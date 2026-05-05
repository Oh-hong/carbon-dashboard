import { Header } from "@/components/layout";
import {
  SummaryCards,
  MonthlyChart,
  ScopeChart,
  CategoryChart,
} from "@/components/dashboard";
import {
  getTotalEmission,
  getEmissionByScope,
  getMonthlyEmissions,
  getEmissionByCategory,
  getMonthOverMonthChange,
} from "@/lib/queries";

export default async function DashboardPage() {
  // DB에서 데이터 조회 (Server Component)
  const [totalEmission, scopeData, monthlyData, categoryData, monthChange] =
    await Promise.all([
      getTotalEmission(),
      getEmissionByScope(),
      getMonthlyEmissions(),
      getEmissionByCategory(),
      getMonthOverMonthChange(),
    ]);

  return (
    <div className="flex flex-col h-full">
      <Header title="대시보드" />

      <div className="flex-1 p-6 space-y-6">
        {/* 요약 카드 */}
        <SummaryCards
          totalEmission={totalEmission}
          scope2={scopeData.scope2}
          scope3={scopeData.scope3}
          monthChange={monthChange}
        />

        {/* 차트 영역 - 상단 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <MonthlyChart data={monthlyData} />
          <ScopeChart scope2={scopeData.scope2} scope3={scopeData.scope3} />
        </div>

        {/* 차트 영역 - 하단 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CategoryChart data={categoryData} />
        </div>
      </div>
    </div>
  );
}
