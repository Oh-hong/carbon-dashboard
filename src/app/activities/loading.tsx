import { Header } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";

export default function ActivitiesLoading() {
  return (
    <div className="flex flex-col h-full">
      <Header title="활동 데이터" />

      <div className="flex-1 p-6 space-y-6">
        {/* 필터 스켈레톤 */}
        <Card>
          <CardContent className="py-4">
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 테이블 스켈레톤 */}
        <Card>
          <CardContent className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
