import { Category } from "@/generated/prisma/client";

// GHG Protocol Scope 매핑
export const SCOPE_MAP: Record<Category, number> = {
  [Category.ELECTRICITY]: 2, // Scope 2: 간접 배출 (구매한 전기)
  [Category.RAW_MATERIAL]: 3, // Scope 3: 기타 간접 (공급망)
  [Category.TRANSPORT]: 3, // Scope 3: 기타 간접 (운송)
};

// 카테고리 한글명
export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.ELECTRICITY]: "전기",
  [Category.RAW_MATERIAL]: "원소재",
  [Category.TRANSPORT]: "운송",
};

// Scope 설명
export const SCOPE_DESCRIPTIONS: Record<number, string> = {
  1: "직접 배출 (자사 시설에서 직접 연소)",
  2: "간접 배출 (구매한 전기/열)",
  3: "기타 간접 배출 (공급망, 운송 등)",
};

// 색상 팔레트
export const COLORS = {
  scope2: "#3B82F6", // blue-500
  scope3: "#10B981", // emerald-500
  electricity: "#3B82F6", // blue-500
  rawMaterial: "#10B981", // emerald-500
  transport: "#F59E0B", // amber-500
  primary: "#0F172A", // slate-900
  secondary: "#64748B", // slate-500
  success: "#22C55E", // green-500
  warning: "#F59E0B", // amber-500
  danger: "#EF4444", // red-500
};

// 차트 색상
export const CHART_COLORS = {
  [Category.ELECTRICITY]: "#3B82F6",
  [Category.RAW_MATERIAL]: "#10B981",
  [Category.TRANSPORT]: "#F59E0B",
};

// 단위
export const EMISSION_UNIT = "kgCO₂e";
