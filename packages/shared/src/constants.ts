// ============================================
// Shared constants for Frontend & Backend
// ============================================

export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

export const CLIENT_TYPE_LABELS: Record<string, string> = {
  HOSPITAL: '병원',
  CLINIC: '의원',
  PHARMACY: '약국',
  OTHER: '기타',
}

export const USER_ROLE_LABELS: Record<string, string> = {
  ADMIN: '관리자',
  MANAGER: '매니저',
  STAFF: '직원',
}

export const SHIPMENT_STATUS_LABELS: Record<string, string> = {
  REQUESTED: '출고 요청',
  APPROVED: '승인',
  SHIPPED: '배송 중',
  DELIVERED: '배송 완료',
  CANCELLED: '취소',
}

export const RECEIVING_STATUS_LABELS: Record<string, string> = {
  PENDING: '대기',
  INSPECTING: '검수 중',
  COMPLETED: '입고 완료',
  REJECTED: '반려',
}

export const SERVICE_TYPE_LABELS: Record<string, string> = {
  INSTALLATION: '설치',
  REPAIR: '수리',
  MAINTENANCE: '유지보수',
}

export const SERVICE_STATUS_LABELS: Record<string, string> = {
  OPEN: '접수',
  IN_PROGRESS: '진행 중',
  RESOLVED: '완료',
  CLOSED: '종료',
}

export const PLAN_LABELS: Record<string, string> = {
  FREE: '무료',
  PRO: '프로',
  ENTERPRISE: '엔터프라이즈',
}
