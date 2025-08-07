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

    console.log('Fetching employment data...');

    // Fetch historical employment data
    const { data: employmentData, error } = await supabase
      .from('연령별_경제활동상태')
      .select('*')
      .eq('연령별', '* 15~29세')
      .eq('수학여부', '전체')
      .order('시점', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log(`Fetched ${employmentData?.length} employment records`);

    // Process data for analysis
    const processedData = employmentData?.map(item => ({
      period: item.시점?.toString() || "",
      employment_rate: parseFloat((item.고용률 || "0").toString()),
      unemployment_rate: parseFloat((item.실업률 || "0").toString()),
      youth_population: parseInt((item.청년층인구 || "0").toString()),
      employed: parseInt((item.취업자 || "0").toString()),
      unemployed: parseInt((item.실업자 || "0").toString())
    })).filter(item => item.employment_rate > 0 && item.unemployment_rate > 0);

    console.log(`Processed ${processedData?.length} valid records`);

    const prompt = `
당신은 한국의 청년 고용 정책 전문가입니다. 다음 청년층(15~29세) 고용률과 실업률 데이터를 분석하여 미래를 예측하고 정책을 추천해주세요.

데이터:
${JSON.stringify(processedData, null, 2)}

다음 형식으로 응답해주세요:

{
  "trend_analysis": "과거 데이터에서 발견되는 주요 트렌드와 패턴 분석 (200자 이내)",
  "future_predictions": {
    "employment_rate_2025": 예측되는 2025년 고용률 (숫자),
    "employment_rate_2026": 예측되는 2026년 고용률 (숫자),
    "employment_rate_2027": 예측되는 2027년 고용률 (숫자),
    "unemployment_rate_2025": 예측되는 2025년 실업률 (숫자),
    "unemployment_rate_2026": 예측되는 2026년 실업률 (숫자),
    "unemployment_rate_2027": 예측되는 2027년 실업률 (숫자),
    "confidence_level": "예측 신뢰도 (높음/보통/낮음)"
  },
  "policy_recommendations": [
    {
      "category": "정책 분야",
      "title": "정책명",
      "description": "정책 설명 (100자 이내)",
      "priority": "우선순위 (높음/보통/낮음)",
      "timeline": "실행 시기"
    }
  ]
}

JSON 형식으로만 응답하고, 데이터 기반의 현실적인 예측과 실용적인 정책을 제안해주세요.
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
            content: '당신은 한국의 청년 고용 정책 전문가입니다. 데이터를 정확히 분석하고 현실적인 예측과 정책을 제안합니다.'
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
      data_points: processedData?.length || 0,
      last_period: processedData?.[processedData.length - 1]?.period || null
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