import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// 카테고리 매핑
const CATEGORY_MAP: Record<string, "ELECTRICITY" | "RAW_MATERIAL" | "TRANSPORT"> = {
  ELECTRICITY: "ELECTRICITY",
  RAW_MATERIAL: "RAW_MATERIAL",
  TRANSPORT: "TRANSPORT",
};

interface ImportActivity {
  date: string;
  categoryCode: string;
  name: string;
  amount: number;
  unit: string;
  scope: number;
}

// POST /api/import - 활동 데이터 일괄 임포트
export async function POST(request: NextRequest) {
  try {
    // JSON 파싱
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "잘못된 요청 형식입니다." },
        { status: 400 }
      );
    }

    const { activities } = body as { activities: ImportActivity[] };

    // 데이터 유효성 검증
    if (!Array.isArray(activities) || activities.length === 0) {
      return NextResponse.json(
        { error: "임포트할 데이터가 없습니다." },
        { status: 400 }
      );
    }

    // 배출계수 조회 (항목명으로 매칭)
    const emissionFactors = await prisma.emissionFactor.findMany();
    const factorMap = new Map(
      emissionFactors.map((f) => [`${f.category}-${f.name}`, f])
    );

    // 데이터 변환 및 저장
    const createData = activities.map((activity) => {
      const category = CATEGORY_MAP[activity.categoryCode];
      if (!category) {
        throw new Error(`유효하지 않은 카테고리: ${activity.categoryCode}`);
      }

      // 배출계수 찾기
      const factor = factorMap.get(`${category}-${activity.name}`);
      const calculatedEmission = factor
        ? activity.amount * factor.currentValue
        : null;

      return {
        date: new Date(activity.date),
        category,
        name: activity.name,
        amount: activity.amount,
        unit: activity.unit,
        scope: activity.scope,
        emissionFactorId: factor?.id ?? null,
        calculatedEmission,
      };
    });

    // 트랜잭션으로 일괄 저장
    const result = await prisma.activity.createMany({
      data: createData,
    });

    return NextResponse.json({
      success: true,
      imported: result.count,
    });
  } catch (error) {
    console.error("POST /api/import error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
