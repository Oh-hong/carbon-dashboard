"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface EmissionFactor {
  id: string;
  category: string;
  name: string;
  unit: string;
  currentValue: number;
}

interface EditDialogProps {
  factor: EmissionFactor;
  open: boolean;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  ELECTRICITY: "전기",
  RAW_MATERIAL: "원소재",
  TRANSPORT: "운송",
};

export function EditDialog({ factor, open, onClose }: EditDialogProps) {
  const router = useRouter();
  const [value, setValue] = useState(factor.currentValue.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const newValue = parseFloat(value);
    if (isNaN(newValue) || newValue <= 0) {
      setError("유효한 숫자를 입력해주세요.");
      return;
    }

    if (newValue === factor.currentValue) {
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/emission-factors/${factor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: newValue }),
      });

      if (!res.ok) {
        throw new Error("업데이트에 실패했습니다.");
      }

      router.refresh();
      onClose();
    } catch {
      setError("업데이트에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-96">
        <div className="p-6">
          <SheetTitle className="text-lg font-semibold mb-2">배출계수 수정</SheetTitle>
          <SheetDescription className="text-sm text-gray-500 mb-6">
            새로운 값을 입력하면 버전 이력이 자동으로 생성됩니다.
          </SheetDescription>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 정보 */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">카테고리</span>
                <span className="font-medium">{CATEGORY_LABELS[factor.category]}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">항목명</span>
                <span className="font-medium">{factor.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">단위</span>
                <span className="font-medium">kgCO₂e / {factor.unit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">현재 값</span>
                <span className="font-medium">{factor.currentValue}</span>
              </div>
            </div>

            {/* 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                새 배출계수 값
              </label>
              <input
                type="number"
                step="0.001"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="예: 0.456"
                disabled={isLoading}
              />
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>

            {/* 버튼 */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1"
              >
                취소
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  "저장"
                )}
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
