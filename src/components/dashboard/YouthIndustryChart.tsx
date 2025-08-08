import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface IndustryData {
  industry: string;
  employed: number;
  percentage: number;
}

interface YouthIndustryChartProps {
  data: IndustryData[];
  totalEmployed: number;
  period?: string;
}

const YouthIndustryChart = ({ data, totalEmployed, period }: YouthIndustryChartProps) => {
  // 산업명을 짧게 줄이는 함수
  const shortenIndustryName = (name: string) => {
    return name
      .replace("업", "")
      .replace("서비스", "")
      .replace("(", "")
      .replace(")", "")
      .replace(/[A-Z]/g, "")
      .trim()
      .substring(0, 8);
  };

  // 데이터를 막대차트용으로 변환 (이미 정렬되어 있음)
  const chartData = data.map(item => ({
    name: shortenIndustryName(item.industry),
    fullName: item.industry,
    value: item.employed,
    percentage: item.percentage
  }));
  // 툴팁 커스터마이징
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground mb-1">{data.fullName}</p>
          <p className="text-sm text-muted-foreground">
            취업자: <span className="font-medium text-foreground">{data.value.toLocaleString()}천명</span>
          </p>
          <p className="text-sm text-muted-foreground">
            비율: <span className="font-medium text-foreground">{data.percentage.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-card border border-border">
      <CardHeader>
        <CardTitle className="text-foreground">청년층 산업별 취업분포</CardTitle>
        <CardDescription className="text-muted-foreground">
          졸업/중퇴 청년층(20~34세)의 산업별 취업자 분포 (상위 16개 산업)
          {period && (
            <span className="block text-xs mt-1 text-primary font-medium">
              기준시점: {period} | 총 취업자: {totalEmployed.toLocaleString()}천명
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 80,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={11}
              className="text-muted-foreground"
            />
            <YAxis 
              fontSize={11}
              className="text-muted-foreground"
              tickFormatter={(value) => `${value}천명`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default YouthIndustryChart;