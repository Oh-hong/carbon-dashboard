import { Header } from "@/components/layout";

export default function ImportLoading() {
  return (
    <div className="flex flex-col h-full">
      <Header title="데이터 임포트" />

      <div className="flex-1 p-6 space-y-6">
        {/* 설명 스켈레톤 */}
        <div className="h-40 w-full rounded-lg bg-gray-200 animate-pulse" />

        {/* 업로드 영역 스켈레톤 */}
        <div className="h-48 w-full rounded-lg bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}
