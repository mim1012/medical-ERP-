# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개요

의료기기 유통/판매 업체를 위한 멀티테넌트 SaaS ERP. Turborepo 모노레포, NestJS 백엔드, React 프론트엔드, Supabase(PostgreSQL + Auth + Storage).

## 명령어

```bash
# 루트 (모노레포 전체)
npm install          # 전체 의존성 설치
npm run dev          # 전체 개발 서버 (FE + BE 동시)
npm run dev:web      # 프론트엔드만
npm run dev:api      # 백엔드만
npm run build        # 전체 빌드
npm run type-check   # 전체 타입 체크

# 백엔드 (apps/api)
cd apps/api
npm run dev          # nest start --watch (port 3000)
npm run build        # nest build → dist/
npm run type-check   # tsc --noEmit (빠른 타입 검증)
npm run test         # jest
npm run test:cov     # jest --coverage

# 프론트엔드 (apps/web)
cd apps/web
npm run dev          # vite (port 5173)
npm run build        # vite build → dist/
npm run type-check   # tsc --noEmit

# DB (apps/api 에서)
supabase link --project-ref koguaoizxjmqsjzdmnsk
supabase db push     # 로컬 migration 파일 → 원격 DB 적용
npx prisma generate  # Prisma 클라이언트 재생성 (스키마 변경 후)
```

> **주의**: `apps/web/src/imports/` 는 Figma Make 자동생성 파일로 TS 에러 71개가 pre-existing. 타입 체크 시 해당 경로 제외: `tsc --noEmit 2>&1 | grep -v src/imports`

## 모노레포 구조

```
medical-ERP-/
├── apps/
│   ├── api/                    # NestJS 백엔드
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts   # 전체 모듈 등록 + Guards/Interceptors
│   │   │   ├── common/         # 공통 인프라
│   │   │   │   ├── guards/supabase-auth.guard.ts
│   │   │   │   ├── interceptors/response.interceptor.ts
│   │   │   │   ├── filters/http-exception.filter.ts
│   │   │   │   ├── middleware/tenant.middleware.ts
│   │   │   │   └── decorators/ (current-user, public)
│   │   │   └── modules/        # 도메인 모듈 14개
│   │   └── prisma/
│   │       └── schema.prisma   # DB 스키마 (변경 후 migrate 필요)
│   │   └── supabase/
│   │       └── migrations/     # supabase db push로 적용
│   └── web/                    # React + Vite 프론트엔드
│       └── src/
│           ├── app/
│           │   ├── App.tsx     # QueryClientProvider + AuthProvider 래핑
│           │   ├── routes.tsx  # 모든 라우트 (ProtectedRoute 적용)
│           │   ├── pages/      # 13개 페이지 + Login
│           │   ├── components/ # 공통 컴포넌트 + 도메인 폼/패널
│           │   └── contexts/   # AuthContext, ThemeContext
│           ├── hooks/          # TanStack Query 커스텀 훅 13개
│           └── lib/
│               ├── api-client.ts     # axios 인스턴스 (baseURL /api)
│               ├── query-client.ts   # TanStack Query 설정
│               └── supabase-client.ts
└── packages/
    └── shared/                 # 공유 타입 (FE↔BE)
```

## 핵심 아키텍처

### 요청 흐름

```
Browser → /api/* (Vite proxy or Vercel rewrite)
  → SupabaseAuthGuard (JWT 검증, request.user 세팅)
  → TenantMiddleware (request.organizationId = user.organizationId)
  → Controller (@CurrentUser() → user.organizationId)
  → Service (Prisma 쿼리, organizationId 필터)
  → ResponseInterceptor ({ success, data, meta? })
```

### 인증 흐름

1. 로그인: `AuthContext.signIn()` → Supabase Auth → JWT 반환 → localStorage 저장
2. API 호출: `api-client.ts` 인터셉터가 `Authorization: Bearer {token}` 헤더 자동 추가
3. 백엔드 Guard: `supabase.auth.getUser(token)` → `user.user_metadata.organizationId` 추출
4. 회원가입: `POST /api/auth/signup` (슈퍼어드민 전용, JWT 필요) → Organization + User 생성 + user_metadata 업데이트

### 멀티테넌트

- **모든 Prisma 쿼리**에 `organizationId` 필터 필수
- `@CurrentUser()` 데코레이터로 컨트롤러에서 추출
- DB 레벨 RLS는 Supabase에 설정 (추가 보안 레이어)
- 프론트에서 Supabase 직접 접근 금지, NestJS API 단일 경유

### API 응답 형식

```typescript
// 모든 API 응답 (ResponseInterceptor 자동 적용)
{ success: true, data: T, meta?: { total, page, limit } }
{ success: false, error: "메시지" }
```

## 환경변수

**`apps/api/.env`**
```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # auth.admin API용 (signup 엔드포인트)
DATABASE_URL=                # PgBouncer pooler :6543 (런타임)
DIRECT_URL=                  # Direct :5432 (prisma migrate용)
PORT=3000
```

**`apps/web/.env.local`**
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_BASE_URL=http://localhost:3000
```

## 백엔드 모듈 패턴

각 도메인 모듈은 `{domain}.module.ts`, `{domain}.controller.ts`, `{domain}.service.ts`, `dto/` 구조.
- 컨트롤러: `@CurrentUser() user` 파라미터로 organizationId 추출
- 서비스: `PrismaService` inject, 모든 쿼리에 `organizationId` 조건 포함
- 재고 변동(입고 COMPLETED, 출고 SHIPPED)은 `prisma.$transaction()` 사용

## 프론트엔드 패턴

- 훅: `apps/web/src/hooks/use-{domain}.ts` → `useQuery`/`useMutation` + `apiClient`
- 페이지 import 경로: `../../hooks/use-{domain}` (pages/ 기준)
- 새 페이지: routes.tsx에 `ProtectedRoute`로 감싸서 등록

## DB 스키마 변경 절차

1. `apps/api/prisma/schema.prisma` 수정
2. `npx prisma generate` (타입 재생성)
3. migration SQL 생성: `npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > supabase/migrations/{timestamp}_{name}.sql`
4. `supabase db push` (원격 적용)

## 아키텍처 결정 사항

| 항목 | 결정 |
|------|------|
| NestJS 배포 | Vercel Serverless Functions (`@vercel/node` 어댑터) |
| UI 라이브러리 | shadcn/ui + Tailwind CSS v4 (MUI 없음) |
| 세금계산서 연동 | 홈택스 SOAP API 직접 연동 예정 (미구현) |
| 사용자-조직 관계 | 1:1 (User → Organization N:1) |
| 회원가입 | 슈퍼어드민이 API로 직접 생성 (공개 가입 없음) |
| Prisma migrate | Docker 없이 `supabase db push`로 대체 |

## 도메인 용어

| 용어 | 설명 |
|------|------|
| 거래처 (Client) | 병원/의원/약국 등 구매처 |
| 입고 (Receiving) | 제조사/수입사로부터 제품 입고 |
| 출고 (Shipping) | 거래처로 제품 배송 |
| 정산 (Settlement) | 매출/매입 정산 (RECEIVABLE/PAYABLE) |
| A/S (Service) | 설치, 수리, 유지보수 |
| 세금계산서 (Tax Invoice) | 전자세금계산서 발행/관리 |

## 미구현 항목

- 홈택스 SOAP API 연동 (국세청 공인인증서 필요)
- productClientMapping (출고 폼 거래처별 구매 이력)
- 테스트 코드 (Vitest/Jest 구조는 있으나 작성 안 됨)
- CI/CD (GitHub Actions 설정 예정)
