import { Header } from "@/components/layout";
import { getEmissionFactors } from "@/lib/queries";
import { EmissionFactorTable } from "./EmissionFactorTable";

export default async function EmissionFactorsPage() {
  const factors = await getEmissionFactors();

  return (
    <div className="flex flex-col h-full">
      <Header title="배출계수 관리" />

      <div className="flex-1 p-6 space-y-6">
        {/* 설명 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>배출계수</strong>란 활동 데이터(전기, 원소재, 운송)를 CO₂ 배출량으로 변환하는 계수입니다.
            <br />
            배출계수를 수정하면 새로운 버전이 생성되며, 이전 버전 이력을 확인할 수 있습니다.
          </p>
        </div>

        {/* 요약 */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            총 <span className="font-semibold text-gray-900">{factors.length}</span>개 배출계수
          </p>
        </div>

        {/* 테이블 */}
        <EmissionFactorTable factors={factors} />
      </div>
    </div>
  );
}
