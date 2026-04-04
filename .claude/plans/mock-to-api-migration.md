# Plan v2: Mock 데이터 → 실제 API 교체

> Revision 2 — Architect ITERATE + Critic REJECT 피드백 반영

## 목표
프론트엔드 13개 페이지의 인라인 mock 데이터를 NestJS 백엔드 API로 교체한다.
FE 인터페이스를 요구사항 명세로 취급하여 Prisma 스키마를 FE 요구에 맞게 확장한다.

## RALPLAN-DR Summary

### Principles
1. **FE 인터페이스 = 요구사항 명세**: mock 인터페이스의 필드가 실제 필요한 데이터 구조. 스키마를 FE에 맞게 확장
2. **점진적 마이그레이션**: 도메인 단위. 미완료 페이지는 mock 유지 (feature flag 패턴)
3. **Entity vs View 타입 분리**: shared에서 DB entity 타입과 API response view 타입을 구분
4. **Auth-first**: 인증 없이는 테넌트 식별 불가. 인증이 최우선

### Decision Drivers
1. **FE-Schema 필드 격차 해소**: 모든 도메인에서 FE가 스키마보다 2-3배 많은 필드 보유
2. **Inventory 재설계 필수**: 1:1 → 1:many (LOT/시리얼별 재고 추적)
3. **인증이 모든 API의 전제 조건**: organizationId 필터링의 기반

### 선택: Option A — React Query + NestJS REST
- **채택 사유**: 서버사이드 비즈니스 로직 확장 가능, Swagger 문서화, 캐싱/리페치 자동화
- **Option B (Supabase 직접) 불채택**: 장기적으로 복잡한 도메인 로직(정산 계산, 재고 예약, LOT 추적)이 서버에 필요
- **Option C (tRPC) 불채택**: NestJS + Swagger 조합이 이미 설치됨, REST 생태계와 정합

---

## Phase -1: 스키마-FE 인터페이스 조정 (Schema Reconciliation)

FE mock 인터페이스를 기준으로 Prisma 스키마와 shared 타입을 확장한다.

### 기존 모델 필드 확장

**Client** (FE 16필드 vs Prisma 10필드):
```
추가 필드: code, representative, contactPerson, region, unpaidBalance,
          lastTransaction, registrationDate, contractStart, contractEnd,
          beds, departments (Json), annualRevenue, documentStatus (Json)
```

**Product** (FE 21필드 vs Prisma 10필드):
```
추가 필드: code, modelName, manufacturer, approvalNumber, deviceGrade,
          lotManagement, serialManagement, expiryManagement,
          standardPrice, supplyPrice, salePrice, safetyStock, minStock, maxStock,
          insuranceCode, insuranceCovered, expiryDate, manufacturingCountry, originCountry
```

**User** (FE 7필드 vs Prisma 7필드):
```
추가 필드: department, position, phone, roleGroup, status
```

**Inventory** — 모델 재설계 (CRITICAL):
```
기존: Inventory (1:1 Product, quantity + safetyStock + lotNumber)
변경: InventoryItem (1:many Product)
      - productId, lotNumber?, serialNumber?, warehouse,
        quantity, reservedQty, receivedDate, manufactureDate,
        expiryDate, organizationId
삭제: 기존 Inventory 모델의 @unique productId 제약 제거
```

**ServiceCase** (FE 9필드 vs Prisma 10필드):
```
추가 필드: caseNumber, equipmentName, serialNumber, symptoms, priority, engineer
기존 불일치: FE는 hospitalName 사용 (= Client.name join)
```

**Shipment / Receiving** — ShipmentItem, ReceivingItem에 lotNumber, serialNumber 필드 추가

### 누락 모델 신규 생성 (7개)

1. **PurchaseOrder** + **PurchaseOrderItem**
   ```
   poNumber, orderDate, supplier, manager, expectedDate,
   totalAmount, status, receivedQty, totalQty, organizationId
   PurchaseOrderItem: productId, quantity, unitPrice
   ```

2. **InstalledDevice**
   ```
   equipmentName, modelName, serialNumber, clientId (→ Client),
   productId (→ Product), installationDate, warrantyExpiry,
   engineer, status, organizationId
   ```

3. **Settlement**
   ```
   settlementNumber, clientId (→ Client), period,
   supplyAmount, taxAmount, totalAmount,
   receivedAmount, unpaidAmount, status,
   daysOverdue?, organizationId
   ```

4. **TaxInvoice**
   ```
   invoiceNumber, clientId (→ Client), shipmentId (→ Shipment),
   businessNumber, issueMonth, supplyAmount, taxAmount, totalAmount,
   issueDate, email, status, manager, organizationId
   ```

5. **Document**
   ```
   documentName, documentType, relatedProductId?, relatedClientId?,
   version, uploadDate, expiryDate, storagePath (Supabase Storage),
   status, organizationId
   ```

6. **Alert**
   ```
   alertNumber, type, title, target, relatedNumber,
   issueDate, priority, status, manager, deadline,
   relatedClientId?, relatedProductId?, actionNote?, internalMemo?,
   organizationId
   ```

7. **AuditLog**
   ```
   timestamp, userId (→ User), menu, action, target,
   targetNumber, summary, ip, importance,
   beforeValue?, afterValue?, reason?, device?, note?,
   organizationId
   ```

### Shared 타입 구조 변경
```
packages/shared/src/
├── types/
│   ├── entities.ts      # DB entity 타입 (Prisma 모델 미러)
│   ├── views.ts         # API response view 타입 (join/computed 포함)
│   ├── dto.ts           # Create/Update DTO 타입
│   └── index.ts         # re-export
├── constants.ts         # 기존 유지
└── index.ts
```

**View 타입 예시:**
```typescript
// entities.ts
interface InventoryItem { productId, lotNumber, quantity, ... }

// views.ts
interface InventoryItemView extends InventoryItem {
  productCode: string      // join Product
  productName: string      // join Product
  modelName: string        // join Product
  availableQty: number     // computed: quantity - reservedQty
  daysUntilExpiry: number  // computed: expiryDate - now
}
```

### 상태 enum 매핑
```typescript
// constants.ts에 추가
export const INVENTORY_STATUS = { NORMAL: '정상', LOW_STOCK: '재고부족', EXPIRING: '만료임박' } as const
// BE에서 enum 저장, FE에서 label 매핑
```

---

## Phase 0: 인프라 준비

### 0-0. Supabase Auth 연동 (BLOCKER)
- **BE**: NestJS `AuthModule` — Supabase JWT 검증 Guard (`SupabaseAuthGuard`)
- **BE**: `@CurrentUser()` 데코레이터 — JWT에서 userId + organizationId 추출
- **BE**: 글로벌 `TenantInterceptor` — 모든 쿼리에 organizationId 자동 주입
- **FE**: Supabase Auth 클라이언트 설정 + 로그인 페이지 (최소한)
- **FE**: axios interceptor — `supabase.auth.getSession()` 토큰 자동 첨부

### 0-1. Prisma 스키마 업데이트
- Phase -1의 모든 변경사항 반영
- `npx prisma migrate dev` 실행
- `npx prisma generate` 클라이언트 재생성

### 0-2. FE 의존성 설치 + API 클라이언트
```bash
cd apps/web
npm install @tanstack/react-query axios @supabase/supabase-js
```
- `src/app/lib/api-client.ts` — axios 인스턴스 (baseURL, auth interceptor)
- `src/app/lib/query-client.ts` — QueryClient 설정
- `App.tsx`에 `QueryClientProvider` 래핑
- `.env` — `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

### 0-3. BE 공통 모듈
- `PaginationDto` (page, limit, search, sortBy, sortOrder)
- `ApiResponse<T>` 응답 인터셉터
- NestJS CORS 설정 (`app.enableCors()`)
- Swagger 부트스트랩 (`main.ts`에 `SwaggerModule.setup`)

### 0-4. 개발 환경 시드 데이터
- `prisma/seed.ts` — 테스트용 Organization, User, 기본 마스터 데이터
- `package.json`에 `"prisma": { "seed": "ts-node prisma/seed.ts" }` 추가

---

## Phase 1: 마스터 데이터 (의존성 없는 CRUD)

각 도메인 모듈 표준 구조:
```
apps/api/src/{domain}/
├── {domain}.module.ts
├── {domain}.controller.ts    # CRUD endpoints + Swagger decorators
├── {domain}.service.ts       # Prisma 쿼리 + 비즈니스 로직
└── dto/
    ├── create-{domain}.dto.ts  # class-validator 데코레이터
    ├── update-{domain}.dto.ts
    └── query-{domain}.dto.ts   # 필터/검색 파라미터

apps/web/src/app/
├── hooks/use{Domain}.ts        # React Query hooks
└── lib/api/{domain}.api.ts     # axios 호출 함수
```

### 1-1. 거래처 (Client)
- BE: `ClientModule` — CRUD + 검색 + 상태별 필터 + 미수금 조회
- FE: `useClients()` hook → `ClientManagement.tsx` mock 교체
- View: `ClientView` (entity + documentStatus computed)

### 1-2. 제품 (Product)
- BE: `ProductModule` — CRUD + 카테고리 필터 + LOT/시리얼 관리 여부
- FE: `useProducts()` hook → `ProductManagement.tsx` mock 교체
- View: `ProductView` (entity + stockQuantity from InventoryItem 집계)

### 1-3. 사용자 (User)
- BE: `UserModule` — CRUD + 역할/상태 필터
- FE: `useUsers()` hook → `UserManagement.tsx` mock 교체

---

## Phase 2: 재고/물류 (마스터 데이터 의존)

### 2-1. 재고 (InventoryItem) — CRITICAL
- BE: `InventoryModule`
  - 다중 필터: 검색 + LOT + 시리얼 + 창고 + 상태 + 만료기간
  - Computed: `availableQty = quantity - reservedQty`, `daysUntilExpiry`
  - 알림 카운트: 30/60/90일 만료임박, 재고부족
- FE: `useInventory()` hook → `InventoryManagement.tsx` mock 교체
- View: `InventoryItemView` (Product join + computed fields)

### 2-2. 입고 (PurchaseOrder + Receiving)
- BE: `ReceivingModule`
  - PurchaseOrder CRUD + 상태 전이 (발주완료→부분입고→입고완료→지연)
  - Receiving 처리 시 InventoryItem 자동 생성/수량 증가
  - 재고부족 감지 → 자동 발주 추천
- FE: `usePurchaseOrders()`, `useReceiving()` hooks → `ReceivingManagement.tsx` mock 교체

### 2-3. 출고 (Shipment)
- BE: `ShipmentModule`
  - 상태 전이 (요청→승인→출고→배송→완료/취소)
  - 출고 확정 시: InventoryItem 수량 차감 + TaxInvoice 자동 생성 + Settlement 연결
  - 제품-거래처 매핑, LOT/시리얼 선택, 공급가·부가세 계산
- FE: `useShipments()` hook → `ShippingManagement.tsx` mock 교체
- 복잡도 높음: multi-entity selection flow (제품→거래처→LOT/시리얼→가격) 전용 hooks 필요

---

## Phase 3: 서비스/정산 (물류 의존)

### 3-1. 설치장비 (InstalledDevice) + A/S (ServiceCase)
- BE: `ServiceModule`
  - InstalledDevice CRUD + 보증만료 추적
  - ServiceCase CRUD + 상태 전이 (접수→진행→완료→종료)
  - 2탭 구조: devices / cases
- FE: `useInstalledDevices()`, `useServiceCases()` hooks → `ServiceManagement.tsx` mock 교체

### 3-2. 정산 (Settlement)
- BE: `SettlementModule`
  - 출고 데이터 기반 자동 집계
  - 수금 처리, 미수금 추적, 연체일 계산
- FE: `useSettlements()` hook → `SettlementManagement.tsx` mock 교체

### 3-3. 세금계산서 (TaxInvoice)
- BE: `TaxInvoiceModule`
  - 출고 확정 시 자동 생성 (발행대기)
  - 상태: 발행대기→발행완료→수정→오류
- FE: `useTaxInvoices()` hook → `TaxInvoiceManagement.tsx` mock 교체

---

## Phase 4: 보조 기능 + 대시보드

### 4-1. 문서 (Document)
- BE: `DocumentModule` + Supabase Storage 연동
  - 파일 업로드/다운로드, 만료일 추적
- FE: `useDocuments()` hook → `DocumentManagement.tsx` mock 교체

### 4-2. 알림 (Alert)
- BE: `AlertModule`
  - 재고부족, 만료임박, 문서만료, 세금계산서 미발행 등 자동 생성 규칙
- FE: `useAlerts()` hook → `AlertCenter.tsx` mock 교체

### 4-3. 감사 로그 (AuditLog)
- BE: `AuditLogModule` + NestJS Interceptor로 자동 기록
  - 모든 CUD 작업의 before/after 값 기록
- FE: `useAuditLogs()` hook → `LogHistory.tsx` mock 교체

### 4-4. 대시보드 (Dashboard) — 집계 API
별도 `DashboardModule`에 전용 엔드포인트:

| 엔드포인트 | 데이터 | 쿼리 전략 |
|-----------|--------|----------|
| `GET /dashboard/kpi` | 월매출, 미수금, 오늘출고, AS건수 | Prisma groupBy + aggregate |
| `GET /dashboard/charts/revenue` | 월별 매출 추이 | Prisma groupBy on Shipment by month |
| `GET /dashboard/charts/clients` | 거래처별 매출 | Prisma groupBy on Settlement by clientId |
| `GET /dashboard/charts/products` | 제품 점유율 | Prisma groupBy on ShipmentItem by productId |
| `GET /dashboard/recent/shipments` | 최근 출고 5건 | Shipment.findMany + Client join |
| `GET /dashboard/recent/service` | 최근 A/S 5건 | ServiceCase.findMany + Client join |
| `GET /dashboard/alerts` | 알림 요약 | Alert.groupBy by type |

초기 구현: Prisma groupBy 사용. 성능 이슈 발생 시 PostgreSQL materialized view로 전환.

---

## FE 마이그레이션 패턴

### 기본 패턴 (단순 목록)
```typescript
// Before
const clients: Client[] = [{ /* mock */ }, ...];

// After
const { data: clients = [], isLoading, error } = useClients({ search, status });
if (isLoading) return <LoadingSkeleton />;
if (error) return <ErrorFallback error={error} />;
```

### 복잡 패턴 (ShippingManagement 등 multi-entity)
```typescript
// 제품 목록
const { data: products } = useProducts({ search: searchProductTerm });
// 선택된 제품의 거래처 목록
const { data: clients } = useProductClients(selectedProduct?.id);
// 선택된 제품의 LOT 목록
const { data: lots } = useProductLots(selectedProduct?.id, { enabled: selectedProduct?.lotManagement });
// 선택된 제품의 시리얼 목록
const { data: serials } = useProductSerials(selectedProduct?.id, { enabled: selectedProduct?.serialManagement });
```

### 롤백 전략
```typescript
// 마이그레이션 중 feature flag
const USE_API = import.meta.env.VITE_USE_API === 'true';

// hook에서 조건부 데이터 소스
function useClients() {
  if (!USE_API) return { data: MOCK_CLIENTS, isLoading: false };
  return useQuery({ queryKey: ['clients'], queryFn: fetchClients });
}
```

---

## 리스크 & 완화

| 리스크 | 영향 | 완화 |
|--------|------|------|
| Inventory 재설계가 Shipment/Receiving에 cascade | Phase 2 전체 지연 | Phase -1에서 확정, Phase 0에서 마이그레이션 완료 후 Phase 2 시작 |
| FE 필드 추가 시 기존 UI 레이아웃 깨짐 | 개별 페이지 | FE 로직은 변경 안 함, 데이터 소스만 교체 |
| Auth 미완료 시 전체 API 사용 불가 | 전체 | Phase 0-0을 최우선 blocker로 설정 |
| 대량 스키마 변경으로 마이그레이션 충돌 | DB | 단일 마이그레이션으로 Phase -1 + 0-1 통합 실행 |
| FE 상태 enum (한글) vs BE enum (영문) 불일치 | 전체 | shared/constants.ts의 label map 활용, View 타입에 label 포함 |

---

## 수용 기준 (Testable)

- [ ] `npm run build` — 0 errors (FE + BE)
- [ ] `npm run type-check` — 0 errors (FE + BE + shared)
- [ ] 13개 페이지 모두 API에서 데이터 로딩 (mock 데이터 0개)
- [ ] 모든 API 엔드포인트 Swagger UI에서 확인 가능 (`/api/docs`)
- [ ] 모든 목록 API에 페이지네이션 동작 (page, limit 파라미터)
- [ ] organizationId 기반 데이터 격리: 다른 테넌트 데이터 접근 불가
- [ ] 각 페이지 필터링/검색이 API 파라미터로 동작
- [ ] 출고 확정 → 재고 차감 + 세금계산서 생성 플로우 동작
- [ ] 입고 완료 → 재고 증가 플로우 동작

## 검증 방법

### BE 검증
- 각 모듈: Jest 단위 테스트 (service 레이어)
- API 통합: Swagger UI에서 CRUD + 필터 수동 테스트
- 테넌트 격리: 다른 organizationId로 요청 시 데이터 미노출 확인

### FE 검증
- 각 페이지: 로딩 → 데이터 렌더링 → 필터 동작 → CRUD 수동 확인
- E2E (추후): Playwright 기본 smoke test (페이지 로드 + 데이터 존재 확인)

### 통합 검증
- `npm run build` + `npm run type-check` 성공
- 시드 데이터로 전체 페이지 순회 확인

---

## ADR (Architecture Decision Record)

**Decision**: React Query + NestJS REST API로 FE mock 데이터 교체
**Drivers**: FE 비즈니스 로직 보존, 서버사이드 확장성, 타입 안전성
**Alternatives**: Supabase 직접 (빠르지만 서버 로직 부재), tRPC (NestJS와 부조화)
**Why chosen**: NestJS가 이미 존재하고 장기적으로 복잡한 도메인 로직(정산, 재고 예약)이 서버에 필요
**Consequences**: ~60개 신규 파일 (10개 BE 모듈 + FE hooks/api), React Query 의존성 추가
**Follow-ups**: Supabase Realtime 알림 연동, E2E 테스트 자동화, CI/CD 파이프라인
