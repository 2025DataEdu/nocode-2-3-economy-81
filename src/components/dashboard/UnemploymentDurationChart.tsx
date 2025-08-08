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

  // 마우스 오버 이벤트 핸들러 (Cell 단위)
  const onCellMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const onCellMouseLeave = () => {
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
        <div className="flex items-center gap-4">
          <div className="w-1/4 min-w-[180px]">
            <div className="space-y-2">
              {data.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="text-foreground truncate">{entry.duration}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="duration"
                  startAngle={90}
                  endAngle={-270}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={colors[index % colors.length]}
                      stroke={hoveredIndex === index ? "#ffffff" : "none"}
                      strokeWidth={hoveredIndex === index ? 3 : 0}
                      style={{
                        filter: hoveredIndex === index ? 'brightness(1.3) drop-shadow(0 4px 12px rgba(0,0,0,0.4))' : 'brightness(1)',
                        transition: 'all 0.15s ease-out',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={() => onCellMouseEnter(index)}
                      onMouseLeave={onCellMouseLeave}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnemploymentDurationChart;