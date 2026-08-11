# Medical ERP — 의료기기 유통사 멀티테넌트 ERP

의료기기 유통·판매업체를 위한 ERP SaaS입니다. 거래처·재고·수주/발주·정산(미수금/미지급금)·세금계산서 흐름을 한 화면에서 관리합니다.

## 주요 기능
- 거래처/품목/재고 관리, 수주·발주 워크플로우
- 정산 관리: 채권(RECEIVABLE)·채무(PAYABLE) 원장, 세금계산서 연동 구조
- 멀티테넌트: 업체별 데이터 완전 격리 (Supabase RLS)
- 역할 기반 권한 (관리자/직원)

## 기술 스택
- Turborepo 모노레포 — NestJS API + React(Vite) 웹
- Prisma / Supabase (PostgreSQL, Row Level Security)
- shadcn/ui
