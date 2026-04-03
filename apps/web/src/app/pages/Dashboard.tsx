import { useState } from "react";
import { useDashboardStats } from "../../hooks/use-dashboard";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { KPICard } from "../components/KPICard";
import { AlertCard } from "../components/AlertCard";
import { StatusBadge } from "../components/StatusBadge";
import { InspectorPanel } from "../components/InspectorPanel";
import { 
  DollarSign, 
  Clock, 
  TruckIcon, 
  Wrench,
  AlertTriangle,
  Calendar,
  Package,
  FileX,
  BarChart3,
  ShoppingCart,
  Hash,
  FileWarning,
  Receipt,
  Upload
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAllShipments, setShowAllShipments] = useState(false);
  const [showAllService, setShowAllService] = useState(false);
  const [showAllDocuments, setShowAllDocuments] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [inspectorType, setInspectorType] = useState<'lot-tracking' | 'serial-missing' | 'low-stock' | 'document-expiry' | 'tax-pending' | 'monthly-revenue' | 'unpaid-balance' | 'today-shipment' | 'as-requests' | 'expiring-products' | 'warranty-expiry' | 'weekly-schedule' | null>(null);

  const handleAlertClick = (type: 'lot-tracking' | 'serial-missing' | 'low-stock' | 'document-expiry' | 'tax-pending') => {
    setInspectorType(type);
    setInspectorOpen(true);
  };

  const handleKPIClick = (type: 'monthly-revenue' | 'unpaid-balance' | 'today-shipment' | 'as-requests' | 'expiring-products' | 'warranty-expiry' | 'weekly-schedule') => {
    setInspectorType(type);
    setInspectorOpen(true);
  };
  
  // Mock data for charts
  const monthlyRevenue = [
    { month: '9월', revenue: 245000000, id: 'month-sep' },
    { month: '10월', revenue: 298000000, id: 'month-oct' },
    { month: '11월', revenue: 312000000, id: 'month-nov' },
    { month: '12월', revenue: 356000000, id: 'month-dec' },
    { month: '1월', revenue: 289000000, id: 'month-jan' },
    { month: '2월', revenue: 423000000, id: 'month-feb' },
  ];
  
  const clientRevenue = [
    { name: '서울대병원', revenue: 125000000, id: 'client-seoul-national' },
    { name: '삼성서울병원', revenue: 98000000, id: 'client-samsung' },
    { name: '세브란스병원', revenue: 87000000, id: 'client-severance' },
    { name: '아산병원', revenue: 65000000, id: 'client-asan' },
    { name: '서울성모병원', revenue: 48000000, id: 'client-catholic' },
  ];
  
  const productShare = [
    { name: '초음파', value: 35, color: '#5B8DB8', id: 'product-ultrasound' },
    { name: 'MRI 소모품', value: 25, color: '#35556E', id: 'product-mri' },
    { name: '수술기구', value: 20, color: '#163A5F', id: 'product-surgical' },
    { name: '검사장비', value: 15, color: '#2E7D5B', id: 'product-test' },
    { name: '기타', value: 5, color: '#C58A2B', id: 'product-other' },
  ];
  
  // Recent shipments
  const recentShipments = [
    { id: 'SH-2024-1234', client: '서울대병원', product: '초음파 프로브 A3', quantity: 2, date: '2026-03-02', status: '출고 완료' },
    { id: 'SH-2024-1235', client: '삼성서울병원', product: 'MRI 조영제 10ml', quantity: 50, date: '2026-03-02', status: '배송중' },
    { id: 'SH-2024-1236', client: '세브란스병원', product: '수술용 가위 세트', quantity: 5, date: '2026-03-01', status: '출고 완료' },
    { id: 'SH-2024-1237', client: '아산병원', product: '혈압계 BP-200', quantity: 10, date: '2026-03-01', status: '출고 완료' },
    { id: 'SH-2024-1238', client: '강남병원', product: '심전도기 ECG-500', quantity: 3, date: '2026-02-29', status: '출고 완료' },
  ];
  
  // Recent A/S requests
  const recentService = [
    { id: 'AS-2024-567', client: '서울대병원', equipment: '초음파기기 US-3000', type: '정기점검', date: '2026-03-02', status: '진행중' },
    { id: 'AS-2024-568', client: '아산병원', equipment: 'X-Ray XR-100', type: '긴급수리', date: '2026-03-01', status: '완료' },
    { id: 'AS-2024-569', client: '삼성서울병원', equipment: 'CT 스캐너 CT-500', type: '정기점검', date: '2026-02-28', status: '예정' },
    { id: 'AS-2024-570', client: '세브란스병원', equipment: 'MRI 장비 MRI-800', type: '부품교체', date: '2026-02-28', status: '진행중' },
  ];
  
  // Recent document uploads
  const recentDocuments = [
    { id: 'DOC-2024-891', type: '인증서', client: '서울대병원', title: 'CE 인증서 - 초음파기기', uploadDate: '2026-03-02', expiryDate: '2027-03-02', status: '정상' },
    { id: 'DOC-2024-892', type: '계약서', client: '삼성서울병원', title: '연간 공급 계약서', uploadDate: '2026-03-01', expiryDate: '2026-12-31', status: '정상' },
    { id: 'DOC-2024-893', type: '매뉴얼', client: '세브란스병원', title: 'MRI 사용 설명서', uploadDate: '2026-02-28', expiryDate: '-', status: '정상' },
    { id: 'DOC-2024-894', type: '보증서', client: '아산병원', equipment: 'X-Ray 장비 보증서', uploadDate: '2026-02-27', expiryDate: '2026-04-15', status: '만료임박' },
  ];
  
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
        <div className="p-2 lg:p-3 h-[calc(100vh-4rem)] overflow-y-auto">
          {/* Page Title */}
          <div className="mb-2">
            <h1 className="text-lg lg:text-xl font-bold text-[#18212B] mb-0.5">메인 홈</h1>
            <p className="text-[10px] lg:text-xs text-[#5B6773]">의료기기 통합 관리 시스템 현황</p>
          </div>
          
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-1.5 mb-2">
            <KPICard
              title="이번 달 매출"
              value="4.23억"
              subtitle="목표 112%"
              icon={DollarSign}
              trend={{ value: "23.5%", isPositive: true }}
              color="primary"
              onClick={() => handleKPIClick('monthly-revenue')}
            />
            <KPICard
              title="미수금 잔액"
              value="1.2억"
              subtitle="15개 거래처"
              icon={Clock}
              trend={{ value: "8.2%", isPositive: false }}
              color="warning"
              onClick={() => handleKPIClick('unpaid-balance')}
            />
            <KPICard
              title="오늘 출고 예정"
              value="12건"
              subtitle="48개 품목"
              icon={TruckIcon}
              color="primary"
              onClick={() => handleKPIClick('today-shipment')}
            />
            <KPICard
              title="A/S 접수 건수"
              value="8건"
              subtitle="긴급 2건"
              icon={Wrench}
              color="success"
              onClick={() => handleKPIClick('as-requests')}
            />
            <KPICard
              title="유효기간 임박"
              value="23품목"
              subtitle="30일 이내"
              icon={AlertTriangle}
              color="danger"
              onClick={() => handleKPIClick('expiring-products')}
            />
            <KPICard
              title="보증 만료 예정"
              value="5대"
              subtitle="60일 이내"
              icon={Calendar}
              color="warning"
              onClick={() => handleKPIClick('warranty-expiry')}
            />
            <KPICard
              title="주간 일정"
              value="3건"
              subtitle="3월 1주차"
              icon={Calendar}
              color="primary"
              onClick={() => handleKPIClick('weekly-schedule')}
            />
          </div>
          
          {/* Alert Cards */}
          <div className="mb-2">
            <h2 className="text-sm lg:text-base font-bold text-[#18212B] mb-1.5">알림 현황</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1.5">
              <AlertCard
                title="로트 추적 필요"
                count={7}
                description="시리얼 번호 미등록 품목"
                icon={Package}
                severity="high"
                onClick={() => handleAlertClick('lot-tracking')}
              />
              <AlertCard
                title="시리얼 등록 누락"
                count={15}
                description="출고 후 미등록 장비"
                icon={Hash}
                severity="high"
                onClick={() => handleAlertClick('serial-missing')}
              />
              <AlertCard
                title="재고 부족"
                count={12}
                description="안전재고 미달 품목"
                icon={AlertTriangle}
                severity="medium"
                onClick={() => handleAlertClick('low-stock')}
              />
              <AlertCard
                title="문서 만료 예정"
                count={8}
                description="30일 이내 만료 문서"
                icon={FileWarning}
                severity="medium"
                onClick={() => handleAlertClick('document-expiry')}
              />
              <AlertCard
                title="세금계산서 미발행"
                count={5}
                description="발행 대기 중인 건"
                icon={Receipt}
                severity="high"
                onClick={() => handleAlertClick('tax-pending')}
              />
            </div>
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
            {/* Monthly Revenue Chart */}
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm lg:text-base font-bold text-[#18212B] flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#5B8DB8]" />
                  월별 매출 추이
                </h3>
                <span className="text-xs text-[#5B6773]">최근 6개월</span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D7DEE6" />
                  <XAxis dataKey="month" stroke="#5B6773" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#5B6773" style={{ fontSize: '11px' }} />
                  <Tooltip 
                    formatter={(value: number) => `${(value / 100000000).toFixed(1)}억원`}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #D7DEE6', borderRadius: '6px', fontSize: '11px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#5B8DB8" 
                    strokeWidth={2} 
                    dot={{ fill: '#5B8DB8', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Client Revenue Chart */}
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm lg:text-base font-bold text-[#18212B] flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-[#5B8DB8]" />
                  거래처별 매출 순위
                </h3>
                <span className="text-xs text-[#5B6773]">이번 달</span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={clientRevenue} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#D7DEE6" />
                  <XAxis type="number" stroke="#5B6773" style={{ fontSize: '11px' }} />
                  <YAxis type="category" dataKey="name" stroke="#5B6773" width={100} style={{ fontSize: '11px' }} />
                  <Tooltip 
                    formatter={(value: number) => `${(value / 100000000).toFixed(1)}억원`}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #D7DEE6', borderRadius: '6px', fontSize: '11px' }}
                  />
                  <Bar dataKey="revenue" fill="#163A5F" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Product Share & Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
            {/* Product Share */}
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm lg:text-base font-bold text-[#18212B]">품목별 매출 비중</h3>
                <span className="text-xs text-[#5B6773]">이번 달</span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={productShare}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productShare.map((entry) => (
                      <Cell key={entry.id} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `${value}%`}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #D7DEE6', borderRadius: '6px', fontSize: '11px' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Installation Schedule */}
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm lg:text-base font-bold text-[#18212B]">이번 주 설치/점검 일정</h3>
                <span className="text-xs text-[#5B6773]">3월 1주차</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-2 bg-[#F4F7FA] rounded-lg border border-[#D7DEE6] hover:border-[#5B8DB8] transition-colors">
                  <div className="w-10 h-10 bg-[#5B8DB8] rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">3</span>
                    <span className="text-white text-[10px]">월</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#18212B] mb-0.5 truncate">초음파기기 설치</p>
                    <p className="text-[10px] text-[#5B6773] mb-0.5 truncate">서울대병원 영상의학과</p>
                    <p className="text-[10px] text-[#5B6773] truncate">김기사 | 14:00-17:00</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 bg-[#F4F7FA] rounded-lg border border-[#D7DEE6] hover:border-[#5B8DB8] transition-colors">
                  <div className="w-10 h-10 bg-[#163A5F] rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">4</span>
                    <span className="text-white text-[10px]">월</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#18212B] mb-0.5 truncate">CT 정기점검</p>
                    <p className="text-[10px] text-[#5B6773] mb-0.5 truncate">삼성서울병원 건강의학센터</p>
                    <p className="text-[10px] text-[#5B6773] truncate">이기사 | 09:00-12:00</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 bg-[#F4F7FA] rounded-lg border border-[#D7DEE6] hover:border-[#5B8DB8] transition-colors">
                  <div className="w-10 h-10 bg-[#35556E] rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">5</span>
                    <span className="text-white text-[10px]">월</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#18212B] mb-0.5 truncate">MRI 부품교체</p>
                    <p className="text-[10px] text-[#5B6773] mb-0.5 truncate">세브란스병원 영상의학과</p>
                    <p className="text-[10px] text-[#5B6773] truncate">박기사 | 10:00-15:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Data Tables */}
          <div className="grid grid-cols-1 gap-2">
            {/* Recent Shipments */}
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm lg:text-base font-bold text-[#18212B]">최근 출고 현황</h3>
                <button 
                  onClick={() => setShowAllShipments(!showAllShipments)}
                  className="text-xs text-[#5B8DB8] hover:text-[#163A5F] font-semibold"
                >
                  {showAllShipments ? '간략히 ←' : '전체 →'}
                </button>
              </div>
              
              {/* Mobile Card View */}
              <div className="lg:hidden space-y-3">
                {(showAllShipments ? recentShipments : recentShipments.slice(0, 3)).map((item) => (
                  <div key={item.id} className="border border-[#D7DEE6] rounded-lg p-3 hover:bg-[#F4F7FA] transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-xs font-bold text-[#163A5F] mb-1">{item.id}</p>
                        <p className="text-sm font-semibold text-[#18212B]">{item.client}</p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#D7DEE6]">
                      <div>
                        <p className="text-[10px] text-[#5B6773] mb-0.5">품목</p>
                        <p className="text-xs text-[#18212B]">{item.product}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#5B6773] mb-0.5">수량</p>
                        <p className="text-xs font-bold text-[#18212B]">{item.quantity}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] text-[#5B6773] mb-0.5">출고일</p>
                        <p className="text-xs text-[#18212B]">{item.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-[#D7DEE6] bg-[#F4F7FA]">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#18212B]">출고번호</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#18212B]">거래처</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#18212B]">품목</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-[#18212B]">수량</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#18212B]">출고일</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-[#18212B]">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentShipments.map((item) => (
                      <tr key={item.id} className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors">
                        <td className="py-4 px-4 text-sm font-semibold text-[#163A5F]">{item.id}</td>
                        <td className="py-4 px-4 text-sm text-[#18212B]">{item.client}</td>
                        <td className="py-4 px-4 text-sm text-[#5B6773]">{item.product}</td>
                        <td className="py-4 px-4 text-sm text-center text-[#18212B] font-semibold">{item.quantity}</td>
                        <td className="py-4 px-4 text-sm text-[#5B6773]">{item.date}</td>
                        <td className="py-4 px-4 text-center">
                          <StatusBadge status={item.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Recent A/S and Documents Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {/* Recent A/S */}
              <div className="bg-white rounded-lg border border-[#D7DEE6] p-3 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm lg:text-base font-bold text-[#18212B]">최근 A/S 현황</h3>
                  <button className="text-xs text-[#5B8DB8] hover:text-[#163A5F] font-semibold" onClick={() => setShowAllService(!showAllService)}>
                    {showAllService ? '접기' : '전체'} →
                  </button>
                </div>
                
                {/* Mobile Card View */}
                <div className="lg:hidden space-y-3">
                  {recentService.map((item) => (
                    <div key={item.id} className="border border-[#D7DEE6] rounded-lg p-3 hover:bg-[#F4F7FA] transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-xs font-bold text-[#163A5F] mb-1">{item.id}</p>
                          <p className="text-sm font-semibold text-[#18212B]">{item.client}</p>
                        </div>
                        <StatusBadge status={item.status} />
                      </div>
                      <div className="pt-2 border-t border-[#D7DEE6]">
                        <p className="text-[10px] text-[#5B6773] mb-0.5">유형</p>
                        <p className="text-xs text-[#18212B]">{item.type}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-[#D7DEE6] bg-[#F4F7FA]">
                        <th className="text-left py-3 px-3 text-xs font-semibold text-[#18212B]">접수번호</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-[#18212B]">거래처</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-[#18212B]">유형</th>
                        <th className="text-center py-3 px-3 text-xs font-semibold text-[#18212B]">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentService.map((item) => (
                        <tr key={item.id} className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors">
                          <td className="py-3 px-3 text-xs font-semibold text-[#163A5F]">{item.id}</td>
                          <td className="py-3 px-3 text-xs text-[#18212B]">{item.client}</td>
                          <td className="py-3 px-3 text-xs text-[#5B6773]">{item.type}</td>
                          <td className="py-3 px-3 text-center">
                            <StatusBadge status={item.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Recent Documents */}
              <div className="bg-white rounded-lg border border-[#D7DEE6] p-3 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm lg:text-base font-bold text-[#18212B] flex items-center gap-2">
                    <Upload className="w-5 h-5 text-[#5B8DB8]" />
                    최근 문서 업로드
                  </h3>
                  <button className="text-xs text-[#5B8DB8] hover:text-[#163A5F] font-semibold" onClick={() => setShowAllDocuments(!showAllDocuments)}>
                    {showAllDocuments ? '접기' : '전체'} →
                  </button>
                </div>
                
                {/* Mobile Card View */}
                <div className="lg:hidden space-y-3">
                  {recentDocuments.map((item) => (
                    <div key={item.id} className="border border-[#D7DEE6] rounded-lg p-3 hover:bg-[#F4F7FA] transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-xs font-bold text-[#163A5F] mb-1">{item.id}</p>
                          <p className="text-sm font-semibold text-[#18212B]">{item.client}</p>
                        </div>
                        <StatusBadge status={item.status} />
                      </div>
                      <div className="pt-2 border-t border-[#D7DEE6]">
                        <p className="text-[10px] text-[#5B6773] mb-0.5">유형</p>
                        <p className="text-xs text-[#18212B]">{item.type}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-[#D7DEE6] bg-[#F4F7FA]">
                        <th className="text-left py-3 px-3 text-xs font-semibold text-[#18212B]">문서번호</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-[#18212B]">유형</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-[#18212B]">거래처</th>
                        <th className="text-center py-3 px-3 text-xs font-semibold text-[#18212B]">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentDocuments.map((item) => (
                        <tr key={item.id} className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors">
                          <td className="py-3 px-3 text-xs font-semibold text-[#163A5F]">{item.id}</td>
                          <td className="py-3 px-3 text-xs text-[#18212B]">{item.type}</td>
                          <td className="py-3 px-3 text-xs text-[#5B6773]">{item.client}</td>
                          <td className="py-3 px-3 text-center">
                            <StatusBadge status={item.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <InspectorPanel
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        type={inspectorType}
      />
    </div>
  );
}