import { Header } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";

export default function EmissionFactorsLoading() {
  return (
    <div className="flex flex-col h-full">
      <Header title="배출계수 관리" />

      <div className="flex-1 p-6 space-y-6">
        {/* 설명 스켈레톤 */}
        <div className="h-16 bg-blue-50 rounded-lg animate-pulse" />

        {/* 테이블 스켈레톤 */}
        <Card>
          <CardContent className="p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 bg-gray-200 rounded animate-pulse" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
