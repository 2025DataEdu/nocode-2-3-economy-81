import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface IndustryPieChartProps {
  data: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  period?: number | null;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
];

const IndustryPieChart = ({ data, period }: IndustryPieChartProps) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-medium">
          <p className="font-semibold text-foreground">{item.name}</p>
          <p className="text-sm text-chart-primary">취업자: {item.value.toLocaleString()}천명</p>
          <p className="text-sm text-chart-secondary">비율: {item.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const renderLabel = (entry: any) => {
    return `${entry.percentage}%`;
  };

  return (
    <Card className="bg-card border border-border shadow-soft">
      <CardHeader>
        <CardTitle className="text-foreground">졸업자의 산업별 취업분포</CardTitle>
        <CardDescription className="text-muted-foreground">
          졸업/중퇴 청년층(20~34세)의 산업별 취업자 분포
          {period && <span className="block text-xs mt-1 text-primary font-medium">기준시점: {period}</span>}
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
              label={renderLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{ fontSize: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default IndustryPieChart;