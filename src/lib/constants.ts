// 카테고리 한글 라벨
export const CATEGORY_LABELS: Record<string, string> = {
  ELECTRICITY: "전기",
  RAW_MATERIAL: "원소재",
  TRANSPORT: "운송",
};

// 카테고리 Badge 색상 (Tailwind 클래스)
export const CATEGORY_COLORS: Record<string, string> = {
  ELECTRICITY: "bg-blue-100 text-blue-800",
  RAW_MATERIAL: "bg-emerald-100 text-emerald-800",
  TRANSPORT: "bg-amber-100 text-amber-800",
};

// 카테고리 필터 옵션
export const CATEGORY_OPTIONS = [
  { value: "ELECTRICITY", label: "전기" },
  { value: "RAW_MATERIAL", label: "원소재" },
  { value: "TRANSPORT", label: "운송" },
] as const;

// Scope 필터 옵션
export const SCOPE_OPTIONS = [
  { value: "2", label: "Scope 2" },
  { value: "3", label: "Scope 3" },
] as const;

// Scope 설명
export const SCOPE_DESCRIPTIONS: Record<number, string> = {
  1: "직접 배출 (자사 시설에서 직접 연소)",
  2: "간접 배출 (구매한 전기/열)",
  3: "기타 간접 배출 (공급망, 운송 등)",
};

// 단위
export const EMISSION_UNIT = "kgCO₂e";
