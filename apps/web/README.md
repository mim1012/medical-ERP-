# Medical ERP Web

의료기기 유통/판매 관리 시스템의 React 프론트엔드 애플리케이션입니다.

## 기술 스택

- **Framework**: React 18 + TypeScript
- **Build**: Vite 6
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI (shadcn/ui 기반)
- **Routing**: React Router v7
- **State Management**: TanStack Query v5 (서버 상태), Context API (UI 상태)
- **Forms**: React Hook Form
- **Charts**: Recharts
- **Auth**: Supabase Auth
- **HTTP Client**: Axios
- **Animation**: Motion (framer-motion)
- **DnD**: react-dnd
- **Testing**: Vitest (예정)

## 환경 변수

`.env.example`을 참고하여 설정:

```
# Supabase (공개 키만)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend API
VITE_API_URL=http://localhost:3000/api
```

## 페이지 및 라우트

| 페이지 | 라우트 | 설명 |
|--------|--------|------|
| **Dashboard** | `/` | 대시보드 - KPI, 매출 차트, 거래처 수 등 |
| **Login** | `/login` | 로그인 페이지 (Supabase Auth) |
| **ClientManagement** | `/clients` | 거래처 관리 - CRUD, 목록, 상세 |
| **ProductManagement** | `/products` | 제품 관리 - CRUD, 목록, 상세 |
| **InventoryManagement** | `/inventory` | 재고 관리 - 제품별 재고 현황 |
| **ReceivingManagement** | `/receiving` | 입고 관리 - 입고 등록, 상태 변경 |
| **ShippingManagement** | `/shipping` | 출고 관리 - 출고 등록, 배송 추적 |
| **ServiceManagement** | `/service` | A/S 관리 - A/S 접수, 진행 상태 |
| **DocumentManagement** | `/documents` | 문서 관리 - 파일 업로드, 다운로드 |
| **SettlementManagement** | `/settlement` | 정산 관리 - 정산 기록, 현황 |
| **TaxInvoiceManagement** | `/invoice` | 세금계산서 관리 - 발행, 이력 |
| **UserManagement** | `/users` | 사용자 관리 - 사용자 정보 |
| **AlertCenter** | `/alerts` | 알림 센터 - 시스템 알림 조회 |
| **LogHistory** | `/logs` | 로그 이력 - 작업 히스토리 |

모든 페이지는 `ProtectedRoute` 컴포넌트로 보호되며, 인증되지 않은 사용자는 로그인 페이지로 리다이렉트됩니다.

## 훅 목록

| 훅 | 위치 | 역할 |
|----|------|------|
| `useClients()` | `hooks/use-clients.ts` | 거래처 데이터 조회, CRUD |
| `useProducts()` | `hooks/use-products.ts` | 제품 데이터 조회, CRUD |
| `useInventory()` | `hooks/use-inventory.ts` | 재고 데이터 조회, 업데이트 |
| `useReceiving()` | `hooks/use-receiving.ts` | 입고 데이터 조회, CRUD |
| `useShipping()` | `hooks/use-shipping.ts` | 출고 데이터 조회, CRUD, 상태변경 |
| `useService()` | `hooks/use-service.ts` | A/S 데이터 조회, CRUD |
| `useDocument()` | `hooks/use-document.ts` | 문서 데이터 조회, 업로드, 삭제 |
| `useSettlement()` | `hooks/use-settlement.ts` | 정산 데이터 조회, CRUD |
| `useTaxInvoice()` | `hooks/use-tax-invoice.ts` | 세금계산서 조회, CRUD, 발행 |
| `useAlert()` | `hooks/use-alert.ts` | 알림 조회, 읽음 처리, 삭제 |
| `useLog()` | `hooks/use-log.ts` | 로그 데이터 조회 |
| `useDashboard()` | `hooks/use-dashboard.ts` | 대시보드 KPI 데이터 조회 |
| `useUsers()` | `hooks/use-users.ts` | 사용자 데이터 조회, 정보 수정 |

**훅 사용 패턴:**
```typescript
const {
  data,           // 데이터 배열
  isLoading,      // 로딩 상태
  error,          // 에러 객체
  create,         // 생성 함수
  update,         // 수정 함수
  delete: remove, // 삭제 함수
  refetch,        // 수동 리페칭
} = useClients()
```

## 컴포넌트 구조

```
src/
├── main.tsx                                 # 엔트리포인트
├── App.tsx                                  # 루트 컴포넌트
├── routes.tsx                               # React Router 설정
├── app/
│   ├── pages/                               # 페이지 컴포넌트
│   │   ├── Dashboard.tsx                    # 대시보드
│   │   ├── ClientManagement.tsx             # 거래처 관리
│   │   ├── ProductManagement.tsx            # 제품 관리
│   │   ├── InventoryManagement.tsx          # 재고 관리
│   │   ├── ReceivingManagement.tsx          # 입고 관리
│   │   ├── ShippingManagement.tsx           # 출고 관리
│   │   ├── ServiceManagement.tsx            # A/S 관리
│   │   ├── DocumentManagement.tsx           # 문서 관리
│   │   ├── SettlementManagement.tsx         # 정산 관리
│   │   ├── TaxInvoiceManagement.tsx         # 세금계산서 관리
│   │   ├── UserManagement.tsx               # 사용자 관리
│   │   ├── AlertCenter.tsx                  # 알림 센터
│   │   ├── LogHistory.tsx                   # 로그 이력
│   │   └── Login.tsx                        # 로그인
│   ├── components/
│   │   ├── ui/                              # shadcn/ui 기본 컴포넌트
│   │   ├── ProtectedRoute.tsx               # 인증 라우트 가드
│   │   ├── Header.tsx                       # 헤더 네비게이션
│   │   ├── Sidebar.tsx                      # 사이드바 메뉴
│   │   ├── ClientForm.tsx                   # 거래처 폼
│   │   ├── ProductForm.tsx                  # 제품 폼
│   │   ├── [기타]Form.tsx                   # 각 도메인별 폼
│   │   ├── ClientDetailPanel.tsx            # 거래처 상세 패널
│   │   └── [기타]DetailPanel.tsx            # 각 도메인별 상세 패널
│   ├── contexts/
│   │   └── ThemeContext.tsx                 # 테마 (다크/라이트 모드)
│   ├── hooks/
│   │   ├── use-clients.ts
│   │   ├── use-products.ts
│   │   ├── use-inventory.ts
│   │   ├── use-receiving.ts
│   │   ├── use-shipping.ts
│   │   ├── use-service.ts
│   │   ├── use-document.ts
│   │   ├── use-settlement.ts
│   │   ├── use-tax-invoice.ts
│   │   ├── use-alert.ts
│   │   ├── use-log.ts
│   │   ├── use-dashboard.ts
│   │   └── use-users.ts
│   └── lib/
│       ├── api.ts                           # Axios 인스턴스, API 유틸
│       ├── auth.ts                          # Supabase Auth 유틸
│       └── utils.ts                         # 포맷팅, 유틸 함수
├── styles/
│   ├── globals.css                          # 글로벌 스타일
│   └── tailwind.css                         # Tailwind 커스텀
└── imports/                                 # Figma Make 임포트 (자동)
```

## 주요 기능

### 인증 (Authentication)
- Supabase Auth 연동 (이메일/비밀번호, 소셜 로그인)
- `ProtectedRoute` 컴포넌트로 보호된 페이지
- JWT 토큰 자동 관리

### 거래처 관리
- 거래처 목록, 추가, 수정, 삭제
- 검색, 필터링, 페이지네이션
- 거래처별 거래 이력 조회

### 제품 관리
- 제품 등록, 수정, 삭제
- 카테고리별 분류
- 가격, 재고 정보 통합 조회

### 재고 관리
- 제품별 실시간 재고 현황
- 입고/출고에 따른 자동 업데이트
- 재고 부족 알림

### 입고/출고 관리
- 입고/출고 등록 및 상태 추적
- 상태 변경 (REQUESTED → APPROVED → SHIPPED → DELIVERED)
- 거래처별 배송 추적

### A/S 관리
- A/S 접수, 진행 상태 추적
- 담당자 배정
- 완료 처리

### 문서 관리
- Supabase Storage 기반 파일 업로드
- 파일 메타데이터 저장
- 다운로드 링크 제공

### 정산 관리
- 정산 기록 추가, 수정
- 거래처별 정산 현황

### 세금계산서 관리
- 세금계산서 생성 (invoiceNumber 자동생성)
- 발행 상태 관리 (DRAFT → ISSUED)
- 이력 조회

### 대시보드
- 주요 KPI (매출, 거래처 수, 재고 현황)
- 매출 추이 차트 (Recharts)
- 최근 활동 요약

### 알림 센터
- 시스템 알림 조회
- 읽음/읽지 않음 상태 관리
- 알림 삭제

## 로컬 실행

### 설치
```bash
npm install
```

### 개발 모드
```bash
npm run dev
```
- 애플리케이션: http://localhost:5173
- HMR(Hot Module Replacement) 자동 활성화

### 빌드
```bash
npm run build
```

### 미리보기
```bash
npm run preview
```

### 타입 체크
```bash
npm run type-check
```

### 린트
```bash
npm run lint
```

## API 통신

### Axios 인스턴스
`lib/api.ts`에서 설정:

```typescript
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터: 자동으로 Bearer 토큰 추가
apiClient.interceptors.request.use((config) => {
  const token = await supabase.auth.getSession()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### 예제: 거래처 조회
```typescript
const { data, isLoading, error } = useClients()

// 또는 TanStack Query 직접 사용
const query = useQuery({
  queryKey: ['clients'],
  queryFn: async () => {
    const res = await apiClient.get('/clients')
    return res.data.data
  },
})
```

## Supabase 통합

### 인증
```typescript
import { supabase } from '@/lib/auth'

const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
})
```

### 스토리지 (Document 파일 업로드)
```typescript
const { data, error } = await supabase.storage
  .from('documents')
  .upload(`${organizationId}/${fileName}`, file)
```

## 테마 지원

Context API 기반 다크/라이트 모드:

```typescript
import { ThemeContext } from '@/app/contexts/ThemeContext'

const { theme, toggleTheme } = useContext(ThemeContext)
```

## 스타일 지침

- **Tailwind CSS**: 모든 스타일은 Tailwind 유틸리티 클래스 사용
- **shadcn/ui**: UI 컴포넌트는 shadcn/ui 활용
- **MUI 제외**: Material-UI 사용 금지 (shadcn/ui로 대체)

## 배포

Vercel에 배포:
1. GitHub 저장소 연결
2. Vercel 프로젝트 생성
3. 환경 변수 설정 (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`)
4. 자동 빌드 & 배포

## 성능 최적화

- Vite 고속 빌드
- TanStack Query 캐싱
- 동적 임포트 (코드 스플리팅)
- 이미지 최적화 (Supabase Storage)

## 문제 해결

### API 응답 에러
- 네트워크 탭에서 응답 확인
- `VITE_API_URL` 환경 변수 확인
- 백엔드 서버 실행 여부 확인

### 인증 실패
- Supabase 프로젝트 설정 확인
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 확인
- 브라우저 캐시 삭제 후 재시도

### Tailwind 스타일 적용 안 됨
- `tailwind.config.js`의 `content` 경로 확인
- Vite 서버 재시작
