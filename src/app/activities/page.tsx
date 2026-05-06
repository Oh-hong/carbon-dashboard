import { Header } from "@/components/layout";
import { getActivities, getAvailableMonths } from "@/lib/queries";
import { ActivityTable } from "./ActivityTable";
import { ActivityFilters } from "./ActivityFilters";
import { Category } from "@/generated/prisma/client";

// 유효한 카테고리 검증
const VALID_CATEGORIES: Category[] = ["ELECTRICITY", "RAW_MATERIAL", "TRANSPORT"];
function isValidCategory(value: string | undefined): value is Category {
  return !!value && VALID_CATEGORIES.includes(value as Category);
}

// 유효한 Scope 검증
function parseScope(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || (parsed !== 2 && parsed !== 3)) return undefined;
  return parsed;
}

interface PageProps {
  searchParams: Promise<{
    month?: string;
    category?: string;
    scope?: string;
  }>;
}

export default async function ActivitiesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // 필터 파싱 (유효성 검증 포함)
  const filters = {
    month: params.month,
    category: isValidCategory(params.category) ? params.category : undefined,
    scope: parseScope(params.scope),
  };

  // 데이터 조회
  const [activities, availableMonths] = await Promise.all([
    getActivities(filters),
    getAvailableMonths(),
  ]);

  // 총 배출량 계산
  const totalEmission = activities.reduce(
    (sum, a) => sum + (a.calculatedEmission ?? 0),
    0
  );

  return (
    <div className="flex flex-col h-full">
      <Header title="활동 데이터" />

      <div className="flex-1 p-6 space-y-6">
        {/* 필터 */}
        <ActivityFilters
          availableMonths={availableMonths}
          currentFilters={filters}
        />

        {/* 요약 */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            총 <span className="font-semibold text-gray-900">{activities.length}</span>건
          </p>
          <p className="text-sm text-gray-600">
            총 배출량:{" "}
            <span className="font-semibold text-emerald-600">
              {totalEmission.toLocaleString()} kgCO₂e
            </span>
          </p>
        </div>

        {/* 테이블 */}
        <ActivityTable activities={activities} />
      </div>
    </div>
  );
}
