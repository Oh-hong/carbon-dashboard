import prisma from "./db";
import { Category } from "@/generated/prisma/client";

// 총 배출량 조회
export async function getTotalEmission() {
  const result = await prisma.activity.aggregate({
    _sum: { calculatedEmission: true },
  });
  return result._sum.calculatedEmission ?? 0;
}

// Scope별 배출량 조회
export async function getEmissionByScope() {
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
export async function getMonthlyEmissions() {
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
export async function getEmissionByCategory() {
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
export async function getMonthOverMonthChange() {
  const monthly = await getMonthlyEmissions();

  if (monthly.length < 2) return null;

  const current = monthly[monthly.length - 1].total;
  const previous = monthly[monthly.length - 2].total;

  if (previous === 0) return null;

  const change = ((current - previous) / previous) * 100;
  return Math.round(change * 10) / 10;
}
