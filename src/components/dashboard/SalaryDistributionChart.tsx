import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

interface SalaryDistributionChartProps {
  data: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  period?: number | null;
}

const SalaryDistributionChart = ({ data, period }: SalaryDistributionChartProps) => {
  const colors = [
    "hsl(var(--chart-primary))",
    "hsl(var(--chart-secondary))",
    "hsl(var(--chart-tertiary))",
    "hsl(var(--chart-quaternary))",
    "hsl(214 84% 70%)",
    "hsl(142 76% 50%)"
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-medium">
          <p className="font-semibold text-foreground">{`급여 구간: ${label}`}</p>
          <p className="text-sm text-chart-primary">
            인원: {data.count.toLocaleString()}천명
          </p>
          <p className="text-sm text-chart-secondary">
            비율: {data.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-card border border-border shadow-soft">
      <CardHeader>
        <CardTitle className="text-foreground">첫 일자리 월평균 임금 분포</CardTitle>
        <CardDescription className="text-muted-foreground">
          청년층의 첫 일자리 급여 수준별 분포 현황
          {period && <span className="block text-xs mt-1 text-primary font-medium">기준시점: {period}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="range" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SalaryDistributionChart;