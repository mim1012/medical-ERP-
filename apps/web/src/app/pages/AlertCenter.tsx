import { useState } from "react";
import { useAlerts, useMarkAlertRead, useMarkAllAlertsRead, useDeleteAlert } from "../../hooks/use-alert";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { AlertDetailPanel } from "../components/AlertDetailPanel";
import { InspectorPanel } from "../components/InspectorPanel";
import { StatusBadge } from "../components/StatusBadge";
import { 
  Search, 
  Filter,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  UserX,
  Calendar,
  Eye,
  FileWarning,
  Package,
  Hash,
  FileText,
  DollarSign,
  Shield,
  Wrench,
  TrendingDown,
  Users
} from "lucide-react";

interface Alert {
  alertNumber: string;
  type: string;
  title: string;
  target: string;
  relatedNumber: string;
  issueDate: string;
  priority: string;
  status: string;
  manager: string;
  deadline: string;
  relatedClient?: string;
  relatedProduct?: string;
  actionNote?: string;
  internalMemo?: string;
}

export function AlertCenter() {
  const [activeMenu, setActiveMenu] = useState('alerts');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('전체');
  const [priorityFilter, setPriorityFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: alerts = [], isLoading, error } = useAlerts();
  const markRead = useMarkAlertRead();
  const markAllRead = useMarkAllAlertsRead();
  const deleteAlert = useDeleteAlert();
  const [inspectorType, setInspectorType] = useState<
    'monthly-revenue' | 'alert-expiry-warning' | 'alert-stock-shortage' | 
    'alert-serial-unregistered' | 'alert-lot-tracking' | 'alert-document-expiry' | 
    'alert-tax-unissued' | 'alert-unpaid-balance' | 'alert-warranty-expiry' | 
    'alert-as-delay' | 'alert-install-schedule' | null
  >(null);


  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.alertNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.relatedNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === '전체' || alert.type === typeFilter;
    const matchesPriority = priorityFilter === '전체' || alert.priority === priorityFilter;
    const matchesStatus = statusFilter === '전체' || alert.status === statusFilter;
    
    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  });

  const handleAlertUpdate = (data: any) => {
    console.log('Alert updated:', data);
    setSelectedAlert(null);
  };

  const getAlertTypeIcon = (type: string) => {
    const icons: { [key: string]: JSX.Element } = {
      '유효기 임박': <Calendar className="w-4 h-4" />,
      '재고 부족': <Package className="w-4 h-4" />,
      '시리얼 미등록': <Hash className="w-4 h-4" />,
      '로트 추적 필요': <FileWarning className="w-4 h-4" />,
      '문서 만료 예정': <FileText className="w-4 h-4" />,
      '세금계산서 미발행': <DollarSign className="w-4 h-4" />,
      '미수금 초과': <TrendingDown className="w-4 h-4" />,
      '보증 만료 예정': <Shield className="w-4 h-4" />,
      'A/S 지연': <Wrench className="w-4 h-4" />,
      '설치 일정 임박': <Users className="w-4 h-4" />,
      '회수/이상 이슈': <AlertTriangle className="w-4 h-4" />,
      '승인 대기 건': <Clock className="w-4 h-4" />,
    };
    return icons[type] || <Bell className="w-4 h-4" />;
  };

  const getAlertTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      '유효기간 임박': 'bg-[#FCEBE9] text-[#B94A48]',
      '재고 부족': 'bg-[#FFF4E5] text-[#C58A2B]',
      '시리얼 미등록': 'bg-[#E8EEF3] text-[#5B8DB8]',
      '로트 추적 필요': 'bg-[#FCEBE9] text-[#B94A48]',
      '문서 만료 예정': 'bg-[#FFF4E5] text-[#C58A2B]',
      '세금계산서 미발행': 'bg-[#FCEBE9] text-[#B94A48]',
      '미수금 초과': 'bg-[#FFF4E5] text-[#C58A2B]',
      '보증 만료 예정': 'bg-[#E8EEF3] text-[#5B8DB8]',
      'A/S 지연': 'bg-[#FFF4E5] text-[#C58A2B]',
      '설치 일정 임박': 'bg-[#E8EEF3] text-[#5B8DB8]',
      '회수/이상 이슈': 'bg-[#FCEBE9] text-[#B94A48]',
      '승인 대기 건': 'bg-[#F0E6F4] text-[#7B4397]',
    };
    return colors[type] || 'bg-[#E8EEF3] text-[#5B6773]';
  };

  const getPriorityBadge = (priority: string) => {
    const badges: { [key: string]: JSX.Element } = {
      '긴급': (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-[#FCEBE9] text-[#B94A48]">
          <AlertTriangle className="w-3 h-3" />
          긴급
        </span>
      ),
      '높음': (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-[#FFF4E5] text-[#C58A2B]">
          높음
        </span>
      ),
      '보통': (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-[#E8EEF3] text-[#5B8DB8]">
          보통
        </span>
      ),
      '낮음': (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-[#F4F7FA] text-[#5B6773]">
          낮음
        </span>
      ),
    };
    return badges[priority] || badges['보통'];
  };

  // Calculate statistics
  const todayNew = alerts.filter(a => a.issueDate === '2026-03-02').length;
  const urgent = alerts.filter(a => a.priority === '긴급').length;
  const unprocessed = alerts.filter(a => a.status === '미확인').length;
  const unassigned = alerts.filter(a => !a.manager).length;
  const expiringSoon = alerts.filter(a => {
    const days = Math.ceil((new Date(a.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days <= 7 && days >= 0;
  }).length;
  const delayed = alerts.filter(a => {
    const days = Math.ceil((new Date(a.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days < 0;
  }).length;

  // Alert type counts
  const typeCount = alerts.reduce((acc, alert) => {
    acc[alert.type] = (acc[alert.type] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

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
            <h1 className="text-3xl font-bold text-[#18212B] mb-2">알림 센터</h1>
            <p className="text-[#5B6773]">시스템 알림 통합 관리</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div 
              onClick={() => setInspectorType('alert-expiry-warning')}
              className="bg-white rounded-lg border border-[#D7DEE6] p-4 shadow-sm cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#5B6773] mb-1">오늘 신규 알림</p>
                  <p className="text-2xl font-bold text-[#5B8DB8]">{todayNew}</p>
                </div>
                <Bell className="w-7 h-7 text-[#5B8DB8] opacity-20" />
              </div>
              <p className="text-xs text-[#5B6773]">건</p>
            </div>

            <div 
              onClick={() => setInspectorType('alert-expiry-warning')}
              className="bg-white rounded-lg border border-[#D7DEE6] p-4 shadow-sm cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#5B6773] mb-1">긴급 알림</p>
                  <p className="text-2xl font-bold text-[#B94A48]">{urgent}</p>
                </div>
                <AlertTriangle className="w-7 h-7 text-[#B94A48] opacity-20" />
              </div>
              <p className="text-xs text-[#B94A48]">즉시 처리</p>
            </div>

            <div 
              onClick={() => setInspectorType('alert-stock-shortage')}
              className="bg-white rounded-lg border border-[#D7DEE6] p-4 shadow-sm cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#5B6773] mb-1">미처리 알림</p>
                  <p className="text-2xl font-bold text-[#C58A2B]">{unprocessed}</p>
                </div>
                <Clock className="w-7 h-7 text-[#C58A2B] opacity-20" />
              </div>
              <p className="text-xs text-[#C58A2B]">미확인</p>
            </div>

            <div 
              onClick={() => setInspectorType('alert-serial-unregistered')}
              className="bg-white rounded-lg border border-[#D7DEE6] p-4 shadow-sm cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#5B6773] mb-1">담당자 미지정</p>
                  <p className="text-2xl font-bold text-[#7B4397]">{unassigned}</p>
                </div>
                <UserX className="w-7 h-7 text-[#7B4397] opacity-20" />
              </div>
              <p className="text-xs text-[#7B4397]">미배정</p>
            </div>

            <div 
              onClick={() => setInspectorType('alert-expiry-warning')}
              className="bg-white rounded-lg border border-[#D7DEE6] p-4 shadow-sm cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#5B6773] mb-1">7일 이내 만료</p>
                  <p className="text-2xl font-bold text-[#C58A2B]">{expiringSoon}</p>
                </div>
                <Calendar className="w-7 h-7 text-[#C58A2B] opacity-20" />
              </div>
              <p className="text-xs text-[#C58A2B]">임박</p>
            </div>

            <div 
              onClick={() => setInspectorType('alert-as-delay')}
              className="bg-white rounded-lg border border-[#D7DEE6] p-4 shadow-sm cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#5B6773] mb-1">지연 처리 건수</p>
                  <p className="text-2xl font-bold text-[#B94A48]">{delayed}</p>
                </div>
                <XCircle className="w-7 h-7 text-[#B94A48] opacity-20" />
              </div>
              <p className="text-xs text-[#B94A48]">기한 초과</p>
            </div>
          </div>

          {/* Alert Type Summary */}
          <div className="bg-white rounded-lg border border-[#D7DEE6] p-6 mb-8 shadow-sm">
            <h3 className="text-sm font-bold text-[#18212B] mb-4">알림 유형별 현황</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Object.entries(typeCount).map(([type, count]) => {
                // 알림 유형별로 inspector 타입 매핑
                const getInspectorType = (alertType: string) => {
                  const typeMap: { [key: string]: any } = {
                    '유효기간 임박': 'alert-expiry-warning',
                    '재고 부족': 'alert-stock-shortage',
                    '시리얼 미등록': 'alert-serial-unregistered',
                    '로트 추적 필요': 'alert-lot-tracking',
                    '문서 만료 예정': 'alert-document-expiry',
                    '세금계산서 미발행': 'alert-tax-unissued',
                    '미수금 초과': 'alert-unpaid-balance',
                    '보증 만료 예정': 'alert-warranty-expiry',
                    'A/S 지연': 'alert-as-delay',
                    '설치 일정 임박': 'alert-install-schedule',
                  };
                  return typeMap[alertType] || null;
                };

                return (
                  <div 
                    key={type} 
                    onClick={() => {
                      const inspectorTypeValue = getInspectorType(type);
                      if (inspectorTypeValue) {
                        setInspectorType(inspectorTypeValue);
                      }
                    }}
                    className="flex items-center gap-2 p-3 bg-[#F4F7FA] rounded-lg cursor-pointer hover:bg-[#E8EEF3] hover:shadow-md transition-all"
                  >
                    <div className={`p-2 rounded ${getAlertTypeColor(type)}`}>
                      {getAlertTypeIcon(type)}
                    </div>
                    <div>
                      <p className="text-xs text-[#5B6773]">{type}</p>
                      <p className="text-lg font-bold text-[#18212B]">{count}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg border border-[#D7DEE6] shadow-sm">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-[#D7DEE6]">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 lg:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6773]" />
                    <input
                      type="text"
                      placeholder="알림번호, 제목, 대상, 관련번호 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#5B6773]" />
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="px-3 py-2 border border-[#D7DEE6] rounded-md bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    >
                      <option value="전체">전체 유형</option>
                      <option value="유효기간 임박">유효기간 임박</option>
                      <option value="재고 부족">재고 부족</option>
                      <option value="시리얼 미등록">시리얼 미등록</option>
                      <option value="로트 추적 필요">로트 추적 필요</option>
                      <option value="문서 만료 예정">문서 만료 예정</option>
                      <option value="세금계산서 미발행">세금계산서 미발행</option>
                      <option value="미수금 초과">미수금 초과</option>
                      <option value="보증 만료 예정">보증 만료 예정</option>
                      <option value="A/S 지연">A/S 지연</option>
                      <option value="설치 일정 임박">설치 일정 임박</option>
                    </select>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="px-3 py-2 border border-[#D7DEE6] rounded-md bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    >
                      <option value="전체">전체 우선순위</option>
                      <option value="긴급">긴급</option>
                      <option value="높음">높음</option>
                      <option value="보통">보통</option>
                      <option value="낮음">낮음</option>
                    </select>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-[#D7DEE6] rounded-md bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    >
                      <option value="전체">전체 상태</option>
                      <option value="미확인">미확인</option>
                      <option value="확인완료">확인완료</option>
                      <option value="처리중">처리중</option>
                      <option value="처리완료">처리완료</option>
                      <option value="보류">보류</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {/* Mobile Card View */}
              <div className="lg:hidden p-4 space-y-3">
                {filteredAlerts.map((alert) => {
                  const daysLeft = Math.ceil((new Date(alert.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  const isOverdue = daysLeft < 0;
                  const isUrgent = daysLeft <= 3 && daysLeft >= 0;

                  return (
                    <div 
                      key={alert.alertNumber}
                      className="border border-[#D7DEE6] rounded-lg p-4 hover:bg-[#F4F7FA] transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${getAlertTypeColor(alert.type)}`}>
                              {getAlertTypeIcon(alert.type)}
                              {alert.type}
                            </span>
                            {getPriorityBadge(alert.priority)}
                          </div>
                          <p className="text-xs font-bold text-[#163A5F] mb-1">{alert.alertNumber}</p>
                          <p className="text-sm font-semibold text-[#18212B] mb-1">{alert.title}</p>
                        </div>
                        <StatusBadge status={alert.status} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3 pt-3 border-t border-[#D7DEE6]">
                        <div>
                          <p className="text-[10px] text-[#5B6773] mb-0.5">대상명</p>
                          <p className="text-xs text-[#18212B]">{alert.target}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#5B6773] mb-0.5">관련번호</p>
                          <p className="text-xs font-semibold text-[#5B8DB8]">{alert.relatedNumber}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#5B6773] mb-0.5">담당자</p>
                          <p className="text-xs text-[#18212B]">{alert.manager || <span className="text-[#B94A48]">미배정</span>}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#5B6773] mb-0.5">조치기한</p>
                          <p className={`text-xs ${
                            isOverdue ? 'text-[#B94A48] font-bold' :
                            isUrgent ? 'text-[#C58A2B] font-semibold' :
                            'text-[#5B6773]'
                          }`}>
                            {alert.deadline}
                            {isOverdue && ' (기한 초과)'}
                            {isUrgent && !isOverdue && ` (D-${daysLeft})`}
                          </p>
                        </div>
                      </div>
                      
                      <button 
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors text-sm"
                        onClick={() => setSelectedAlert(alert)}
                      >
                        <Eye className="w-4 h-4" />
                        상세보기
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <table className="w-full hidden lg:table">
                <thead>
                  <tr className="border-b-2 border-[#D7DEE6] bg-[#163A5F]">
                    <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[110px]">알림번호</th>
                    <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[130px]">알림유형</th>
                    <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[300px]">제목</th>
                    <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[120px]">대상명</th>
                    <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[120px]">관련번호</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-white min-w-[90px]">발생일</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-white min-w-[80px]">우선순위</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-white min-w-[90px]">상태</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-white min-w-[70px]">담당자</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-white min-w-[90px]">조치기한</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-white min-w-[60px]">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAlerts.map((alert) => {
                    const daysLeft = Math.ceil((new Date(alert.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    const isOverdue = daysLeft < 0;
                    const isUrgent = daysLeft <= 3 && daysLeft >= 0;

                    return (
                      <tr key={alert.alertNumber} className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors">
                        <td className="py-3 px-3 text-xs font-semibold text-[#163A5F]">{alert.alertNumber}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${getAlertTypeColor(alert.type)}`}>
                            {getAlertTypeIcon(alert.type)}
                            {alert.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-xs text-[#18212B]">{alert.title}</td>
                        <td className="py-3 px-3 text-xs text-[#5B6773]">{alert.target}</td>
                        <td className="py-3 px-3 text-xs text-[#5B8DB8] font-semibold">{alert.relatedNumber}</td>
                        <td className="py-3 px-3 text-xs text-center text-[#5B6773]">{alert.issueDate}</td>
                        <td className="py-3 px-3 text-center">{getPriorityBadge(alert.priority)}</td>
                        <td className="py-3 px-3 text-center">
                          <StatusBadge status={alert.status} />
                        </td>
                        <td className="py-3 px-3 text-xs text-center text-[#5B6773]">
                          {alert.manager || <span className="text-[#B94A48]">미배정</span>}
                        </td>
                        <td className="py-3 px-3 text-xs text-center">
                          <span className={
                            isOverdue ? 'text-[#B94A48] font-bold' :
                            isUrgent ? 'text-[#C58A2B] font-semibold' :
                            'text-[#5B6773]'
                          }>
                            {alert.deadline}
                            {isOverdue && <span className="block text-[10px]">기한 초과</span>}
                            {isUrgent && !isOverdue && <span className="block text-[10px]">D-{daysLeft}</span>}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button 
                            className="p-1 hover:bg-[#E8EEF3] rounded transition-colors"
                            onClick={() => setSelectedAlert(alert)}
                          >
                            <Eye className="w-4 h-4 text-[#5B8DB8]" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-[#D7DEE6] flex items-center justify-between bg-[#F4F7FA]">
              <p className="text-sm text-[#5B6773]">
                전체 {filteredAlerts.length}건
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

      {/* Alert Detail Panel */}
      <AlertDetailPanel
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        alert={selectedAlert}
        onUpdate={handleAlertUpdate}
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