import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { LogDetailPanel } from "../components/LogDetailPanel";
import { 
  Search, 
  Filter,
  Eye,
  Download,
  FileText,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  LogIn,
  LogOut,
  Upload,
  Key,
  ToggleRight,
  Shield,
  Calendar,
  Users,
  Settings
} from "lucide-react";

interface LogEntry {
  timestamp: string;
  userName: string;
  department: string;
  menu: string;
  action: string;
  target: string;
  targetNumber: string;
  summary: string;
  ip: string;
  importance: string;
  beforeValue?: string;
  afterValue?: string;
  reason?: string;
  device?: string;
  note?: string;
}

export function LogHistory() {
  const [activeMenu, setActiveMenu] = useState('logs');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuFilter, setMenuFilter] = useState('전체');
  const [actionFilter, setActionFilter] = useState('전체');
  const [userFilter, setUserFilter] = useState('전체');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState('오늘');
  const [importanceFilter, setImportanceFilter] = useState('전체');
  const [detailPanelLogs, setDetailPanelLogs] = useState<LogEntry[] | null>(null);
  const [detailPanelTitle, setDetailPanelTitle] = useState('');

  // Mock data
  const logs: LogEntry[] = [
    {
      timestamp: '2026-03-02 14:32:15',
      userName: '박운영',
      department: '운영팀',
      menu: '재고 관리',
      action: '수정',
      target: 'MRI 조영제',
      targetNumber: 'INV-2026-0045',
      summary: '재고수량 조정: 150개 → 145개',
      ip: '192.168.1.45',
      importance: '높음',
      beforeValue: '재고수량: 150개',
      afterValue: '재고수량: 145개',
      reason: '실사 후 차이 발생으로 인한 조정'
    },
    {
      timestamp: '2026-03-02 14:15:28',
      userName: '강정산',
      department: '정산팀',
      menu: '정산 관리',
      action: '수정',
      target: '삼성서울병원 정산',
      targetNumber: 'STL-2026-002',
      summary: '미수금 금액 수정',
      ip: '192.168.1.52',
      importance: '높음',
      beforeValue: '미수금: 50,000,000원',
      afterValue: '미수금: 47,900,000원',
      reason: '부분 입금 반영'
    },
    {
      timestamp: '2026-03-02 13:45:10',
      userName: '이영업',
      department: '영업팀',
      menu: '거래처 관리',
      action: '등록',
      target: '대전성심병원',
      targetNumber: 'CLT-2026-0125',
      summary: '신규 거래처 등록',
      ip: '192.168.1.38',
      importance: '보통'
    },
    {
      timestamp: '2026-03-02 13:20:42',
      userName: '최물류',
      department: '물류팀',
      menu: '출고 관리',
      action: '삭제',
      target: '출고 요청',
      targetNumber: 'SHP-2026-0247',
      summary: '잘못 등록된 출고 요청 삭제',
      ip: '192.168.1.47',
      importance: '높음',
      reason: '중복 입력으로 인한 삭제'
    },
    {
      timestamp: '2026-03-02 12:55:33',
      userName: '김대표',
      department: '경영지원',
      menu: '사용자 관리',
      action: '권한변경',
      target: '윤영업',
      targetNumber: 'USR-2026-0007',
      summary: '권한그룹 변경',
      ip: '192.168.1.10',
      importance: '긴급',
      beforeValue: '권한그룹: 읽기전용',
      afterValue: '권한그룹: 영업팀',
      reason: '정식 발령으로 인한 권한 상향'
    },
    {
      timestamp: '2026-03-02 11:30:15',
      userName: '정서비스',
      department: 'A/S팀',
      menu: '설치/A/S',
      action: '상태변경',
      target: 'MRI 스캐너 A/S',
      targetNumber: 'SVC-2026-0045',
      summary: '상태: 처리중 → 완료',
      ip: '192.168.1.48',
      importance: '보통',
      beforeValue: '상태: 처리중',
      afterValue: '상태: 완료'
    },
    {
      timestamp: '2026-03-02 10:45:20',
      userName: '박운영',
      department: '운영팀',
      menu: '문서 관리',
      action: '업로드',
      target: 'ISO 13485 갱신 인증서',
      targetNumber: 'DOC-2026-0125',
      summary: '문서 파일 업로드',
      ip: '192.168.1.45',
      importance: '높음'
    },
    {
      timestamp: '2026-03-02 10:15:08',
      userName: '이영업',
      department: '영업팀',
      menu: '정산 관리',
      action: '다운로드',
      target: '2월 정산 보고서',
      targetNumber: 'RPT-2026-002',
      summary: '엑셀 다운로드',
      ip: '192.168.1.38',
      importance: '보통'
    },
    {
      timestamp: '2026-03-02 09:30:00',
      userName: '김대표',
      department: '경영지원',
      menu: '시스템',
      action: '로그인',
      target: '시스템 로그인',
      targetNumber: '-',
      summary: '정상 로그인',
      ip: '192.168.1.10',
      importance: '낮음'
    },
    {
      timestamp: '2026-03-02 09:28:45',
      userName: 'unknown',
      department: '-',
      menu: '시스템',
      action: '로그인',
      target: '로그인 시도 실패',
      targetNumber: '-',
      summary: '비밀번호 오류 (3회)',
      ip: '203.142.78.92',
      importance: '긴급',
      note: '의심스러운 접속 시도 감지'
    },
    {
      timestamp: '2026-03-01 18:45:00',
      userName: '강정산',
      department: '정산팀',
      menu: '세금계산',
      action: '승인',
      target: '세브란스병원 세금계산서',
      targetNumber: 'INV-2026-0313',
      summary: '발행 승인',
      ip: '192.168.1.52',
      importance: '보통'
    },
    {
      timestamp: '2026-03-01 17:20:30',
      userName: '이영업',
      department: '영업팀',
      menu: '품목 관리',
      action: '수정',
      target: 'CT 스캐너',
      targetNumber: 'PRD-2026-0012',
      summary: '판매가격 변경',
      ip: '192.168.1.38',
      importance: '높음',
      beforeValue: '판매가격: 450,000,000원',
      afterValue: '판매가격: 435,000,000원',
      reason: '프로모션 적용'
    },
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMenu = menuFilter === '전체' || log.menu === menuFilter;
    const matchesAction = actionFilter === '전체' || log.action === actionFilter;
    const matchesUser = userFilter === '전체' || log.userName === userFilter;
    const matchesImportance = importanceFilter === '전체' || log.importance === importanceFilter;
    
    // Date filter logic (simplified)
    let matchesDate = true;
    if (dateFilter === '오늘') {
      matchesDate = log.timestamp.startsWith('2026-03-02');
    } else if (dateFilter === '어제') {
      matchesDate = log.timestamp.startsWith('2026-03-01');
    }
    
    return matchesSearch && matchesMenu && matchesAction && matchesUser && matchesImportance && matchesDate;
  });

  const getActionIcon = (action: string) => {
    const icons: { [key: string]: JSX.Element } = {
      '등록': <FileText className="w-3 h-3" />,
      '수정': <Edit className="w-3 h-3" />,
      '삭제': <Trash2 className="w-3 h-3" />,
      '승인': <CheckCircle2 className="w-3 h-3" />,
      '반려': <XCircle className="w-3 h-3" />,
      '로그인': <LogIn className="w-3 h-3" />,
      '로그아웃': <LogOut className="w-3 h-3" />,
      '다운로드': <Download className="w-3 h-3" />,
      '업로드': <Upload className="w-3 h-3" />,
      '권한변경': <Key className="w-3 h-3" />,
      '상태변경': <ToggleRight className="w-3 h-3" />,
    };
    return icons[action] || <FileText className="w-3 h-3" />;
  };

  const getActionColor = (action: string) => {
    const colors: { [key: string]: string } = {
      '등록': 'bg-[#E6F4EA] text-[#2E7D5B]',
      '수정': 'bg-[#E8EEF3] text-[#5B8DB8]',
      '삭제': 'bg-[#FCEBE9] text-[#B94A48]',
      '승인': 'bg-[#E6F4EA] text-[#2E7D5B]',
      '반려': 'bg-[#FFF4E5] text-[#C58A2B]',
      '로그인': 'bg-[#E8EEF3] text-[#5B8DB8]',
      '로그아웃': 'bg-[#F4F7FA] text-[#5B6773]',
      '다운로드': 'bg-[#E8EEF3] text-[#5B8DB8]',
      '업로드': 'bg-[#E8EEF3] text-[#5B8DB8]',
      '권한변경': 'bg-[#FCEBE9] text-[#B94A48]',
      '상태변경': 'bg-[#FFF4E5] text-[#C58A2B]',
    };
    return colors[action] || 'bg-[#F4F7FA] text-[#5B6773]';
  };

  const getImportanceBadge = (importance: string) => {
    const badges: { [key: string]: JSX.Element } = {
      '긴급': (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-[#FCEBE9] text-[#B94A48]">
          <Shield className="w-3 h-3" />
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
    return badges[importance] || badges['보통'];
  };

  // Calculate statistics
  const todayChanges = logs.filter(l => l.timestamp.startsWith('2026-03-02')).length;
  const deleteActions = logs.filter(l => l.action === '삭제').length;
  const permissionChanges = logs.filter(l => l.action === '권한변경').length;
  const loginFailures = logs.filter(l => l.action === '로그인' && l.summary.includes('실패')).length;
  const inventoryAdjustments = logs.filter(l => l.menu === '재고 관리' && l.action === '수정').length;
  const settlementEdits = logs.filter(l => l.menu === '정산 관리' && l.action === '수정').length;

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
            <h1 className="text-3xl font-bold text-[#18212B] mb-2">로그/이력 관리</h1>
            <p className="text-[#5B6773]">시스템 작업 이력 추적 및 감사</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#5B6773] mb-1">오늘 변경 건수</p>
                  <p className="text-2xl font-bold text-[#5B8DB8]">{todayChanges}</p>
                </div>
                <Calendar className="w-7 h-7 text-[#5B8DB8] opacity-20" />
              </div>
              <p className="text-xs text-[#5B6773]">건</p>
            </div>

            <div className="bg-white rounded-lg border border-[#D7DEE6] p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#5B6773] mb-1">삭제 작업 건수</p>
                  <p className="text-2xl font-bold text-[#B94A48]">{deleteActions}</p>
                </div>
                <Trash2 className="w-7 h-7 text-[#B94A48] opacity-20" />
              </div>
              <p className="text-xs text-[#B94A48]">주의 필요</p>
            </div>

            <div className="bg-white rounded-lg border border-[#D7DEE6] p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#5B6773] mb-1">권한 변경 건수</p>
                  <p className="text-2xl font-bold text-[#C58A2B]">{permissionChanges}</p>
                </div>
                <Key className="w-7 h-7 text-[#C58A2B] opacity-20" />
              </div>
              <p className="text-xs text-[#C58A2B]">보안 감사</p>
            </div>

            <div className="bg-white rounded-lg border border-[#D7DEE6] p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#5B6773] mb-1">로그인 실패 건수</p>
                  <p className="text-2xl font-bold text-[#B94A48]">{loginFailures}</p>
                </div>
                <Shield className="w-7 h-7 text-[#B94A48] opacity-20" />
              </div>
              <p className="text-xs text-[#B94A48]">보안 위협</p>
            </div>

            <div className="bg-white rounded-lg border border-[#D7DEE6] p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#5B6773] mb-1">재고 조정 건수</p>
                  <p className="text-2xl font-bold text-[#5B8DB8]">{inventoryAdjustments}</p>
                </div>
                <Settings className="w-7 h-7 text-[#5B8DB8] opacity-20" />
              </div>
              <p className="text-xs text-[#5B6773]">건</p>
            </div>

            <div className="bg-white rounded-lg border border-[#D7DEE6] p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#5B6773] mb-1">정산 수정 건수</p>
                  <p className="text-2xl font-bold text-[#7B4397]">{settlementEdits}</p>
                </div>
                <Edit className="w-7 h-7 text-[#7B4397] opacity-20" />
              </div>
              <p className="text-xs text-[#7B4397]">재무 변경</p>
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
                      placeholder="사용자, 대상, 번호 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#5B6773]" />
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="px-3 py-2 border border-[#D7DEE6] rounded-md bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    >
                      <option value="오늘">오늘</option>
                      <option value="어제">어제</option>
                      <option value="7일">최근 7일</option>
                      <option value="30일">최근 30일</option>
                    </select>
                    <select
                      value={menuFilter}
                      onChange={(e) => setMenuFilter(e.target.value)}
                      className="px-3 py-2 border border-[#D7DEE6] rounded-md bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    >
                      <option value="전체">전체 메뉴</option>
                      <option value="거래처 관리">거래처 관리</option>
                      <option value="품목 관리">품목 관리</option>
                      <option value="재고 관리">재고 관리</option>
                      <option value="출고 관리">출고 관리</option>
                      <option value="정산 관리">정산 관리</option>
                      <option value="세금계산서">세금계산서</option>
                      <option value="사용자 관리">사용자 관리</option>
                      <option value="문서 관리">문서 관리</option>
                      <option value="설치/A/S">설치/A/S</option>
                    </select>
                    <select
                      value={actionFilter}
                      onChange={(e) => setActionFilter(e.target.value)}
                      className="px-3 py-2 border border-[#D7DEE6] rounded-md bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    >
                      <option value="전체">전체 작업</option>
                      <option value="등록">등록</option>
                      <option value="수정">수정</option>
                      <option value="삭제">삭제</option>
                      <option value="승인">승인</option>
                      <option value="반려">반려</option>
                      <option value="로그인">로그인</option>
                      <option value="다운로드">다운로드</option>
                      <option value="업로드">업로드</option>
                      <option value="권한변경">권한변경</option>
                      <option value="상태변경">상태변경</option>
                    </select>
                    <select
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                      className="px-3 py-2 border border-[#D7DEE6] rounded-md bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    >
                      <option value="전체">전체 사용자</option>
                      <option value="박운영">박운영</option>
                      <option value="강정산">강정산</option>
                      <option value="이영업">이영업</option>
                      <option value="최물류">최물류</option>
                      <option value="김대표">김대표</option>
                      <option value="정서비스">정서비스</option>
                      <option value="unknown">unknown</option>
                    </select>
                    <select
                      value={importanceFilter}
                      onChange={(e) => setImportanceFilter(e.target.value)}
                      className="px-3 py-2 border border-[#D7DEE6] rounded-md bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    >
                      <option value="전체">전체 중요도</option>
                      <option value="긴급">긴급</option>
                      <option value="높음">높음</option>
                      <option value="보통">보통</option>
                      <option value="낮음">낮음</option>
                    </select>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-[#D7DEE6] rounded-md text-[#5B6773] hover:bg-[#F4F7FA] transition-colors text-sm font-semibold">
                  <Download className="w-4 h-4" />
                  로그 내보내기
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {/* Mobile Card View */}
              <div className="lg:hidden p-4 space-y-3">
                {filteredLogs.map((log, index) => (
                  <div 
                    key={index}
                    className="border border-[#D7DEE6] rounded-lg p-4 hover:bg-[#F4F7FA] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${getActionColor(log.action)}`}>
                            {getActionIcon(log.action)}
                            {log.action}
                          </span>
                          {getImportanceBadge(log.importance)}
                        </div>
                        <p className="text-sm font-semibold text-[#18212B] mb-1">{log.userName}</p>
                        <p className="text-xs text-[#5B6773]">{log.department} · {log.menu}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3 pt-3 border-t border-[#D7DEE6]">
                      <div>
                        <p className="text-[10px] text-[#5B6773] mb-0.5">대상명</p>
                        <p className="text-xs text-[#18212B]">{log.target}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#5B6773] mb-0.5">대상번호</p>
                        <p className="text-xs font-semibold text-[#5B8DB8]">{log.targetNumber}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] text-[#5B6773] mb-0.5">변경요약</p>
                        <p className="text-xs text-[#18212B]">{log.summary}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#5B6773] mb-0.5">일시</p>
                        <p className="text-xs font-mono text-[#5B6773]">{log.timestamp}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#5B6773] mb-0.5">IP</p>
                        <p className="text-xs font-mono text-[#5B6773]">{log.ip}</p>
                      </div>
                    </div>
                    
                    <button 
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors text-sm"
                      onClick={() => setSelectedLog(log)}
                    >
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
                    <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[140px]">일시</th>
                    <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[80px]">사용자명</th>
                    <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[80px]">부서</th>
                    <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[100px]">메뉴</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-white min-w-[90px]">작업유형</th>
                    <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[120px]">대상명</th>
                    <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[120px]">대상번호</th>
                    <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[200px]">변경요약</th>
                    <th className="text-left py-3 px-3 text-xs font-bold text-white min-w-[110px]">IP</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-white min-w-[70px]">중요도</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-white min-w-[60px]">상세</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, index) => (
                    <tr key={index} className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors">
                      <td className="py-3 px-3 text-xs text-[#5B6773] font-mono">{log.timestamp}</td>
                      <td className="py-3 px-3 text-xs font-semibold text-[#18212B]">{log.userName}</td>
                      <td className="py-3 px-3 text-xs text-[#5B6773]">{log.department}</td>
                      <td className="py-3 px-3 text-xs text-[#5B6773]">{log.menu}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${getActionColor(log.action)}`}>
                          {getActionIcon(log.action)}
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-xs text-[#18212B]">{log.target}</td>
                      <td className="py-3 px-3 text-xs text-[#5B8DB8] font-semibold">{log.targetNumber}</td>
                      <td className="py-3 px-3 text-xs text-[#5B6773]">{log.summary}</td>
                      <td className="py-3 px-3 text-xs text-[#5B6773] font-mono">{log.ip}</td>
                      <td className="py-3 px-3 text-center">{getImportanceBadge(log.importance)}</td>
                      <td className="py-3 px-3 text-center">
                        <button 
                          className="p-1 hover:bg-[#E8EEF3] rounded transition-colors"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="w-4 h-4 text-[#5B8DB8]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-[#D7DEE6] flex items-center justify-between bg-[#F4F7FA]">
              <p className="text-sm text-[#5B6773]">
                전체 {filteredLogs.length}건 | 보안 감사 로그 추적 시스템
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

      {/* Log Detail Panel */}
      <LogDetailPanel
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        log={selectedLog}
      />
    </div>
  );
}