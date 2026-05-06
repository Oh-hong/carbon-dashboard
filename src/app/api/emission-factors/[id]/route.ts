import { NextRequest, NextResponse } from "next/server";
import { getEmissionFactorById, updateEmissionFactor } from "@/lib/queries";

// GET /api/emission-factors/[id] - 배출계수 상세 조회
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const factor = await getEmissionFactorById(id);

  if (!factor) {
    return NextResponse.json(
      { error: "배출계수를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json(factor);
}

// PATCH /api/emission-factors/[id] - 배출계수 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const body = await request.json();
  const { value } = body;

  if (typeof value !== "number" || value <= 0) {
    return NextResponse.json(
      { error: "유효한 배출계수 값을 입력해주세요." },
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

  await updateEmissionFactor(id, value);

  return NextResponse.json({ success: true });
}
