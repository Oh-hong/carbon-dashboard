"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { History, Pencil } from "lucide-react";
import { EditDialog } from "./EditDialog";
import { VersionHistoryDialog } from "./VersionHistoryDialog";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/constants";

interface EmissionFactor {
  id: string;
  category: string;
  name: string;
  unit: string;
  currentValue: number;
  updatedAt: Date;
  versionsCount: number;
}

interface EmissionFactorTableProps {
  factors: EmissionFactor[];
}

export function EmissionFactorTable({ factors }: EmissionFactorTableProps) {
  const [editingFactor, setEditingFactor] = useState<EmissionFactor | null>(null);
  const [viewingHistoryId, setViewingHistoryId] = useState<string | null>(null);

  if (factors.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">등록된 배출계수가 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>카테고리</TableHead>
                <TableHead>항목명</TableHead>
                <TableHead>단위</TableHead>
                <TableHead className="text-right">현재 배출계수</TableHead>
                <TableHead>버전</TableHead>
                <TableHead>최근 수정</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {factors.map((factor) => (
                <TableRow key={factor.id}>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={CATEGORY_COLORS[factor.category]}
                    >
                      {CATEGORY_LABELS[factor.category]}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{factor.name}</TableCell>
                  <TableCell className="text-gray-500">{factor.unit}</TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    {factor.currentValue} kgCO₂e/{factor.unit}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{factor.versionsCount}개</Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {new Date(factor.updatedAt).toLocaleDateString("ko-KR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewingHistoryId(factor.id)}
                        title="버전 이력"
                      >
                        <History className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingFactor(factor)}
                        title="수정"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 수정 다이얼로그 */}
      {editingFactor && (
        <EditDialog
          factor={editingFactor}
          open={!!editingFactor}
          onClose={() => setEditingFactor(null)}
        />
      )}

      {/* 버전 이력 다이얼로그 */}
      {viewingHistoryId && (
        <VersionHistoryDialog
          factorId={viewingHistoryId}
          open={!!viewingHistoryId}
          onClose={() => setViewingHistoryId(null)}
        />
      )}
    </>
  );
}
