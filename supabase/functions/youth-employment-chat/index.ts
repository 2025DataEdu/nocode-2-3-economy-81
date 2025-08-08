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
    employmentDuration: null,
    majorMatch: null,
    industryEmployment: null,
    allDatasets: null
  };

  // 키워드 기반으로 관련 데이터 검색 (유의어 포함)
  const questionLower = question.toLowerCase();
  
  console.log('Searching for keywords in question:', questionLower);
  
  try {
    // 모든 데이터셋을 병렬로 검색 (21개 데이터셋 모두 활용)
    const [
      employmentResult,
      salaryResult,
      unemploymentResult,
      durationResult,
      majorResult,
      industryResult,
      schoolStatusResult,
      graduationDurationResult,
      vocationalTrainingResult,
      workExperienceResult,
      firstJobIndustryResult,
      firstJobOccupationResult,
      quitReasonResult,
      jobSearchRouteResult,
      leaveExperienceResult,
      workExperienceTypeResult,
      unemploymentActivityResult,
      jobExamPrepResult,
      continuousEmploymentResult
    ] = await Promise.all([
      // 1. 연령별 경제활동상태
      supabase.from('연령별_경제활동상태')
        .select('*')
        .eq('연령별', '20~34세')
        .eq('수학여부', '전체')
        .order('시점', { ascending: false })
        .limit(5),
      
      // 2. 성별 첫 일자리 월평균임금
      supabase.from('성별_첫_일자리_월평균임금')
        .select('*')
        .eq('성별', '계')
        .eq('연령구분', '20~34세')
        .order('시점', { ascending: false })
        .limit(5),
      
      // 3. 성별 미취업기간별 미취업자
      supabase.from('성별_미취업기간별_미취업자')
        .select('*')
        .eq('성별', '계')
        .eq('연령별', '20~34세')
        .order('시점', { ascending: false })
        .limit(5),
      
      // 4. 성별 첫 취업 소요기간 및 평균소요기간
      supabase.from('성별_첫_취업_소요기간_및_평균소요기간')
        .select('*')
        .eq('전체', '전체')
        .eq('연령구분', '20~34세')
        .order('시점', { ascending: false })
        .limit(5),
      
      // 5. 성별 최종학교 전공일치 여부
      supabase.from('성별_최종학교_전공일치_여부')
        .select('*')
        .eq('성별', '계')
        .eq('연령별', '20~34세')
        .order('시점', { ascending: false })
        .limit(5),
      
      // 6. ★★★ 졸업중퇴 취업자의 산업별 취업분포 (핵심)
      supabase.from('졸업_중퇴_취업자의_산업별_취업분포_11차')
        .select('*')
        .eq('연령구분(1)', '20~34세')
        .order('시점', { ascending: false })
        .limit(20),
      
      // 7. 연령별 수학여부
      supabase.from('연령별_수학여부')
        .select('*')
        .eq('연령별', '20~34세')
        .order('시점', { ascending: false })
        .limit(3),
      
      // 8. 성 및 학제별 대학졸업소요기간
      supabase.from('성_및_학제별_대학졸업소요기간')
        .select('*')
        .eq('성별', '계')
        .eq('연령구분', '20~34세')
        .order('시점', { ascending: false })
        .limit(3),
      
      // 9. 성별 직업교육 훈련 경험 유무 및 시기
      supabase.from('성별_직업교육_훈련__경험_유무_및_시기')
        .select('*')
        .eq('성별', '계')
        .eq('연령구분', '20~34세')
        .order('시점', { ascending: false })
        .limit(3),
      
      // 10. 성별 취업경험유무 및 횟수
      supabase.from('성별_취업경험유무_및_횟수_졸업_중퇴_인구')
        .select('*')
        .eq('성별', '계')
        .eq('연령구분', '20~34세')
        .order('시점', { ascending: false })
        .limit(3),
      
      // 11. 성별 첫일자리 산업
      supabase.from('성별_첫일자리_산업_졸업_중퇴_취업유경험자')
        .select('*')
        .eq('성별', '계')
        .eq('연령구분', '20~34세')
        .order('시점', { ascending: false })
        .limit(5),
      
      // 12. 성별 첫일자리 직업
      supabase.from('성별_첫일자리_직업_졸업_중퇴취업유경험자')
        .select('*')
        .eq('성별', '계')
        .eq('연령구분', '20~34세')
        .order('시점', { ascending: false })
        .limit(5),
      
      // 13. 성별 첫일자리를 그만둔 사유
      supabase.from('성별_첫일자리를_그만둔_사유')
        .select('*')
        .eq('성별', '계')
        .eq('연령구분', '20~34세')
        .order('시점', { ascending: false })
        .limit(3),
      
      // 14. 성별 학력별 취업경로
      supabase.from('성별_학력별_취업경로__졸업_중퇴_취업자')
        .select('*')
        .eq('성별', '계')
        .eq('연령구분', '20~34세')
        .order('시점', { ascending: false })
        .limit(5),
      
      // 15. 성별 휴학경험유무 평균휴학기간
      supabase.from('성별_휴학경험유무_평균휴학기간_대졸자')
        .select('*')
        .eq('성별', '계')
        .eq('연령구분', '20~34세')
        .order('시점', { ascending: false })
        .limit(3),
      
      // 16. 성별 직장체험형태
      supabase.from('성별_직장체험형태_직장체험경험자')
        .select('*')
        .eq('성별', '계')
        .eq('연령구분', '20~34세')
        .order('시점', { ascending: false })
        .limit(3),
      
      // 17. 성별 미취업기간활동별 미취업자
      supabase.from('성별_미취업기간활동별_미취업자')
        .select('*')
        .eq('성별', '계')
        .eq('연령별', '20~34세')
        .order('시점', { ascending: false })
        .limit(3),
      
      // 18. 성별 취업시험준비유무 및 준비분야
      supabase.from('성별_취업시험준비유무_및_준비분야_비경제활')
        .select('*')
        .eq('성별', '계')
        .eq('연령구분', '20~34세')
        .order('시점', { ascending: false })
        .limit(3),
      
      // 19. 첫직장 근속기간
      supabase.from('첫직장_근속기간')
        .select('*')
        .eq('연령구분', '20~34세')
        .order('시점', { ascending: false })
        .limit(3)
    ]);

    // 결과 로깅 및 데이터 수집
    const results = [
      { name: '연령별 경제활동상태', data: employmentResult.data, key: 'employment' },
      { name: '첫 일자리 월평균임금', data: salaryResult.data, key: 'salary' },
      { name: '미취업 기간별 분포', data: unemploymentResult.data, key: 'unemployment' },
      { name: '첫 취업 소요기간', data: durationResult.data, key: 'employmentDuration' },
      { name: '전공 일치 여부', data: majorResult.data, key: 'majorMatch' },
      { name: '★산업별 취업분포★', data: industryResult.data, key: 'industryEmployment' },
      { name: '수학여부', data: schoolStatusResult.data, key: 'schoolStatus' },
      { name: '대학졸업소요기간', data: graduationDurationResult.data, key: 'graduationDuration' },
      { name: '직업교육훈련경험', data: vocationalTrainingResult.data, key: 'vocationalTraining' },
      { name: '취업경험유무', data: workExperienceResult.data, key: 'workExperience' },
      { name: '첫일자리산업', data: firstJobIndustryResult.data, key: 'firstJobIndustry' },
      { name: '첫일자리직업', data: firstJobOccupationResult.data, key: 'firstJobOccupation' },
      { name: '퇴직사유', data: quitReasonResult.data, key: 'quitReason' },
      { name: '취업경로', data: jobSearchRouteResult.data, key: 'jobSearchRoute' },
      { name: '휴학경험', data: leaveExperienceResult.data, key: 'leaveExperience' },
      { name: '직장체험형태', data: workExperienceTypeResult.data, key: 'workExperienceType' },
      { name: '미취업활동', data: unemploymentActivityResult.data, key: 'unemploymentActivity' },
      { name: '취업시험준비', data: jobExamPrepResult.data, key: 'jobExamPrep' },
      { name: '근속기간', data: continuousEmploymentResult.data, key: 'continuousEmployment' }
    ];

    // 모든 데이터 수집 및 로깅
    results.forEach(result => {
      const dataCount = result.data?.length || 0;
      console.log(`${result.name}: ${dataCount} rows`);
      
      if (dataCount > 0) {
        relevantData[result.key] = result.data;
        relevantData.sources.push(result.name);
        relevantData.dataPoints += dataCount;
      }
    });

    console.log(`Total data points collected: ${relevantData.dataPoints}`);
    console.log(`Data sources: ${relevantData.sources.join(', ')}`);

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

  if (relevantData.majorMatch) {
    context += "\n=== 전공 일치 여부 ===\n";
    relevantData.majorMatch.forEach((item: any) => {
      context += `- ${item.시점}: 전체 ${item.계}천명, 매우 일치 ${item["매우 일치"]}천명, 그런대로 일치 ${item["그런대로 일치"]}천명, 약간 불일치 ${item["약간 불일치"]}천명, 매우 불일치 ${item["매우 불일치"]}천명\n`;
    });
  }

  if (relevantData.industryEmployment) {
    context += "\n=== 산업별 취업분포 (졸업중퇴 취업자) ===\n";
    relevantData.industryEmployment.forEach((item: any) => {
      context += `- ${item.시점}: 산업분야 ${item["산업별(1)"]}, 졸업중퇴 청년층 취업자 ${item["졸업/중퇴 청년층 취업자"]}천명, 전체 취업자 ${item["전체 취업자"]}천명\n`;
    });
  }

  // 추가 데이터셋들도 컨텍스트에 포함
  if (relevantData.schoolStatus) {
    context += "\n=== 수학여부 (재학/졸업/중퇴) ===\n";
    relevantData.schoolStatus.forEach((item: any) => {
      context += `- ${item.시점}: 청년층인구 전체 ${item["청년층인구 전체"]}천명, 재학 ${item["재학"]}천명, 졸업/중퇴 ${item["졸업/중퇴"]}천명, 휴학 ${item["휴학"]}천명\n`;
    });
  }

  if (relevantData.firstJobIndustry) {
    context += "\n=== 첫일자리 산업별 분포 ===\n";
    relevantData.firstJobIndustry.forEach((item: any) => {
      context += `- ${item.시점}: 제조업 ${item["광ㆍ제조업(BC)"]}천명, 도소매업 ${item["도매 및 소매업(G)"]}천명, 숙박음식점업 ${item["숙박 및 음식점업(I)"]}천명, 보건복지서비스업 ${item["보건업 및 사회복지 서비스업(Q)"]}천명\n`;
    });
  }

  if (relevantData.firstJobOccupation) {
    context += "\n=== 첫일자리 직업별 분포 ===\n";
    relevantData.firstJobOccupation.forEach((item: any) => {
      context += `- ${item.시점}: 관리자전문가 ${item["관리자ㆍ전문가"]}천명, 사무종사자 ${item["사무 종사자"]}천명, 서비스종사자 ${item["서비스 종사자"]}천명, 판매종사자 ${item["판매 종사자"]}천명\n`;
    });
  }

  if (relevantData.workExperience) {
    context += "\n=== 취업경험 유무 및 횟수 ===\n";
    relevantData.workExperience.forEach((item: any) => {
      context += `- ${item.시점}: 전체 ${item["졸업ㆍ중퇴 청년층인구 전체"]}천명, 취업경험있음 ${item["취업경험 있음"]}천명, 취업경험없음 ${item["취업경험 없음"]}천명\n`;
    });
  }

  if (relevantData.vocationalTraining) {
    context += "\n=== 직업교육훈련 경험 ===\n";
    relevantData.vocationalTraining.forEach((item: any) => {
      context += `- ${item.시점}: 청년층인구 전체 ${item["청년층 인구 전체"]}천명, 교육훈련경험있음 ${item["교육훈련 경험있음"]}천명, 교육훈련경험없음 ${item["교육훈련 경험없음"]}천명\n`;
    });
  }

  if (context === "") {
    context = "관련 데이터를 찾을 수 없습니다.";
  }

  return context;
}