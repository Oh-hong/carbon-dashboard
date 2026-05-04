# Carbon Dashboard

PCF(Product Carbon Footprint) 데이터를 시각화하는 탄소 배출 대시보드

## 프로젝트 개요

HanaLoop 프론트엔드 개발자 채용 과제로, 기업의 탄소 배출량을 측정·관리하는 대시보드를 구현합니다.

### 대상 사용자
- **경영자**: 요약 현황, 트렌드 파악, 탄소세 계획
- **실무자**: 데이터 입력, 상세 분석, 배출계수 관리

### 핵심 도메인 개념

#### GHG Protocol Scope
| Scope | 설명 | 이 프로젝트 데이터 |
|-------|------|-------------------|
| Scope 1 | 직접 배출 (자사 시설 연소) | - |
| Scope 2 | 간접 배출 (구매 전기/열) | 전기 (한국전력) |
| Scope 3 | 기타 간접 (공급망, 운송) | 원소재, 운송 |

#### 배출량 계산
```
CO₂ 배출량(kgCO₂e) = 활동량 × 배출계수
```

## 기술 스택

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL + Prisma 7
- **Charts**: Recharts
- **Excel Parsing**: xlsx

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 대시보드 메인
│   ├── activities/        # 활동 데이터 페이지
│   ├── emission-factors/  # 배출계수 관리 페이지
│   ├── import/            # Excel 임포트 페이지
│   └── api/               # API Routes
├── components/
│   ├── ui/                # shadcn 컴포넌트
│   ├── layout/            # 레이아웃 (Sidebar, Header)
│   └── dashboard/         # 대시보드 컴포넌트
├── lib/
│   ├── db.ts              # Prisma 클라이언트
│   ├── constants.ts       # 상수 (Scope, 카테고리, 색상)
│   └── utils.ts           # 유틸리티 함수
├── generated/prisma/      # Prisma 생성 파일
└── types/                 # TypeScript 타입
```

## 데이터베이스 스키마

```
EmissionFactor (배출계수)
├── id, category, name, unit, currentValue
└── versions[] → EmissionFactorVersion (버전 이력)

Activity (활동 데이터)
├── id, date, category, name, amount, unit
├── scope (GHG Scope 2 or 3)
├── calculatedEmission (미리 계산된 배출량)
└── emissionFactorId → EmissionFactor
```

## 명령어

```bash
# 개발 서버
npm run dev

# 데이터베이스
npm run db:seed      # 시드 데이터 입력
npm run db:reset     # DB 리셋 + 마이그레이션

# Prisma
npx prisma studio    # DB GUI
npx prisma migrate dev --name <name>  # 마이그레이션 생성
npx prisma generate  # 클라이언트 재생성
```

## 환경 변수

```env
DATABASE_URL="postgresql://username@localhost:5432/carbon_dashboard"
```

## 과제 요구사항 체크리스트

- [x] 데이터베이스 스키마 설계
- [x] 배출계수 버전 이력 추적
- [x] GHG Scope 구분 (Scope 2, 3)
- [ ] 대시보드 UI (요약 카드, 차트)
- [ ] 활동 데이터 조회/필터
- [ ] 배출계수 관리 페이지
- [ ] Excel 임포트 기능 (가점)
- [ ] 반응형 레이아웃
- [ ] 로딩/에러 상태 처리

## 참고 사항

- Node.js 22+ 필요 (Prisma 7 요구사항)
- PostgreSQL 로컬 실행 필요
- `export PATH="/opt/homebrew/opt/node@22/bin:$PATH"` (Node 22 사용 시)

@AGENTS.md
