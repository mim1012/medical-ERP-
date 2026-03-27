# Medical ERP - 구현 계획

## Phase 1: 프로젝트 기반 구축
- [ ] Turborepo 모노레포 구성 (apps/web, apps/api, packages/shared)
- [ ] 기존 프론트엔드 코드를 apps/web으로 이전
- [ ] NestJS 백엔드 프로젝트 초기화 (apps/api)
- [ ] TypeScript strict mode 설정 (FE + BE)
- [ ] ESLint + Prettier 설정 (공통)
- [ ] Supabase 프로젝트 생성 및 연결
- [ ] Prisma ORM 설정 + Supabase DB 연동
- [ ] RLS (Row-Level Security) 기본 정책 설정
- [ ] 멀티테넌트 DB 스키마 설계 (tenant_id 기반)
- [ ] 환경변수 설정 (.env: Supabase URL, keys)
- [ ] 공통 모듈: 로깅, 에러 핸들링, 페이지네이션 (packages/shared)

## Phase 2: 인증 & 멀티테넌트
- [ ] Supabase Auth 설정 (이메일/비밀번호 + 소셜 로그인)
- [ ] 로그인/회원가입 UI 구현
- [ ] 조직(Organization) / 테넌트 관리
- [ ] RBAC (역할 기반 접근 제어: Admin, Manager, Staff)
- [ ] RLS 정책에 auth.uid() + tenant_id 연동
- [ ] 사용자 CRUD API (테넌트 격리)
- [ ] 보호 라우트 + Supabase Auth Guard (NestJS)

## Phase 3: 핵심 도메인 - 거래처 & 제품
- [ ] 거래처 관리 API + DB
- [ ] 거래처 관리 페이지 백엔드 연동
- [ ] 제품 관리 API + DB
- [ ] 제품 관리 페이지 백엔드 연동
- [ ] 검색/필터/페이지네이션 공통 로직

## Phase 4: 재고 & 입출고
- [ ] 재고 관리 API + DB
- [ ] 입고 관리 (발주 -> 입고 -> 검수 워크플로우)
- [ ] 출고/배송 관리 (요청 -> 승인 -> 배송 -> 완료)
- [ ] 재고 자동 증감 로직
- [ ] 재고 부족 알림 트리거

## Phase 5: 정산 & 세금계산서
- [ ] 정산 관리 API + DB
- [ ] 매출/매입 집계 로직
- [ ] 미수금/미지급금 관리
- [ ] 세금계산서 발행 UI/API
- [ ] 홈택스 전자세금계산서 연동 (선택)

## Phase 6: A/S & 부가 기능
- [ ] A/S 서비스 케이스 관리
- [ ] 문서 관리 (파일 업로드/다운로드)
- [ ] 알림 센터 (WebSocket / Polling)
- [ ] 로그 이력 (감사 로그)

## Phase 7: 대시보드 & 리포팅
- [ ] KPI 집계 API
- [ ] 대시보드 차트 실데이터 연동
- [ ] 기간별 리포트 생성
- [ ] 엑셀/PDF 내보내기

## Phase 8: SaaS 기능
- [ ] 구독/결제 시스템 (토스페이먼츠 / Stripe)
- [ ] 요금제 관리 (Free / Pro / Enterprise)
- [ ] 사용량 추적 및 제한
- [ ] 테넌트별 설정/커스터마이징
- [ ] 온보딩 플로우

## Phase 9: 품질 & 배포
- [ ] 단위 테스트 (Vitest + Jest)
- [ ] E2E 테스트 (Playwright)
- [ ] 성능 최적화 (코드 스플리팅, 레이지 로딩)
- [ ] Vercel 배포 설정 (프론트엔드)
- [ ] Supabase Cloud 운영 설정
- [ ] GitHub Actions CI/CD
- [ ] Sentry 모니터링

## 의존성
- Phase 2 -> Phase 3 (인증/멀티테넌트 필요)
- Phase 3 -> Phase 4 (거래처/제품 데이터 필요)
- Phase 4 -> Phase 5 (입출고 데이터 기반 정산)
- Phase 3~6 -> Phase 7 (실데이터 기반 대시보드)
- Phase 2 -> Phase 8 (테넌트 기반 SaaS)
- Phase 1~8 -> Phase 9 (전체 완성 후 품질/배포)
