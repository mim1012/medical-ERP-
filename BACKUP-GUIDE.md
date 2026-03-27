# 🔄 의료기기 ERP - 백업 및 복원 가이드

**작성일:** 2026년 3월 15일

---

## 📦 **현재 백업된 파일**

```
/src/app/pages/
├─ ClientManagement.BACKUP.tsx      ← 거래처 관리 이전 버전
└─ ProductManagement.BACKUP.tsx     ← 품목 관리 이전 버전
```

---

## 🔧 **백업이 필요한 시점**

### 1. 대규모 수정 전
```
예시:
- 출고/판매 관리 페이지 전면 재작성 전
- 재고 관리 페이지 구조 변경 전
- 데이터 구조 변경 전
```

### 2. 새로운 기능 추가 전
```
예시:
- Product-first 출고 구조 적용 전
- 전역 상태 관리 도입 전
- 새로운 Context 추가 전
```

### 3. 정기 백업 (권장)
```
- 매일 작업 종료 시
- 중요 마일스톤 달성 시
- 배포 전
```

---

## 💾 **백업 방법**

### 방법 1: 파일명에 날짜 추가
```bash
현재 파일명: ClientManagement.tsx
백업 파일명: ClientManagement.BACKUP-20260315.tsx

패턴: [파일명].BACKUP-[YYYYMMDD].tsx
```

### 방법 2: 간단한 백업 (BACKUP만)
```bash
현재 파일명: ClientManagement.tsx
백업 파일명: ClientManagement.BACKUP.tsx

패턴: [파일명].BACKUP.tsx
```

### 방법 3: 버전별 백업
```bash
현재 파일명: ClientManagement.tsx
백업 파일명:
  - ClientManagement.v1.tsx
  - ClientManagement.v2.tsx
  - ClientManagement.v3.tsx

패턴: [파일명].v[버전번호].tsx
```

---

## 📋 **백업해야 할 파일 목록**

### 1. 핵심 페이지 컴포넌트 (우선순위 높음)
```
/src/app/pages/
  ✓ Dashboard.tsx                   → 메인 홈
  ✓ ClientManagement.tsx            → 거래처 관리
  ✓ ProductManagement.tsx           → 품목 관리
  ✓ InventoryManagement.tsx         → 재고 관리 ⭐
  ✓ ReceivingManagement.tsx         → 입고/발주 관리
  ✓ ShippingManagement.tsx          → 출고/판매 관리 ⭐
  ✓ ServiceManagement.tsx           → 설치/A/S 관리
  ✓ TaxInvoiceManagement.tsx        → 세금계산서 관리
  ✓ AlertCenter.tsx                 → 알림 센터
```

⭐ = 대규모 작업 예정, 백업 필수!

### 2. Context 파일 (중요)
```
/src/app/contexts/
  ✓ ThemeContext.tsx
  ✓ (추가 예정) InventoryContext.tsx
  ✓ (추가 예정) ClientContext.tsx
  ✓ (추가 예정) ProductContext.tsx
```

### 3. 공통 컴포넌트
```
/src/app/components/
  ✓ Sidebar.tsx
  ✓ Header.tsx
  ✓ InspectorPanel.tsx
  ✓ Layout.tsx
```

### 4. 라우팅 설정
```
/src/app/
  ✓ routes.tsx
```

### 5. 스타일 파일
```
/src/styles/
  ✓ theme.css
  ✓ fonts.css
```

---

## 🔄 **복원 방법**

### 상황 1: 최근 백업으로 복원
```bash
# 백업 파일이 있는 경우
ClientManagement.BACKUP.tsx → ClientManagement.tsx로 복사

작업:
1. 기존 파일을 임시 백업 (옵션)
   ClientManagement.tsx → ClientManagement.TEMP.tsx

2. 백업 파일을 현재 파일로 복원
   ClientManagement.BACKUP.tsx → ClientManagement.tsx
   
3. 페이지 새로고침하여 확인
```

### 상황 2: 특정 버전으로 복원
```bash
# 여러 버전이 있는 경우
ClientManagement.v1.tsx
ClientManagement.v2.tsx
ClientManagement.v3.tsx

작업:
1. 원하는 버전을 현재 파일로 복사
   ClientManagement.v2.tsx → ClientManagement.tsx
```

### 상황 3: 전체 시스템 복원
```bash
# 모든 백업 파일을 한번에 복원

작업:
1. /src/app/pages/ 폴더의 모든 .BACKUP.tsx 파일을 원본으로 복사
2. /src/app/contexts/ 폴더의 백업 파일 복원
3. routes.tsx 복원
```

---

## ⚠️ **백업 시 주의사항**

### 1. 백업 전 확인사항
```
✓ 현재 코드가 정상 작동하는지 확인
✓ 어떤 부분을 변경할 예정인지 메모
✓ 백업 파일명에 날짜 또는 버전 표시
```

### 2. 백업하지 말아야 할 파일
```
❌ node_modules/
❌ .next/
❌ build/
❌ dist/
❌ pnpm-lock.yaml  (보호된 파일)
```

### 3. 백업 파일 관리
```
✓ 오래된 백업 파일은 주기적으로 삭제
✓ 중요한 백업은 별도 폴더에 보관
✓ 백업 파일이 너무 많으면 관리가 어려움
```

---

## 📝 **백업 체크리스트**

### 대규모 작업 전
```
□ Dashboard.tsx 백업
□ ClientManagement.tsx 백업
□ ProductManagement.tsx 백업
□ InventoryManagement.tsx 백업
□ ReceivingManagement.tsx 백업
□ ShippingManagement.tsx 백업
□ ServiceManagement.tsx 백업
□ TaxInvoiceManagement.tsx 백업
□ AlertCenter.tsx 백업
□ routes.tsx 백업
□ ThemeContext.tsx 백업
□ Sidebar.tsx 백업
□ Header.tsx 백업
```

### 백업 파일명 규칙
```
✓ 날짜 포함: ClientManagement.BACKUP-20260315.tsx
✓ 버전 포함: ClientManagement.v1.tsx
✓ 설명 포함: ClientManagement.BACKUP-before-product-first.tsx
```

---

## 🎯 **권장 백업 전략**

### 1단계: 현재 상태 전체 백업 (지금!)
```
모든 완성된 페이지를 .BACKUP-20260315.tsx로 백업

백업할 파일:
✓ Dashboard.tsx
✓ ClientManagement.tsx
✓ ProductManagement.tsx
✓ ReceivingManagement.tsx
✓ TaxInvoiceManagement.tsx
✓ AlertCenter.tsx
```

### 2단계: 출고/재고 작업 전 백업
```
대규모 작업 예정 파일:
✓ ShippingManagement.tsx  → .BACKUP-before-product-first.tsx
✓ InventoryManagement.tsx → .BACKUP-before-lot-serial.tsx
✓ routes.tsx              → .BACKUP-before-context.tsx
```

### 3단계: 작업 후 백업
```
작업 완료 후:
✓ ShippingManagement.tsx  → .BACKUP-after-product-first.tsx
✓ InventoryManagement.tsx → .BACKUP-after-lot-serial.tsx
```

---

## 🚀 **빠른 백업 명령어**

### AI에게 요청하기
```
"현재 ClientManagement.tsx를 백업해줘"
→ ClientManagement.BACKUP.tsx 생성

"출고 관리 페이지 작업 전에 백업해줘"
→ ShippingManagement.BACKUP-20260315.tsx 생성

"모든 페이지를 날짜 포함해서 백업해줘"
→ 모든 주요 파일 백업
```

---

## 💡 **복원 시나리오**

### 시나리오 1: "새로 만든 출고 관리가 마음에 안 들어요"
```
복원 방법:
1. ShippingManagement.BACKUP.tsx 확인
2. ShippingManagement.BACKUP.tsx → ShippingManagement.tsx로 복사
3. 페이지 새로고침
```

### 시나리오 2: "재고 관리 페이지가 깨졌어요"
```
복원 방법:
1. InventoryManagement.BACKUP.tsx 확인
2. 백업 파일이 없으면 기본 템플릿으로 복원 요청
3. "재고 관리 페이지를 기본 템플릿으로 복원해줘"
```

### 시나리오 3: "전체 시스템을 어제 상태로 되돌리고 싶어요"
```
복원 방법:
1. .BACKUP-20260314.tsx 파일들 확인
2. 모든 백업 파일을 현재 파일로 복원
3. "2026-03-14 백업으로 전체 복원해줘"
```

---

## 📊 **백업 상태 확인**

### 현재 백업 현황
```
✅ 백업됨:
  - ClientManagement.BACKUP.tsx
  - ProductManagement.BACKUP.tsx

❌ 백업 안 됨:
  - Dashboard.tsx
  - InventoryManagement.tsx
  - ReceivingManagement.tsx
  - ShippingManagement.tsx
  - ServiceManagement.tsx
  - TaxInvoiceManagement.tsx
  - AlertCenter.tsx
```

### 백업 우선순위
```
🔴 즉시 백업 필요 (대규모 작업 예정):
  - ShippingManagement.tsx      ← Product-first 구조 재설계 예정
  - InventoryManagement.tsx     ← LOT/시리얼 추적 시스템 구축 예정

🟡 백업 권장:
  - Dashboard.tsx
  - ReceivingManagement.tsx
  - TaxInvoiceManagement.tsx
  - AlertCenter.tsx

🟢 백업 완료:
  - ClientManagement.tsx        ✓
  - ProductManagement.tsx       ✓
```

---

## 🎯 **다음 단계**

### 1. 즉시 실행 (권장)
```
"현재 모든 주요 페이지를 날짜 포함해서 백업해줘"

생성될 파일:
✓ Dashboard.BACKUP-20260315.tsx
✓ ClientManagement.BACKUP-20260315.tsx
✓ ProductManagement.BACKUP-20260315.tsx
✓ InventoryManagement.BACKUP-20260315.tsx
✓ ReceivingManagement.BACKUP-20260315.tsx
✓ ShippingManagement.BACKUP-20260315.tsx
✓ ServiceManagement.BACKUP-20260315.tsx
✓ TaxInvoiceManagement.BACKUP-20260315.tsx
✓ AlertCenter.BACKUP-20260315.tsx
```

### 2. 작업 시작 전
```
"출고/재고 작업 시작 전에 관련 파일들 백업해줘"

백업할 파일:
✓ ShippingManagement.tsx
✓ InventoryManagement.tsx
✓ routes.tsx
```

### 3. 정기 백업 (일일)
```
매일 작업 종료 시:
"오늘 작업한 모든 파일 백업해줘"
```

---

**백업 가이드 작성 완료!**

언제든지 다음과 같이 요청하세요:
- "OOO 페이지 백업해줘"
- "모든 페이지 백업해줘"
- "백업 파일로 복원해줘"
- "어제 백업으로 되돌려줘"
