import { NextRequest, NextResponse } from "next/server";
import { getEmissionFactorById, updateEmissionFactor } from "@/lib/queries";

// GET /api/emission-factors/[id] - 배출계수 상세 조회
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // ID 유효성 검증
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "유효하지 않은 ID입니다." },
        { status: 400 }
      );
    }

    const factor = await getEmissionFactorById(id);

    if (!factor) {
      return NextResponse.json(
        { error: "배출계수를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(factor);
  } catch (error) {
    console.error("GET /api/emission-factors/[id] error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// PATCH /api/emission-factors/[id] - 배출계수 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // ID 유효성 검증
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "유효하지 않은 ID입니다." },
        { status: 400 }
      );
    }

    // JSON 파싱 (실패 시 에러 처리)
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "잘못된 요청 형식입니다." },
        { status: 400 }
      );
    }

    const { value } = body;

    // 값 유효성 검증
    if (typeof value !== "number" || value <= 0 || !isFinite(value)) {
      return NextResponse.json(
        { error: "유효한 배출계수 값을 입력해주세요. (0보다 큰 숫자)" },
        { status: 400 }
      );
    }

    // 존재 여부 확인
    const factor = await getEmissionFactorById(id);
    if (!factor) {
      return NextResponse.json(
        { error: "배출계수를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 업데이트
    await updateEmissionFactor(id, value);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/emission-factors/[id] error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
