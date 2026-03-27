# Medical ERP - 의료기기 유통/판매 관리 시스템

## 개요
의료기기 유통/판매 업체를 위한 풀스택 ERP 시스템. Figma Make로 생성된 프론트엔드 UI를 기반으로 백엔드 API, DB, 인증까지 포함한 완전한 ERP를 구축한다.

## 기술 스택

### Frontend
- **Framework**: React 18 + TypeScript
- **Build**: Vite 6
- **Styling**: Tailwind CSS v4 + MUI v7
- **UI Components**: Radix UI (shadcn/ui 기반) + MUI
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
- **배포**: Vercel (프론트엔드) + Supabase Cloud (백엔드/DB)
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
- 스타일: Tailwind CSS 우선, MUI는 복잡한 컴포넌트에만 사용
- 경로 alias: `@/` -> `src/`
- 파일 크기: 800줄 이하

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
