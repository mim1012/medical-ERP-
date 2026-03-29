# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Medical device distribution/sales ERP system (SaaS). Turborepo monorepo with React frontend, NestJS backend, and shared type package. Multi-tenant via Row-Level Security (tenant_id per row). Korean UI labels throughout.

## Commands

```bash
# Install
npm install

# Development (all apps)
npm run dev

# Development (single app)
npm run dev:web          # Vite dev server (apps/web)
npm run dev:api          # NestJS watch mode (apps/api)

# Build
npm run build            # All packages (Turborepo, respects dependency order)

# Type check
npm run type-check       # All packages

# Lint
npm run lint             # All packages

# Test (backend only currently)
cd apps/api && npm test              # Jest
cd apps/api && npm run test:cov      # Jest with coverage

# Prisma (from apps/api)
cd apps/api && npx prisma generate   # Generate client
cd apps/api && npx prisma migrate dev # Run migrations
cd apps/api && npx prisma studio     # DB browser
```

## Architecture

### Monorepo Structure (Turborepo + npm workspaces)

- **apps/web** (`@medical-erp/web`) - React 18 SPA with Vite 6. Tailwind CSS v4 + shadcn/ui + MUI v7. React Router v7 (flat routes, no nesting/layout routes yet).
- **apps/api** (`@medical-erp/api`) - NestJS 11 modular monolith. Prisma ORM + Supabase (PostgreSQL). ConfigModule loads `.env.local` then `.env`.
- **packages/shared** (`@medical-erp/shared`) - Shared TypeScript types and Korean label constants. Both apps depend on this. No build step (direct `.ts` imports via `"main": "./src/index.ts"`).

### Frontend (apps/web)

**Entry**: `src/main.tsx` -> `src/app/App.tsx` (ThemeProvider -> RouterProvider)

**Routing**: `src/app/routes.tsx` - flat `createBrowserRouter` with 13 top-level routes. No auth guards or layout wrappers yet.

| Path | Page | Domain |
|------|------|--------|
| `/` | Dashboard | KPI overview |
| `/clients` | ClientManagement | 거래처 |
| `/products` | ProductManagement | 제품 |
| `/inventory` | InventoryManagement | 재고 |
| `/receiving` | ReceivingManagement | 입고 |
| `/shipping` | ShippingManagement | 출고/배송 |
| `/service` | ServiceManagement | A/S |
| `/settlement` | SettlementManagement | 정산 |
| `/invoice` | TaxInvoiceManagement | 세금계산서 |
| `/documents` | DocumentManagement | 문서 |
| `/alerts` | AlertCenter | 알림 |
| `/logs` | LogHistory | 로그 이력 |
| `/users` | UserManagement | 사용자 |

**Component pattern**: Each domain has a page (`pages/XxxManagement.tsx`), a form (`components/XxxForm.tsx`), and a detail panel (`components/XxxDetailPanel.tsx`). Pages currently use inline mock data (no API integration yet).

**UI layers**:
- `components/ui/` - shadcn/ui primitives (Radix-based). Don't modify these directly.
- `components/figma/` - Figma Make generated components.
- `components/*.tsx` - Domain-specific components (forms, panels, cards).

**Path alias**: `@/` -> `apps/web/src/`

### Backend (apps/api)

**Entry**: `src/main.ts` -> `AppModule`

Early stage - scaffold only. Has:
- `PrismaModule` / `PrismaService` (global, extends PrismaClient with lifecycle hooks)
- `ConfigModule` (global, loads `.env.local` / `.env`)
- Root `AppController` / `AppService` (health check placeholder)

No domain modules yet (clients, products, etc. are not implemented).

**Path alias**: `@/` -> `apps/api/src/`

### Shared Package (packages/shared)

- `types.ts` - All domain interfaces (`Client`, `Product`, `Shipment`, `Receiving`, `ServiceCase`, `Inventory`, `User`, `Organization`) + `ApiResponse<T>`, pagination types
- `constants.ts` - Korean label maps for enums (`CLIENT_TYPE_LABELS`, `SHIPMENT_STATUS_LABELS`, etc.)

When adding new domain types, add them here so both apps share the same contract.

## Key Design Decisions

- **Multi-tenant SaaS**: Every domain entity has `organizationId`. All queries must filter by tenant. Backend will use Prisma middleware or RLS policies.
- **Dual UI library**: Tailwind CSS + shadcn/ui for most UI. MUI only for complex data components (DataGrid, DatePicker). Don't mix for the same use case.
- **Figma Make origin**: Frontend was initially generated from Figma. Some `imports/` files and `.BACKUP.tsx` files are artifacts of this process.
- **Supabase Auth planned**: Auth will use Supabase Auth (not custom JWT). Supabase JS client is already a dependency in apps/api.

## Domain Glossary

| Korean | English | Code Term |
|--------|---------|-----------|
| 거래처 | Client (hospital/clinic/pharmacy) | `Client` |
| 제품 | Medical device product | `Product` |
| 입고 | Receiving from manufacturer | `Receiving` |
| 출고 | Shipping to client | `Shipment` |
| 정산 | Financial settlement | `Settlement` |
| A/S | After-service (install/repair/maintenance) | `ServiceCase` |
| 세금계산서 | Tax invoice | `TaxInvoice` |

## Conventions

- TypeScript strict mode in both apps
- Named exports for components (`export function XxxPage()`, not default exports)
- Immutable patterns (spread operator, no mutation)
- Tailwind CSS first, MUI for complex widgets only
- File size limit: 800 lines
- Backend: NestJS module-per-domain pattern (controller + service + DTOs + guard)
- Validation: `class-validator` decorators on backend DTOs
- Enums: Prisma = UPPER_SNAKE English, FE = Korean labels via `shared/constants.ts`

## Current Work: Mock → API Migration

**Status**: 계획 승인 완료, 구현 대기
**Plan**: `.claude/plans/mock-to-api-migration.md` (Ralplan 합의 통과)

### Phase 진행 상황

| Phase | 내용 | 상태 |
|-------|------|------|
| **-1** | 스키마-FE 인터페이스 조정 (Prisma 필드 확장 + 7개 신규 모델) | TODO |
| **0** | 인프라 (Auth, Prisma migration, React Query/axios, BE 공통, 시드) | TODO |
| **1** | 마스터 데이터 CRUD (Client, Product, User) | TODO |
| **2** | 재고/물류 (InventoryItem 재설계, PurchaseOrder+Receiving, Shipment) | TODO |
| **3** | 서비스/정산 (ServiceCase+InstalledDevice, Settlement, TaxInvoice) | TODO |
| **4** | 보조 (Document, Alert, AuditLog, Dashboard 집계 API) | TODO |

### Critical Notes
- **FE 인터페이스 = 요구사항 명세**: 각 페이지의 로컬 interface가 Prisma보다 2-3배 풍부. 스키마를 FE에 맞게 확장
- **Inventory 재설계 필수**: 현재 1:1 (Product-Inventory) → 1:many (InventoryItem: LOT/시리얼/창고별)
- **누락 모델 7개**: PurchaseOrder, PurchaseOrderItem, InstalledDevice, Settlement, TaxInvoice, Document, Alert, AuditLog
- **Auth가 blocker**: Phase 0-0 Supabase Auth 연동 없이는 어떤 API도 tenant 필터링 불가
- **FE에 React Query/axios 미설치**: Phase 0-2에서 설치 필요

### BE 모듈 표준 구조
```
apps/api/src/{domain}/
├── {domain}.module.ts
├── {domain}.controller.ts
├── {domain}.service.ts
└── dto/
    ├── create-{domain}.dto.ts
    ├── update-{domain}.dto.ts
    └── query-{domain}.dto.ts
```

### FE Hook 표준 구조
```
apps/web/src/app/
├── hooks/use{Domain}.ts
└── lib/api/{domain}.api.ts
```

### Shared 타입 목표 구조
```
packages/shared/src/
├── types/
│   ├── entities.ts   # DB entity (Prisma mirror)
│   ├── views.ts      # API response (join/computed 포함)
│   ├── dto.ts        # Create/Update DTOs
│   └── index.ts
├── constants.ts
└── index.ts
```

## Project Tracking

- **Migration Plan**: `.claude/plans/mock-to-api-migration.md`
- **Hive Config**: `.claude/hive-config.json`
- **Obsidian Wiki**: `C:\Users\samsung\Documents\Obsidian Vault\Project\medical-ERP-\`
