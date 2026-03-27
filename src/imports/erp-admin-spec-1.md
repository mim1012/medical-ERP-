의료기기 및 의료소모품 기업용 한국형 ERP 관리자 시스템을 만들어줘.
이번 결과물은 단순 시안이 아니라 **개발자가 추가 질문 없이 바로 착수 가능한 수준**이어야 한다.
즉, 화면 디자인만 하지 말고 **정보구조, 데이터 관계, 필드 규칙, 상태 전이, 권한 구조, 반응형 규칙, 컴포넌트 시스템, 자동 로직**까지 화면에 반영해줘.

최종 목표:

* 고급스럽고 신뢰감 있는 한국형 의료 ERP 관리자 웹
* 프리미엄 B2B 엔터프라이즈 느낌
* 개발자가 라우트, 컴포넌트, API 연결 포인트, 상태 설계를 바로 이해할 수 있는 구조
* 화면만 예쁜 게 아니라 실제 개발 명세로 사용 가능한 Figma 파일

절대 금지:

* 쇼핑몰 느낌
* 소비자앱 느낌
* 장식 위주 UI
* 과한 라운드
* 과한 그림자
* 과한 그라데이션
* 의미 없는 카드 남발
* 데이터 밀도가 낮은 화면

==================================================

1. 전체 디자인 원칙
   ==================================================

이 시스템은 내부 실무자가 사용하는 ERP다.
사용자는 대표, 운영관리자, 영업, 물류, 서비스 엔지니어, 회계 담당자다.

디자인 키워드:

* 프리미엄
* 신뢰감
* 실무형
* 무게감
* 한국형 B2B 엔터프라이즈
* 촘촘한 데이터 표현
* 테이블 중심
* 정돈된 계층
* 개발 친화적 구조

레이아웃 원칙:

* Desktop 1440 기준
* Left fixed sidebar
* Top fixed header
* Main content는 12 column grid
* Margin 24 / Gutter 16
* Tablet은 stacked layout
* Mobile은 4 columns / margin 16 / gutter 12
* Mobile 상세는 bottom sheet
* Desktop은 테이블 중심
* Tablet은 카드+테이블 혼합
* Mobile은 2줄 리스트 행 중심

==================================================
2. 컬러 / 타이포 / 스타일
=================

컬러:

* Primary Navy #163A5F
* Dark Navy #0F2942
* Slate Blue #35556E
* Accent Blue #5B8DB8
* Background #F4F7FA
* White #FFFFFF
* Border #D7DEE6
* Text Primary #18212B
* Text Secondary #5B6773
* Success #2E7D5B
* Warning #C58A2B
* Danger #B94A48
* Info #3C6EA8

스타일 원칙:

* 사이드바는 Dark Navy
* 본문은 밝고 깨끗한 배경
* 테이블 헤더는 아주 연한 톤
* 상태 배지는 색상 체계 통일
* 저채도 중심
* 포인트 컬러 최소 사용

타이포:

* Pretendard 스타일
* Page title 28~32 bold
* Section title 18~20 semibold
* Body 14~16
* Caption 12
* KPI 숫자는 크지만 카드 높이는 얇고 컴팩트하게
* 숫자는 정렬 기준이 명확해야 함

==================================================
3. 시스템 핵심 정책
============

반드시 UI와 흐름 안에 아래 정책을 드러내줘.

* Product-first 구조를 기본값으로 설계
* Client-first 토글도 제공
* 신용한도 초과 시 차단이 아니라 경고만 표시하고 진행은 허용
* 출고 확정 시 재고 차감
* 출고 확정 시 세금계산서 상태가 자동으로 “발행대기” 생성
* 세금계산서 발행 완료 후 정산 화면과 연결
* 소모품은 lot / expiry 중심
* 장비는 serial 중심
* 소모품은 FEFO 추천 로직을 UI에 표시
* 상세보기는 Desktop에서 Inspector Drawer 우선
* Mobile 상세는 Bottom Sheet 사용

==================================================
4. 핵심 엔티티 정의
============

반드시 아래 엔티티를 기준으로 화면을 설계해줘.
각 엔티티는 단순 이름만 쓰지 말고 화면에서 관계가 보이게 해줘.

1. 거래처 Client
   필드 예시:

* client_id
* client_name
* client_type
* business_number
* manager_name
* phone
* email
* region
* address
* credit_limit
* credit_used
* receivable_amount
* status
* last_order_date
* created_at

2. 품목 Product
   필드 예시:

* product_id
* product_code
* product_name
* category
* manufacturer
* permit_number
* unit
* cost_price
* sale_price
* lot_tracking_enabled
* serial_tracking_enabled
* expiry_tracking_enabled
* storage_condition
* active_status

3. 재고유닛 Inventory Unit
   필드 예시:

* inventory_unit_id
* product_id
* warehouse_id
* lot_number
* serial_number
* qty_on_hand
* qty_reserved
* qty_available
* expiry_date
* consign_client_id
* inventory_status

4. 출고 Shipment
   필드 예시:

* shipment_id
* shipment_type
* client_id
* shipment_date
* shipment_status
* subtotal
* tax_amount
* total_amount
* invoice_status
* settlement_status
* confirmed_by
* confirmed_at

5. 출고 아이템 Shipment Item
   필드 예시:

* shipment_item_id
* shipment_id
* product_id
* lot_number
* serial_number
* qty
* unit_price
* supply_amount
* tax_amount
* line_total

6. 세금계산서 Tax Invoice
   필드 예시:

* tax_invoice_id
* shipment_id
* client_id
* issue_status
* issue_date
* subtotal
* tax_amount
* total_amount
* revised_flag

7. 정산 Settlement
   필드 예시:

* settlement_id
* client_id
* billing_amount
* received_amount
* receivable_amount
* due_date
* closing_status
* linked_invoice_count

8. 설치장비 Installed Device
   필드 예시:

* installed_device_id
* client_id
* product_id
* serial_number
* install_date
* warranty_end_date
* last_inspection_date
* device_status

9. A/S Ticket
   필드 예시:

* as_ticket_id
* installed_device_id
* client_id
* priority
* status
* assignee
* opened_at
* closed_at

10. Document
    필드 예시:

* document_id
* document_type
* related_client_id
* related_product_id
* related_device_id
* version
* expiry_date
* upload_status

11. User
    필드 예시:

* user_id
* name
* role
* team
* status
* permission_policy_id

==================================================
5. 엔티티 관계를 화면에서 보여줘
===================

반드시 아래 관계가 UI에서 보이게 설계해줘.

* 거래처 ↔ 출고
* 거래처 ↔ 설치장비
* 거래처 ↔ 미수금 / 정산
* 품목 ↔ lot / serial / expiry
* 출고 ↔ 출고아이템
* 출고 ↔ 세금계산서
* 출고 ↔ 정산
* 출고 ↔ 재고 차감
* 설치장비 ↔ A/S 이력
* 문서 ↔ 거래처 / 품목 / 장비
* 사용자 ↔ 권한정책 ↔ 메뉴 접근

이 관계는 단순 설명문이 아니라

* drawer 요약
* linked section
* related table
* status badge
* detail card
  등으로 실제 화면에 드러나게 해줘.

==================================================
6. 공통 컴포넌트 시스템
==============

반드시 컴포넌트 시스템부터 만들어줘.
반복되는 UI는 모두 component와 variant로 설계해줘.

Navigation / Layout

* Sidebar Navigation
* Top Header
* Breadcrumb
* Page Title Bar
* Section Header

Search / Filter

* Search Bar
* Filter Bar
* Filter Chips
* Date Range Filter
* Bulk Action Bar
* Sort Dropdown

Display

* KPI Strip
* Alert Card
* Status Badge
* Summary Card
* Data Table
* Related Table
* Info Panel
* Timeline Block
* Empty State
* No Result State
* Loading Skeleton
* Error Banner

Interaction

* Primary Button
* Secondary Button
* Ghost Button
* Danger Button
* Toggle Tabs
* Standard Tabs
* Modal Form
* Inspector Drawer
* Bottom Sheet
* Confirm Dialog
* Toast
* Pagination
* Stepper

Form

* Input
* Select
* Searchable Select
* Number Field
* Currency Field
* Date Picker
* Textarea
* Checkbox
* Radio
* Toggle
* Helper Text
* Error Text
* Required Marker
* Section Divider
* Repeater Row

각 컴포넌트는 최소한 아래 상태 variant를 가져야 함:

* default
* hover
* focus
* disabled
* error
* success
* selected
* loading

==================================================
7. 모든 주요 화면에 반드시 들어갈 상태 설계
==========================

각 화면마다 아래 상태 프레임을 반드시 별도로 만들어줘.

* Default
* Loading
* Empty
* No Search Result
* Error
* Saving
* Saved Success
* Permission Denied
* Draft
* Pending Approval
* Confirmed
* Cancelled
* Rejected
* Selected Rows
* Bulk Action Open
* Drawer Open
* Modal Open

==================================================
8. 권한 정책
========

아래 역할을 기준으로 사용자/권한 관리 화면을 설계해줘.

Roles:

* 관리자
* 영업
* 물류
* 서비스
* 회계

Permissions:

* 조회
* 등록
* 수정
* 삭제
* 승인
* 다운로드
* 발행
* 정산마감

권한은 체크박스 매트릭스 형태로 보여줘.
각 메뉴별 접근 권한과 세부 액션 권한이 구분되어야 한다.

==================================================
9. 자동 로직 / 업무 규칙을 화면에 명확히 반영
============================

아래 규칙은 UI에 반드시 드러나야 한다.

1. 출고 확정 로직

* 출고는 Draft → Confirmed 상태 전이
* Confirmed 시 재고 차감
* Confirmed 시 세금계산서 “발행대기” 자동 생성
* Confirmed 시 정산 연결 준비 상태 표시

2. 재고 계산 로직

* qty_available = qty_on_hand - qty_reserved
* lot 중심 품목은 lot / expiry 필수
* serial 중심 품목은 serial 필수
* 소모품은 FEFO 추천 표시
* 만료 임박은 warning badge

3. 신용한도 로직

* credit_used > credit_limit 이어도 차단하지 않음
* 단, warning banner와 badge 표시
* 승인자 확인 문구 표시

4. 입고 로직

* 요청 → 승인 → 부분입고 → 완료
* 입고 완료 시 재고 증가
* lot / serial / expiry는 품목 정책에 따라 필수/선택 자동 분기

5. 문서 만료 로직

* 만료 예정 배지
* 만료된 문서는 danger 상태
* 관련 품목/장비/거래처 상세에서도 동일하게 보이게

6. A/S 로직

* serial 기반 장비 추적
* 보증만료 여부 표시
* 점검이력 / 티켓이력 연결

==================================================
10. 메뉴 구조
=========

사이드바 메뉴는 아래 순서로 통일해줘.

* 대시보드
* 거래처 관리
* 품목 관리
* 재고 관리
* 입고/발주 관리
* 출고/판매 관리
* 설치/A/S 관리
* 문서 관리
* 정산 관리
* 세금계산서 관리
* 알림 센터
* 사용자/권한 관리
* 로그/이력 관리

==================================================
11. 페이지별 상세 설계
==============

1. 대시보드
   목표:
   운영 현황을 한눈에 파악하는 실무형 홈 화면

포함 요소:

* Compact KPI Strip

  * 이번 달 매출
  * 미수금
  * 오늘 출고
  * A/S 접수
  * 유효기간 임박
  * 보증만료 예정
* Alert Table 또는 Alert Card

  * 재고 부족
  * 문서 만료
  * 세금계산서 미발행
  * 시리얼 누락
  * 회수 이슈
* Charts

  * 월별 매출 추이
  * 거래처별 매출
  * 품목별 매출 비중
* Related Tables

  * 최근 출고
  * 최근 A/S
  * 최근 문서
  * 최근 정산

반드시 상태 프레임 포함

2. 거래처 관리

* Summary Strip
* Search / Filter / Table Action Bar
* Client Table
  컬럼:
  거래처명 / 유형 / 담당자 / 지역 / 최근거래일 / 미수금 / 신용사용률 / 상태 / 액션
* Drawer:
  기본정보 / 최근출고 / 설치장비 / 미수금 / 관련문서 / 담당자

3. 품목 관리

* Product Table
* Filters:
  카테고리 / 제조사 / 허가상태 / lot / serial / expiry
* Modal Form:
  기본정보 / 추적정책 / 가격 / 보관조건 / 상태
* lot / serial / expiry 토글에 따라 helper text와 required rule 표시

4. 재고 관리
   가장 중요

* 상단에 Product-first / Client-first toggle
* KPI Strip
* 2 Panel Layout
  왼쪽:
  Inventory Unit Table
  컬럼:
  품목 / lot / serial / on_hand / reserved / available / warehouse / expiry / status
  오른쪽:
  Related Client / Recent Shipment / Recommended Action / FEFO / Consign Info / Alerts
* lot 품목과 serial 품목의 row 표시 방식 다르게 설계
* FEFO badge와 expiry warning badge 필수

5. 입고/발주 관리

* 탭: 발주 / 입고
* Status flow:
  요청 / 승인 / 부분입고 / 완료
* List + Detail Drawer + Register Form
* Repeater row form
  필드:
  공급사 / 창고 / 예정일 / 실제입고일 / 품목 / 수량 / lot / expiry / serial / 비고
* 품목별 정책에 따라 필수 필드가 달라지는 UI를 보여줘

6. 출고/판매 관리
   반드시 Stepper 기반
   Step 1 거래유형 선택
   Step 2 거래처 선택
   Step 3 품목 선택
   Step 4 lot / serial 선택
   Step 5 확인 및 확정

화면 요구:

* 품목 선택 후 lot 후보 노출
* lot 선택 후 serial 필요 시 추가 노출
* available 수량 표시
* 신용한도 초과 경고
* 재고 부족 경고
* 만료 임박 경고
* 공급가 / 세액 / 합계 표시
* Confirmed 후 “세금계산서 발행대기 생성” linked result panel 표시
* Draft / Confirmed / Cancelled 상태 예시 반드시 포함

7. 설치/A/S 관리
   탭:
   설치장비 / A/S 티켓
   설치장비:
   장비명 / serial / 거래처 / 설치일 / 보증만료 / 최근점검 / 상태
   A/S 티켓:
   접수번호 / 장비 / serial / 거래처 / 우선순위 / 상태 / 담당자 / 접수일
   Drawer:
   장비정보 / 점검이력 / A/S 이력 / 관련문서

8. 문서 관리
   분류:
   인증서 / 계약서 / 보증서 / 사용설명서 / 허가문서
   컬럼:
   문서명 / 유형 / 버전 / 관련거래처 / 관련품목 / 관련장비 / 업로드일 / 만료일 / 상태 / 다운로드

* 만료 예정 / 만료됨 상태 필수
* 관련 엔티티 detail에서도 연결 보이게

9. 정산 관리

* KPI Strip
* Settlement Table
  컬럼:
  거래처 / 청구금액 / 수금금액 / 미수금 / 결제예정일 / 신용사용률 / 마감상태 / 액션
* Drawer:
  linked shipment / linked invoice / received history / receivable summary
* 마감 상태 variant 포함

10. 세금계산서 관리

* 출고 기반 생성 흐름이 보여야 함
* Tax Invoice Table
  컬럼:
  세금계산서ID / shipment ID / 거래처 / 공급가 / 세액 / 합계 / 발행상태 / 발행일 / 액션
* 상태:
  발행대기 / 발행완료 / 수정발행 / 취소
* Drawer:
  shipment 연결 / 품목 / lot / serial / 수정이력

11. 알림 센터

* Table 중심
  컬럼:
  알림유형 / 우선순위 / 상태 / 생성일 / 관련모듈 / 담당자 / 액션
  유형:
  저재고 / 문서만료 / 보증만료 / 세금계산서 미발행 / 시리얼누락 / 회수이슈 / 유효기간임박

12. 사용자/권한 관리

* 탭: 사용자 / 권한정책
* 사용자 리스트
* 권한정책 체크박스 매트릭스
* role별 preset 상태 포함

13. 로그/이력 관리

* Table
  컬럼:
  일시 / 사용자 / 메뉴 / 작업유형 / 대상ID / 변경전 / 변경후 / 중요도 / 상세
* before / after 비교가 쉽게 보이게
* Drawer:
  변경 상세 / 관련 엔티티 / 영향 범위

==================================================
12. 반응형 규칙
==========

Desktop:

* 테이블 중심
* Drawer 사용
* 2 panel 적극 사용

Tablet:

* 패널은 상하 stacked
* 필터는 접힘 가능
* Drawer 폭 축소

Mobile:

* Sidebar는 drawer
* KPI는 horizontal scroll
* 테이블은 2줄 리스트 행
* 상세는 bottom sheet
* 긴 form은 step form
* 핵심 정보 우선순위 재배열
* 컬럼 강제 축소보다 정보 재구성 우선

==================================================
13. 피그마 파일 페이지 구조
=================

반드시 아래 페이지 구조로 정리해줘.

Page 1. Design System

* Colors
* Typography
* Spacing
* Radius
* Shadows
* Icon Rules
* Status Tokens

Page 2. Components

* Buttons
* Inputs
* Selects
* Search
* Filters
* Chips
* Badges
* KPI
* Alerts
* Tables
* Drawer
* Bottom Sheet
* Modal
* Stepper
* Toast
* Empty / Loading / Error

Page 3. Layouts

* Desktop Base
* Tablet Base
* Mobile Base
* Sidebar
* Header
* Content Area

Page 4. Desktop Screens

* Dashboard
* Client
* Product
* Inventory
* Purchase / Receiving
* Shipment / Sales
* Installation / AS
* Documents
* Settlement
* Tax Invoice
* Alerts
* Users / Permissions
* Logs

Page 5. Mobile Key Screens

* Dashboard Mobile
* Inventory Mobile
* Shipment Mobile Stepper
* Alerts Mobile
* Bottom Sheet Examples

Page 6. State Examples

* Empty
* Loading
* No Result
* Error
* Saving
* Saved
* Permission Denied
* Selected Rows
* Bulk Action
* Draft / Confirmed / Cancelled / Rejected
* Confirm Dialog

Page 7. Developer Handoff Frames

* Entity Relationship Summary
* Table Column Rules
* Form Validation Rules
* State Transition Map
* Permission Matrix Summary
* Responsive Rules Summary
* API Mapping Placeholder Blocks
* Event Trigger Notes

==================================================
14. 개발자 핸드오프용 요약 프레임도 포함
========================

반드시 마지막 페이지에 아래 요약 프레임을 포함해줘.

1. Entity Map

* 각 엔티티와 관계 요약

2. Table Column Spec

* 화면별 테이블 컬럼 정의

3. Form Rule Spec

* 어떤 필드가 required인지
* 어떤 필드가 조건부 노출인지
* 어떤 값이 자동 생성인지

4. State Transition Spec
   예시:

* Shipment: Draft → Confirmed → Cancelled
* Purchase: Requested → Approved → Partial Received → Completed
* Tax Invoice: Pending → Issued → Revised → Cancelled

5. Trigger Notes

* 출고 확정 시 재고 차감
* 출고 확정 시 세금계산서 발행대기 생성
* 입고 완료 시 재고 증가
* 문서 만료 시 alert 생성
* 신용한도 초과 시 warning 표시

6. Permission Summary

* 역할별 접근 메뉴 및 액션 정리

7. Responsive Summary

* Desktop / Tablet / Mobile 전환 기준 요약

==================================================
15. 네이밍 규칙
==========

프레임 / 컴포넌트 이름은 아래 규칙으로 통일해줘.

* Layout/Desktop/Base
* Layout/Tablet/Base
* Layout/Mobile/Base
* Component/Button/Primary
* Component/Badge/Status
* Component/Table/Inventory
* Component/Drawer/ClientDetail
* Component/Modal/ProductForm
* Form/Shipment/Step01
* Form/Shipment/Step02
* Form/Shipment/Step03
* Form/Shipment/Step04
* Form/Shipment/Step05
* State/Table/Empty
* State/Table/Loading
* State/Form/Error
* Desktop/Inventory/ProductFirst
* Desktop/Inventory/ClientFirst
* Mobile/Inventory/List
* Mobile/Detail/BottomSheet

==================================================
16. 최종 요구사항
===========

반드시 결과물이 아래 조건을 만족해야 한다.

* 개발자가 라우트 구조를 바로 이해할 수 있어야 함
* 반복 컴포넌트를 바로 분리할 수 있어야 함
* 테이블, 드로어, 모달, 폼 규칙이 일관되어야 함
* 각 화면 상태별 UI가 준비되어 있어야 함
* 업무 규칙과 자동 로직이 UI에서 읽혀야 함
* Product-first / Client-first 차이가 분명해야 함
* 출고 → 세금계산서 → 정산 연결이 보여야 함
* lot / serial / expiry 정책이 구현 가능한 수준으로 드러나야 함
* 의료기기와 의료소모품이 동시에 관리되는 ERP 구조가 자연스럽게 보여야 함
* 최종 결과물은 디자인 시안이 아니라 실제 개발 전달용 수준이어야 함
