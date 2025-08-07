import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useEmploymentData = () => {
  return useQuery({
    queryKey: ["employment-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("연령별_경제활동상태")
        .select("*")
        .eq("연령별", "* 15~29세")
        .eq("수학여부", "전체")
        .order("시점", { ascending: true });

      if (error) throw error;
      
      // 데이터 변환 로직
      return data.map(item => ({
        period: item.시점?.toString() || "",
        age_group: item.연령별 || "",
        employment_rate: parseFloat((item.고용률 || "0").toString()),
        unemployment_rate: parseFloat((item.실업률 || "0").toString()),
        youth_population: parseInt((item.청년층인구 || "0").toString()),
        economically_active: parseInt((item.경제활동인구 || "0").toString()),
        employed: parseInt((item.취업자 || "0").toString()),
        unemployed: parseInt((item.실업자 || "0").toString())
      }));
    },
  });
};

// 최신 고용 통계 데이터만 가져오는 훅
export const useLatestEmploymentStats = () => {
  return useQuery({
    queryKey: ["latest-employment-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("연령별_경제활동상태")
        .select("*")
        .eq("연령별", "* 15~29세")
        .eq("수학여부", "전체")
        .order("시점", { ascending: false })
        .limit(1);

      if (error) throw error;
      
      if (!data || data.length === 0) return null;
      
      const latest = data[0];
      return {
        period: latest.시점?.toString() || "",
        employment_rate: parseFloat((latest.고용률 || "0").toString()),
        unemployment_rate: parseFloat((latest.실업률 || "0").toString()),
        youth_population: parseInt((latest.청년층인구 || "0").toString()),
        economically_active: parseInt((latest.경제활동인구 || "0").toString()),
        employed: parseInt((latest.취업자 || "0").toString()),
        unemployed: parseInt((latest.실업자 || "0").toString())
      };
    },
  });
};

export const useSalaryData = () => {
  return useQuery({
    queryKey: ["salary-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("성별_첫_일자리_월평균임금")
        .select("*")
        .eq("성별", "계")
        .order("시점", { ascending: false })
        .limit(1);

      if (error) throw error;
      
      if (!data || data.length === 0) return { data: [], period: null };

      const latestData = data[0];
      const period = latestData.시점;
      
      
      const salaryDistribution = [
        { range: "50만원 미만", count: parseInt((latestData["50만원 미만"] || "0").toString()) },
        { range: "50~100만원", count: parseInt((latestData["50~100만원 미만"] || "0").toString()) },
        { range: "100~150만원", count: parseInt((latestData["100~150만원 미만"] || "0").toString()) },
        { range: "150~200만원", count: parseInt((latestData["150~200만원 미만"] || "0").toString()) },
        { range: "200~300만원", count: parseInt((latestData["200~300만원 미만"] || "0").toString()) },
        { range: "300만원 이상", count: parseInt((latestData["300만원 이상"] || "0").toString()) }
      ].map(item => {
        const total = data[0]["계"] ? parseInt(data[0]["계"].toString()) : 0;
        return {
          ...item,
          percentage: total > 0 ? parseFloat(((item.count / total) * 100).toFixed(1)) : 0
        };
      }).filter(item => item.count > 0);

      return { data: salaryDistribution, period };
    },
  });
};

// 성별 대학졸업소요기간 데이터 훅
export const useGenderGraduationData = () => {
  return useQuery({
    queryKey: ["gender-graduation-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("성_및_학제별_대학졸업소요기간" as any)
        .select("*")
        .in("성별", ["남자", "여자"])
        .eq("연령구분", "15~29세")
        .order("시점", { ascending: false })
        .limit(2);

      if (error) throw error;
      
      if (!data || data.length === 0) return { maleData: null, femaleData: null, period: null };

      const typedData = data as any[];
      const period = typedData[0]?.시점;
      const maleData = typedData.find((item: any) => item.성별 === "남자");
      const femaleData = typedData.find((item: any) => item.성별 === "여자");
      
      return { 
        maleData: {
          totalGraduates: parseInt((maleData?.["대졸자"] || "0").toString()),
          period
        },
        femaleData: {
          totalGraduates: parseInt((femaleData?.["대졸자"] || "0").toString()),
          period
        },
        period
      };
    },
  });
};

// 평균 임금 데이터 훅 추가
export const useAverageSalaryData = () => {
  return useQuery({
    queryKey: ["average-salary-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("성별_첫_일자리_월평균임금")
        .select("*")
        .eq("성별", "계")
        .order("시점", { ascending: false })
        .limit(1);

      if (error) throw error;
      
      if (!data || data.length === 0) return { totalCount: 0, period: null };

      const latestData = data[0];
      const period = latestData.시점;
      const totalCount = parseInt((latestData["계"] || "0").toString());
      
      return { totalCount, period };
    },
  });
};

export const useUnemploymentDurationData = () => {
  return useQuery({
    queryKey: ["unemployment-duration-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("성별_미취업기간별_미취업자")
        .select("*")
        .eq("성별", "계")
        .order("시점", { ascending: false })
        .limit(1);

      if (error) throw error;
      
      if (!data || data.length === 0) return { data: [], period: null };

      const latestData = data[0];
      const period = latestData.시점;
      
      
      const unemploymentDuration = [
        { duration: "6개월 미만", count: parseInt((latestData["6개월 미만"] || "0").toString()) },
        { duration: "6개월~1년 미만", count: parseInt((latestData["6개월~1년 미만"] || "0").toString()) },
        { duration: "1~2년 미만", count: parseInt((latestData["1~2년 미만"] || "0").toString()) },
        { duration: "2~3년 미만", count: parseInt((latestData["2~3년 미만"] || "0").toString()) },
        { duration: "3년 이상", count: parseInt((latestData["3년 이상"] || "0").toString()) }
      ].map(item => {
        const total = data[0]["계"] ? parseInt(data[0]["계"].toString()) : 0;
        return {
          ...item,
          percentage: total > 0 ? parseFloat(((item.count / total) * 100).toFixed(1)) : 0
        };
      }).filter(item => item.count > 0);

      return { data: unemploymentDuration, period };
    },
  });
};