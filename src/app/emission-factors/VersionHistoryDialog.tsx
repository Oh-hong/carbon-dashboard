"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { CATEGORY_LABELS } from "@/lib/constants";

interface Version {
  id: string;
  value: number;
  validFrom: string;
  validTo: string | null;
  createdAt: string;
  createdBy: string | null;
}

interface FactorDetail {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentValue: number;
  versions: Version[];
}

interface VersionHistoryDialogProps {
  factorId: string;
  open: boolean;
  onClose: () => void;
}

export function VersionHistoryDialog({ factorId, open, onClose }: VersionHistoryDialogProps) {
  const [data, setData] = useState<FactorDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setIsLoading(true);
    setError(null);

    fetch(`/api/emission-factors/${factorId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((json) => setData(json))
      .catch(() => setError("데이터를 불러오는데 실패했습니다."))
      .finally(() => setIsLoading(false));
  }, [factorId, open]);

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-[450px] overflow-y-auto">
        <div className="p-6">
          <SheetTitle className="text-lg font-semibold mb-2">버전 이력</SheetTitle>
          <SheetDescription className="text-sm text-gray-500 mb-6">
            배출계수 변경 이력을 확인합니다.
          </SheetDescription>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          )}

          {error && (
            <div className="text-center py-12 text-red-500">{error}</div>
          )}

          {data && (
            <>
              {/* 배출계수 정보 */}
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">카테고리</span>
                  <span className="font-medium">{CATEGORY_LABELS[data.category]}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">항목명</span>
                  <span className="font-medium">{data.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">현재 값</span>
                  <span className="font-medium font-mono">
                    {data.currentValue} kgCO₂e/{data.unit}
                  </span>
                </div>
              </div>

              {/* 버전 이력 */}
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                변경 이력 ({data.versions.length}개)
              </h3>

              <div className="space-y-3">
                {data.versions.map((version, index) => (
                  <div
                    key={version.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-semibold text-emerald-600">
                        {version.value}
                      </span>
                      {index === 0 && (
                        <Badge className="bg-emerald-100 text-emerald-800">현재</Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>
                        적용 시작:{" "}
                        {new Date(version.validFrom).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      {version.validTo && (
                        <div>
                          적용 종료:{" "}
                          {new Date(version.validTo).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      )}
                      {version.createdBy && (
                        <div>변경자: {version.createdBy}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
