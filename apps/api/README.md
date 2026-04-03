# Medical ERP API

의료기기 유통/판매 관리 시스템의 백엔드 NestJS API 서버입니다.

## 기술 스택

- **Framework**: NestJS 11 (TypeScript)
- **ORM**: Prisma 6
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Bearer JWT)
- **Storage**: Supabase Storage
- **API Documentation**: Swagger/OpenAPI
- **Validation**: class-validator, class-transformer
- **Testing**: Jest

## 환경 변수

`.env.example`을 참고하여 설정:

```
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

# Server
PORT=3000 (기본값)
NODE_ENV=development|production

# Frontend
FRONTEND_URL=http://localhost:5173
```

## API 엔드포인트

모든 엔드포인트는 `/api` 프리픽스가 붙으며 Bearer JWT 인증이 필요합니다.

| 모듈 | Method | Path | 설명 |
|------|--------|------|------|
| **Clients** (거래처) | GET | `/api/clients` | 거래처 목록 조회 |
| | GET | `/api/clients/:id` | 거래처 상세 조회 |
| | POST | `/api/clients` | 거래처 생성 |
| | PATCH | `/api/clients/:id` | 거래처 수정 |
| | DELETE | `/api/clients/:id` | 거래처 삭제 |
| **Products** (제품) | GET | `/api/products` | 제품 목록 조회 |
| | GET | `/api/products/:id` | 제품 상세 조회 |
| | POST | `/api/products` | 제품 생성 |
| | PATCH | `/api/products/:id` | 제품 수정 |
| | DELETE | `/api/products/:id` | 제품 삭제 |
| **Inventory** (재고) | GET | `/api/inventory` | 재고 목록 조회 |
| | GET | `/api/inventory/:id` | 재고 상세 조회 |
| | PATCH | `/api/inventory/:id` | 재고 수정 |
| **Receiving** (입고) | GET | `/api/receiving` | 입고 목록 조회 |
| | GET | `/api/receiving/:id` | 입고 상세 조회 (items 포함) |
| | POST | `/api/receiving` | 입고 생성 |
| | PATCH | `/api/receiving/:id` | 입고 상태 변경 |
| | DELETE | `/api/receiving/:id` | 입고 삭제 |
| **Shipping** (출고) | GET | `/api/shipping` | 출고 목록 조회 |
| | GET | `/api/shipping/:id` | 출고 상세 조회 (items, client 포함) |
| | POST | `/api/shipping` | 출고 생성 |
| | PATCH | `/api/shipping/:id/status` | 출고 상태 변경 (APPROVED → SHIPPED → DELIVERED) |
| | DELETE | `/api/shipping/:id` | 출고 삭제 (REQUESTED 상태만) |
| **Service** (A/S) | GET | `/api/service` | A/S 목록 조회 |
| | GET | `/api/service/:id` | A/S 상세 조회 |
| | POST | `/api/service` | A/S 접수 |
| | PATCH | `/api/service/:id` | A/S 수정 (상태, 담당자, 해결일시) |
| | DELETE | `/api/service/:id` | A/S 삭제 |
| **Settlement** (정산) | GET | `/api/settlement` | 정산 목록 조회 |
| | GET | `/api/settlement/:id` | 정산 상세 조회 |
| | POST | `/api/settlement` | 정산 생성 |
| | PATCH | `/api/settlement/:id` | 정산 수정 |
| | DELETE | `/api/settlement/:id` | 정산 삭제 |
| **TaxInvoice** (세금계산서) | GET | `/api/tax-invoice` | 세금계산서 목록 조회 |
| | GET | `/api/tax-invoice/:id` | 세금계산서 상세 조회 |
| | POST | `/api/tax-invoice` | 세금계산서 생성 (invoiceNumber 자동생성) |
| | PATCH | `/api/tax-invoice/:id` | 세금계산서 수정 |
| | PATCH | `/api/tax-invoice/:id/issue` | 세금계산서 발행 (DRAFT → ISSUED) |
| | DELETE | `/api/tax-invoice/:id` | 세금계산서 삭제 (DRAFT만 가능) |
| **Document** (문서) | GET | `/api/document` | 문서 목록 조회 |
| | GET | `/api/document/:id` | 문서 상세 조회 |
| | POST | `/api/document` | 문서 생성 (Supabase Storage 파일 업로드 포함) |
| | PATCH | `/api/document/:id` | 문서 수정 |
| | DELETE | `/api/document/:id` | 문서 삭제 |
| **Alert** (알림) | GET | `/api/alert` | 알림 목록 조회 |
| | GET | `/api/alert/unread-count` | 읽지 않은 알림 수 조회 |
| | PATCH | `/api/alert/:id/read` | 알림 읽음 처리 |
| | PATCH | `/api/alert/read-all` | 전체 알림 읽음 처리 |
| | DELETE | `/api/alert/:id` | 알림 삭제 |
| **Log** (로그) | GET | `/api/log` | 시스템 로그 조회 |
| **Dashboard** | GET | `/api/dashboard/stats` | 대시보드 KPI (매출, 거래처, 재고 등) |
| **Users** (사용자) | GET | `/api/users` | 사용자 목록 조회 |
| | GET | `/api/users/:id` | 사용자 상세 조회 |
| | PATCH | `/api/users/:id` | 사용자 정보 수정 |

## API 응답 형식

모든 응답은 다음 형식을 따릅니다:

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number      // 전체 데이터 수 (페이지네이션)
    page: number       // 현재 페이지
    limit: number      // 페이지당 항목 수
  }
}
```

### 성공 응답 (200)
```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "거래처명"
  }
}
```

### 페이지네이션 응답 (200)
```json
{
  "success": true,
  "data": [
    { "id": "1", "name": "거래처1" },
    { "id": "2", "name": "거래처2" }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

### 에러 응답 (4xx, 5xx)
```json
{
  "success": false,
  "error": "거래처를 찾을 수 없습니다."
}
```

## 인증 (Authentication)

모든 요청 헤더에 Bearer JWT 토큰을 포함:

```
Authorization: Bearer <jwt_token>
```

Supabase Auth로부터 발급받은 토큰을 사용합니다. 토큰은 요청 시 자동으로 검증되며, 유효하지 않거나 만료된 경우 401 Unauthorized를 반환합니다.

## 멀티테넌트 지원

- **조직 격리**: Row-Level Security (RLS) 정책으로 `tenant_id` 기반 데이터 격리
- **사용자-조직 관계**: 1:1 (한 사용자는 하나의 조직만 소속)
- **Current User**: `@CurrentUser()` 데코레이터로 현재 인증된 사용자 정보 및 organizationId 자동 추출

## 로컬 실행

### 설치
```bash
npm install
```

### 개발 모드
```bash
npm run dev
```
- API 서버: http://localhost:3000
- Swagger 문서: http://localhost:3000/api/docs

### 빌드
```bash
npm run build
```

### 프로덕션 실행
```bash
npm run start:prod
```

### 테스트
```bash
npm run test
npm run test:cov
```

### 타입 체크
```bash
npm run type-check
```

### 린트
```bash
npm run lint
```

## 프로젝트 구조

```
src/
├── main.ts                          # 애플리케이션 진입점
├── app.module.ts                    # 루트 모듈
├── app.controller.ts                # 헬스 체크
├── common/
│   ├── decorators/
│   │   ├── current-user.decorator.ts    # 인증 사용자 정보 추출
│   │   └── public.decorator.ts          # 공개 라우트 표시
│   ├── guards/
│   │   └── supabase-auth.guard.ts       # JWT 검증 가드
│   ├── interceptors/
│   │   └── response.interceptor.ts      # API 응답 표준화
│   ├── filters/
│   │   └── http-exception.filter.ts     # 전역 예외 처리
│   └── middleware/
│       └── tenant.middleware.ts         # 멀티테넌트 컨텍스트
├── modules/
│   ├── clients/
│   ├── products/
│   ├── inventory/
│   ├── receiving/
│   ├── shipping/
│   ├── service/
│   ├── settlement/
│   ├── tax-invoice/
│   ├── document/
│   ├── alert/
│   ├── log/
│   ├── dashboard/
│   └── users/
└── prisma/
    └── schema.prisma                # Prisma ORM 스키마
```

## 주요 기능

### 거래처 관리 (Clients)
- 병원, 의원, 약국 등 의료기기 구매처 관리
- 연락처, 주소, 담당자 정보 저장

### 제품 관리 (Products)
- 의료기기 품목 등록 및 관리
- 품목코드, 이름, 카테고리, 가격 정보

### 재고 관리 (Inventory)
- 제품별 재고 수량 추적
- 입고/출고에 따른 자동 업데이트

### 입고/출고 (Receiving/Shipping)
- 제조사로부터 제품 입고 관리
- 거래처로의 제품 배송 관리
- 상태 변경 추적 (REQUESTED → APPROVED → SHIPPED → DELIVERED)

### A/S 관리 (Service)
- 설치, 수리, 유지보수 서비스 접수
- 담당자 배정, 진행 상태 관리

### 정산 관리 (Settlement)
- 매출/매입 정산 기록
- 거래처별 정산 현황

### 세금계산서 (TaxInvoice)
- 전자세금계산서 생성 및 발행
- invoiceNumber 자동생성
- 상태 관리 (DRAFT → ISSUED)
- 홈택스 SOAP API 연동 (미구현)

### 문서 관리 (Document)
- 서류 파일 업로드 (Supabase Storage)
- 파일 메타데이터 저장
- 테넌트별 격리된 스토리지

### 알림 센터 (Alert)
- 시스템 알림 전송 및 관리
- 읽음/읽지 않음 상태 추적

## 배포

Vercel Serverless Functions에 배포:
- `@vercel/node` 어댑터 사용
- 환경 변수는 Vercel 프로젝트 설정에서 관리

## 문서

- Swagger UI: http://localhost:3000/api/docs (개발 모드)
- 각 모듈의 controller 파일에서 `@ApiOperation`, `@ApiResponse` 데코레이터로 상세 설명
