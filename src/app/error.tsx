"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-red-100 p-3">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          데이터를 불러오는데 실패했습니다
        </h2>
        <p className="max-w-md text-sm text-gray-500">
          {error.message || "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요."}
        </p>
        <Button onClick={reset} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          다시 시도
        </Button>
      </div>
    </div>
  );
}
