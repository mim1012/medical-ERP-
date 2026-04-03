import { useState } from "react";
import { useReceiving, useCreateReceiving, useUpdateReceiving } from "../../hooks/use-receiving";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { PurchaseOrderForm } from "../components/PurchaseOrderForm";
import { ReceivingForm } from "../components/ReceivingForm";
import { ReceivingDetailPanel } from "../components/ReceivingDetailPanel";
import { StockShortageModal } from "../components/StockShortageModal";
import { StatusBadge } from "../components/StatusBadge";
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit,
  PackageCheck,
  FileText,
  Calendar,
  ShoppingCart,
  PackageOpen,
  AlertCircle
} from "lucide-react";

interface PurchaseOrder {
  poNumber: string;
  orderDate: string;
  supplier: string;
  manager: string;
  expectedDate: string;
  totalAmount: number;
  items: number;
  status: string;
  receivedQty: number;
  totalQty: number;
}

export function ReceivingManagement() {
  const [activeMenu, setActiveMenu] = useState('receiving');
  const [activeTab, setActiveTab] = useState<'purchase' | 'receiving'>('purchase');
  const [isPOFormOpen, setIsPOFormOpen] = useState(false);
  const [isReceivingFormOpen, setIsReceivingFormOpen] = useState(false);
  const [isStockShortageOpen, setIsStockShortageOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [detailPanelOrders, setDetailPanelOrders] = useState<PurchaseOrder[] | null>(null);
  const [detailPanelTitle, setDetailPanelTitle] = useState('');

  const { data: purchaseOrders = [], isLoading, error } = useReceiving({ search: searchTerm });
  const createReceiving = useCreateReceiving();
  const updateReceiving = useUpdateReceiving();


  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = 
      order.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.manager.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '전체' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handlePOFormSubmit = (data: any) => {
    console.log('PO submitted:', data);
    setIsPOFormOpen(false);
    setSelectedPO(null);
  };

  const handleReceivingSubmit = (data: any) => {
    console.log('Receiving submitted:', data);
    setIsReceivingFormOpen(false);
    setSelectedPO(null);
  };

  const handleStockShortageSelect = (stockShortageItems: any[]) => {
    console.log('Stock shortage items:', stockShortageItems);
    
    // 재고 부족 품목이 있으면 자동 발주서 생성 알림
    if (stockShortageItems.length > 0) {
      alert(`✅ 재고 부족 품목 선택 완료!\n\n📦 재고부족 ${stockShortageItems.length}개 품목에 대한 발주서가 자동 생성되었습니다.\n\n부족 품목:\n${stockShortageItems.map((item: any) => `• ${item.productName}: ${item.quantity}개 부족`).join('\n')}`);
    } else {
      alert(`✅ 모든 품목의 재고가 충분합니다.`);
    }
    
    setIsStockShortageOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR');
  };

  const getProgressPercentage = (received: number, total: number) => {
    return total > 0 ? Math.round((received / total) * 100) : 0;
  };

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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#18212B] mb-2">입고/발주 관리</h1>
            <p className="text-[#5B6773]">발주서 작성 및 입고 처리를 관리합니다</p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-[#D7DEE6]">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab('purchase')}
                  className={`flex items-center gap-2 px-6 py-3 font-bold transition-all relative ${
                    activeTab === 'purchase'
                      ? 'text-[#163A5F] bg-white border-t-4 border-[#163A5F]'
                      : 'text-[#5B6773] hover:text-[#163A5F] hover:bg-[#F4F7FA]'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>발주 관리</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === 'purchase' 
                      ? 'bg-[#163A5F] text-white' 
                      : 'bg-[#D7DEE6] text-[#5B6773]'
                  }`}>
                    {purchaseOrders.filter(p => p.status === '발주완료' || p.status === '지연').length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('receiving')}
                  className={`flex items-center gap-2 px-6 py-3 font-bold transition-all relative ${
                    activeTab === 'receiving'
                      ? 'text-[#2E7D5B] bg-white border-t-4 border-[#2E7D5B]'
                      : 'text-[#5B6773] hover:text-[#2E7D5B] hover:bg-[#F4F7FA]'
                  }`}
                >
                  <PackageOpen className="w-5 h-5" />
                  <span>입고 처리</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === 'receiving' 
                      ? 'bg-[#2E7D5B] text-white' 
                      : 'bg-[#D7DEE6] text-[#5B6773]'
                  }`}>
                    {purchaseOrders.filter(p => p.status === '부분입고').length}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards - Different for each tab */}
          {activeTab === 'purchase' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div 
                onClick={() => {
                  setDetailPanelOrders(purchaseOrders);
                  setDetailPanelTitle('전체 발주 내역');
                }}
                className="bg-gradient-to-br from-[#163A5F] to-[#0F2942] rounded-lg p-6 shadow-md cursor-pointer hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-white/80 mb-1">총 발주건수</p>
                    <p className="text-3xl font-bold text-white">{purchaseOrders.length}</p>
                    <p className="text-xs text-white/70 mt-1">이번 달</p>
                  </div>
                  <ShoppingCart className="w-10 h-10 text-white/30" />
                </div>
              </div>
              <div 
                onClick={() => {
                  const items = purchaseOrders.filter(p => p.status === '발주완료');
                  setDetailPanelOrders(items);
                  setDetailPanelTitle('발주 완료 내역');
                }}
                className="bg-white rounded-lg border-2 border-[#5B8DB8] p-6 shadow-sm cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-[#5B6773] mb-1">발주 완료</p>
                    <p className="text-3xl font-bold text-[#5B8DB8]">{purchaseOrders.filter(p => p.status === '발주완료').length}</p>
                    <p className="text-xs text-[#5B8DB8] mt-1 font-semibold">입고 대기중</p>
                  </div>
                  <Calendar className="w-10 h-10 text-[#5B8DB8] opacity-30" />
                </div>
              </div>
              <div 
                onClick={() => {
                  const items = purchaseOrders.filter(p => p.status === '지연');
                  setDetailPanelOrders(items);
                  setDetailPanelTitle('지연 발주 내역');
                }}
                className="bg-white rounded-lg border-2 border-[#B94A48] p-6 shadow-sm cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-[#5B6773] mb-1">지연 건수</p>
                    <p className="text-3xl font-bold text-[#B94A48]">{purchaseOrders.filter(p => p.status === '지연').length}</p>
                    <p className="text-xs text-[#B94A48] mt-1 font-semibold">긴급 조치 필요</p>
                  </div>
                  <Calendar className="w-10 h-10 text-[#B94A48] opacity-30" />
                </div>
              </div>
              <div className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-[#5B6773] mb-1">총 발주금액</p>
                    <p className="text-2xl font-bold text-[#18212B]">
                      {formatCurrency(purchaseOrders.reduce((sum, p) => sum + p.totalAmount, 0))}원
                    </p>
                    <p className="text-xs text-[#5B6773] mt-1">이번 달</p>
                  </div>
                  <FileText className="w-10 h-10 text-[#163A5F] opacity-20" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'receiving' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div 
                onClick={() => {
                  const items = purchaseOrders.filter(p => p.status !== '입고완료');
                  setDetailPanelOrders(items);
                  setDetailPanelTitle('입고 대기 내역');
                }}
                className="bg-gradient-to-br from-[#2E7D5B] to-[#1E5A3D] rounded-lg p-6 shadow-md cursor-pointer hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-white/80 mb-1">입고 대기</p>
                    <p className="text-3xl font-bold text-white">
                      {purchaseOrders.filter(p => p.status !== '입고완료').length}
                    </p>
                    <p className="text-xs text-white/70 mt-1">처리 필요</p>
                  </div>
                  <PackageOpen className="w-10 h-10 text-white/30" />
                </div>
              </div>
              <div 
                onClick={() => {
                  const items = purchaseOrders.filter(p => p.status === '부분입고');
                  setDetailPanelOrders(items);
                  setDetailPanelTitle('부분 입고 내역');
                }}
                className="bg-white rounded-lg border-2 border-[#C58A2B] p-6 shadow-sm cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-[#5B6773] mb-1">부분 입고</p>
                    <p className="text-3xl font-bold text-[#C58A2B]">{purchaseOrders.filter(p => p.status === '부분입고').length}</p>
                    <p className="text-xs text-[#C58A2B] mt-1 font-semibold">진행중</p>
                  </div>
                  <PackageCheck className="w-10 h-10 text-[#C58A2B] opacity-30" />
                </div>
              </div>
              <div 
                onClick={() => {
                  const items = purchaseOrders.filter(p => p.status === '입고완료');
                  setDetailPanelOrders(items);
                  setDetailPanelTitle('입고 완료 내역');
                }}
                className="bg-white rounded-lg border-2 border-[#2E7D5B] p-6 shadow-sm cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-[#5B6773] mb-1">입고 완료</p>
                    <p className="text-3xl font-bold text-[#2E7D5B]">{purchaseOrders.filter(p => p.status === '입고완료').length}</p>
                    <p className="text-xs text-[#2E7D5B] mt-1 font-semibold">완료</p>
                  </div>
                  <PackageCheck className="w-10 h-10 text-[#2E7D5B] opacity-30" />
                </div>
              </div>
              <div className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-[#5B6773] mb-1">입고 진행률</p>
                    <p className="text-2xl font-bold text-[#18212B]">
                      {Math.round((purchaseOrders.filter(p => p.status === '입고완료').length / purchaseOrders.length) * 100)}%
                    </p>
                    <p className="text-xs text-[#5B6773] mt-1">전체 발주 대비</p>
                  </div>
                  <PackageCheck className="w-10 h-10 text-[#2E7D5B] opacity-20" />
                </div>
              </div>
            </div>
          )}

          {/* Table Section */}
          <div className="bg-white rounded-lg border border-[#D7DEE6] shadow-sm">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-[#D7DEE6]">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 lg:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5B6773]" />
                    <input
                      type="text"
                      placeholder="발주번호, 공급사, 담당자 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-[#5B6773]" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2.5 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    >
                      <option value="전체">전체 상태</option>
                      <option value="발주완료">발주완료</option>
                      <option value="부분입고">부분입고</option>
                      <option value="입고완료">입고완료</option>
                      <option value="지연">지연</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-[#D7DEE6] rounded-md text-[#5B6773] hover:bg-[#F4F7FA] transition-colors text-sm font-semibold">
                    <Download className="w-4 h-4" />
                    내보내기
                  </button>
                  <button
                    onClick={() => setIsStockShortageOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#5B8DB8] to-[#163A5F] text-white rounded-md hover:shadow-lg transition-all text-sm font-semibold"
                  >
                    <AlertCircle className="w-4 h-4" />
                    재고 부족 품목 발주
                  </button>
                  <button
                    onClick={() => setIsPOFormOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors text-sm font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    신규 발주서
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {/* Mobile Card View */}
              <div className="lg:hidden p-4 space-y-3">
                {filteredOrders.map((order) => {
                  const progress = getProgressPercentage(order.receivedQty, order.totalQty);
                  
                  return (
                    <div 
                      key={order.poNumber}
                      className="border border-[#D7DEE6] rounded-lg p-4 hover:bg-[#F4F7FA] transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-xs font-bold text-[#163A5F] mb-1">{order.poNumber}</p>
                          <p className="text-sm font-semibold text-[#18212B] mb-1">{order.supplier}</p>
                          <p className="text-xs text-[#5B6773]">담당: {order.manager}</p>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3 pt-3 border-t border-[#D7DEE6]">
                        <div>
                          <p className="text-[10px] text-[#5B6773] mb-0.5">발주일</p>
                          <p className="text-xs text-[#18212B]">{order.orderDate}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#5B6773] mb-0.5">입고예정일</p>
                          <p className="text-xs text-[#18212B]">{order.expectedDate}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#5B6773] mb-0.5">품목수</p>
                          <p className="text-sm font-semibold text-[#18212B]">{order.items}개</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#5B6773] mb-0.5">총발주금액</p>
                          <p className="text-sm font-semibold text-[#18212B]">{formatCurrency(order.totalAmount)}원</p>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t border-[#D7DEE6] mb-3">
                        <p className="text-[10px] text-[#5B6773] mb-1.5">입고 진행률</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-[#E8EEF3] rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full transition-all ${
                                progress === 100 ? 'bg-[#2E7D5B]' :
                                progress > 0 ? 'bg-[#5B8DB8]' :
                                'bg-[#D7DEE6]'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-[#5B6773] min-w-[45px]">
                            {progress}%
                          </span>
                        </div>
                        <p className="text-xs text-[#5B6773] text-right mt-1">
                          {order.receivedQty}/{order.totalQty}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#F4F7FA] border border-[#D7DEE6] rounded-md text-sm text-[#5B6773] hover:bg-white transition-colors">
                          <Eye className="w-4 h-4" />
                          상세
                        </button>
                        <button 
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => {
                            setSelectedPO(order);
                            setIsReceivingFormOpen(true);
                          }}
                          disabled={order.status === '입고완료'}
                        >
                          <PackageCheck className="w-4 h-4" />
                          입고처리
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <table className="w-full hidden lg:table">
                <thead>
                  <tr className="border-b-2 border-[#D7DEE6] bg-[#F4F7FA]">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#18212B] min-w-[120px]">발주번호</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#18212B] min-w-[100px]">발주일</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#18212B] min-w-[150px]">공급사</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#18212B] min-w-[100px]">담당자</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#18212B] min-w-[110px]">입고예정일</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#18212B] min-w-[80px]">품목수</th>
                    <th className="text-right py-4 px-4 text-sm font-semibold text-[#18212B] min-w-[130px]">총발주금액</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#18212B] min-w-[150px]">입고 진행률</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#18212B] min-w-[100px]">상태</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#18212B] min-w-[120px]">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const progress = getProgressPercentage(order.receivedQty, order.totalQty);
                    
                    return (
                      <tr key={order.poNumber} className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors">
                        <td className="py-4 px-4 text-sm font-semibold text-[#163A5F]">{order.poNumber}</td>
                        <td className="py-4 px-4 text-sm text-center text-[#5B6773]">{order.orderDate}</td>
                        <td className="py-4 px-4 text-sm font-semibold text-[#18212B]">{order.supplier}</td>
                        <td className="py-4 px-4 text-sm text-[#5B6773]">{order.manager}</td>
                        <td className="py-4 px-4 text-sm text-center text-[#5B6773]">{order.expectedDate}</td>
                        <td className="py-4 px-4 text-sm text-center font-semibold text-[#18212B]">{order.items}</td>
                        <td className="py-4 px-4 text-sm text-right font-semibold text-[#18212B]">
                          {formatCurrency(order.totalAmount)}원
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-[#E8EEF3] rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-full transition-all ${
                                  progress === 100 ? 'bg-[#2E7D5B]' :
                                  progress > 0 ? 'bg-[#5B8DB8]' :
                                  'bg-[#D7DEE6]'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-[#5B6773] min-w-[35px]">
                              {progress}%
                            </span>
                          </div>
                          <p className="text-xs text-[#5B6773] text-center mt-1">
                            {order.receivedQty}/{order.totalQty}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button className="p-1.5 hover:bg-[#E8EEF3] rounded transition-colors" title="상세보기">
                              <Eye className="w-4 h-4 text-[#5B6773]" />
                            </button>
                            <button 
                              className="p-1.5 hover:bg-[#E8EEF3] rounded transition-colors"
                              title="수정"
                              onClick={() => {
                                setSelectedPO(order);
                                setIsPOFormOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4 text-[#5B8DB8]" />
                            </button>
                            <button 
                              className="p-1.5 hover:bg-[#E8EEF3] rounded transition-colors"
                              title="입고처리"
                              onClick={() => {
                                setSelectedPO(order);
                                setIsReceivingFormOpen(true);
                              }}
                              disabled={order.status === '입고완료'}
                            >
                              <PackageCheck className="w-4 h-4 text-[#2E7D5B]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-[#D7DEE6] flex items-center justify-between">
              <p className="text-sm text-[#5B6773]">
                전체 {filteredOrders.length}개 발주서
              </p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 border border-[#D7DEE6] rounded text-sm text-[#5B6773] hover:bg-[#F4F7FA] transition-colors">
                  이전
                </button>
                <button className="px-3 py-1.5 bg-[#163A5F] text-white rounded text-sm">1</button>
                <button className="px-3 py-1.5 border border-[#D7DEE6] rounded text-sm text-[#5B6773] hover:bg-[#F4F7FA] transition-colors">
                  2
                </button>
                <button className="px-3 py-1.5 border border-[#D7DEE6] rounded text-sm text-[#5B6773] hover:bg-[#F4F7FA] transition-colors">
                  다음
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Purchase Order Form Modal */}
      <PurchaseOrderForm
        isOpen={isPOFormOpen}
        onClose={() => {
          setIsPOFormOpen(false);
          setSelectedPO(null);
        }}
        onSubmit={handlePOFormSubmit}
        initialData={selectedPO}
      />

      {/* Receiving Form Side Drawer */}
      <ReceivingForm
        isOpen={isReceivingFormOpen}
        onClose={() => {
          setIsReceivingFormOpen(false);
          setSelectedPO(null);
        }}
        onSubmit={handleReceivingSubmit}
        purchaseOrder={selectedPO}
      />

      {/* Receiving Detail Panel */}
      <ReceivingDetailPanel
        isOpen={!!detailPanelOrders}
        orders={detailPanelOrders}
        title={detailPanelTitle}
        onClose={() => setDetailPanelOrders(null)}
      />

      {/* Stock Shortage Modal */}
      <StockShortageModal
        isOpen={isStockShortageOpen}
        onClose={() => setIsStockShortageOpen(false)}
        onCreatePurchaseOrder={handleStockShortageSelect}
      />
    </div>
  );
}