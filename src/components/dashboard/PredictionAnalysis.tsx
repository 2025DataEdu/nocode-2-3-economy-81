import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { TrendingUp, Brain, AlertCircle, Target, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PredictionData {
  comprehensive_analysis: string;
  future_predictions: {
    employment_metrics: {
      employment_rate_2025: number;
      employment_rate_2026: number;
      employment_rate_2027: number;
      unemployment_rate_2025: number;
      unemployment_rate_2026: number;
      unemployment_rate_2027: number;
    };
    salary_predictions: {
      avg_salary_range_2025: string;
      avg_salary_range_2026: string;
      avg_salary_range_2027: string;
      high_salary_percentage_2025: number;
      high_salary_percentage_2026: number;
      high_salary_percentage_2027: number;
    };
    unemployment_duration: {
      avg_duration_trend: string;
      short_term_ratio_2025: number;
      short_term_ratio_2026: number;
      short_term_ratio_2027: number;
    };
    graduation_trends: {
      graduation_duration_2025: number;
      graduation_duration_2026: number;
      graduation_duration_2027: number;
    };
    confidence_level: string;
  };
  policy_recommendations: Array<{
    category: string;
    title: string;
    description: string;
    priority: string;
    timeline: string;
    target_metric: string;
  }>;
}

const PredictionAnalysis = () => {
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSummary, setDataSummary] = useState<any>(null);
  const [lastPeriod, setLastPeriod] = useState<string>("");
  const { toast } = useToast();

  const runAnalysis = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-employment-trends');
      
      if (error) throw error;

      if (data.success) {
        setPredictionData(data.data);
        setDataSummary(data.data_summary);
        setLastPeriod(data.last_period);
        toast({
          title: "종합 분석 완료",
          description: "AI 기반 다차원 미래 예측 분석이 완료되었습니다.",
        });
      } else {
        throw new Error(data.error || "분석 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "분석 오류",
        description: "AI 분석 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "높음": return "destructive";
      case "보통": return "secondary";
      case "낮음": return "outline";
      default: return "secondary";
    }
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case "높음": return "text-green-600";
      case "보통": return "text-yellow-600";
      case "낮음": return "text-red-600";
      default: return "text-muted-foreground";
    }
  };

  // Chart data for employment predictions
  const employmentChartData = predictionData ? [
    {
      year: "2025",
      employment_rate: predictionData.future_predictions.employment_metrics.employment_rate_2025,
      unemployment_rate: predictionData.future_predictions.employment_metrics.unemployment_rate_2025,
    },
    {
      year: "2026", 
      employment_rate: predictionData.future_predictions.employment_metrics.employment_rate_2026,
      unemployment_rate: predictionData.future_predictions.employment_metrics.unemployment_rate_2026,
    },
    {
      year: "2027",
      employment_rate: predictionData.future_predictions.employment_metrics.employment_rate_2027,
      unemployment_rate: predictionData.future_predictions.employment_metrics.unemployment_rate_2027,
    }
  ] : [];

  // Chart data for salary predictions  
  const salaryChartData = predictionData ? [
    {
      year: "2025",
      high_salary_percentage: predictionData.future_predictions.salary_predictions.high_salary_percentage_2025,
      short_term_unemployment: predictionData.future_predictions.unemployment_duration.short_term_ratio_2025,
      graduation_duration: predictionData.future_predictions.graduation_trends.graduation_duration_2025,
    },
    {
      year: "2026",
      high_salary_percentage: predictionData.future_predictions.salary_predictions.high_salary_percentage_2026,
      short_term_unemployment: predictionData.future_predictions.unemployment_duration.short_term_ratio_2026,
      graduation_duration: predictionData.future_predictions.graduation_trends.graduation_duration_2026,
    },
    {
      year: "2027",
      high_salary_percentage: predictionData.future_predictions.salary_predictions.high_salary_percentage_2027,
      short_term_unemployment: predictionData.future_predictions.unemployment_duration.short_term_ratio_2027,
      graduation_duration: predictionData.future_predictions.graduation_trends.graduation_duration_2027,
    }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI 기반 종합 미래 예측 분석
          </CardTitle>
          <CardDescription>
            과거 고용, 임금, 미취업, 졸업 데이터를 종합 분석하여 AI가 청년층(20~34세) 다차원적 미래 트렌드를 예측하고 맞춤형 정책을 추천합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!predictionData ? (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                종합 분석을 시작하려면 아래 버튼을 클릭하세요.
              </p>
              <Button 
                onClick={runAnalysis} 
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    종합 분석 중...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    종합 미래 예측 분석 시작
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  분석 기준: 고용({dataSummary?.employment_points}), 임금({dataSummary?.salary_points}), 미취업({dataSummary?.unemployment_points}), 졸업({dataSummary?.graduation_points}) 데이터 포인트 (최신: {lastPeriod})
                </AlertDescription>
              </Alert>
              <Button 
                onClick={runAnalysis} 
                disabled={isLoading}
                variant="outline"
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    종합 재분석 중...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    종합 재분석
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {predictionData && (
        <>
          {/* Comprehensive Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">종합 트렌드 분석</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{predictionData.comprehensive_analysis}</p>
            </CardContent>
          </Card>

          {/* Employment Predictions Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                고용률/실업률 예측 (2025-2027)
                <Badge 
                  variant="outline" 
                  className={getConfidenceColor(predictionData.future_predictions.confidence_level)}
                >
                  신뢰도: {predictionData.future_predictions.confidence_level}
                </Badge>
              </CardTitle>
              <CardDescription>
                AI가 예측한 청년층(20~34세) 고용률과 실업률 전망
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={employmentChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px"
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="employment_rate" 
                    stroke="hsl(var(--chart-primary))" 
                    strokeWidth={3}
                    name="고용률 (%)"
                    dot={{ fill: "hsl(var(--chart-primary))", strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="unemployment_rate" 
                    stroke="hsl(var(--chart-secondary))" 
                    strokeWidth={3}
                    name="실업률 (%)"
                    dot={{ fill: "hsl(var(--chart-secondary))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Multi-Metric Predictions Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">다차원 예측 지표 (2025-2027)</CardTitle>
              <CardDescription>
                임금, 미취업기간, 졸업소요기간 등 종합 예측 지표
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salaryChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px"
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="high_salary_percentage" 
                    stroke="hsl(var(--chart-primary))" 
                    strokeWidth={3}
                    name="고임금 비율 (%)"
                    dot={{ fill: "hsl(var(--chart-primary))", strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="short_term_unemployment" 
                    stroke="hsl(var(--chart-secondary))" 
                    strokeWidth={3}
                    name="단기 미취업 비율 (%)"
                    dot={{ fill: "hsl(var(--chart-secondary))", strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="graduation_duration" 
                    stroke="hsl(var(--chart-tertiary))" 
                    strokeWidth={3}
                    name="졸업소요기간 (개월)"
                    dot={{ fill: "hsl(var(--chart-tertiary))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Detailed Predictions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">임금 전망</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs space-y-1">
                  <p><span className="font-medium">2025:</span> {predictionData.future_predictions.salary_predictions.avg_salary_range_2025}</p>
                  <p><span className="font-medium">2026:</span> {predictionData.future_predictions.salary_predictions.avg_salary_range_2026}</p>
                  <p><span className="font-medium">2027:</span> {predictionData.future_predictions.salary_predictions.avg_salary_range_2027}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">미취업 기간 전망</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-foreground">{predictionData.future_predictions.unemployment_duration.avg_duration_trend}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">졸업소요기간 전망</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-xs space-y-1">
                  <p><span className="font-medium">2025:</span> {predictionData.future_predictions.graduation_trends.graduation_duration_2025}개월</p>
                  <p><span className="font-medium">2026:</span> {predictionData.future_predictions.graduation_trends.graduation_duration_2026}개월</p>
                  <p><span className="font-medium">2027:</span> {predictionData.future_predictions.graduation_trends.graduation_duration_2027}개월</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Policy Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5" />
                종합 정책 추천
              </CardTitle>
              <CardDescription>
                다차원 데이터 분석 결과를 바탕으로 AI가 추천하는 청년층(20~34세) 고용 정책
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {predictionData.policy_recommendations.map((policy, index) => (
                  <Card key={index} className="border border-border/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <h4 className="font-semibold text-foreground">{policy.title}</h4>
                            <Badge variant={getPriorityColor(policy.priority)}>
                              {policy.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">분야:</span> {policy.category}
                          </p>
                          <p className="text-foreground">{policy.description}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {policy.timeline} | 목표: {policy.target_metric}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default PredictionAnalysis;