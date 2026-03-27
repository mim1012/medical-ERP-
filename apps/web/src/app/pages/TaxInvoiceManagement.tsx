import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { TaxInvoiceForm } from "../components/TaxInvoiceForm";
import { InspectorPanel } from "../components/InspectorPanel";
import { StatusBadge } from "../components/StatusBadge";
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  RefreshCw,
  DollarSign
} from "lucide-react";

interface TaxInvoice {
  invoiceNumber: string;
  clientName: string;
  businessNumber: string;
  issueMonth: string;
  shippingNumber: string;
  supplyAmount: number;
  taxAmount: number;
  totalAmount: number;
  issueDate: string;
  email: string;
  status: string;
  manager: string;
}

export function TaxInvoiceManagement() {
  const [activeMenu, setActiveMenu] = useState('invoice');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<TaxInvoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inspectorType, setInspectorType] = useState<'monthly-revenue' | 'tax-scheduled' | 'tax-completed' | 'tax-unissued' | 'tax-revision' | 'tax-error' | null>(null);

  // Mock data
  const invoices: TaxInvoice[] = [
    {
      invoiceNumber: 'INV-2026-0315',
      clientName: '서울대병원',
      businessNumber: '123-45-67890',
      issueMonth: '2026년 2월',
      shippingNumber: 'SHP-2026-0245',
      supplyAmount: 45000000,
      taxAmount: 4500000,
      totalAmount: 49500000,
      issueDate: '2026-03-01',
      email: 'accounting@snuh.org',
      status: '발행완료',
      manager: '강정산'
    },
    {
      invoiceNumber: 'INV-2026-0314',
      clientName: '삼성서울병원',
      businessNumber: '234-56-78901',
      issueMonth: '2026년 2월',
      shippingNumber: 'SHP-2026-0238',
      supplyAmount: 89000000,
      taxAmount: 8900000,
      totalAmount: 97900000,
      issueDate: '2026-03-01',
      email: 'tax@smc.or.kr',
      status: '발행완료',
      manager: '강정산'
    },
    {
      invoiceNumber: 'INV-2026-0313',
      clientName: '세브란스병원',
      businessNumber: '345-67-89012',
      issueMonth: '2026년 2월',
      shippingNumber: 'SHP-2026-0229',
      supplyAmount: 125000000,
      taxAmount: 12500000,
      totalAmount: 137500000,
      issueDate: '',
      email: 'finance@yuhs.ac',
      status: '발행대기',
      manager: '강정산'
    },
    {
      invoiceNumber: 'INV-2026-0312',
      clientName: '아산병원',
      businessNumber: '456-78-90123',
      issueMonth: '2026년 1월',
      shippingNumber: 'SHP-2026-0195',
      supplyAmount: 67500000,
      taxAmount: 6750000,
      totalAmount: 74250000,
      issueDate: '2026-02-01',
      email: 'tax@amc.seoul.kr',
      status: '발행완료',
      manager: '김경리'
    },
    {
      invoiceNumber: 'INV-2026-0311',
      clientName: '서울성모병원',
      businessNumber: '567-89-01234',
      issueMonth: '2026년 2월',
      shippingNumber: 'SHP-2026-0233',
      supplyAmount: 34000000,
      taxAmount: 3400000,
      totalAmount: 37400000,
      issueDate: '',
      email: 'acc@cmcseoul.or.kr',
      status: '미발행',
      manager: '이회계'
    },
    {
      invoiceNumber: 'INV-2026-0310',
      clientName: '강남세브란스',
      businessNumber: '678-90-12345',
      issueMonth: '2026년 2월',
      shippingNumber: 'SHP-2026-0241',
      supplyAmount: 28500000,
      taxAmount: 2850000,
      totalAmount: 31350000,
      issueDate: '',
      email: 'finance@gs.yuhs.ac',
      status: '발행대기',
      manager: '강정산'
    },
    {
      invoiceNumber: 'INV-2026-0309',
      clientName: '분당서울대병원',
      businessNumber: '789-01-23456',
      issueMonth: '2026년 2월',
      shippingNumber: 'SHP-2026-0236',
      supplyAmount: 15600000,
      taxAmount: 1560000,
      totalAmount: 17160000,
      issueDate: '2026-03-01',
      email: 'tax@snubh.org',
      status: '수정발행',
      manager: '김경리'
    },
    {
      invoiceNumber: 'INV-2026-0308',
      clientName: '고려대안암병원',
      businessNumber: '890-12-34567',
      issueMonth: '2026년 2월',
      shippingNumber: 'SHP-2026-0242',
      supplyAmount: 42300000,
      taxAmount: 4230000,
      totalAmount: 46530000,
      issueDate: '',
      email: 'accounting@kumc.or.kr',
      status: '발행오류',
      manager: '이회계'
    },
  ];

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.businessNumber.includes(searchTerm) ||
      inv.shippingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMonth = monthFilter === '전체' || inv.issueMonth === monthFilter;
    const matchesStatus = statusFilter === '전체' || inv.status === statusFilter;
    
    return matchesSearch && matchesMonth && matchesStatus;
  });

  const handleFormSubmit = (data: any) => {
    console.log('Tax invoice submitted:', data);
    setIsFormOpen(false);
    setSelectedInvoice(null);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR');
  };

  // Calculate statistics
  const scheduledCount = invoices.filter(i => i.status === '발행대기').length;
  const completedCount = invoices.filter(i => i.status === '발행완료').length;
  const unissuedCount = invoices.filter(i => i.status === '미발행').length;
  const revisionCount = invoices.filter(i => i.status === '수정발행').length;
  const errorCount = invoices.filter(i => i.status === '발행오류').length;

  const totalSupply = invoices.reduce((sum, inv) => sum + inv.supplyAmount, 0);
  const completedSupply = invoices.filter(i => i.status === '발행완료').reduce((sum, inv) => sum + inv.supplyAmount, 0);

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
            <h1 className="text-3xl font-bold text-[#18212B] mb-2">세금계산서 관리</h1>
            <p className="text-[#5B6773]">전자세금계산서 발행 및 관리</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
            <div 
              onClick={() => setInspectorType('tax-scheduled')}
              className="bg-white rounded-lg border border-[#D7DEE6] p-3 shadow-sm cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5 text-[#5B8DB8] flex-shrink-0" />
                    <p className="text-[10px] font-bold text-[#5B6773] uppercase tracking-wide truncate">발행 예정</p>
                  </div>
                  <p className="text-xl font-bold text-[#5B8DB8] leading-none mb-1">{scheduledCount}</p>
                  <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#E8EEF3] text-[#5B8DB8]">
                    대기중
                  </span>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setInspectorType('tax-completed')}
              className="bg-white rounded-lg border border-[#D7DEE6] p-3 shadow-sm cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D5B] flex-shrink-0" />
                    <p className="text-[10px] font-bold text-[#5B6773] uppercase tracking-wide truncate">발행 완료</p>
                  </div>
                  <p className="text-xl font-bold text-[#2E7D5B] leading-none mb-1">{completedCount}</p>
                  <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#E6F4EA] text-[#2E7D5B]">
                    완료
                  </span>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setInspectorType('tax-unissued')}
              className="bg-white rounded-lg border border-[#D7DEE6] p-3 shadow-sm cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <FileText className="w-3.5 h-3.5 text-[#C58A2B] flex-shrink-0" />
                    <p className="text-[10px] font-bold text-[#5B6773] uppercase tracking-wide truncate">미발행</p>
                  </div>
                  <p className="text-xl font-bold text-[#C58A2B] leading-none mb-1">{unissuedCount}</p>
                  <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FFF4E5] text-[#C58A2B]">
                    미발행
                  </span>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setInspectorType('tax-revision')}
              className="bg-white rounded-lg border border-[#D7DEE6] p-3 shadow-sm cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <RefreshCw className="w-3.5 h-3.5 text-[#7B4397] flex-shrink-0" />
                    <p className="text-[10px] font-bold text-[#5B6773] uppercase tracking-wide truncate">수정발행</p>
                  </div>
                  <p className="text-xl font-bold text-[#7B4397] leading-none mb-1">{revisionCount}</p>
                  <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#F5E6FF] text-[#7B4397]">
                    재발행
                  </span>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setInspectorType('tax-error')}
              className="bg-white rounded-lg border border-[#D7DEE6] p-3 shadow-sm cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <XCircle className="w-3.5 h-3.5 text-[#B94A48] flex-shrink-0" />
                    <p className="text-[10px] font-bold text-[#5B6773] uppercase tracking-wide truncate">발행오류</p>
                  </div>
                  <p className="text-xl font-bold text-[#B94A48] leading-none mb-1">{errorCount}</p>
                  <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FCEBE9] text-[#B94A48]">
                    오류
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div 
              onClick={() => setInspectorType('monthly-revenue')}
              className="bg-gradient-to-br from-[#163A5F] to-[#0F2942] rounded-lg p-3 shadow-sm text-white cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 opacity-70 flex-shrink-0" />
                <p className="text-[10px] font-bold opacity-90 uppercase tracking-wide truncate">총 발행 예정</p>
              </div>
              <p className="text-xl font-bold leading-none mb-1">{formatCurrency(totalSupply)}원</p>
              <p className="text-[9px] opacity-70">부가세 포함 {formatCurrency(totalSupply * 1.1)}원</p>
            </div>

            <div 
              onClick={() => setInspectorType('monthly-revenue')}
              className="bg-gradient-to-br from-[#2E7D5B] to-[#1F5A3F] rounded-lg p-3 shadow-sm text-white cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 opacity-70 flex-shrink-0" />
                <p className="text-[10px] font-bold opacity-90 uppercase tracking-wide truncate">발행 완료</p>
              </div>
              <p className="text-xl font-bold leading-none mb-1">{formatCurrency(completedSupply)}원</p>
              <p className="text-[9px] opacity-70">발행률 {totalSupply > 0 ? Math.round((completedSupply / totalSupply) * 100) : 0}%</p>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg border border-[#D7DEE6] shadow-sm">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-[#D7DEE6]">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 lg:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6773]" />
                    <input
                      type="text"
                      placeholder="거래처, 발행번호, 출고번호..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#5B6773]" />
                    <select
                      value={monthFilter}
                      onChange={(e) => setMonthFilter(e.target.value)}
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
                      <option value="발행대기">발행대기</option>
                      <option value="발행완료">발행완료</option>
                      <option value="미발행">미발행</option>
                      <option value="수정발">수정발행</option>
                      <option value="발행오류">발행오류</option>
                      <option value="취소">취소</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 border border-[#D7DEE6] rounded-md text-[#5B6773] hover:bg-[#F4F7FA] transition-colors text-sm font-semibold">
                    <Download className="w-4 h-4" />
                    내보내기
                  </button>
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors text-sm font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    계산서 발행
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#D7DEE6] bg-[#163A5F]">
                    <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[120px]">발행번호</th>
                    <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[130px]">거래처명</th>
                    <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[110px]">사업자번호</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-white min-w-[90px]">발행월</th>
                    <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[110px]">출고번호</th>
                    <th className="text-right py-3 px-3 text-xs font-bold text-white min-w-[100px]">공급가액</th>
                    <th className="text-right py-3 px-3 text-xs font-bold text-white min-w-[80px]">부가세</th>
                    <th className="text-right py-3 px-3 text-xs font-bold text-white min-w-[100px]">총액</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-white min-w-[90px]">발행일</th>
                    <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[150px]">수신 이메일</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-white min-w-[90px]">상태</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-white min-w-[70px]">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.invoiceNumber} className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors">
                      <td className="py-3 px-3 text-xs font-semibold text-[#163A5F]">{invoice.invoiceNumber}</td>
                      <td className="py-3 px-3 text-xs font-semibold text-[#18212B]">{invoice.clientName}</td>
                      <td className="py-3 px-3 text-xs text-[#5B6773] font-mono">{invoice.businessNumber}</td>
                      <td className="py-3 px-3 text-xs text-center text-[#5B6773]">{invoice.issueMonth}</td>
                      <td className="py-3 px-3 text-xs text-[#5B8DB8] font-semibold">{invoice.shippingNumber}</td>
                      <td className="py-3 px-3 text-xs text-right font-semibold text-[#18212B]">
                        {formatCurrency(invoice.supplyAmount)}
                      </td>
                      <td className="py-3 px-3 text-xs text-right text-[#5B6773]">
                        {formatCurrency(invoice.taxAmount)}
                      </td>
                      <td className="py-3 px-3 text-xs text-right font-bold text-[#18212B]">
                        {formatCurrency(invoice.totalAmount)}
                      </td>
                      <td className="py-3 px-3 text-xs text-center text-[#5B6773]">
                        {invoice.issueDate || '-'}
                      </td>
                      <td className="py-3 px-3 text-xs text-[#5B6773]">{invoice.email}</td>
                      <td className="py-3 px-3 text-center">
                        <StatusBadge status={invoice.status} />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1 hover:bg-[#E8EEF3] rounded transition-colors" title="미리보기">
                            <Eye className="w-4 h-4 text-[#5B6773]" />
                          </button>
                          <button 
                            className="p-1 hover:bg-[#E8EEF3] rounded transition-colors"
                            title="수정"
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setIsFormOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4 text-[#5B8DB8]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-[#D7DEE6]">
              {filteredInvoices.map((invoice) => (
                <div key={invoice.invoiceNumber} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[#163A5F] mb-1">{invoice.invoiceNumber}</p>
                      <h3 className="text-base font-bold text-[#18212B]">{invoice.clientName}</h3>
                      <p className="text-[10px] text-[#5B6773] mt-1 font-mono">{invoice.businessNumber}</p>
                    </div>
                    <StatusBadge status={invoice.status} />
                  </div>
                  
                  <div className="bg-[#F4F7FA] rounded-lg p-3 mb-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#5B6773]">출고번호</span>
                      <span className="font-semibold text-[#5B8DB8]">{invoice.shippingNumber}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#5B6773]">발행월</span>
                      <span className="font-semibold text-[#18212B]">{invoice.issueMonth}</span>
                    </div>
                    <div className="h-px bg-[#D7DEE6] my-1.5"></div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#5B6773]">공급가액</span>
                      <span className="font-semibold text-[#18212B]">{formatCurrency(invoice.supplyAmount)}원</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#5B6773]">부가세</span>
                      <span className="text-[#5B6773]">{formatCurrency(invoice.taxAmount)}원</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#5B6773]">총액</span>
                      <span className="text-base font-bold text-[#18212B]">{formatCurrency(invoice.totalAmount)}원</span>
                    </div>
                    <div className="h-px bg-[#D7DEE6] my-1.5"></div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#5B6773]">발행일</span>
                      <span className="font-semibold text-[#18212B]">{invoice.issueDate || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[#5B6773]">이메일</span>
                      <span className="text-[#5B6773] truncate ml-2">{invoice.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-[#D7DEE6] rounded-lg text-[#5B6773] hover:bg-[#F4F7FA] transition-colors text-sm">
                      <Eye className="w-4 h-4" />
                      미리보기
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setIsFormOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#163A5F] text-white rounded-lg hover:bg-[#0F2942] transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      수정
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-[#D7DEE6] flex items-center justify-between bg-[#F4F7FA]">
              <p className="text-sm text-[#5B6773]">
                전체 {filteredInvoices.length}건
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
      </main>

      {/* Tax Invoice Form Modal */}
      <TaxInvoiceForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedInvoice(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedInvoice}
      />

      {/* Inspector Panel */}
      <InspectorPanel
        isOpen={!!inspectorType}
        onClose={() => setInspectorType(null)}
        type={inspectorType}
      />
    </div>
  );
}