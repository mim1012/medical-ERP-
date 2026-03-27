# Medical ERP - 기능 명세

## Feature 1: 대시보드 (Dashboard)
### 요구사항
1. KPI 카드 (매출, 재고, 미수금, A/S 현황)
2. 매출 추이 차트 (월별/분기별)
3. 재고 부족 알림 위젯
4. 최근 활동 로그
### 데이터 모델
- KPI 집계 데이터 (실시간 or 캐시)
### 비즈니스 로직
- 기간별 매출 집계, 재고 임계값 기반 알림

## Feature 2: 거래처 관리 (Client Management)
### 요구사항
1. 거래처 CRUD (병원/의원/약국/기타)
2. 거래처 유형별 분류 및 검색
3. 담당자 정보 관리
4. 거래 이력 조회
### API 명세
- `GET /api/clients` - 목록 조회 (페이지네이션, 필터)
- `POST /api/clients` - 생성
- `GET /api/clients/:id` - 상세 조회
- `PUT /api/clients/:id` - 수정
- `DELETE /api/clients/:id` - 삭제
### 데이터 모델
- Client: id, name, type, businessNumber, address, phone, email, manager, notes, createdAt, updatedAt

## Feature 3: 제품 관리 (Product Management)
### 요구사항
1. 제품 CRUD (의료기기 품목)
2. 카테고리/브랜드별 분류
3. 인허가 정보 관리 (식약처 허가번호 등)
4. 제품 이미지/문서 첨부
### API 명세
- `GET /api/products` - 목록
- `POST /api/products` - 생성
- `GET /api/products/:id` - 상세
- `PUT /api/products/:id` - 수정
### 데이터 모델
- Product: id, name, category, brand, model, licenseNumber, unitPrice, description, images, createdAt

## Feature 4: 재고 관리 (Inventory Management)
### 요구사항
1. 실시간 재고 현황 조회
2. 재고 부족 알림 (임계값 설정)
3. 입출고 이력 추적
4. 로트/시리얼 번호 관리
### 비즈니스 로직
- 입고 시 재고 증가, 출고 시 재고 감소
- 안전재고 이하 시 알림 자동 생성

## Feature 5: 출고/배송 관리 (Shipping Management)
### 요구사항
1. 출고 요청 생성/승인 워크플로우
2. 배송 상태 추적 (스테퍼)
3. 출고 명세서 생성
4. 배송 완료 확인
### 비즈니스 로직
- 출고 시 재고 차감, 정산 데이터 연동

## Feature 6: 입고 관리 (Receiving Management)
### 요구사항
1. 발주(PO) 기반 입고 처리
2. 검수 프로세스
3. 입고 명세서 생성
### 비즈니스 로직
- 입고 확정 시 재고 증가, 매입 데이터 연동

## Feature 7: A/S 관리 (Service Management)
### 요구사항
1. 서비스 케이스 생성/관리
2. 설치/수리/유지보수 유형 분류
3. 서비스 이력 추적
4. 담당 엔지니어 배정

## Feature 8: 정산 관리 (Settlement Management)
### 요구사항
1. 매출/매입 정산 조회
2. 미수금/미지급금 관리
3. 정산 기간별 리포트

## Feature 9: 세금계산서 관리 (Tax Invoice Management)
### 요구사항
1. 세금계산서 발행/조회
2. 전자세금계산서 연동 (홈택스 API)
3. 매출/매입 세금계산서 분류

## Feature 10: 문서 관리 (Document Management)
### 요구사항
1. 계약서, 견적서, 인허가서류 등 문서 저장/조회
2. 문서 카테고리 분류
3. 파일 업로드/다운로드

## Feature 11: 알림 센터 (Alert Center)
### 요구사항
1. 시스템 알림 통합 조회
2. 재고 부족, 정산 마감, A/S 알림 등
3. 읽음/안읽음 상태 관리

## Feature 12: 사용자 관리 (User Management)
### 요구사항
1. 사용자 CRUD
2. 역할 기반 접근 제어 (RBAC)
3. 로그인/로그아웃, 비밀번호 관리

## Feature 13: 로그 이력 (Log History)
### 요구사항
1. 시스템 감사 로그
2. 사용자별 활동 이력
3. 기간/유형별 필터링
