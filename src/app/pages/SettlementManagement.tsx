import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { SettlementDetailPanel } from "../components/SettlementDetailPanel";
import { StatusBadge } from "../components/StatusBadge";
import { 
  Search, 
  Filter, 
  Download,
  Eye,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  CreditCard,
  FileText
} from "lucide-react";

interface Settlement {
  settlementNumber: string;
  clientName: string;
  period: string;
  supplyAmount: number;
  taxAmount: number;
  totalAmount: number;
  receivedAmount: number;
  unpaidAmount: number;
  status: string;
  daysOverdue?: number;
}

export function SettlementManagement() {
  const [activeMenu, setActiveMenu] = useState('settlement');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [periodFilter, setPeriodFilter] = useState('전체');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [detailPanelSettlements, setDetailPanelSettlements] = useState<Settlement[] | null>(null);
  const [detailPanelTitle, setDetailPanelTitle] = useState('');

  // Mock data
  const settlements: Settlement[] = [
    {
      settlementNumber: 'STL-2026-001',
      clientName: '서울대병원',
      period: '2026년 2월',
      supplyAmount: 45000000,
      taxAmount: 4500000,
      totalAmount: 49500000,
      receivedAmount: 49500000,
      unpaidAmount: 0,
      status: '완납',
      daysOverdue: 0
    },
    {
      settlementNumber: 'STL-2026-002',
      clientName: '삼성서울병원',
      period: '2026년 2월',
      supplyAmount: 89000000,
      taxAmount: 8900000,
      totalAmount: 97900000,
      receivedAmount: 50000000,
      unpaidAmount: 47900000,
      status: '미수',
      daysOverdue: 5
    },
    {
      settlementNumber: 'STL-2026-003',
      clientName: '세브란스병원',
      period: '2026년 2월',
      supplyAmount: 125000000,
      taxAmount: 12500000,
      totalAmount: 137500000,
      receivedAmount: 0,
      unpaidAmount: 137500000,
      status: '미납',
      daysOverdue: 15
    },
    {
      settlementNumber: 'STL-2026-004',
      clientName: '아산병원',
      period: '2026년 1월',
      supplyAmount: 67500000,
      taxAmount: 6750000,
      totalAmount: 74250000,
      receivedAmount: 74250000,
      unpaidAmount: 0,
      status: '완납',
      daysOverdue: 0
    },
    {
      settlementNumber: 'STL-2026-005',
      clientName: '서울성모병원',
      period: '2026년 2월',
      supplyAmount: 34000000,
      taxAmount: 3400000,
      totalAmount: 37400000,
      receivedAmount: 20000000,
      unpaidAmount: 17400000,
      status: '미수',
      daysOverdue: 3
    },
    {
      settlementNumber: 'STL-2026-006',
      clientName: '강남세브란스',
      period: '2026년 1월',
      supplyAmount: 28500000,
      taxAmount: 2850000,
      totalAmount: 31350000,
      receivedAmount: 31350000,
      unpaidAmount: 0,
      status: '완납',
      daysOverdue: 0
    },
    {
      settlementNumber: 'STL-2025-012',
      clientName: '분당서울대병원',
      period: '2025년 12월',
      supplyAmount: 15600000,
      taxAmount: 1560000,
      totalAmount: 17160000,
      receivedAmount: 0,
      unpaidAmount: 17160000,
      status: '연체',
      daysOverdue: 62
    },
  ];

  const filteredSettlements = settlements.filter(settlement => {
    const matchesSearch = 
      settlement.settlementNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      settlement.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '전체' || settlement.status === statusFilter;
    const matchesPeriod = periodFilter === '전체' || settlement.period.includes(periodFilter);
    
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR');
  };

  const getPaymentRate = (received: number, total: number) => {
    return total > 0 ? Math.round((received / total) * 100) : 0;
  };

  // Calculate statistics
  const totalSupply = settlements.reduce((sum, s) => sum + s.supplyAmount, 0);
  const totalReceived = settlements.reduce((sum, s) => sum + s.receivedAmount, 0);
  const totalUnpaid = settlements.reduce((sum, s) => sum + s.unpaidAmount, 0);
  const overdueAmount = settlements.filter(s => s.daysOverdue && s.daysOverdue > 30).reduce((sum, s) => sum + s.unpaidAmount, 0);
  const collectionRate = totalSupply > 0 ? Math.round((totalReceived / (totalSupply + settlements.reduce((sum, s) => sum + s.taxAmount, 0))) * 100) : 0;

  // Get overdue settlements
  const overdueSettlements = settlements.filter(s => s.unpaidAmount > 0 && s.daysOverdue && s.daysOverdue > 0).sort((a, b) => (b.daysOverdue || 0) - (a.daysOverdue || 0));

  return (
    <div className="min-h-screen bg-[#F4F7FA]">
      <Sidebar 
        activeMenu={activeMenu} 
        onMenuClick={setActiveMenu}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="lg:ml-64 pt-16">
        <div className="p-4 lg:p-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#18212B] mb-2">정산 관리</h1>
            <p className="text-[#5B6773]">매출 정산 및 수금 현황 관리</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div 
              onClick={() => {
                setDetailPanelSettlements(settlements);
                setDetailPanelTitle('전체 정산');
              }}
              className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm cursor-pointer hover:border-[#163A5F] hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#5B6773] mb-1">총 공급가액</p>
                  <p className="text-2xl font-bold text-[#18212B] mb-1">{formatCurrency(totalSupply)}</p>
                  <p className="text-xs text-[#5B6773]">원 (이번 달)</p>
                </div>
                <DollarSign className="w-10 h-10 text-[#163A5F] opacity-20" />
              </div>
            </div>

            <div 
              onClick={() => {
                const paid = settlements.filter(s => s.status === '완납');
                setDetailPanelSettlements(paid);
                setDetailPanelTitle('완납 정산');
              }}
              className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm cursor-pointer hover:border-[#2E7D5B] hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#5B6773] mb-1">수금액</p>
                  <p className="text-2xl font-bold text-[#2E7D5B] mb-1">{formatCurrency(totalReceived)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3 text-[#2E7D5B]" />
                    <p className="text-xs text-[#2E7D5B]">수금률 {collectionRate}%</p>
                  </div>
                </div>
                <TrendingUp className="w-10 h-10 text-[#2E7D5B] opacity-20" />
              </div>
            </div>

            <div 
              onClick={() => {
                const unpaid = settlements.filter(s => s.unpaidAmount > 0);
                setDetailPanelSettlements(unpaid);
                setDetailPanelTitle('미수금 정산');
              }}
              className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm cursor-pointer hover:border-[#C58A2B] hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#5B6773] mb-1">미수금</p>
                  <p className="text-2xl font-bold text-[#C58A2B] mb-1">{formatCurrency(totalUnpaid)}</p>
                  <p className="text-xs text-[#C58A2B]">원 (진행중)</p>
                </div>
                <CreditCard className="w-10 h-10 text-[#C58A2B] opacity-20" />
              </div>
            </div>

            <div 
              onClick={() => {
                const overdue = settlements.filter(s => s.daysOverdue && s.daysOverdue > 30);
                setDetailPanelSettlements(overdue);
                setDetailPanelTitle('연체 정산 (30일 이상)');
              }}
              className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm cursor-pointer hover:border-[#B94A48] hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#5B6773] mb-1">연체금액</p>
                  <p className="text-2xl font-bold text-[#B94A48] mb-1">{formatCurrency(overdueAmount)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 text-[#B94A48]" />
                    <p className="text-xs text-[#B94A48]">30일 이상</p>
                  </div>
                </div>
                <AlertCircle className="w-10 h-10 text-[#B94A48] opacity-20" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Unpaid Balance Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-[#D7DEE6] shadow-sm">
                <div className="px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F]">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    미수금 현황
                  </h3>
                </div>
                <div className="p-6 max-h-[500px] overflow-y-auto">
                  {overdueSettlements.length > 0 ? (
                    <div className="space-y-3">
                      {overdueSettlements.map((settlement) => (
                        <div 
                          key={settlement.settlementNumber}
                          className={`p-4 rounded-lg border-l-4 ${
                            settlement.daysOverdue && settlement.daysOverdue > 30
                              ? 'border-[#B94A48] bg-[#FCEBE9]'
                              : 'border-[#C58A2B] bg-[#FFF4E5]'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-sm font-bold text-[#18212B]">{settlement.clientName}</p>
                              <p className="text-xs text-[#5B6773] mt-0.5">{settlement.period}</p>
                            </div>
                            {settlement.daysOverdue && settlement.daysOverdue > 0 && (
                              <span className={`text-xs font-bold px-2 py-1 rounded ${
                                settlement.daysOverdue > 30
                                  ? 'bg-[#B94A48] text-white'
                                  : 'bg-[#C58A2B] text-white'
                              }`}>
                                D+{settlement.daysOverdue}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-[#5B6773]">미수금</span>
                            <span className="text-base font-bold text-[#B94A48]">
                              {formatCurrency(settlement.unpaidAmount)}원
                            </span>
                          </div>
                          <div className="mt-2 pt-2 border-t border-[#D7DEE6]">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#5B6773]">수금률</span>
                              <span className="font-semibold text-[#18212B]">
                                {getPaymentRate(settlement.receivedAmount, settlement.totalAmount)}%
                              </span>
                            </div>
                            <div className="mt-1.5 bg-white rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="h-full bg-[#C58A2B]"
                                style={{ width: `${getPaymentRate(settlement.receivedAmount, settlement.totalAmount)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle2 className="w-12 h-12 text-[#2E7D5B] mx-auto mb-3 opacity-50" />
                      <p className="text-sm font-semibold text-[#2E7D5B]">미수금이 없습니다</p>
                      <p className="text-xs text-[#5B6773] mt-1">모든 정산이 완료되었습니다</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Settlement Table */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-[#D7DEE6] shadow-sm">
                {/* Table Header */}
                <div className="px-6 py-4 border-b border-[#D7DEE6] bg-[#F4F7FA]">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1 lg:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6773]" />
                        <input
                          type="text"
                          placeholder="정산번호, 거래처 검색..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-[#5B6773]" />
                        <select
                          value={periodFilter}
                          onChange={(e) => setPeriodFilter(e.target.value)}
                          className="px-3 py-2 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                        >
                          <option value="전체">전체 기간</option>
                          <option value="2026년 2월">2026년 2월</option>
                          <option value="2026년 1월">2026년 1월</option>
                          <option value="2025년 12월">2025년 12월</option>
                        </select>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="px-3 py-2 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                        >
                          <option value="전체">전체 상태</option>
                          <option value="완납">완납</option>
                          <option value="미수">미수</option>
                          <option value="미납">미납</option>
                          <option value="연체">연체</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 border border-[#D7DEE6] rounded-md text-[#5B6773] hover:bg-white transition-colors text-sm font-semibold">
                        <Download className="w-4 h-4" />
                        내보내기
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors text-sm font-semibold">
                        <FileText className="w-4 h-4" />
                        정산서 발행
                      </button>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  {/* Mobile Card View */}
                  <div className="lg:hidden p-4 space-y-3">
                    {filteredSettlements.map((settlement) => (
                      <div 
                        key={settlement.settlementNumber}
                        className="border border-[#D7DEE6] rounded-lg p-4 hover:bg-[#F4F7FA] transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="text-xs font-bold text-[#163A5F] mb-1">{settlement.settlementNumber}</p>
                            <p className="text-sm font-semibold text-[#18212B] mb-1">{settlement.clientName}</p>
                            <p className="text-xs text-[#5B6773]">{settlement.period}</p>
                          </div>
                          <StatusBadge status={settlement.status} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mb-3 pt-3 border-t border-[#D7DEE6]">
                          <div>
                            <p className="text-[10px] text-[#5B6773] mb-0.5">공급가액</p>
                            <p className="text-sm font-semibold text-[#18212B]">{formatCurrency(settlement.supplyAmount)}원</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-[#5B6773] mb-0.5">부가세</p>
                            <p className="text-sm text-[#5B6773]">{formatCurrency(settlement.taxAmount)}원</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-[#5B6773] mb-0.5">총금액</p>
                            <p className="text-sm font-bold text-[#18212B]">{formatCurrency(settlement.totalAmount)}원</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-[#5B6773] mb-0.5">수금액</p>
                            <p className="text-sm font-bold text-[#2E7D5B]">{formatCurrency(settlement.receivedAmount)}원</p>
                          </div>
                        </div>
                        
                        <div className="pt-3 border-t border-[#D7DEE6]">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-[#5B6773]">미수금</p>
                            <p className="text-lg font-bold text-[#B94A48]">{formatCurrency(settlement.unpaidAmount)}원</p>
                          </div>
                        </div>
                        
                        <button className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors text-sm">
                          <Eye className="w-4 h-4" />
                          상세보기
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <table className="w-full hidden lg:table">
                    <thead>
                      <tr className="border-b-2 border-[#D7DEE6] bg-[#163A5F]">
                        <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[110px]">정산번호</th>
                        <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[130px]">거래처명</th>
                        <th className="text-center py-3 px-3 text-xs font-bold text-white min-w-[90px]">기간</th>
                        <th className="text-right py-3 px-3 text-xs font-bold text-white min-w-[110px]">공급가액</th>
                        <th className="text-right py-3 px-3 text-xs font-bold text-white min-w-[90px]">부가세</th>
                        <th className="text-right py-3 px-3 text-xs font-bold text-white min-w-[110px]">총금액</th>
                        <th className="text-right py-3 px-3 text-xs font-bold text-white min-w-[110px]">수금액</th>
                        <th className="text-right py-3 px-3 text-xs font-bold text-white min-w-[110px]">미수금</th>
                        <th className="text-center py-3 px-3 text-xs font-bold text-white min-w-[90px]">정산상태</th>
                        <th className="text-center py-3 px-3 text-xs font-bold text-white min-w-[60px]">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSettlements.map((settlement) => (
                        <tr key={settlement.settlementNumber} className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors">
                          <td className="py-3 px-3 text-xs font-semibold text-[#163A5F]">{settlement.settlementNumber}</td>
                          <td className="py-3 px-3 text-xs font-semibold text-[#18212B]">{settlement.clientName}</td>
                          <td className="py-3 px-3 text-xs text-center text-[#5B6773]">{settlement.period}</td>
                          <td className="py-3 px-3 text-xs text-right font-semibold text-[#18212B]">
                            {formatCurrency(settlement.supplyAmount)}
                          </td>
                          <td className="py-3 px-3 text-xs text-right text-[#5B6773]">
                            {formatCurrency(settlement.taxAmount)}
                          </td>
                          <td className="py-3 px-3 text-xs text-right font-bold text-[#18212B]">
                            {formatCurrency(settlement.totalAmount)}
                          </td>
                          <td className="py-3 px-3 text-xs text-right font-bold text-[#2E7D5B]">
                            {formatCurrency(settlement.receivedAmount)}
                          </td>
                          <td className="py-3 px-3 text-xs text-right font-bold text-[#B94A48]">
                            {formatCurrency(settlement.unpaidAmount)}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <StatusBadge status={settlement.status} />
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button className="p-1 hover:bg-[#E8EEF3] rounded transition-colors" title="상세보기">
                              <Eye className="w-4 h-4 text-[#5B6773]" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-[#D7DEE6] flex items-center justify-between bg-[#F4F7FA]">
                  <p className="text-sm text-[#5B6773]">
                    전체 {filteredSettlements.length}건
                  </p>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 border border-[#D7DEE6] rounded text-sm text-[#5B6773] hover:bg-white transition-colors">
                      이전
                    </button>
                    <button className="px-3 py-1.5 bg-[#163A5F] text-white rounded text-sm">1</button>
                    <button className="px-3 py-1.5 border border-[#D7DEE6] rounded text-sm text-[#5B6773] hover:bg-white transition-colors">
                      다음
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Settlement Detail Panel */}
      <SettlementDetailPanel
        isOpen={!!detailPanelSettlements}
        settlements={detailPanelSettlements}
        title={detailPanelTitle}
        onClose={() => setDetailPanelSettlements(null)}
      />
    </div>
  );
}