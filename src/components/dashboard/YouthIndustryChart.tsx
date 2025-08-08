import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

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

// 막대별 색상 팔레트
const BAR_COLORS = [
  "hsl(220, 70%, 50%)",    // 파란색
  "hsl(160, 60%, 45%)",    // 청록색  
  "hsl(30, 80%, 55%)",     // 주황색
  "hsl(340, 75%, 55%)",    // 분홍색
  "hsl(270, 70%, 50%)",    // 보라색
  "hsl(80, 60%, 45%)",     // 연두색
  "hsl(200, 80%, 50%)",    // 하늘색
  "hsl(15, 70%, 50%)",     // 빨간색
  "hsl(45, 90%, 55%)",     // 노란색
  "hsl(300, 70%, 50%)",    // 자주색
  "hsl(120, 60%, 40%)",    // 초록색
  "hsl(60, 70%, 50%)",     // 라임색
  "hsl(240, 70%, 50%)",    // 남색
  "hsl(180, 60%, 45%)",    // 민트색
  "hsl(0, 70%, 50%)",      // 빨간색
  "hsl(320, 70%, 50%)",    // 핫핑크
];

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
      .substring(0, 12);
  };

  // 데이터를 막대차트용으로 변환 (이미 정렬되어 있음)
  const chartData = data.map((item, index) => ({
    name: shortenIndustryName(item.industry),
    fullName: item.industry,
    value: item.employed,
    percentage: item.percentage,
    color: BAR_COLORS[index % BAR_COLORS.length]
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
          졸업/중퇴 청년층(20~34세)의 산업별 취업자 분포
          {period && (
            <span className="block text-xs mt-1 text-primary font-medium">
              기준시점: {period} | 총 취업자: {totalEmployed.toLocaleString()}천명
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 100,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={90}
              fontSize={10}
              className="text-muted-foreground"
            />
            <YAxis 
              fontSize={10}
              className="text-muted-foreground"
              tickFormatter={(value) => `${value}천명`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default YouthIndustryChart;