import { Header } from "@/components/layout";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="대시보드" />

      <div className="flex-1 p-6">
        {/* 요약 카드 영역 */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">총 배출량</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">11,072.72</p>
            <p className="text-sm text-gray-500">kgCO₂e</p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Scope 2</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">469.22</p>
            <p className="text-sm text-gray-500">kgCO₂e (전기)</p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Scope 3</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">10,603.5</p>
            <p className="text-sm text-gray-500">kgCO₂e (원소재+운송)</p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">전월 대비</p>
            <p className="mt-2 text-3xl font-bold text-red-600">+5.2%</p>
            <p className="text-sm text-gray-500">증가</p>
          </div>
        </div>

        {/* 차트 영역 (placeholder) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">월별 배출량 추이</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-400">차트 영역</p>
            </div>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scope별 비율</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-400">차트 영역</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
