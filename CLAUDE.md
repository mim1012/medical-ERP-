# Medical ERP - 의료기기 유통/판매 관리 시스템

## 개요
의료기기 유통/판매 업체를 위한 풀스택 ERP 시스템. Figma Make로 생성된 프론트엔드 UI를 기반으로 백엔드 API, DB, 인증까지 포함한 완전한 ERP를 구축한다.

## 기술 스택

### Frontend
- **Framework**: React 18 + TypeScript
- **Build**: Vite 6
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI (shadcn/ui 기반)
- **Routing**: React Router v7
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Animation**: Motion (framer-motion)
- **DnD**: react-dnd

### Backend
- **Server**: NestJS (TypeScript, modular monolith)
- **DB**: Supabase (PostgreSQL, 호스팅)
- **ORM**: Prisma
- **Auth**: Supabase Auth (소셜 로그인, MFA 내장)
- **Storage**: Supabase Storage (문서/이미지, 테넌트별 격리)
- **Realtime**: Supabase Realtime (알림, 재고 변동)

### Infra
- **배포**: Vercel (프론트엔드 + NestJS API Serverless Functions) + Supabase Cloud (DB/Auth/Storage)
- **CI/CD**: GitHub Actions
- **모니터링**: Sentry
- **테스트**: Vitest (FE) + Jest (BE) + Playwright (E2E)

### Architecture
- **모노레포**: Turborepo (apps/web, apps/api, packages/shared)
- **멀티테넌트**: Row-Level Security (tenant_id 기반 데이터 격리)
- **SaaS 모델**: 조직(Organization) 기반, 10~50개 조직 목표

## 빌드 & 실행
- 설치: `npm install`
- 개발: `npm run dev`
- 빌드: `npm run build`
- 테스트: TBD

## 디렉토리 구조
```
src/
├── main.tsx                    # 엔트리포인트
├── app/
│   ├── App.tsx                 # 루트 컴포넌트
│   ├── routes.tsx              # 라우팅 설정
│   ├── components/             # 공통 컴포넌트
│   │   ├── ui/                 # shadcn/ui 기본 컴포넌트
│   │   ├── figma/              # Figma 연동 컴포넌트
│   │   ├── Header.tsx          # 헤더
│   │   ├── Sidebar.tsx         # 사이드바 네비게이션
│   │   ├── *Form.tsx           # 각 도메인별 폼
│   │   └── *DetailPanel.tsx    # 각 도메인별 상세 패널
│   ├── pages/                  # 페이지 컴포넌트
│   │   ├── Dashboard.tsx       # 대시보드 (KPI)
│   │   ├── ClientManagement.tsx      # 거래처 관리
│   │   ├── ProductManagement.tsx     # 제품 관리
│   │   ├── InventoryManagement.tsx   # 재고 관리
│   │   ├── ShippingManagement.tsx    # 출고/배송 관리
│   │   ├── ReceivingManagement.tsx   # 입고 관리
│   │   ├── ServiceManagement.tsx     # A/S 관리
│   │   ├── SettlementManagement.tsx  # 정산 관리
│   │   ├── TaxInvoiceManagement.tsx  # 세금계산서 관리
│   │   ├── DocumentManagement.tsx    # 문서 관리
│   │   ├── AlertCenter.tsx           # 알림 센터
│   │   ├── LogHistory.tsx            # 로그 이력
│   │   └── UserManagement.tsx        # 사용자 관리
│   └── contexts/
│       └── ThemeContext.tsx     # 테마 컨텍스트
├── imports/                    # Figma Make 임포트
└── styles/                     # 글로벌 스타일
```

## 코딩 컨벤션
- TypeScript strict mode
- Immutable 패턴 (spread operator)
- 컴포넌트: 함수형 + named export
- 스타일: Tailwind CSS + shadcn/ui 전용 (MUI 사용 금지)
- 경로 alias: `@/` -> `src/`
- 파일 크기: 800줄 이하

## 아키텍처 결정 사항

| 항목 | 결정 | 비고 |
|------|------|------|
| NestJS 배포 | Vercel Serverless Functions | `@vercel/node` 어댑터 사용 |
| MUI | 사용 안 함, 제거 대상 | shadcn/ui + Tailwind로 통일 |
| 세금계산서 연동 | 홈택스 직접 연동 (국세청 SOAP API) | 공인인증서 관리 로직 별도 필요 |
| 사용자-조직 관계 | 1:1 (한 사용자는 하나의 조직만) | User -> Organization N:1 유지 |
| 데이터 접근 경로 | NestJS API 단일 경유 | FE에서 Supabase 직접 DB 접근 금지 |

## 도메인 용어
| 용어 | 설명 |
|------|------|
| 거래처 (Client) | 병원/의원/약국 등 의료기기 구매처 |
| 제품 (Product) | 의료기기 품목 |
| 입고 (Receiving) | 제조사/수입사로부터 제품 입고 |
| 출고 (Shipping) | 거래처로 제품 배송 |
| 정산 (Settlement) | 매출/매입 정산 |
| A/S (Service) | 설치, 수리, 유지보수 서비스 |
| 세금계산서 (Tax Invoice) | 전자세금계산서 발행/관리 |

## 구현 현황

### 백엔드 API (NestJS)
- **상태**: 완성
- **13개 모듈 완성**:
  - `clients` - 거래처 CRUD
  - `products` - 제품 CRUD
  - `inventory` - 재고 조회/업데이트
  - `receiving` - 입고 CRUD 및 상태 관리
  - `shipping` - 출고 CRUD, 상태 변경 (APPROVED → SHIPPED → DELIVERED)
  - `service` - A/S 접수, CRUD
  - `settlement` - 정산 CRUD
  - `tax-invoice` - 세금계산서 CRUD, 발행 (invoiceNumber 자동생성)
  - `document` - 문서 CRUD + Supabase Storage 파일 업로드
  - `alert` - 알림 조회, 읽음 처리, 삭제
  - `log` - 시스템 로그 조회
  - `dashboard` - KPI 통계 (매출, 거래처, 재고)
  - `users` - 사용자 정보 조회/수정
- **인증**: Supabase Auth Guard 연동, Bearer JWT 검증
- **응답 포맷**: ApiResponse<T> 표준화 (success, data, error, meta)
- **멀티테넌트**: @CurrentUser() 데코레이터로 organizationId 자동 추출
- **문서**: Swagger/OpenAPI 자동 생성 (`http://localhost:3000/api/docs`)

### 프론트엔드 (React + Vite)
- **상태**: 완성
- **13개 페이지 + 로그인**:
  - `Dashboard` - KPI, 매출 차트 (Recharts)
  - `ClientManagement` - 거래처 목록, CRUD
  - `ProductManagement` - 제품 목록, CRUD
  - `InventoryManagement` - 재고 현황
  - `ReceivingManagement` - 입고 등록, 상태 관리
  - `ShippingManagement` - 출고 등록, 배송 추적
  - `ServiceManagement` - A/S 접수, 관리
  - `DocumentManagement` - 문서 파일 관리
  - `SettlementManagement` - 정산 기록
  - `TaxInvoiceManagement` - 세금계산서 관리
  - `UserManagement` - 사용자 관리
  - `AlertCenter` - 알림 조회 및 관리
  - `LogHistory` - 로그 이력 조회
- **API 연동**: 13개 custom hooks (useClients, useProducts, useShipping 등)
- **인증**: Supabase Auth + ProtectedRoute
- **스토리지**: Supabase Storage 기반 문서 파일 업로드 구현 완료
- **상태 관리**: TanStack Query (서버 상태) + Context API (UI 상태)

### 데이터베이스 (Supabase PostgreSQL)
- **상태**: 마이그레이션 완료
- **파일**: `supabase/migrations/20260403000000_init.sql`
- **테이블**: 13개 도메인 + 사용자/조직 테이블
- **RLS 정책**: 멀티테넌트 데이터 격리 (tenant_id 기반)

### 배포 & 인프라
- **프론트엔드**: Vercel (자동 배포)
- **백엔드**: Vercel Serverless Functions (@vercel/node 어댑터)
- **데이터베이스**: Supabase Cloud (호스팅 PostgreSQL)
- **파일 스토리지**: Supabase Storage (문서, 이미지)
- **CI/CD**: GitHub Actions (예정)

### 미구현 항목
- 🔴 홈택스 SOAP API 연동 (세금계산서 직접 발행) - 공인인증서 관리 로직 필요
- 🟡 productClientMapping 엔드포인트 (출고 폼에서 거래처별 구매 이력 조회)
- 🟡 테스트 (Vitest/Jest) - 구조는 설정되어 있으나 작성 미완료

### 코딩 컨벤션 준수
- ✅ TypeScript strict mode
- ✅ Immutable 패턴 (spread operator)
- ✅ 함수형 컴포넌트 + named export
- ✅ Tailwind CSS + shadcn/ui 전용 (MUI 제외)
- ✅ 경로 alias (@/ → src/)
- ✅ 파일 크기: 800줄 이하
