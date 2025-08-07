import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Fetching comprehensive employment data...');

    // Fetch historical employment data
    const { data: employmentData, error: empError } = await supabase
      .from('연령별_경제활동상태')
      .select('*')
      .eq('연령별', '20~34세')
      .eq('수학여부', '전체')
      .order('시점', { ascending: true });

    // Fetch salary data
    const { data: salaryData, error: salError } = await supabase
      .from('성별_첫_일자리_월평균임금')
      .select('*')
      .eq('성별', '계')
      .order('시점', { ascending: true });

    // Fetch unemployment duration data
    const { data: unemploymentData, error: unempError } = await supabase
      .from('성별_미취업기간별_미취업자')
      .select('*')
      .eq('성별', '계')
      .eq('연령별', '20~34세')
      .order('시점', { ascending: true });

    // Fetch employment duration data
    const { data: employmentDurationData, error: empDurError } = await supabase
      .from('성별_첫_취업_소요기간_및_평균소요기간' as any)
      .select('*')
      .eq('전체', '전체')
      .eq('연령구분', '20~34세')
      .order('시점', { ascending: true });

    if (empError || salError || unempError || empDurError) {
      console.error('Database errors:', { empError, salError, unempError, empDurError });
      throw empError || salError || unempError || empDurError;
    }

    console.log(`Fetched data: employment(${employmentData?.length}), salary(${salaryData?.length}), unemployment(${unemploymentData?.length}), employment_duration(${employmentDurationData?.length})`);

    // Process employment data
    const processedEmploymentData = employmentData?.map(item => ({
      period: item.시점?.toString() || "",
      employment_rate: parseFloat((item.고용률 || "0").toString()),
      unemployment_rate: parseFloat((item.실업률 || "0").toString()),
      youth_population: parseInt((item.청년층인구 || "0").toString()),
      employed: parseInt((item.취업자 || "0").toString()),
      unemployed: parseInt((item.실업자 || "0").toString())
    })).filter(item => item.employment_rate > 0 && item.unemployment_rate > 0);

    // Process salary data
    const processedSalaryData = salaryData?.map((item: any) => ({
      period: item.시점?.toString() || "",
      total_count: parseInt((item.계 || "0").toString()),
      under_50: parseInt((item["50만원 미만"] || "0").toString()),
      range_50_100: parseInt((item["50~100만원 미만"] || "0").toString()),
      range_100_150: parseInt((item["100~150만원 미만"] || "0").toString()),
      range_150_200: parseInt((item["150~200만원 미만"] || "0").toString()),
      range_200_300: parseInt((item["200~300만원 미만"] || "0").toString()),
      over_300: parseInt((item["300만원 이상"] || "0").toString())
    })).filter((item: any) => item.total_count > 0);

    // Process unemployment duration data
    const processedUnemploymentData = unemploymentData?.map((item: any) => ({
      period: item.시점?.toString() || "",
      total: parseInt((item.계 || "0").toString()),
      under_6months: parseInt((item["6개월 미만"] || "0").toString()),
      months_6_12: parseInt((item["6개월~1년 미만"] || "0").toString()),
      years_1_2: parseInt((item["1~2년 미만"] || "0").toString()),
      years_2_3: parseInt((item["2~3년 미만"] || "0").toString()),
      over_3years: parseInt((item["3년 이상"] || "0").toString())
    })).filter((item: any) => item.total > 0);

    // Process employment duration data
    const processedEmploymentDurationData = employmentDurationData?.map((item: any) => ({
      period: item.시점?.toString() || "",
      total_experienced: parseInt((item["졸업ㆍ중퇴 후 취업 유경험자 전체"] || "0").toString()),
      avg_duration_months: parseInt((item["첫 취업 평균소요기간"] || "0").toString()),
      under_3months: parseInt((item["3개월 미만"] || "0").toString()),
      months_3_6: parseInt((item["3~6개월 미만"] || "0").toString()),
      months_6_12: parseInt((item["6개월~1년 미만"] || "0").toString()),
      years_1_2: parseInt((item["1~2년 미만"] || "0").toString()),
      years_2_3: parseInt((item["2~3년 미만"] || "0").toString()),
      over_3years: parseInt((item["3년 이상"] || "0").toString())
    })).filter((item: any) => item.total_experienced > 0);

    console.log(`Processed data: employment(${processedEmploymentData?.length}), salary(${processedSalaryData?.length}), unemployment(${processedUnemploymentData?.length}), employment_duration(${processedEmploymentDurationData?.length})`);

    const prompt = `
당신은 한국의 청년 고용 정책 전문가입니다. 다음 청년층(20~34세) 다양한 데이터를 종합 분석하여 미래를 예측하고 정책을 추천해주세요.

고용률/실업률 데이터:
${JSON.stringify(processedEmploymentData?.slice(-10), null, 2)}

월평균임금 분포 데이터:
${JSON.stringify(processedSalaryData?.slice(-5), null, 2)}

미취업 기간별 데이터:
${JSON.stringify(processedUnemploymentData?.slice(-5), null, 2)}

첫 취업 소요기간 데이터:
${JSON.stringify(processedEmploymentDurationData?.slice(-5), null, 2)}

다음 형식으로 응답해주세요:

{
  "comprehensive_analysis": "종합 데이터 분석 결과와 주요 트렌드 (300자 이내)",
  "future_predictions": {
    "employment_metrics": {
      "employment_rate_2025": 예측되는 2025년 고용률,
      "employment_rate_2026": 예측되는 2026년 고용률,
      "employment_rate_2027": 예측되는 2027년 고용률,
      "unemployment_rate_2025": 예측되는 2025년 실업률,
      "unemployment_rate_2026": 예측되는 2026년 실업률,
      "unemployment_rate_2027": 예측되는 2027년 실업률
    },
    "salary_predictions": {
      "avg_salary_range_2025": "예측되는 2025년 주요 임금 구간",
      "avg_salary_range_2026": "예측되는 2026년 주요 임금 구간", 
      "avg_salary_range_2027": "예측되는 2027년 주요 임금 구간",
      "high_salary_percentage_2025": 200만원 이상 고임금 비율 2025년,
      "high_salary_percentage_2026": 200만원 이상 고임금 비율 2026년,
      "high_salary_percentage_2027": 200만원 이상 고임금 비율 2027년
    },
    "unemployment_duration": {
      "avg_duration_trend": "미취업 기간 트렌드 전망",
      "short_term_ratio_2025": 6개월 미만 단기 미취업 비율 2025년,
      "short_term_ratio_2026": 6개월 미만 단기 미취업 비율 2026년,
      "short_term_ratio_2027": 6개월 미만 단기 미취업 비율 2027년
    },
    "employment_duration_trends": {
      "avg_duration_trend": "첫 취업 소요기간 트렌드 전망",
      "avg_duration_2025": 예측되는 2025년 평균 첫 취업 소요기간(개월),
      "avg_duration_2026": 예측되는 2026년 평균 첫 취업 소요기간(개월),
      "avg_duration_2027": 예측되는 2027년 평균 첫 취업 소요기간(개월)
    },
    "confidence_level": "전체 예측 신뢰도 (높음/보통/낮음)"
  },
  "policy_recommendations": [
    {
      "category": "정책 분야",
      "title": "정책명",
      "description": "정책 설명 (100자 이내)",
      "priority": "우선순위 (높음/보통/낮음)",
      "timeline": "실행 시기",
      "target_metric": "개선 목표 지표"
    }
  ]
}

JSON 형식으로만 응답하고, 모든 데이터를 종합 분석한 현실적인 예측과 실용적인 정책을 제안해주세요.
`;

    console.log('Sending request to OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: '당신은 한국의 청년 고용 정책 전문가입니다. 다양한 고용 관련 데이터를 종합 분석하고 현실적인 예측과 정책을 제안합니다.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log('Received response from OpenAI');

    const analysisResult = JSON.parse(aiResponse.choices[0].message.content);

    return new Response(JSON.stringify({
      success: true,
      data: analysisResult,
      data_summary: {
        employment_points: processedEmploymentData?.length || 0,
        salary_points: processedSalaryData?.length || 0,
        unemployment_points: processedUnemploymentData?.length || 0,
        employment_duration_points: processedEmploymentDurationData?.length || 0
      },
      last_period: processedEmploymentData?.[processedEmploymentData.length - 1]?.period || null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-employment-trends function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});