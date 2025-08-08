import { TrendingUp, Users, Briefcase, PieChart } from "lucide-react";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import EmploymentChart from "@/components/dashboard/EmploymentChart";
import SalaryDistributionChart from "@/components/dashboard/SalaryDistributionChart";
import UnemploymentDurationChart from "@/components/dashboard/UnemploymentDurationChart";
import IndustryPieChart from "@/components/dashboard/IndustryPieChart";
import PredictionAnalysis from "@/components/dashboard/PredictionAnalysis";
import YouthEmploymentChatbot from "@/components/chat/YouthEmploymentChatbot";
import DataStatusCard from "@/components/dashboard/DataStatusCard";
import { useEmploymentData, useLatestEmploymentStats, useSalaryData, useUnemploymentDurationData, useAverageSalaryData, useGenderGraduationData, useIndustryDistributionPieData } from "@/hooks/useEconomicData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { data: employmentData, isLoading: employmentLoading } = useEmploymentData();
  const { data: latestStats, isLoading: latestStatsLoading } = useLatestEmploymentStats();
  const { data: salaryData, isLoading: salaryLoading } = useSalaryData();
  const { data: unemploymentDurationData, isLoading: unemploymentDurationLoading } = useUnemploymentDurationData();
  const { data: averageSalaryData, isLoading: averageSalaryLoading } = useAverageSalaryData();
  const { data: genderGraduationData, isLoading: genderGraduationLoading } = useGenderGraduationData();
  const { data: industryPieData, isLoading: industryPieLoading } = useIndustryDistributionPieData();

  // 디버깅용 콘솔 로그
  console.log("Industry Pie Data:", industryPieData);
  console.log("Industry Pie Loading:", industryPieLoading);

  // 최신 데이터에서 통계 계산
  const totalUnemploymentCount = unemploymentDurationData?.data?.reduce((sum, item) => sum + item.count, 0) || 0;

  // 차트용 데이터 가공 - 15~29세 전체 데이터만 사용
  const chartEmploymentData = employmentData?.map(item => ({
    period: item.period,
    employment_rate: item.employment_rate,
    unemployment_rate: item.unemployment_rate
  })) || [];

  if (employmentLoading || latestStatsLoading || salaryLoading || unemploymentDurationLoading || averageSalaryLoading || genderGraduationLoading || industryPieLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">데이터를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">데이터 대시보드</TabsTrigger>
            <TabsTrigger value="analysis">AI 분석 도구</TabsTrigger>
            <TabsTrigger value="chatbot">AI 챗봇</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* 사용 데이터 현황 */}
            <DataStatusCard />
            
            {/* 주요 지표 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="고용률"
                value={`${latestStats?.employment_rate?.toFixed(1) || "0"}%`}
                changeType="neutral"
                icon={TrendingUp}
                description={`청년층(20~34세) 고용률${latestStats?.period ? ` (${latestStats.period})` : ""}`}
              />
              <StatsCard
                title="실업률"
                value={`${latestStats?.unemployment_rate?.toFixed(1) || "0"}%`}
                changeType="neutral"
                icon={Users}
                description={`청년층(20~34세) 실업률${latestStats?.period ? ` (${latestStats.period})` : ""}`}
              />
              <StatsCard
                title="남자 대졸자의 졸업소요기간"
                value={`${genderGraduationData?.maleData?.totalGraduates || "0"}개월`}
                changeType="neutral"
                icon={Briefcase}
                description={`청년층(20~34세) 남자 대졸자 평균 졸업소요기간${genderGraduationData?.period ? ` (${genderGraduationData.period})` : ""}`}
              />
              <StatsCard
                title="여자 대졸자의 졸업소요기간"
                value={`${genderGraduationData?.femaleData?.totalGraduates || "0"}개월`}
                changeType="neutral"
                icon={PieChart}
                description={`청년층(20~34세) 여자 대졸자 평균 졸업소요기간${genderGraduationData?.period ? ` (${genderGraduationData.period})` : ""}`}
              />
            </div>

            {/* 차트 그리드 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EmploymentChart data={chartEmploymentData} latestPeriod={latestStats?.period} />
              <SalaryDistributionChart data={salaryData?.data || []} period={salaryData?.period} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UnemploymentDurationChart data={unemploymentDurationData?.data || []} period={unemploymentDurationData?.period} />
              <IndustryPieChart data={industryPieData?.data || []} period={industryPieData?.period} />
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <PredictionAnalysis />
          </TabsContent>

          <TabsContent value="chatbot" className="space-y-6">
            <YouthEmploymentChatbot />
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
};

export default Index;
