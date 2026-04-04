import { useState } from "react";
import { useDashboardStats } from "../../hooks/use-dashboard";
import { formatKRW } from "../../lib/format";
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
  BarChart3,
  ShoppingCart,
  Hash,
  FileWarning,
  Receipt,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAllShipments, setShowAllShipments] = useState(false);
  const [showAllService, setShowAllService] = useState(false);
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
  
  const { data: dashboardStats } = useDashboardStats();

  const monthlyRevenue = dashboardStats?.monthlyRevenueChart ?? [];
  const recentShipments = dashboardStats?.recentShipments ?? [];
  const recentNotifications = dashboardStats?.recentNotifications ?? [];
  
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
              value={monthlyRevenue.length > 0 ? formatKRW(monthlyRevenue[monthlyRevenue.length - 1].revenue, { abbreviate: true }) : '-'}
              subtitle="최근 월 기준"
              icon={DollarSign}
              color="primary"
              onClick={() => handleKPIClick('monthly-revenue')}
            />
            <KPICard
              title="미수금 잔액"
              value={dashboardStats ? formatKRW(dashboardStats.unpaidBalance, { abbreviate: true }) : '-'}
              subtitle="미수/부분납 합계"
              icon={Clock}
              color="warning"
              onClick={() => handleKPIClick('unpaid-balance')}
            />
            <KPICard
              title="이번 달 출고"
              value={dashboardStats ? `${dashboardStats.monthlyShipments}건` : '-'}
              subtitle="이번 달 기준"
              icon={TruckIcon}
              color="primary"
              onClick={() => handleKPIClick('today-shipment')}
            />
            <KPICard
              title="A/S 접수 건수"
              value={dashboardStats ? `${dashboardStats.openServiceCases}건` : '-'}
              subtitle="진행 중 포함"
              icon={Wrench}
              color="success"
              onClick={() => handleKPIClick('as-requests')}
            />
            <KPICard
              title="재고 부족"
              value={dashboardStats ? `${dashboardStats.lowStockCount}품목` : '-'}
              subtitle="안전재고 미달"
              icon={AlertTriangle}
              color="danger"
              onClick={() => handleKPIClick('expiring-products')}
            />
            <KPICard
              title="총 거래처"
              value={dashboardStats ? `${dashboardStats.totalClients}개` : '-'}
              subtitle="등록된 거래처"
              icon={Calendar}
              color="warning"
              onClick={() => handleKPIClick('warranty-expiry')}
            />
            <KPICard
              title="총 제품"
              value={dashboardStats ? `${dashboardStats.totalProducts}개` : '-'}
              subtitle="등록된 제품"
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
                count={0}
                description="시리얼 번호 미등록 품목"
                icon={Package}
                severity="high"
                onClick={() => handleAlertClick('lot-tracking')}
              />
              <AlertCard
                title="시리얼 등록 누락"
                count={0}
                description="출고 후 미등록 장비"
                icon={Hash}
                severity="high"
                onClick={() => handleAlertClick('serial-missing')}
              />
              <AlertCard
                title="재고 부족"
                count={dashboardStats?.lowStockCount ?? 0}
                description="안전재고 미달 품목"
                icon={AlertTriangle}
                severity="medium"
                onClick={() => handleAlertClick('low-stock')}
              />
              <AlertCard
                title="문서 만료 예정"
                count={0}
                description="30일 이내 만료 문서"
                icon={FileWarning}
                severity="medium"
                onClick={() => handleAlertClick('document-expiry')}
              />
              <AlertCard
                title="세금계산서 미발행"
                count={0}
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
            
            {/* Summary Stats */}
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm lg:text-base font-bold text-[#18212B] flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-[#5B8DB8]" />
                  주요 현황 요약
                </h3>
                <span className="text-xs text-[#5B6773]">실시간</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 bg-[#F4F7FA] rounded-lg">
                  <p className="text-[10px] text-[#5B6773] mb-1">총 거래처</p>
                  <p className="text-xl font-bold text-[#163A5F]">{dashboardStats?.totalClients ?? '-'}</p>
                  <p className="text-[10px] text-[#5B6773]">개</p>
                </div>
                <div className="p-3 bg-[#F4F7FA] rounded-lg">
                  <p className="text-[10px] text-[#5B6773] mb-1">총 제품</p>
                  <p className="text-xl font-bold text-[#163A5F]">{dashboardStats?.totalProducts ?? '-'}</p>
                  <p className="text-[10px] text-[#5B6773]">개</p>
                </div>
                <div className="p-3 bg-[#F4F7FA] rounded-lg">
                  <p className="text-[10px] text-[#5B6773] mb-1">이번 달 출고</p>
                  <p className="text-xl font-bold text-[#163A5F]">{dashboardStats?.monthlyShipments ?? '-'}</p>
                  <p className="text-[10px] text-[#5B6773]">건</p>
                </div>
                <div className="p-3 bg-[#F4F7FA] rounded-lg">
                  <p className="text-[10px] text-[#5B6773] mb-1">A/S 진행 중</p>
                  <p className="text-xl font-bold text-[#E05A5A]">{dashboardStats?.openServiceCases ?? '-'}</p>
                  <p className="text-[10px] text-[#5B6773]">건</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Share & Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
            {/* Unpaid Balance */}
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm lg:text-base font-bold text-[#18212B]">미수금 현황</h3>
                <span className="text-xs text-[#5B6773]">미수/부분납</span>
              </div>
              <div className="flex flex-col items-center justify-center h-[180px] gap-2">
                <p className="text-4xl font-bold text-[#E07B5A]">
                  {dashboardStats ? formatKRW(dashboardStats.unpaidBalance, { abbreviate: true }) : '-'}
                </p>
                <p className="text-sm text-[#5B6773]">미수금 잔액 합계</p>
                <div className="mt-2 px-4 py-2 bg-[#FFF4F0] rounded-lg border border-[#F0C9BA]">
                  <p className="text-xs text-[#E07B5A]">RECEIVABLE 미수/부분납 기준</p>
                </div>
              </div>
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
                        <p className="text-sm font-semibold text-[#18212B]">{item.clientName}</p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#D7DEE6]">
                      <div>
                        <p className="text-[10px] text-[#5B6773] mb-0.5">품목 수</p>
                        <p className="text-xs font-bold text-[#18212B]">{item.itemCount}개</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] text-[#5B6773] mb-0.5">출고일</p>
                        <p className="text-xs text-[#18212B]">{new Date(item.createdAt).toLocaleDateString('ko-KR')}</p>
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
                      <th className="text-center py-3 px-4 text-sm font-semibold text-[#18212B]">품목 수</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#18212B]">출고일</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-[#18212B]">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentShipments.map((item) => (
                      <tr key={item.id} className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors">
                        <td className="py-4 px-4 text-sm font-semibold text-[#163A5F]">{item.id}</td>
                        <td className="py-4 px-4 text-sm text-[#18212B]">{item.clientName}</td>
                        <td className="py-4 px-4 text-sm text-center text-[#18212B] font-semibold">{item.itemCount}개</td>
                        <td className="py-4 px-4 text-sm text-[#5B6773]">{new Date(item.createdAt).toLocaleDateString('ko-KR')}</td>
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
              {/* Recent Notifications */}
              <div className="bg-white rounded-lg border border-[#D7DEE6] p-3 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm lg:text-base font-bold text-[#18212B]">최근 알림</h3>
                  <button className="text-xs text-[#5B8DB8] hover:text-[#163A5F] font-semibold" onClick={() => setShowAllService(!showAllService)}>
                    {showAllService ? '접기' : '전체'} →
                  </button>
                </div>

                <div className="space-y-2">
                  {(showAllService ? recentNotifications : recentNotifications.slice(0, 4)).map((item) => (
                    <div key={item.id} className="flex items-start gap-2 p-2 rounded-lg border border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#18212B] truncate">{item.title}</p>
                        <p className="text-[10px] text-[#5B6773] truncate">{item.message}</p>
                        <p className="text-[10px] text-[#5B6773]">{new Date(item.createdAt).toLocaleDateString('ko-KR')}</p>
                      </div>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#5B8DB8] flex-shrink-0 mt-1" />
                      )}
                    </div>
                  ))}
                  {recentNotifications.length === 0 && (
                    <p className="text-xs text-[#5B6773] text-center py-4">알림이 없습니다</p>
                  )}
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