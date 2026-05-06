"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Activity {
  id: string;
  date: Date;
  category: string;
  name: string;
  amount: number;
  unit: string;
  scope: number;
  calculatedEmission: number | null;
}

interface ActivityTableProps {
  activities: Activity[];
}

const CATEGORY_LABELS: Record<string, string> = {
  ELECTRICITY: "전기",
  RAW_MATERIAL: "원소재",
  TRANSPORT: "운송",
};

const CATEGORY_COLORS: Record<string, string> = {
  ELECTRICITY: "bg-blue-100 text-blue-800",
  RAW_MATERIAL: "bg-emerald-100 text-emerald-800",
  TRANSPORT: "bg-amber-100 text-amber-800",
};

export function ActivityTable({ activities }: ActivityTableProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">조회된 데이터가 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>날짜</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>항목명</TableHead>
              <TableHead className="text-right">사용량</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead className="text-right">배출량 (kgCO₂e)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">
                  {new Date(activity.date).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={CATEGORY_COLORS[activity.category]}
                  >
                    {CATEGORY_LABELS[activity.category]}
                  </Badge>
                </TableCell>
                <TableCell>{activity.name}</TableCell>
                <TableCell className="text-right">
                  {activity.amount.toLocaleString()} {activity.unit}
                </TableCell>
                <TableCell>
                  <Badge variant={activity.scope === 2 ? "default" : "outline"}>
                    Scope {activity.scope}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium text-emerald-600">
                  {activity.calculatedEmission?.toLocaleString() ?? "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
