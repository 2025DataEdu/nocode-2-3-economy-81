import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

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

// 차트 색상 팔레트
const CHART_COLORS = [
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
  // 툴팁 커스터마이징
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground mb-1">{data.industry}</p>
          <p className="text-sm text-muted-foreground">
            취업자: <span className="font-medium text-foreground">{data.employed.toLocaleString()}천명</span>
          </p>
          <p className="text-sm text-muted-foreground">
            비율: <span className="font-medium text-foreground">{data.percentage.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // 파이 차트 라벨 렌더링
  const renderLabel = (entry: any) => {
    if (entry.percentage < 3) return ''; // 3% 미만은 라벨 숨김
    return `${entry.percentage.toFixed(1)}%`;
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
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={140}
              fill="#8884d8"
              dataKey="employed"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={CHART_COLORS[index % CHART_COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={60}
              wrapperStyle={{ 
                fontSize: "11px",
                paddingTop: "20px"
              }}
              formatter={(value: string) => {
                // 산업명이 너무 길면 줄임
                return value.length > 15 ? value.substring(0, 15) + "..." : value;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default YouthIndustryChart;