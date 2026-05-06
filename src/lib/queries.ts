import prisma from "./db";
import { Category } from "@/generated/prisma/client";

// 타입 정의
export interface ScopeEmission {
  scope2: number;
  scope3: number;
}

export interface MonthlyEmission {
  month: string;
  monthLabel: string;
  scope2: number;
  scope3: number;
  total: number;
}

export interface CategoryEmission {
  category: Category;
  label: string;
  emission: number;
}

// 총 배출량 조회
export async function getTotalEmission(): Promise<number> {
  const result = await prisma.activity.aggregate({
    _sum: { calculatedEmission: true },
  });
  return result._sum.calculatedEmission ?? 0;
}

// Scope별 배출량 조회
export async function getEmissionByScope(): Promise<ScopeEmission> {
  const scope2 = await prisma.activity.aggregate({
    where: { scope: 2 },
    _sum: { calculatedEmission: true },
  });

  const scope3 = await prisma.activity.aggregate({
    where: { scope: 3 },
    _sum: { calculatedEmission: true },
  });

  return {
    scope2: scope2._sum.calculatedEmission ?? 0,
    scope3: scope3._sum.calculatedEmission ?? 0,
  };
}

// 월별 배출량 조회
export async function getMonthlyEmissions(): Promise<MonthlyEmission[]> {
  const activities = await prisma.activity.findMany({
    select: {
      date: true,
      calculatedEmission: true,
      scope: true,
    },
    orderBy: { date: "asc" },
  });

  // 월별로 그룹핑
  const monthlyMap = new Map<string, { scope2: number; scope3: number }>();

  for (const activity of activities) {
    const month = activity.date.toISOString().slice(0, 7); // "2025-01"
    const current = monthlyMap.get(month) ?? { scope2: 0, scope3: 0 };

    if (activity.scope === 2) {
      current.scope2 += activity.calculatedEmission ?? 0;
    } else {
      current.scope3 += activity.calculatedEmission ?? 0;
    }

    monthlyMap.set(month, current);
  }

  return Array.from(monthlyMap.entries()).map(([month, data]) => ({
    month,
    monthLabel: month.slice(5) + "월", // "01월"
    scope2: Math.round(data.scope2 * 100) / 100,
    scope3: Math.round(data.scope3 * 100) / 100,
    total: Math.round((data.scope2 + data.scope3) * 100) / 100,
  }));
}

// 카테고리별 배출량 조회
export async function getEmissionByCategory(): Promise<CategoryEmission[]> {
  const result = await prisma.activity.groupBy({
    by: ["category"],
    _sum: { calculatedEmission: true },
  });

  const categoryLabels: Record<Category, string> = {
    [Category.ELECTRICITY]: "전기",
    [Category.RAW_MATERIAL]: "원소재",
    [Category.TRANSPORT]: "운송",
  };

  return result.map((item) => ({
    category: item.category,
    label: categoryLabels[item.category],
    emission: Math.round((item._sum.calculatedEmission ?? 0) * 100) / 100,
  }));
}

// 전월 대비 변화율 계산
export async function getMonthOverMonthChange(): Promise<number | null> {
  const monthly = await getMonthlyEmissions();

  if (monthly.length < 2) return null;

  const current = monthly[monthly.length - 1].total;
  const previous = monthly[monthly.length - 2].total;

  if (previous === 0) return null;

  const change = ((current - previous) / previous) * 100;
  return Math.round(change * 10) / 10;
}

// 활동 데이터 타입
export interface ActivityItem {
  id: string;
  date: Date;
  category: Category;
  name: string;
  amount: number;
  unit: string;
  scope: number;
  calculatedEmission: number | null;
}

// 활동 데이터 필터
export interface ActivityFilters {
  month?: string; // "2025-01" 형식
  category?: Category;
  scope?: number;
}

// 활동 데이터 조회 (필터 지원)
export async function getActivities(filters?: ActivityFilters): Promise<ActivityItem[]> {
  const where: {
    date?: { gte: Date; lt: Date };
    category?: Category;
    scope?: number;
  } = {};

  // 월 필터
  if (filters?.month) {
    const [year, month] = filters.month.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    where.date = { gte: startDate, lt: endDate };
  }

  // 카테고리 필터
  if (filters?.category) {
    where.category = filters.category;
  }

  // Scope 필터
  if (filters?.scope) {
    where.scope = filters.scope;
  }

  const activities = await prisma.activity.findMany({
    where,
    orderBy: { date: "desc" },
  });

  return activities.map((activity) => ({
    id: activity.id,
    date: activity.date,
    category: activity.category,
    name: activity.name,
    amount: activity.amount,
    unit: activity.unit,
    scope: activity.scope,
    calculatedEmission: activity.calculatedEmission,
  }));
}

// 사용 가능한 월 목록 조회
export async function getAvailableMonths(): Promise<string[]> {
  const activities = await prisma.activity.findMany({
    select: { date: true },
    distinct: ["date"],
    orderBy: { date: "desc" },
  });

  const months = new Set<string>();
  activities.forEach((a) => {
    months.add(a.date.toISOString().slice(0, 7));
  });

  return Array.from(months).sort().reverse();
}
