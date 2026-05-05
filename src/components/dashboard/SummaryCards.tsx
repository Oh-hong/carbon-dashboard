import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Zap, Factory, Truck } from "lucide-react";

interface SummaryCardsProps {
  totalEmission: number;
  scope2: number;
  scope3: number;
  monthChange: number | null;
}

export function SummaryCards({
  totalEmission,
  scope2,
  scope3,
  monthChange,
}: SummaryCardsProps) {
  const formatNumber = (num: number) => {
    return num.toLocaleString("ko-KR", { maximumFractionDigits: 2 });
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* 총 배출량 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">총 배출량</p>
            <div className="rounded-full bg-gray-100 p-2">
              <Factory className="h-4 w-4 text-gray-600" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formatNumber(totalEmission)}
          </p>
          <p className="text-sm text-gray-500">kgCO₂e</p>
        </CardContent>
      </Card>

      {/* Scope 2 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Scope 2</p>
            <div className="rounded-full bg-blue-100 p-2">
              <Zap className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {formatNumber(scope2)}
          </p>
          <p className="text-sm text-gray-500">kgCO₂e (전기)</p>
        </CardContent>
      </Card>

      {/* Scope 3 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Scope 3</p>
            <div className="rounded-full bg-emerald-100 p-2">
              <Truck className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {formatNumber(scope3)}
          </p>
          <p className="text-sm text-gray-500">kgCO₂e (원소재+운송)</p>
        </CardContent>
      </Card>

      {/* 전월 대비 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">전월 대비</p>
            <div
              className={`rounded-full p-2 ${
                monthChange === null
                  ? "bg-gray-100"
                  : monthChange > 0
                  ? "bg-red-100"
                  : "bg-green-100"
              }`}
            >
              {monthChange === null ? (
                <TrendingUp className="h-4 w-4 text-gray-400" />
              ) : monthChange > 0 ? (
                <TrendingUp className="h-4 w-4 text-red-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-600" />
              )}
            </div>
          </div>
          <p
            className={`mt-2 text-3xl font-bold ${
              monthChange === null
                ? "text-gray-400"
                : monthChange > 0
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {monthChange !== null ? `${monthChange > 0 ? "+" : ""}${monthChange}%` : "-"}
          </p>
          <p className="text-sm text-gray-500">
            {monthChange === null
              ? "데이터 없음"
              : monthChange > 0
              ? "증가"
              : "감소"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
