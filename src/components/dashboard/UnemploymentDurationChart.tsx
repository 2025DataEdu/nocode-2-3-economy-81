import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useState } from "react";

interface UnemploymentDurationChartProps {
  data: Array<{
    duration: string;
    count: number;
    percentage: number;
  }>;
  period?: number | null;
}

const UnemploymentDurationChart = ({ data, period }: UnemploymentDurationChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const colors = [
    "hsl(var(--chart-primary))",
    "hsl(var(--chart-secondary))",
    "hsl(var(--chart-tertiary))",
    "hsl(var(--chart-quaternary))",
    "hsl(214 84% 70%)",
    "hsl(142 76% 50%)"
  ];

  // 마우스 오버 이벤트 핸들러
  const onPieEnter = (data: any, index: number) => {
    setHoveredIndex(index);
  };

  const onPieLeave = () => {
    setHoveredIndex(null);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-medium">
          <p className="font-semibold text-foreground">{`기간: ${data.duration.replace('개월', '개월').replace('년', '년')}`}</p>
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
              label={renderCustomizedLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="count"
              nameKey="duration"
              startAngle={90}
              endAngle={-270}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                  style={{
                    filter: hoveredIndex === index ? 'brightness(1.1)' : 'brightness(1)',
                    transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: 'center',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer'
                  }}
                />
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