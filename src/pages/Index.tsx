import { TrendingUp, Users, Briefcase, PieChart, BarChart } from "lucide-react";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import EmploymentChart from "@/components/dashboard/EmploymentChart";
import SalaryDistributionChart from "@/components/dashboard/SalaryDistributionChart";
import UnemploymentDurationChart from "@/components/dashboard/UnemploymentDurationChart";
import PredictionAnalysis from "@/components/dashboard/PredictionAnalysis";
import YouthEmploymentChatbot from "@/components/chat/YouthEmploymentChatbot";
import { useEmploymentData, useLatestEmploymentStats, useSalaryData, useUnemploymentDurationData, useAverageSalaryData, useGenderGraduationData } from "@/hooks/useEconomicData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { data: employmentData, isLoading: employmentLoading } = useEmploymentData();
  const { data: latestStats, isLoading: latestStatsLoading } = useLatestEmploymentStats();
  const { data: salaryData, isLoading: salaryLoading } = useSalaryData();
  const { data: unemploymentDurationData, isLoading: unemploymentDurationLoading } = useUnemploymentDurationData();
  const { data: averageSalaryData, isLoading: averageSalaryLoading } = useAverageSalaryData();
  const { data: genderGraduationData, isLoading: genderGraduationLoading } = useGenderGraduationData();

  // 최신 데이터에서 통계 계산
  const totalUnemploymentCount = unemploymentDurationData?.data?.reduce((sum, item) => sum + item.count, 0) || 0;

  // 차트용 데이터 가공 - 15~29세 전체 데이터만 사용
  const chartEmploymentData = employmentData?.map(item => ({
    period: item.period,
    employment_rate: item.employment_rate,
    unemployment_rate: item.unemployment_rate
  })) || [];

  if (employmentLoading || latestStatsLoading || salaryLoading || unemploymentDurationLoading || averageSalaryLoading || genderGraduationLoading) {
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">데이터 대시보드</TabsTrigger>
            <TabsTrigger value="analysis">AI 분석 도구</TabsTrigger>
            <TabsTrigger value="chatbot">AI 챗봇</TabsTrigger>
            <TabsTrigger value="reports" disabled>리포트</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
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
              
              <Card className="bg-card border border-border shadow-soft">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <BarChart className="w-5 h-5" />
                    데이터 요약
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    현재 대시보드의 주요 데이터 포인트
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium text-foreground">총 데이터 테이블</span>
                      <span className="text-sm font-bold text-primary">21개</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium text-foreground">분석 기간</span>
                      <span className="text-sm font-bold text-primary">2004.05~현재</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium text-foreground">대상 연령층</span>
                      <span className="text-sm font-bold text-primary">청년층</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <PredictionAnalysis />
          </TabsContent>

          <TabsContent value="chatbot" className="space-y-6">
            <YouthEmploymentChatbot />
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>리포트</CardTitle>
                <CardDescription>곧 업데이트 예정입니다.</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
