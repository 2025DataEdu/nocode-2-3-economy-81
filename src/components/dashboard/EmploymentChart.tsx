import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface EmploymentChartProps {
  data: Array<{
    period: string;
    employment_rate: number;
    unemployment_rate: number;
  }>;
  latestPeriod?: string;
}

const EmploymentChart = ({ data, latestPeriod }: EmploymentChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-medium">
          <p className="font-semibold text-foreground">{`기간: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-card border border-border shadow-soft">
      <CardHeader>
        <CardTitle className="text-foreground">연령별 고용률 및 실업률 추이</CardTitle>
        <CardDescription className="text-muted-foreground">
          청년층의 고용률과 실업률 변화를 시각화한 차트입니다
          {latestPeriod && <span className="block text-xs mt-1 text-primary font-medium">최신 데이터: {latestPeriod}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="period" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="employment_rate" 
              stroke="hsl(var(--chart-primary))" 
              strokeWidth={3}
              name="고용률"
              dot={{ fill: "hsl(var(--chart-primary))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(var(--chart-primary))", strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="unemployment_rate" 
              stroke="hsl(var(--chart-secondary))" 
              strokeWidth={3}
              name="실업률"
              dot={{ fill: "hsl(var(--chart-secondary))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(var(--chart-secondary))", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EmploymentChart;