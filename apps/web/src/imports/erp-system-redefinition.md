현재 설계된 의료기기 및 의료소모품 ERP 관리자 시스템을 유지하되, 이번에는 반드시 “개발자가 추가 질문 없이 바로 착수 가능한 수준”으로 재구성해줘.

중요:

* 이 시스템은 쇼핑몰이 아니라 ERP다.
* 쿠폰, 타임딜, 리뷰, 소비자 주문, 프로모션 카드, 커머스 배너 같은 요소는 절대 넣지 마라.
* 목표는 예쁜 화면이 아니라 실제 업무형 ERP 설계다.
* 작업자 가독성, 업무 속도, 개발 전달성, 상태 명확성, 데이터 관계 가독성을 최우선으로 한다.

반드시 아래 기준을 지켜줘.

1. 전체 톤앤매너

* 프리미엄
* 신뢰감
* 무게감
* 한국형 B2B 엔터프라이즈
* 남성적
* 데이터 밀도 높음
* 테이블 중심
* 장식 최소화
* 저채도 색상
* 과한 라운드 금지
* 과한 그라데이션 금지
* 쇼핑몰 느낌 금지
* 소비자앱 느낌 금지

2. 핵심 구조

* Product-first 구조를 기본값으로 설계
* Client-first 토글도 제공
* Desktop 상세는 Inspector Drawer 사용
* Mobile 상세는 Bottom Sheet 사용
* 긴 폼은 모바일에서 Step Form 사용

3. 출고/판매 관리 페이지는 전면 재설계
   반드시 5단계 Stepper 구조로 설계해줘.

Step 1 거래유형 선택
Step 2 거래처 선택
Step 3 품목 선택
Step 4 lot / serial 선택
Step 5 확인 및 확정

반드시 화면에 보여야 하는 것:

* 품목 선택 후 available 재고 표시
* lot 후보 목록 표시
* serial 필요 품목은 serial 선택 UI 노출
* 재고 부족 경고
* 신용한도 초과 경고
* 만료임박 경고
* 공급가 / 세액 / 합계
* 출고 확정 후 “세금계산서 발행대기 생성” 연결 표시
* 상태 예시: Draft / Confirmed / Cancelled

4. 재고 관리 페이지 보완
   반드시 Product-first / Client-first 전환 토글을 상단에 배치해줘.
   재고 화면은 2패널 구조로 설계해줘.

왼쪽:

* Inventory Unit Table
* 품목
* lot
* serial
* on_hand
* reserved
* available
* warehouse
* expiry
* status

오른쪽:

* 관련 거래처
* 최근 출고 이력
* FEFO 추천
* 위탁재고 정보
* 권장 액션
* 만료 임박 경고
* 부족 재고 경고

반드시 lot 중심 품목과 serial 중심 품목의 표시 방식을 다르게 보여줘.

5. 세금계산서 관리 보완
   출고와의 관계를 더 명확하게 보여줘.
   반드시 아래 흐름이 화면에서 읽혀야 한다.

* 출고 확정
* 세금계산서 발행대기 자동 생성
* 발행완료
* 수정발행 또는 취소
* 정산 연결

세금계산서 상세에는 아래를 보여줘.

* shipment ID
* 거래처
* 품목
* lot / serial
* 공급가
* 세액
* 합계
* 수정 이력
* 발행 상태

6. 모든 폼에 검증 규칙 표시
   반드시 form rule spec을 포함해줘.

각 폼에서 아래를 명확히 보여줘.

* required 필드
* 조건부 노출 필드
* 자동 생성 필드
* 읽기 전용 필드
* 품목 정책에 따라 필수 여부가 바뀌는 필드
* 오류 상태
* helper text
* error text

예시:

* lot 관리 품목이면 lot 필수
* serial 관리 품목이면 serial 필수
* expiry 관리 품목이면 expiry 필수

7. 상태 설계 추가
   모든 주요 화면에 아래 상태 프레임을 추가해줘.

* Default
* Loading
* Empty
* No Result
* Error
* Saving
* Saved
* Permission Denied
* Draft
* Confirmed
* Cancelled
* Rejected
* Selected Rows
* Bulk Action Open
* Drawer Open
* Modal Open

8. 권한 구조 보완
   사용자/권한 페이지는 역할만 보여주지 말고 액션 단위까지 보여줘.

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

권한은 체크박스 매트릭스 형태로 설계해줘.

9. 모바일 보완
   현재 구조는 반응형 웹 수준이므로, 모바일 업무 사용성을 강화해줘.
   반드시 반영할 것:

* Bottom Sheet 상세 패턴
* 2줄 리스트 행 구조
* 가로 스크롤 KPI strip
* 긴 폼 Step Form
* 모바일 검색 / 필터 / 액션바 단순화
* 손쉬운 빠른 액션 우선 배치

10. Developer Handoff 페이지 추가
    마지막 페이지에 반드시 Developer Handoff를 추가해줘.
    여기에는 장식 없는 명세판 형태로 아래를 정리해줘.

* Entity Map
* Table Column Spec
* Form Validation Rules
* State Transition Map
* Trigger Notes
* Permission Matrix
* Responsive Rules

반드시 포함해야 하는 트리거:

* 출고 확정 시 재고 차감
* 출고 확정 시 세금계산서 발행대기 생성
* 입고 완료 시 재고 증가
* 문서 만료 시 alert 생성
* 신용한도 초과 시 warning 표시
* serial 누락 시 alert 생성

11. 반드시 유지해야 하는 메뉴

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

12. 최종 결과물 목표

* ERP 작업자가 빠르게 읽고 사용할 수 있어야 함
* 웹에서는 테이블 중심으로 밀도 있게 보여야 함
* 모바일에서는 최소한 현장 작업이 편해야 함
* lot / serial / expiry 정책이 UI에 구현 가능하게 드러나야 함
* 출고 → 세금계산서 → 정산 연결이 명확해야 함
* 개발자가 컴포넌트, 상태, 라우트, API 연결 포인트를 쉽게 이해할 수 있어야 함
* 결과물은 시안이 아니라 실제 개발 전달용 수준이어야 함
