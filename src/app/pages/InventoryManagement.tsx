import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { InventoryDetailPanel } from "../components/InventoryDetailPanel";
import { StatusBadge } from "../components/StatusBadge";
import { 
  Search, 
  Filter, 
  Download, 
  AlertTriangle,
  Package,
  Calendar,
  Eye,
  RefreshCw,
  FileText
} from "lucide-react";

interface InventoryItem {
  productCode: string;
  productName: string;
  modelName: string;
  lotNumber: string;
  serialNumber: string;
  receivedDate: string;
  manufactureDate: string;
  expiryDate: string;
  warehouse: string;
  currentQty: number;
  reservedQty: number;
  availableQty: number;
  status: string;
  daysUntilExpiry: number;
}

export function InventoryManagement() {
  const [activeMenu, setActiveMenu] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [lotSearch, setLotSearch] = useState('');
  const [serialSearch, setSerialSearch] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('전체');
  const [expiryFilter, setExpiryFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [detailPanelItems, setDetailPanelItems] = useState<InventoryItem[] | null>(null);
  const [detailPanelTitle, setDetailPanelTitle] = useState('');

  // Mock data
  const inventoryItems: InventoryItem[] = [
    {
      productCode: 'PRD-2024-002',
      productName: 'MRI 조영제 10ml',
      modelName: 'MRC-10',
      lotNumber: 'LOT-2025-A123',
      serialNumber: '-',
      receivedDate: '2025-12-15',
      manufactureDate: '2025-12-01',
      expiryDate: '2026-12-01',
      warehouse: '본사창고',
      currentQty: 240,
      reservedQty: 50,
      availableQty: 190,
      status: '정상',
      daysUntilExpiry: 274
    },
    {
      productCode: 'PRD-2024-006',
      productName: 'CT 조영제 50ml',
      modelName: 'CTC-50',
      lotNumber: 'LOT-2025-B456',
      serialNumber: '-',
      receivedDate: '2026-01-10',
      manufactureDate: '2026-01-05',
      expiryDate: '2026-04-15',
      warehouse: '본사창고',
      currentQty: 180,
      reservedQty: 30,
      availableQty: 150,
      status: '만료임박',
      daysUntilExpiry: 44
    },
    {
      productCode: 'PRD-2024-001',
      productName: '초음파 프로브 A3',
      modelName: 'USP-A300',
      lotNumber: 'LOT-2024-C789',
      serialNumber: 'SN-US-001234',
      receivedDate: '2024-11-20',
      manufactureDate: '2024-11-01',
      expiryDate: '-',
      warehouse: '본사창고',
      currentQty: 15,
      reservedQty: 2,
      availableQty: 13,
      status: '정상',
      daysUntilExpiry: 9999
    },
    {
      productCode: 'PRD-2024-007',
      productName: '일회용 주사기 5ml',
      modelName: 'SYR-5',
      lotNumber: 'LOT-2024-D321',
      serialNumber: '-',
      receivedDate: '2024-06-01',
      manufactureDate: '2024-05-15',
      expiryDate: '2026-05-15',
      warehouse: '본사창고',
      currentQty: 5000,
      reservedQty: 500,
      availableQty: 4500,
      status: '정상',
      daysUntilExpiry: 439
    },
    {
      productCode: 'PRD-2024-004',
      productName: '혈압계 BP-200',
      modelName: 'BP-200',
      lotNumber: 'LOT-2024-E654',
      serialNumber: 'SN-BP-005678',
      receivedDate: '2025-02-10',
      manufactureDate: '2025-01-20',
      expiryDate: '-',
      warehouse: '지점창고',
      currentQty: 32,
      reservedQty: 5,
      availableQty: 27,
      status: '정상',
      daysUntilExpiry: 9999
    },
    {
      productCode: 'PRD-2024-005',
      productName: '심전도기 ECG-500',
      modelName: 'ECG-500',
      lotNumber: 'LOT-2024-F987',
      serialNumber: 'SN-ECG-009012',
      receivedDate: '2025-03-15',
      manufactureDate: '2025-02-28',
      expiryDate: '-',
      warehouse: '지점창고',
      currentQty: 5,
      reservedQty: 1,
      availableQty: 4,
      status: '재고부족',
      daysUntilExpiry: 9999
    },
    {
      productCode: 'PRD-2024-002',
      productName: 'MRI 조영제 10ml',
      modelName: 'MRC-10',
      lotNumber: 'LOT-2024-G111',
      serialNumber: '-',
      receivedDate: '2024-04-20',
      manufactureDate: '2024-04-01',
      expiryDate: '2026-04-01',
      warehouse: '본사창고',
      currentQty: 85,
      reservedQty: 15,
      availableQty: 70,
      status: '만료임박',
      daysUntilExpiry: 30
    },
    {
      productCode: 'PRD-2024-010',
      productName: '인공관절 무릎',
      modelName: 'KJ-PRO',
      lotNumber: 'LOT-2025-H222',
      serialNumber: 'SN-KJ-003456',
      receivedDate: '2025-11-05',
      manufactureDate: '2025-10-15',
      expiryDate: '-',
      warehouse: '본사창고',
      currentQty: 12,
      reservedQty: 3,
      availableQty: 9,
      status: '정상',
      daysUntilExpiry: 9999
    },
    {
      productCode: 'PRD-2024-006',
      productName: 'CT 조영제 50ml',
      modelName: 'CTC-50',
      lotNumber: 'LOT-2024-I333',
      serialNumber: '-',
      receivedDate: '2024-03-10',
      manufactureDate: '2024-03-01',
      expiryDate: '2026-03-10',
      warehouse: '지점창고',
      currentQty: 45,
      reservedQty: 10,
      availableQty: 35,
      status: '만료임박',
      daysUntilExpiry: 8
    },
    {
      productCode: 'PRD-2024-003',
      productName: '수술용 가위 세트',
      modelName: 'SS-PRO',
      lotNumber: 'LOT-2024-J444',
      serialNumber: 'SN-SS-007890',
      receivedDate: '2025-01-15',
      manufactureDate: '2024-12-20',
      expiryDate: '-',
      warehouse: '본사창고',
      currentQty: 8,
      reservedQty: 3,
      availableQty: 5,
      status: '재고부족',
      daysUntilExpiry: 9999
    },
  ];

  // Calculate alert counts
  const expiring30Days = inventoryItems.filter(item => item.daysUntilExpiry <= 30 && item.daysUntilExpiry > 0).length;
  const expiring60Days = inventoryItems.filter(item => item.daysUntilExpiry > 30 && item.daysUntilExpiry <= 60).length;
  const expiring90Days = inventoryItems.filter(item => item.daysUntilExpiry > 60 && item.daysUntilExpiry <= 90).length;
  const lowStock = inventoryItems.filter(item => item.status === '재고부족').length;

  // Filter data
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = 
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.modelName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLot = lotSearch === '' || item.lotNumber.toLowerCase().includes(lotSearch.toLowerCase());
    const matchesSerial = serialSearch === '' || item.serialNumber.toLowerCase().includes(serialSearch.toLowerCase());
    const matchesWarehouse = selectedWarehouse === '전체' || item.warehouse === selectedWarehouse;
    const matchesStatus = statusFilter === '전체' || item.status === statusFilter;
    
    let matchesExpiry = true;
    if (expiryFilter === '30일 이내') {
      matchesExpiry = item.daysUntilExpiry <= 30 && item.daysUntilExpiry > 0;
    } else if (expiryFilter === '60일 이내') {
      matchesExpiry = item.daysUntilExpiry <= 60 && item.daysUntilExpiry > 0;
    } else if (expiryFilter === '90일 이내') {
      matchesExpiry = item.daysUntilExpiry <= 90 && item.daysUntilExpiry > 0;
    }
    
    return matchesSearch && matchesLot && matchesSerial && matchesWarehouse && matchesStatus && matchesExpiry;
  });

  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  const getExpiryColor = (days: number) => {
    if (days <= 30) return 'text-[#B94A48] font-bold';
    if (days <= 60) return 'text-[#C58A2B] font-semibold';
    if (days <= 90) return 'text-[#C58A2B]';
    return 'text-[#18212B]';
  };

  const getExpiryBadge = (days: number, date: string) => {
    if (date === '-') return <span className="text-[#5B6773]">-</span>;
    if (days <= 30) return <span className="text-[#B94A48] font-bold">{date} (D-{days})</span>;
    if (days <= 60) return <span className="text-[#C58A2B] font-semibold">{date} (D-{days})</span>;
    if (days <= 90) return <span className="text-[#C58A2B]">{date} (D-{days})</span>;
    return <span className="text-[#18212B]">{date}</span>;
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#18212B] mb-2">재고 관리</h1>
            <p className="text-[#5B6773]">로트/시리얼/유효기간 추적 관리</p>
          </div>

          {/* Alert Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div 
              onClick={() => {
                const items = inventoryItems.filter(item => item.daysUntilExpiry <= 30 && item.daysUntilExpiry > 0);
                setDetailPanelItems(items);
                setDetailPanelTitle('30일 이내 만료 품목 (긴급)');
              }}
              className="bg-white rounded-lg border-l-4 border-[#B94A48] p-5 shadow-sm cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-[#B94A48]" />
                    <p className="text-sm font-bold text-[#B94A48]">긴급</p>
                  </div>
                  <p className="text-2xl font-bold text-[#18212B] mb-1">{expiring30Days}건</p>
                  <p className="text-sm text-[#5B6773]">30일 이내 만료</p>
                </div>
                <Calendar className="w-8 h-8 text-[#B94A48] opacity-20" />
              </div>
            </div>

            <div 
              onClick={() => {
                const items = inventoryItems.filter(item => item.daysUntilExpiry > 30 && item.daysUntilExpiry <= 60);
                setDetailPanelItems(items);
                setDetailPanelTitle('60일 이내 만료 품목 (주의)');
              }}
              className="bg-white rounded-lg border-l-4 border-[#C58A2B] p-5 shadow-sm cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-[#C58A2B]" />
                    <p className="text-sm font-bold text-[#C58A2B]">주의</p>
                  </div>
                  <p className="text-2xl font-bold text-[#18212B] mb-1">{expiring60Days}건</p>
                  <p className="text-sm text-[#5B6773]">60일 이내 만료</p>
                </div>
                <Calendar className="w-8 h-8 text-[#C58A2B] opacity-20" />
              </div>
            </div>

            <div 
              onClick={() => {
                const items = inventoryItems.filter(item => item.daysUntilExpiry > 60 && item.daysUntilExpiry <= 90);
                setDetailPanelItems(items);
                setDetailPanelTitle('90일 이내 만료 품목 (관찰)');
              }}
              className="bg-white rounded-lg border-l-4 border-[#5B8DB8] p-5 shadow-sm cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-[#5B8DB8]" />
                    <p className="text-sm font-bold text-[#5B8DB8]">관찰</p>
                  </div>
                  <p className="text-2xl font-bold text-[#18212B] mb-1">{expiring90Days}건</p>
                  <p className="text-sm text-[#5B6773]">90일 이내 만료</p>
                </div>
                <Calendar className="w-8 h-8 text-[#5B8DB8] opacity-20" />
              </div>
            </div>

            <div 
              onClick={() => {
                const items = inventoryItems.filter(item => item.status === '재고부족');
                setDetailPanelItems(items);
                setDetailPanelTitle('재고 부족 품목');
              }}
              className="bg-white rounded-lg border-l-4 border-[#163A5F] p-5 shadow-sm cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-[#163A5F]" />
                    <p className="text-sm font-bold text-[#163A5F]">재고</p>
                  </div>
                  <p className="text-2xl font-bold text-[#18212B] mb-1">{lowStock}건</p>
                  <p className="text-sm text-[#5B6773]">재고 부족</p>
                </div>
                <Package className="w-8 h-8 text-[#163A5F] opacity-20" />
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg border border-[#D7DEE6] shadow-sm">
            {/* Filters */}
            <div className="px-6 py-5 border-b border-[#D7DEE6] bg-[#F4F7FA]">
              <div className="space-y-4">
                {/* First Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#18212B] mb-1.5">창고 선택</label>
                    <select
                      value={selectedWarehouse}
                      onChange={(e) => setSelectedWarehouse(e.target.value)}
                      className="w-full px-3 py-2 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    >
                      <option value="전체">전체 창고</option>
                      <option value="본사창고">본사창고</option>
                      <option value="지점창고">지점창고</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#18212B] mb-1.5">유효기간 필터</label>
                    <select
                      value={expiryFilter}
                      onChange={(e) => setExpiryFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    >
                      <option value="전체">전체</option>
                      <option value="30일 이내">30일 이내 만료</option>
                      <option value="60일 이내">60일 이내 만료</option>
                      <option value="90일 이내">90일 이내 만료</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#18212B] mb-1.5">상태 필터</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    >
                      <option value="전체">전체 상태</option>
                      <option value="정상">정상</option>
                      <option value="재고부족">재고부족</option>
                      <option value="만료임박">만료임박</option>
                    </select>
                  </div>

                  <div className="flex items-end gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors text-sm font-semibold">
                      <RefreshCw className="w-4 h-4" />
                      새로고침
                    </button>
                    <button className="px-4 py-2 border border-[#D7DEE6] rounded-md text-[#5B6773] hover:bg-white transition-colors text-sm">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="relative">
                    <label className="block text-xs font-semibold text-[#18212B] mb-1.5">품목 검색</label>
                    <Search className="absolute left-3 bottom-2.5 w-4 h-4 text-[#5B6773]" />
                    <input
                      type="text"
                      placeholder="품목명, 코드, 모델명..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-xs font-semibold text-[#18212B] mb-1.5">로트번호 검색</label>
                    <Search className="absolute left-3 bottom-2.5 w-4 h-4 text-[#5B6773]" />
                    <input
                      type="text"
                      placeholder="LOT-0000-A000"
                      value={lotSearch}
                      onChange={(e) => setLotSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-xs font-semibold text-[#18212B] mb-1.5">시리얼번호 검색</label>
                    <Search className="absolute left-3 bottom-2.5 w-4 h-4 text-[#5B6773]" />
                    <input
                      type="text"
                      placeholder="SN-XX-000000"
                      value={serialSearch}
                      onChange={(e) => setSerialSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {/* Mobile Card View */}
              <div className="lg:hidden p-4 space-y-3">
                {filteredItems.map((item, index) => (
                  <div 
                    key={`${item.productCode}-${item.lotNumber}-${index}`}
                    className="border border-[#D7DEE6] rounded-lg p-4 hover:bg-[#F4F7FA] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-xs font-bold text-[#163A5F] mb-1">{item.productCode}</p>
                        <p className="text-sm font-semibold text-[#18212B] mb-1">{item.productName}</p>
                        <p className="text-xs text-[#5B6773]">{item.modelName}</p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3 pt-3 border-t border-[#D7DEE6]">
                      <div>
                        <p className="text-[10px] text-[#5B6773] mb-0.5">로트번호</p>
                        <p className="text-xs font-mono font-semibold text-[#18212B]">{item.lotNumber}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#5B6773] mb-0.5">시리얼번호</p>
                        <p className="text-xs font-mono text-[#5B6773]">{item.serialNumber}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#5B6773] mb-0.5">창고</p>
                        <p className="text-xs text-[#18212B]">{item.warehouse}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#5B6773] mb-0.5">유효기간</p>
                        <p className="text-xs">{getExpiryBadge(item.daysUntilExpiry, item.expiryDate)}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#D7DEE6]">
                      <div className="text-center">
                        <p className="text-[10px] text-[#5B6773] mb-0.5">현재</p>
                        <p className="text-sm font-semibold text-[#18212B]">{formatNumber(item.currentQty)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-[#5B6773] mb-0.5">예약</p>
                        <p className="text-sm font-semibold text-[#C58A2B]">{formatNumber(item.reservedQty)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-[#5B6773] mb-0.5">가용</p>
                        <p className="text-sm font-bold text-[#2E7D5B]">{formatNumber(item.availableQty)}</p>
                      </div>
                    </div>
                    
                    <button className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-[#F4F7FA] border border-[#D7DEE6] rounded-md text-sm text-[#5B6773] hover:bg-white transition-colors">
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
                    <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[110px]">품목코드</th>
                    <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[180px]">품목명</th>
                    <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[100px]">모델명</th>
                    <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[130px]">로트번호</th>
                    <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[130px]">시리얼번호</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-white min-w-[95px]">입고일</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-white min-w-[95px]">제조일</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-white min-w-[140px]">유효기간</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-white min-w-[90px]">창고</th>
                    <th className="text-right py-3 px-3 text-xs font-bold text-white min-w-[80px]">현재수량</th>
                    <th className="text-right py-3 px-3 text-xs font-bold text-white min-w-[80px]">예약수량</th>
                    <th className="text-right py-3 px-3 text-xs font-bold text-white min-w-[80px]">가용수량</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-white min-w-[90px]">상태</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-white min-w-[60px]">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, index) => (
                    <tr 
                      key={`${item.productCode}-${item.lotNumber}-${index}`} 
                      className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors"
                    >
                      <td className="py-3 px-3 text-xs font-semibold text-[#163A5F]">{item.productCode}</td>
                      <td className="py-3 px-3 text-xs font-semibold text-[#18212B]">{item.productName}</td>
                      <td className="py-3 px-3 text-xs text-[#5B6773]">{item.modelName}</td>
                      <td className="py-3 px-3 text-xs font-mono font-semibold text-[#18212B]">{item.lotNumber}</td>
                      <td className="py-3 px-3 text-xs font-mono text-[#5B6773]">{item.serialNumber}</td>
                      <td className="py-3 px-3 text-xs text-center text-[#5B6773]">{item.receivedDate}</td>
                      <td className="py-3 px-3 text-xs text-center text-[#5B6773]">{item.manufactureDate}</td>
                      <td className="py-3 px-3 text-xs text-center">
                        {getExpiryBadge(item.daysUntilExpiry, item.expiryDate)}
                      </td>
                      <td className="py-3 px-3 text-xs text-center text-[#18212B]">{item.warehouse}</td>
                      <td className="py-3 px-3 text-xs text-right font-semibold text-[#18212B]">{formatNumber(item.currentQty)}</td>
                      <td className="py-3 px-3 text-xs text-right text-[#C58A2B]">{formatNumber(item.reservedQty)}</td>
                      <td className="py-3 px-3 text-xs text-right font-bold text-[#2E7D5B]">{formatNumber(item.availableQty)}</td>
                      <td className="py-3 px-3 text-center">
                        <StatusBadge status={item.status} />
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
                전체 {filteredItems.length}개 재고 항목
              </p>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 border border-[#D7DEE6] rounded-md text-[#5B6773] hover:bg-white transition-colors text-sm font-semibold">
                  <FileText className="w-4 h-4" />
                  재고 보고서
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Inventory Detail Panel */}
      <InventoryDetailPanel
        isOpen={!!detailPanelItems}
        items={detailPanelItems}
        title={detailPanelTitle}
        onClose={() => setDetailPanelItems(null)}
      />
    </div>
  );
}