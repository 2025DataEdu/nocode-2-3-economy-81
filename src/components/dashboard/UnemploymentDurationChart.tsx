import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface UnemploymentDurationChartProps {
  data: Array<{
    duration: string;
    count: number;
    percentage: number;
  }>;
}

const UnemploymentDurationChart = ({ data }: UnemploymentDurationChartProps) => {
  const colors = [
    "hsl(var(--chart-primary))",
    "hsl(var(--chart-secondary))",
    "hsl(var(--chart-tertiary))",
    "hsl(var(--chart-quaternary))",
    "hsl(214 84% 70%)",
    "hsl(142 76% 50%)"
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-medium">
          <p className="font-semibold text-foreground">{`기간: ${data.duration}`}</p>
          <p className="text-sm text-chart-primary">
            인원: {data.count.toLocaleString()}명
          </p>
          <p className="text-sm text-chart-secondary">
            비율: {data.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // 5% 미만은 라벨 표시 안함
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="bg-card border border-border shadow-soft">
      <CardHeader>
        <CardTitle className="text-foreground">미취업 기간별 분포</CardTitle>
        <CardDescription className="text-muted-foreground">
          청년층의 미취업 기간별 인원 분포 현황
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default UnemploymentDurationChart;