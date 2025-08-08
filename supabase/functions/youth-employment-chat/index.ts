import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Received question:', question);

    // RAG: 질문과 관련된 데이터 검색
    const relevantData = await searchRelevantData(supabase, question);
    console.log('Found relevant data sources:', relevantData.sources);

    // 컨텍스트 구성
    const context = buildContext(relevantData);
    console.log('Built context with', context.length, 'characters');

    // OpenAI에 RAG 기반 질문
    const prompt = `
당신은 한국의 청년(20~34세) 고용 분야 전문가입니다. 아래 제공된 실제 통계 데이터만을 기반으로 정확하게 답변해주세요.

[정의]
- 본 서비스에서 "고임금"은 "월 300만원 이상"을 의미합니다.

**중요한 지침:**
1. 제공된 데이터에만 기반하여 답변하세요
2. 데이터에 없는 내용은 추측하지 마세요  
3. 수치는 정확히 인용하고, 비율 계산 시 반드시 검증하세요
4. 비율이나 퍼센트 계산 시에는 분모와 분자를 명확히 하세요
5. 출처가 명확한 정보만 사용하세요
6. 데이터가 부족한 경우 솔직히 말씀하세요
7. 계산 과정을 보여주고 정확한 수식을 사용하세요
8. LaTeX 코드나 수학 기호는 사용하지 말고 일반 텍스트로만 답변하세요

**제공된 실제 데이터:**
${context}

**사용자 질문:** ${question}

**답변 형식:**
- 구체적인 수치와 기간을 포함하여 답변
- 비율 계산 시 일반 텍스트로 "(A ÷ B × 100 = C%)" 형식 사용
- 데이터 출처 명시
- 객관적이고 정확한 정보만 제공
- 계산에 사용된 수치의 단위(천명, 만명 등) 확인 후 계산
- 필요시 "제공된 데이터에서는 해당 정보를 확인할 수 없습니다"라고 명시
- LaTeX, MathML, \\text{} 같은 수학 마크업 언어는 절대 사용하지 마세요
- 모든 수식과 계산은 일반 텍스트로만 표현하세요
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14', // 최신 GPT-4.1 모델로 업그레이드
        messages: [
          {
            role: 'system',
            content: '당신은 한국의 청년 고용 통계 전문가입니다. 제공된 실제 데이터만을 기반으로 정확하고 객관적인 답변을 제공합니다. LaTeX 코드나 수학 마크업 언어는 절대 사용하지 말고 모든 수식을 일반 텍스트로만 표현하세요.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1, // 낮은 temperature로 일관성 있는 답변
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const answer = aiResponse.choices[0].message.content;

    return new Response(JSON.stringify({
      success: true,
      answer: answer,
      sources: relevantData.sources,
      data_used: relevantData.dataPoints
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in youth-employment-chat:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// RAG: 질문과 관련된 데이터 검색 함수
async function searchRelevantData(supabase: any, question: string) {
  const relevantData = {
    sources: [],
    dataPoints: 0,
    employment: null,
    salary: null,
    unemployment: null,
    employmentDuration: null
  };

  // 키워드 기반으로 관련 데이터 검색
  const questionLower = question.toLowerCase();
  
  try {
    // 고용률/실업률 관련 질문
    if (questionLower.includes('고용률') || questionLower.includes('실업률') || 
        questionLower.includes('취업자') || questionLower.includes('경제활동')) {
      
      const { data: employmentData } = await supabase
        .from('연령별_경제활동상태')
        .select('*')
        .eq('연령별', '20~34세')
        .eq('수학여부', '전체')
        .order('시점', { ascending: false })
        .limit(5);
      
      if (employmentData?.length > 0) {
        relevantData.employment = employmentData;
        relevantData.sources.push('연령별 경제활동상태');
        relevantData.dataPoints += employmentData.length;
      }
    }

    // 임금 관련 질문
    if (questionLower.includes('임금') || questionLower.includes('월급') || 
        questionLower.includes('급여') || questionLower.includes('소득')) {
      
      const { data: salaryData } = await supabase
        .from('성별_첫_일자리_월평균임금')
        .select('*')
        .eq('성별', '계')
        .eq('연령구분', '20~34세')
        .order('시점', { ascending: false })
        .limit(3);
      
      if (salaryData?.length > 0) {
        relevantData.salary = salaryData;
        relevantData.sources.push('첫 일자리 월평균임금');
        relevantData.dataPoints += salaryData.length;
      }
    }

    // 미취업 기간 관련 질문
    if (questionLower.includes('미취업') || questionLower.includes('구직') || 
        questionLower.includes('취업 기간') || questionLower.includes('구직활동')) {
      
      const { data: unemploymentData } = await supabase
        .from('성별_미취업기간별_미취업자')
        .select('*')
        .eq('성별', '계')
        .eq('연령별', '20~34세')
        .order('시점', { ascending: false })
        .limit(3);
      
      if (unemploymentData?.length > 0) {
        relevantData.unemployment = unemploymentData;
        relevantData.sources.push('미취업 기간별 분포');
        relevantData.dataPoints += unemploymentData.length;
      }
    }

    // 취업 소요기간 관련 질문
    if (questionLower.includes('취업 소요') || questionLower.includes('첫 취업') || 
        questionLower.includes('취업까지') || questionLower.includes('졸업 후')) {
      
      const { data: durationData } = await supabase
        .from('성별_첫_취업_소요기간_및_평균소요기간')
        .select('*')
        .eq('전체', '전체')
        .eq('연령구분', '20~34세')
        .order('시점', { ascending: false })
        .limit(3);
      
      if (durationData?.length > 0) {
        relevantData.employmentDuration = durationData;
        relevantData.sources.push('첫 취업 소요기간');
        relevantData.dataPoints += durationData.length;
      }
    }

    // 일반적인 질문이거나 키워드가 명확하지 않은 경우 최신 종합 데이터 제공
    if (relevantData.sources.length === 0) {
      console.log('No specific keywords found, providing general overview data');
      
      const [employmentResult, salaryResult] = await Promise.all([
        supabase
          .from('연령별_경제활동상태')
          .select('*')
          .eq('연령별', '20~34세')
          .eq('수학여부', '전체')
          .order('시점', { ascending: false })
          .limit(2),
        supabase
          .from('성별_첫_일자리_월평균임금')
          .select('*')
          .eq('성별', '계')
          .eq('연령구분', '20~34세')
          .order('시점', { ascending: false })
          .limit(2)
      ]);

      if (employmentResult.data?.length > 0) {
        relevantData.employment = employmentResult.data;
        relevantData.sources.push('연령별 경제활동상태 (일반)');
        relevantData.dataPoints += employmentResult.data.length;
      }

      if (salaryResult.data?.length > 0) {
        relevantData.salary = salaryResult.data;
        relevantData.sources.push('첫 일자리 월평균임금 (일반)');
        relevantData.dataPoints += salaryResult.data.length;
      }
    }

  } catch (error) {
    console.error('Error searching relevant data:', error);
  }

  return relevantData;
}

// 검색된 데이터를 컨텍스트로 구성
function buildContext(relevantData: any): string {
  let context = "";

  if (relevantData.employment) {
    context += "\n=== 고용률 및 실업률 데이터 ===\n";
    relevantData.employment.forEach((item: any) => {
      context += `- ${item.시점}: 고용률 ${item.고용률}%, 실업률 ${item.실업률}%, 취업자 ${item.취업자}천명, 실업자 ${item.실업자}천명, 청년층인구 ${item.청년층인구}천명\n`;
    });
  }

  if (relevantData.salary) {
    context += "\n=== 첫 일자리 월평균임금 분포 ===\n";
    relevantData.salary.forEach((item: any) => {
      context += `- ${item.시점}: 전체 ${item.계}천명, 50만원미만 ${item["50만원 미만"]}천명, 50~100만원 ${item["50~100만원 미만"]}천명, 100~150만원 ${item["100~150만원 미만"]}천명, 150~200만원 ${item["150~200만원 미만"]}천명, 200~300만원 ${item["200~300만원 미만"]}천명, 300만원이상 ${item["300만원 이상"]}천명\n`;
    });
  }

  if (relevantData.unemployment) {
    context += "\n=== 미취업 기간별 분포 ===\n";
    relevantData.unemployment.forEach((item: any) => {
      context += `- ${item.시점}: 전체 ${item.계}천명, 6개월미만 ${item["6개월 미만"]}천명, 6개월~1년 ${item["6개월~1년 미만"]}천명, 1~2년 ${item["1~2년 미만"]}천명, 2~3년 ${item["2~3년 미만"]}천명, 3년이상 ${item["3년 이상"]}천명\n`;
    });
  }

  if (relevantData.employmentDuration) {
    context += "\n=== 첫 취업 소요기간 ===\n";
    relevantData.employmentDuration.forEach((item: any) => {
      context += `- ${item.시점}: 평균 ${item["첫 취업 평균소요기간"]}개월, 전체 취업경험자 ${item["졸업ㆍ중퇴 후 취업 유경험자 전체"]}천명, 3개월미만 ${item["3개월 미만"]}천명, 3~6개월 ${item["3~6개월 미만"]}천명, 6개월~1년 ${item["6개월~1년 미만"]}천명\n`;
    });
  }

  if (context === "") {
    context = "관련 데이터를 찾을 수 없습니다.";
  }

  return context;
}