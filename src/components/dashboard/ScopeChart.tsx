"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Scope별 색상
const SCOPE_COLORS: Record<number, string> = {
  2: "#3B82F6", // blue-500 (Scope 2: 전기)
  3: "#10B981", // emerald-500 (Scope 3: 원소재+운송)
};

interface ScopeChartProps {
  scope2: number;
  scope3: number;
}

export function ScopeChart({ scope2, scope3 }: ScopeChartProps) {
  const data = [
    { name: "Scope 2 (전기)", value: scope2, scope: 2 },
    { name: "Scope 3 (원소재+운송)", value: scope3, scope: 3 },
  ];

  const total = scope2 + scope3;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scope별 배출 비율</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ percent }) => `${((percent ?? 0) * 100).toFixed(1)}%`}
                labelLine={false}
              >
                {data.map((entry) => (
                  <Cell key={`cell-${entry.scope}`} fill={SCOPE_COLORS[entry.scope]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => {
                  const numValue = Number(value) || 0;
                  return [`${numValue.toLocaleString()} kgCO₂e (${((numValue / total) * 100).toFixed(1)}%)`];
                }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
