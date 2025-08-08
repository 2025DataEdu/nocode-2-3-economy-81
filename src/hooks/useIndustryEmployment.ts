import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// 새로운 산업별 청년 취업분포 데이터 훅
export const useIndustryEmployment = () => {
  return useQuery({
    queryKey: ["industry-employment-2025"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("졸업_중퇴_취업자의_산업별_취업분포_11차" as any)
        .select("*")
        .eq("연령구분(1)", "20~34세")
        .eq("시점", 2025.05);

      if (error) throw error;
      
      if (!data || data.length === 0) return { industries: [], totalEmployed: 0 };

      const rows = data as any[];
      
      // "계" 데이터에서 전체 취업자 수 확인
      const totalRow = rows.find(row => row["산업별(1)"] === "계");
      const totalEmployed = totalRow ? parseInt(totalRow["졸업/중퇴 청년층 취업자"].toString()) : 0;
      
      // "계"를 제외한 실제 산업 데이터만 추출
      const industryData = rows
        .filter(row => row["산업별(1)"] !== "계")
        .map(row => ({
          industry: row["산업별(1)"] as string,
          employed: parseInt(row["졸업/중퇴 청년층 취업자"].toString()),
          totalIndustryEmployed: parseInt(row["전체 취업자"].toString())
        }))
        .filter(item => item.employed > 0)
        .sort((a, b) => b.employed - a.employed);

      // 비율 계산
      const industriesWithPercentage = industryData.map(item => ({
        ...item,
        percentage: totalEmployed > 0 ? ((item.employed / totalEmployed) * 100) : 0
      }));

      return {
        industries: industriesWithPercentage,
        totalEmployed,
        period: "2025.05"
      };
    },
  });
};