export default function Loading() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
        <p className="text-sm text-gray-500">데이터를 불러오는 중...</p>
      </div>
    </div>
  );
}
