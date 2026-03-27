import { X, Package, Calendar, AlertTriangle, TrendingUp, Clock, DollarSign, TruckIcon, Wrench, FileWarning, Receipt, ExternalLink } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface InspectorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'lot-tracking' | 'serial-missing' | 'low-stock' | 'document-expiry' | 'tax-pending' | 'monthly-revenue' | 'unpaid-balance' | 'today-shipment' | 'as-requests' | 'expiring-products' | 'warranty-expiry' | 'weekly-schedule' | 
  // 세금계산서 관리 타입
  'tax-scheduled' | 'tax-completed' | 'tax-unissued' | 'tax-revision' | 'tax-error' |
  // 알림센터 타입
  'alert-expiry-warning' | 'alert-stock-shortage' | 'alert-serial-unregistered' | 'alert-lot-tracking' | 'alert-document-expiry' | 'alert-tax-unissued' | 'alert-unpaid-balance' | 'alert-warranty-expiry' | 'alert-as-delay' | 'alert-install-schedule' | null;
}

export function InspectorPanel({ isOpen, onClose, type }: InspectorPanelProps) {
  if (!isOpen || !type) return null;

  const getLotTrackingContent = () => (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-5 h-5 text-[#B94A48]" />
          <h3 className="text-lg font-bold text-[#18212B]">로트 추적 필요 품목</h3>
        </div>
        <p className="text-sm text-[#5B6773]">FEFO 원칙에 따라 먼저 출고해야 할 로트가 있습니다.</p>
      </div>

      <div className="space-y-4">
        {/* Item 1 */}
        <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-bold text-[#0F172A] mb-1">PRD-2024-002</p>
              <h4 className="text-sm font-bold text-[#1E293B]">MRI 조영제 10ml</h4>
              <p className="text-xs text-[#475569] mt-1">모델: MRC-10</p>
            </div>
            <span className="px-2 py-1 bg-[#FEE2E2] text-[#DC2626] text-xs font-bold rounded">긴급</span>
          </div>

          <div className="bg-white rounded-lg p-3 mb-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">권장 로트</span>
              <span className="text-xs font-bold text-[#0F172A]">LOT-2024-A001</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">유효기간</span>
              <span className="text-xs font-bold text-[#DC2626]">2026-03-15 (12일 남음)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">재고수량</span>
              <span className="text-xs font-bold text-[#0F172A]">45개</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">위치</span>
              <span className="text-xs font-bold text-[#0F172A]">본사창고 A-12</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-[#FEF3C7] rounded-lg">
            <AlertTriangle className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[#92400E] mb-1">FEFO 권장</p>
              <p className="text-xs text-[#78350F]">다음 출고 시 이 로트를 우선 사용하세요. 유효기간이 12일 남았습니다.</p>
            </div>
          </div>
        </div>

        {/* Item 2 */}
        <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-bold text-[#0F172A] mb-1">PRD-2024-006</p>
              <h4 className="text-sm font-bold text-[#1E293B]">CT 조영제 50ml</h4>
              <p className="text-xs text-[#475569] mt-1">모델: CTC-50</p>
            </div>
            <span className="px-2 py-1 bg-[#FEE2E2] text-[#DC2626] text-xs font-bold rounded">긴급</span>
          </div>

          <div className="bg-white rounded-lg p-3 mb-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">권장 로트</span>
              <span className="text-xs font-bold text-[#0F172A]">LOT-2024-I333</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">유효기간</span>
              <span className="text-xs font-bold text-[#DC2626]">2026-03-10 (7일 남음)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">재고수량</span>
              <span className="text-xs font-bold text-[#0F172A]">45개</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">위치</span>
              <span className="text-xs font-bold text-[#0F172A]">지점창고 B-08</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-[#FEF3C7] rounded-lg">
            <AlertTriangle className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[#92400E] mb-1">FEFO 권장</p>
              <p className="text-xs text-[#78350F]">유효기간이 7일 남았습니다. 즉시 출고를 권장합니다.</p>
            </div>
          </div>
        </div>

        {/* Item 3 */}
        <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-bold text-[#0F172A] mb-1">PRD-2024-012</p>
              <h4 className="text-sm font-bold text-[#1E293B]">혈액검사 시약</h4>
              <p className="text-xs text-[#475569] mt-1">모델: BT-500</p>
            </div>
            <span className="px-2 py-1 bg-[#FEF3C7] text-[#F59E0B] text-xs font-bold rounded">주의</span>
          </div>

          <div className="bg-white rounded-lg p-3 mb-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">권장 로트</span>
              <span className="text-xs font-bold text-[#0F172A]">LOT-2025-B127</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">유효기간</span>
              <span className="text-xs font-bold text-[#F59E0B]">2026-03-28 (25일 남음)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">재고수량</span>
              <span className="text-xs font-bold text-[#0F172A]">120개</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">위치</span>
              <span className="text-xs font-bold text-[#0F172A]">본사창고 C-05</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-[#F1F5F9] rounded-lg">
        <div className="flex items-start gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-[#0F172A] mb-1">FEFO 원칙 안내</p>
            <p className="text-xs text-[#475569] leading-relaxed">
              First Expired, First Out: 유효기간이 빠른 제품을 먼저 출고하여 재고 손실을 최소화합니다.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const getSerialMissingContent = () => (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-5 h-5 text-[#B94A48]" />
          <h3 className="text-lg font-bold text-[#18212B]">시리얼 등록 누락</h3>
        </div>
        <p className="text-sm text-[#5B6773]">출고 후 시리얼 번호를 등록하지 않은 장비가 있습니다.</p>
      </div>

      <div className="space-y-4">
        <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-bold text-[#0F172A] mb-1">SHP-2026-0245</p>
              <h4 className="text-sm font-bold text-[#1E293B]">초음파 프로브 A3</h4>
              <p className="text-xs text-[#475569] mt-1">거래처: 서울대병원</p>
            </div>
            <span className="px-2 py-1 bg-[#FEE2E2] text-[#DC2626] text-xs font-bold rounded">긴급</span>
          </div>

          <div className="bg-white rounded-lg p-3 mb-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">출고일</span>
              <span className="text-xs font-bold text-[#0F172A]">2026-03-01</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">출고수량</span>
              <span className="text-xs font-bold text-[#0F172A]">2대</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">등록 현황</span>
              <span className="text-xs font-bold text-[#DC2626]">0/2 등록</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">경과일</span>
              <span className="text-xs font-bold text-[#DC2626]">2일</span>
            </div>
          </div>

          <button className="w-full px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1E293B] transition-colors text-sm font-semibold">
            시리얼 번호 등록
          </button>
        </div>

        <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-bold text-[#0F172A] mb-1">SHP-2026-0238</p>
              <h4 className="text-sm font-bold text-[#1E293B]">X-Ray 장비 XR-500</h4>
              <p className="text-xs text-[#475569] mt-1">거래처: 삼성서울병원</p>
            </div>
            <span className="px-2 py-1 bg-[#FEE2E2] text-[#DC2626] text-xs font-bold rounded">긴급</span>
          </div>

          <div className="bg-white rounded-lg p-3 mb-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">출고일</span>
              <span className="text-xs font-bold text-[#0F172A]">2026-02-28</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">출고수량</span>
              <span className="text-xs font-bold text-[#0F172A]">1대</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">등록 현황</span>
              <span className="text-xs font-bold text-[#DC2626]">0/1 등록</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">경과일</span>
              <span className="text-xs font-bold text-[#DC2626]">3일</span>
            </div>
          </div>

          <button className="w-full px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1E293B] transition-colors text-sm font-semibold">
            시리얼 번호 등록
          </button>
        </div>
      </div>
    </>
  );

  const getLowStockContent = () => (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
          <h3 className="text-lg font-bold text-[#18212B]">재고 부족 품목</h3>
        </div>
        <p className="text-sm text-[#5B6773]">안전재고 수량 미달 품목입니다.</p>
      </div>

      <div className="space-y-4">
        <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-bold text-[#0F172A] mb-1">PRD-2024-003</p>
              <h4 className="text-sm font-bold text-[#1E293B]">수술용 가위 세트</h4>
              <p className="text-xs text-[#475569] mt-1">모델: SS-PRO</p>
            </div>
            <span className="px-2 py-1 bg-[#FEF3C7] text-[#F59E0B] text-xs font-bold rounded">경고</span>
          </div>

          <div className="bg-white rounded-lg p-3 mb-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">현재 재고</span>
              <span className="text-xs font-bold text-[#DC2626]">8개</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">안전 재고</span>
              <span className="text-xs font-bold text-[#0F172A]">15개</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">부족 수량</span>
              <span className="text-xs font-bold text-[#DC2626]">-7개</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569]">예약 재고</span>
              <span className="text-xs font-bold text-[#0F172A]">3개</span>
            </div>
          </div>

          <button className="w-full px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1E293B] transition-colors text-sm font-semibold">
            발주 요청
          </button>
        </div>
      </div>
    </>
  );

  const getMonthlyRevenueContent = () => (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-5 h-5 text-[#2563EB]" />
          <h3 className="text-lg font-bold text-[#18212B]">이번 달 매출 상세</h3>
        </div>
        <p className="text-sm text-[#5B6773]">2026년 3월 매출 현황입니다.</p>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-lg p-6 mb-6 text-white">
        <p className="text-sm opacity-90 mb-2">총 매출액</p>
        <p className="text-3xl font-bold mb-1">423,000,000원</p>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-[#16A34A] rounded text-xs font-bold">↑ 23.5%</span>
          <span className="text-xs opacity-75">전월 대비 증가</span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-[#18212B] mb-3">카테고리별 매출</h4>
        <div className="space-y-3">
          <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-[#1E293B]">의료기기</span>
              <span className="text-sm font-bold text-[#0F172A]">298,500,000원</span>
            </div>
            <div className="w-full bg-[#E2E8F0] rounded-full h-2">
              <div className="bg-[#2563EB] h-2 rounded-full" style={{ width: '70.6%' }}></div>
            </div>
            <p className="text-xs text-[#475569] mt-1">전체의 70.6%</p>
          </div>

          <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-[#1E293B]">의료 소모품</span>
              <span className="text-sm font-bold text-[#0F172A]">124,500,000원</span>
            </div>
            <div className="w-full bg-[#E2E8F0] rounded-full h-2">
              <div className="bg-[#16A34A] h-2 rounded-full" style={{ width: '29.4%' }}></div>
            </div>
            <p className="text-xs text-[#475569] mt-1">전체의 29.4%</p>
          </div>
        </div>
      </div>

      {/* Top Clients */}
      <div>
        <h4 className="text-sm font-bold text-[#18212B] mb-3">상위 거래처 (Top 5)</h4>
        <div className="space-y-2">
          {[
            { name: '서울대병원', amount: 125000000, rank: 1 },
            { name: '삼성서울병원', amount: 98000000, rank: 2 },
            { name: '세브란스병원', amount: 87000000, rank: 3 },
            { name: '아산병원', amount: 65000000, rank: 4 },
            { name: '서울성모병원', amount: 48000000, rank: 5 },
          ].map((client) => (
            <div key={client.name} className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
              <div className="w-8 h-8 bg-[#0F172A] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{client.rank}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#1E293B]">{client.name}</p>
                <p className="text-xs text-[#475569]">{client.amount.toLocaleString()}원</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-[#DBEAFE] rounded-lg">
        <div className="flex items-start gap-2">
          <TrendingUp className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-[#1E3A8A] mb-1">목표 달성률</p>
            <p className="text-xs text-[#1E40AF]">월간 목표 3.78억원 대비 112% 달성했습니다.</p>
          </div>
        </div>
      </div>
    </>
  );

  const getUnpaidBalanceContent = () => (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-[#F59E0B]" />
          <h3 className="text-lg font-bold text-[#18212B]">미수금 현황</h3>
        </div>
        <p className="text-sm text-[#5B6773]">15개 거래처의 미수금 내역입니다.</p>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-lg p-6 mb-6 text-white">
        <p className="text-sm opacity-90 mb-2">총 미수금</p>
        <p className="text-3xl font-bold mb-1">120,000,000원</p>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-[#DC2626] rounded text-xs font-bold">↓ 8.2%</span>
          <span className="text-xs opacity-75">전월 대비 감소</span>
        </div>
      </div>

      {/* Aging Analysis */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-[#18212B] mb-3">연체 기간별 분석</h4>
        <div className="space-y-3">
          <div className="bg-[#FEE2E2] rounded-lg p-4 border border-[#FCA5A5]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-[#991B1B]">90일 이상</span>
              <span className="text-sm font-bold text-[#991B1B]">35,000,000원</span>
            </div>
            <p className="text-xs text-[#7F1D1D]">3개 거래처 | 긴급 회수 필요</p>
          </div>

          <div className="bg-[#FEF3C7] rounded-lg p-4 border border-[#FDE047]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-[#78350F]">60-89일</span>
              <span className="text-sm font-bold text-[#78350F]">42,000,000원</span>
            </div>
            <p className="text-xs text-[#713F12]">5개 거래처 | 독촉 필요</p>
          </div>

          <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-[#1E293B]">30-59일</span>
              <span className="text-sm font-bold text-[#1E293B]">28,000,000원</span>
            </div>
            <p className="text-xs text-[#475569]">4개 거래처 | 정상 범위</p>
          </div>

          <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-[#1E293B]">30일 이내</span>
              <span className="text-sm font-bold text-[#1E293B]">15,000,000원</span>
            </div>
            <p className="text-xs text-[#475569]">3개 거래처 | 정상</p>
          </div>
        </div>
      </div>

      {/* Top Unpaid Clients */}
      <div>
        <h4 className="text-sm font-bold text-[#18212B] mb-3">미수금 상위 거래처</h4>
        <div className="space-y-2">
          {[
            { name: '세브란스병원', amount: 28000000, days: 95, status: '긴급' },
            { name: '강남병원', amount: 22000000, days: 68, status: '경고' },
            { name: '고대안암병원', amount: 18500000, days: 45, status: '정상' },
          ].map((client) => (
            <div key={client.name} className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-[#1E293B]">{client.name}</p>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  client.status === '긴급' ? 'bg-[#FEE2E2] text-[#DC2626]' :
                  client.status === '경고' ? 'bg-[#FEF3C7] text-[#F59E0B]' :
                  'bg-[#E2E8F0] text-[#475569]'
                }`}>{client.status}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#475569]">{client.days}일 경과</span>
                <span className="font-bold text-[#0F172A]">{client.amount.toLocaleString()}원</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const getTodayShipmentContent = () => (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <TruckIcon className="w-5 h-5 text-[#2563EB]" />
          <h3 className="text-lg font-bold text-[#18212B]">오늘 출고 예정</h3>
        </div>
        <p className="text-sm text-[#5B6773]">오늘 출고 예정인 12건의 상세 내역입니다.</p>
      </div>

      <div className="bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-lg p-6 mb-6 text-white">
        <p className="text-sm opacity-90 mb-2">총 출고 건수</p>
        <p className="text-3xl font-bold mb-1">12건</p>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-white/20 rounded text-xs font-bold">48개 품목</span>
          <span className="text-xs opacity-75">총 금액 2.8억원</span>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold text-[#18212B]">출고 리스트</h4>
        
        {[
          { id: 'SHP-2026-0412', client: '서울대병원', items: 5, amount: 45000000, time: '09:00', status: '준비중', priority: 'high' },
          { id: 'SHP-2026-0413', client: '삼성서울병원', items: 8, amount: 67000000, time: '10:30', status: '준비중', priority: 'high' },
          { id: 'SHP-2026-0414', client: '세브란스병원', items: 3, amount: 22000000, time: '11:00', status: '대기', priority: 'normal' },
        ].map((shipment) => (
          <div key={shipment.id} className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-bold text-[#0F172A] mb-1">{shipment.id}</p>
                <h4 className="text-sm font-bold text-[#1E293B]">{shipment.client}</h4>
              </div>
              <div className="flex items-center gap-2">
                {shipment.priority === 'high' && (
                  <span className="px-2 py-0.5 bg-[#FEE2E2] text-[#DC2626] text-xs font-bold rounded">긴급</span>
                )}
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#475569]">출고 시간</span>
                <span className="font-bold text-[#0F172A]">{shipment.time}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#475569]">품목 수</span>
                <span className="font-bold text-[#0F172A]">{shipment.items}개</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const getASRequestsContent = () => (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Wrench className="w-5 h-5 text-[#16A34A]" />
          <h3 className="text-lg font-bold text-[#18212B]">A/S 접수 현황</h3>
        </div>
        <p className="text-sm text-[#5B6773]">현재 접수된 8건의 A/S 상세 내역입니다.</p>
      </div>

      <div className="bg-gradient-to-br from-[#16A34A] to-[#15803D] rounded-lg p-6 mb-6 text-white">
        <p className="text-sm opacity-90 mb-2">총 접수 건수</p>
        <p className="text-3xl font-bold mb-1">8건</p>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-[#DC2626] rounded text-xs font-bold">긴급 2건</span>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold text-[#18212B]">A/S 리스트</h4>
        
        {[
          { id: 'AS-2026-089', client: '서울대병원', equipment: '초음파기기 US-3000', type: '긴급수리', priority: 'high' },
          { id: 'AS-2026-090', client: '삼성서울병원', equipment: 'CT 스캐너 CT-500', type: '긴급수리', priority: 'high' },
        ].map((request) => (
          <div key={request.id} className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-bold text-[#0F172A] mb-1">{request.id}</p>
                <h4 className="text-sm font-bold text-[#1E293B]">{request.client}</h4>
              </div>
              {request.priority === 'high' && (
                <span className="px-2 py-0.5 bg-[#FEE2E2] text-[#DC2626] text-xs font-bold rounded">긴급</span>
              )}
            </div>
            <div className="bg-white rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#475569]">장비</span>
                <span className="font-bold text-[#0F172A]">{request.equipment}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#475569]">유형</span>
                <span className="font-bold text-[#0F172A]">{request.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const getExpiringProductsContent = () => (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
          <h3 className="text-lg font-bold text-[#18212B]">유효기간 임박 품목</h3>
        </div>
        <p className="text-sm text-[#5B6773]">30일 이내 유효기간이 만료되는 23개 품목입니다.</p>
      </div>

      <div className="bg-gradient-to-br from-[#DC2626] to-[#B91C1C] rounded-lg p-6 mb-6 text-white">
        <p className="text-sm opacity-90 mb-2">임박 품목</p>
        <p className="text-3xl font-bold mb-1">23품목</p>
      </div>

      <div className="space-y-4">
        {[
          { code: 'PRD-2024-002', name: 'MRI 조영제 10ml', days: 7, qty: 45 },
          { code: 'PRD-2024-006', name: 'CT 조영제 50ml', days: 9, qty: 32 },
        ].map((product) => (
          <div key={product.code} className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-bold text-[#0F172A] mb-1">{product.code}</p>
                <h4 className="text-sm font-bold text-[#1E293B]">{product.name}</h4>
              </div>
              <span className="px-2 py-0.5 bg-[#FEE2E2] text-[#DC2626] text-xs font-bold rounded">{product.days}일 남음</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const getWarrantyExpiryContent = () => (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-[#F59E0B]" />
          <h3 className="text-lg font-bold text-[#18212B]">보증 만료 예정</h3>
        </div>
        <p className="text-sm text-[#5B6773]">60일 이내 보증이 만료되는 5대의 장비입니다.</p>
      </div>

      <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-lg p-6 mb-6 text-white">
        <p className="text-sm opacity-90 mb-2">만료 예정 장비</p>
        <p className="text-3xl font-bold mb-1">5대</p>
      </div>

      <div className="space-y-4">
        {[
          { serial: 'SN-US-3000-2023-A12', name: '초음파기기 US-3000', client: '서울대병원', days: 12 },
          { serial: 'SN-CT-500-2023-B08', name: 'CT 스캐너 CT-500', client: '삼성서울병원', days: 29 },
        ].map((equipment) => (
          <div key={equipment.serial} className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-bold text-[#0F172A] mb-1">{equipment.serial}</p>
                <h4 className="text-sm font-bold text-[#1E293B]">{equipment.name}</h4>
              </div>
              <span className="px-2 py-0.5 bg-[#FEE2E2] text-[#DC2626] text-xs font-bold rounded">{equipment.days}일 남음</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const getDocumentExpiryContent = () => (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FileWarning className="w-5 h-5 text-[#F59E0B]" />
          <h3 className="text-lg font-bold text-[#18212B]">문서 만료 예정</h3>
        </div>
        <p className="text-sm text-[#5B6773]">30일 이내 만료되는 8개의 중요 문서입니다.</p>
      </div>

      <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-lg p-6 mb-6 text-white">
        <p className="text-sm opacity-90 mb-2">만료 예정 문서</p>
        <p className="text-3xl font-bold mb-1">8개</p>
      </div>

      <div className="space-y-4">
        {[
          { id: 'DOC-2024-156', title: 'CE 인증서 - 초음파기기', days: 17 },
          { id: 'DOC-2024-189', title: '연간 공급 계약서', days: 33 },
        ].map((document) => (
          <div key={document.id} className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-bold text-[#0F172A] mb-1">{document.id}</p>
                <h4 className="text-sm font-bold text-[#1E293B]">{document.title}</h4>
              </div>
              <span className="px-2 py-0.5 bg-[#FEF3C7] text-[#F59E0B] text-xs font-bold rounded">{document.days}일 남음</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const getTaxPendingContent = () => (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Receipt className="w-5 h-5 text-[#DC2626]" />
          <h3 className="text-lg font-bold text-[#18212B]">세금계산서 미발행</h3>
        </div>
        <p className="text-sm text-[#5B6773]">발행 대기 중인 5건의 세금계산서입니다.</p>
      </div>

      <div className="bg-gradient-to-br from-[#DC2626] to-[#B91C1C] rounded-lg p-6 mb-6 text-white">
        <p className="text-sm opacity-90 mb-2">미발행 건수</p>
        <p className="text-3xl font-bold mb-1">5건</p>
      </div>

      <div className="space-y-4">
        {[
          { invoiceNo: 'TAX-2026-0156', client: '서울대병원', totalAmount: 97900000, days: 3 },
          { invoiceNo: 'TAX-2026-0157', client: '삼성서울병원', totalAmount: 73700000, days: 2 },
        ].map((invoice) => (
          <div key={invoice.invoiceNo} className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-bold text-[#0F172A] mb-1">{invoice.invoiceNo}</p>
                <h4 className="text-sm font-bold text-[#1E293B]">{invoice.client}</h4>
              </div>
              <span className="px-2 py-0.5 bg-[#FEE2E2] text-[#DC2626] text-xs font-bold rounded">{invoice.days}일 경과</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const getWeeklyScheduleContent = () => (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-[#2563EB]" />
          <h3 className="text-lg font-bold text-[#18212B]">이번 주 설치/점검 일정</h3>
        </div>
        <p className="text-sm text-[#5B6773]">3월 1주차 설치 및 점검 일정입니다.</p>
      </div>

      <div className="bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-lg p-6 mb-6 text-white">
        <p className="text-sm opacity-90 mb-2">이번 주 총 일정</p>
        <p className="text-3xl font-bold mb-1">3건</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-2 py-1 bg-white/20 rounded text-xs font-bold">설치 1건</span>
          <span className="px-2 py-1 bg-white/20 rounded text-xs font-bold">점검 2건</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Schedule Item 1 */}
        <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 bg-[#5B8DB8] rounded-lg flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-base">3</span>
              <span className="text-white text-[10px]">월</span>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs font-bold text-[#163A5F] mb-1">SCH-2026-012</p>
                  <h4 className="text-sm font-bold text-[#1E293B]">초음파기기 설치</h4>
                </div>
                <StatusBadge status="예정" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569]">거래처</span>
              <span className="font-bold text-[#0F172A]">서울대병원 영상의학과</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569]">장비명</span>
              <span className="font-bold text-[#0F172A]">초음파기기 US-3000</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569]">시리얼번호</span>
              <span className="font-bold text-[#0F172A]">US500-2024-002</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569]">유형</span>
              <span className="px-2 py-0.5 bg-[#E6F4EA] text-[#2E7D5B] rounded text-[10px] font-bold">설치</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569]">예정일</span>
              <span className="font-bold text-[#0F172A]">2026-03-03 14:00 - 17:00</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569]">담당자</span>
              <span className="font-bold text-[#0F172A]">김기사</span>
            </div>
          </div>
        </div>

        {/* Schedule Item 2 */}
        <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 bg-[#163A5F] rounded-lg flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-base">4</span>
              <span className="text-white text-[10px]">월</span>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs font-bold text-[#163A5F] mb-1">SCH-2026-013</p>
                  <h4 className="text-sm font-bold text-[#1E293B]">CT 정기점검</h4>
                </div>
                <StatusBadge status="예정" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569]">거래처</span>
              <span className="font-bold text-[#0F172A]">삼성서울병원 건강의학센터</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569]">장비명</span>
              <span className="font-bold text-[#0F172A]">CT 스캐너 CT-750</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569]">시리얼번호</span>
              <span className="font-bold text-[#0F172A]">CT750-2024-001</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569]">유형</span>
              <span className="px-2 py-0.5 bg-[#FFF4E5] text-[#C58A2B] rounded text-[10px] font-bold">정기점검</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569]">예정일</span>
              <span className="font-bold text-[#0F172A]">2026-03-04 09:00 - 12:00</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569]">담당자</span>
              <span className="font-bold text-[#0F172A]">이기사</span>
            </div>
          </div>
        </div>

        {/* Schedule Item 3 */}
        <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 bg-[#35556E] rounded-lg flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-base">5</span>
              <span className="text-white text-[10px]">월</span>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs font-bold text-[#163A5F] mb-1">SCH-2026-014</p>
                  <h4 className="text-sm font-bold text-[#1E293B]">MRI 부품교체</h4>
                </div>
                <StatusBadge status="예정" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569]">거래처</span>
              <span className="font-bold text-[#0F172A]">세브란스병원 영상의학과</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569]">장비명</span>
              <span className="font-bold text-[#0F172A]">MRI 스캐너 MRI-300</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569]">시리얼번호</span>
              <span className="font-bold text-[#0F172A]">MRI300-2024-002</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569]">유형</span>
              <span className="px-2 py-0.5 bg-[#FCEBE9] text-[#B94A48] rounded text-[10px] font-bold">부품교체</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569]">예정일</span>
              <span className="font-bold text-[#0F172A]">2026-03-05 10:00 - 15:00</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569]">담당자</span>
              <span className="font-bold text-[#0F172A]">박기사</span>
            </div>
          </div>
        </div>
      </div>

      {/* View All Button */}
      <div className="mt-6">
        <button className="w-full px-4 py-3 bg-[#163A5F] text-white rounded-lg hover:bg-[#0F2942] transition-colors font-bold flex items-center justify-center gap-2">
          <ExternalLink className="w-4 h-4" />
          설치/A/S 관리 전체보기 (이번 주 필터)
        </button>
        <p className="text-xs text-[#5B6773] text-center mt-2">
          설치/A/S 관리 메뉴로 이동하며, 이번 주 일정 필터가 자동 적용됩니다
        </p>
      </div>

      <div className="mt-4 p-4 bg-[#E6F4EA] rounded-lg">
        <div className="flex items-start gap-2">
          <Calendar className="w-4 h-4 text-[#2E7D5B] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-[#2E7D5B] mb-1">일정 관리 안내</p>
            <p className="text-xs text-[#18212B] leading-relaxed">
              설치 및 점검 일정은 거래처와 사전 협의 후 등록하며, 담당 기사의 작업 결과를 실시간으로 확인할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const getContent = () => {
    switch (type) {
      case 'lot-tracking':
      case 'alert-lot-tracking':
        return getLotTrackingContent();
      case 'serial-missing':
      case 'alert-serial-unregistered':
        return getSerialMissingContent();
      case 'low-stock':
      case 'alert-stock-shortage':
        return getLowStockContent();
      case 'monthly-revenue':
      case 'tax-scheduled':
      case 'tax-completed':
      case 'tax-unissued':
      case 'tax-revision':
      case 'tax-error':
      case 'alert-tax-unissued':
        return getMonthlyRevenueContent();
      case 'unpaid-balance':
      case 'alert-unpaid-balance':
        return getUnpaidBalanceContent();
      case 'today-shipment':
        return getTodayShipmentContent();
      case 'as-requests':
      case 'alert-as-delay':
        return getASRequestsContent();
      case 'expiring-products':
      case 'alert-expiry-warning':
        return getExpiringProductsContent();
      case 'warranty-expiry':
      case 'alert-warranty-expiry':
        return getWarrantyExpiryContent();
      case 'document-expiry':
      case 'alert-document-expiry':
        return getDocumentExpiryContent();
      case 'tax-pending':
        return getTaxPendingContent();
      case 'weekly-schedule':
      case 'alert-install-schedule':
        return getWeeklyScheduleContent();
      default:
        return <p className="text-sm text-[#5B6773]">상세 정보가 없습니다.</p>;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full lg:w-[480px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#0F172A]">
          <h2 className="text-lg font-bold text-white">알림 상세</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1E293B] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {getContent()}
        </div>
      </div>
    </>
  );
}