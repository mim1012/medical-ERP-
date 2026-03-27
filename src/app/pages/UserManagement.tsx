import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { UserForm } from "../components/UserForm";
import { StatusBadge } from "../components/StatusBadge";
import { 
  Plus, 
  Search, 
  Filter,
  Edit,
  Shield,
  Users,
  Key,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";

interface User {
  name: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  roleGroup: string;
  status: string;
}

export function UserManagement() {
  const [activeMenu, setActiveMenu] = useState('users');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'permissions'>('users');

  // Mock data
  const users: User[] = [
    {
      name: '김대표',
      department: '경영지원',
      position: '대표이사',
      email: 'ceo@company.com',
      phone: '010-1234-5678',
      roleGroup: '대표',
      status: '활성'
    },
    {
      name: '이영업',
      department: '영업팀',
      position: '부장',
      email: 'sales.lee@company.com',
      phone: '010-2345-6789',
      roleGroup: '영업팀',
      status: '활성'
    },
    {
      name: '박운영',
      department: '운영팀',
      position: '차장',
      email: 'ops.park@company.com',
      phone: '010-3456-7890',
      roleGroup: '운영팀',
      status: '활성'
    },
    {
      name: '최물류',
      department: '물류팀',
      position: '과장',
      email: 'logistics.choi@company.com',
      phone: '010-4567-8901',
      roleGroup: '물류팀',
      status: '활성'
    },
    {
      name: '정서비스',
      department: 'A/S팀',
      position: '대리',
      email: 'service.jung@company.com',
      phone: '010-5678-9012',
      roleGroup: 'A/S팀',
      status: '활성'
    },
    {
      name: '강정산',
      department: '정산팀',
      position: '과장',
      email: 'finance.kang@company.com',
      phone: '010-6789-0123',
      roleGroup: '정산팀',
      status: '활성'
    },
    {
      name: '윤영업',
      department: '영업팀',
      position: '사원',
      email: 'sales.yoon@company.com',
      phone: '010-7890-1234',
      roleGroup: '영업팀',
      status: '활성'
    },
    {
      name: '임물류',
      department: '물류팀',
      position: '사원',
      email: 'logistics.lim@company.com',
      phone: '010-8901-2345',
      roleGroup: '물류팀',
      status: '휴면'
    },
    {
      name: '한외부',
      department: '외부감사',
      position: '감사',
      email: 'audit.han@external.com',
      phone: '010-9012-3456',
      roleGroup: '읽기전용',
      status: '활성'
    },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === '전체' || user.roleGroup === roleFilter;
    const matchesStatus = statusFilter === '전체' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleFormSubmit = (data: any) => {
    console.log('User submitted:', data);
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      '대표': 'bg-[#FCEBE9] text-[#B94A48]',
      '영업팀': 'bg-[#E6F4EA] text-[#2E7D5B]',
      '운영팀': 'bg-[#E8EEF3] text-[#5B8DB8]',
      '물류팀': 'bg-[#FFF4E5] text-[#C58A2B]',
      'A/S팀': 'bg-[#F0E6F4] text-[#7B4397]',
      '정산팀': 'bg-[#E8F5E9] text-[#2E7D5B]',
      '읽기전용': 'bg-[#F4F7FA] text-[#5B6773]',
    };
    return colors[role] || 'bg-[#E8EEF3] text-[#5B6773]';
  };

  // Permission matrix data
  const modules = [
    '대시보드',
    '거래처 관리',
    '품목 관리',
    '재고 관리',
    '입고 관리',
    '출고 관리',
    '설치/A/S',
    '문서 관리',
    '정산 관리',
    '세금계산서',
    '사용자 관리',
    '시스템 설정'
  ];

  const permissions = {
    '대표': {
      '대시보드': '전체',
      '거래처 관리': '전체',
      '품목 관리': '전체',
      '재고 관리': '전체',
      '입고 관리': '전체',
      '출고 관리': '전체',
      '설치/A/S': '전체',
      '문서 관리': '전체',
      '정산 관리': '전체',
      '세금계산서': '전체',
      '사용자 관리': '전체',
      '시스템 설정': '전체'
    },
    '영업팀': {
      '대시보드': '읽기',
      '거래처 관리': '전체',
      '품목 관리': '읽기',
      '재고 관리': '읽기',
      '입고 관리': '없음',
      '출고 관리': '쓰기',
      '설치/A/S': '읽기',
      '문서 관리': '읽기',
      '정산 관리': '읽기',
      '세금계산서': '읽기',
      '사용자 관리': '없음',
      '시스템 설정': '없음'
    },
    '운영팀': {
      '대시보드': '읽기',
      '거래처 관리': '쓰기',
      '품목 관리': '전체',
      '재고 관리': '전체',
      '입고 관리': '전체',
      '출고 관리': '전체',
      '설치/A/S': '읽기',
      '문서 관리': '쓰기',
      '정산 관리': '읽기',
      '세금계산서': '읽기',
      '사용자 관리': '없음',
      '시스템 설정': '읽기'
    },
    '물류팀': {
      '대시보드': '읽기',
      '거래처 관리': '읽기',
      '품목 관리': '읽기',
      '재고 관리': '전체',
      '입고 관리': '전체',
      '출고 관리': '전체',
      '설치/A/S': '읽기',
      '문서 관리': '읽기',
      '정산 관리': '없음',
      '세금계산서': '없음',
      '사용자 관리': '없음',
      '시스템 설정': '없음'
    },
    'A/S팀': {
      '대시보드': '읽기',
      '거래처 관리': '읽기',
      '품목 관리': '읽기',
      '재고 관리': '읽기',
      '입고 관리': '없음',
      '출고 관리': '읽기',
      '설치/A/S': '전체',
      '문서 관리': '쓰기',
      '정산 관리': '없음',
      '세금계산서': '없음',
      '사용자 관리': '없음',
      '시스템 설정': '없음'
    },
    '정산팀': {
      '대시보드': '읽기',
      '거래처 관리': '읽기',
      '품목 관리': '읽기',
      '재고 관리': '읽기',
      '입고 관리': '읽기',
      '출고 관리': '읽기',
      '설치/A/S': '읽기',
      '문서 관리': '읽기',
      '정산 관리': '전체',
      '세금계산서': '전체',
      '사용자 관리': '없음',
      '시스템 설정': '없음'
    },
    '읽기전용': {
      '대시보드': '읽기',
      '거래처 관리': '읽기',
      '품목 관리': '읽기',
      '재고 관리': '읽기',
      '입고 관리': '읽기',
      '출고 관리': '읽기',
      '설치/A/S': '읽기',
      '문서 관리': '읽기',
      '정산 관리': '읽기',
      '세금계산서': '읽기',
      '사용자 관리': '없음',
      '시스템 설정': '없음'
    }
  };

  const getPermissionBadge = (permission: string) => {
    if (permission === '전체') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-[#E6F4EA] text-[#2E7D5B]">
          <CheckCircle2 className="w-3 h-3" />
          전체
        </span>
      );
    } else if (permission === '쓰기') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-[#E8EEF3] text-[#5B8DB8]">
          <Edit className="w-3 h-3" />
          쓰기
        </span>
      );
    } else if (permission === '읽기') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-[#FFF4E5] text-[#C58A2B]">
          <Shield className="w-3 h-3" />
          읽기
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-[#F4F7FA] text-[#5B6773]">
          <XCircle className="w-3 h-3" />
          없음
        </span>
      );
    }
  };

  // Statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === '활성').length;
  const dormantUsers = users.filter(u => u.status === '휴면').length;
  const roleCount = users.reduce((acc, user) => {
    acc[user.roleGroup] = (acc[user.roleGroup] || 0) + 1;
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
            <h1 className="text-3xl font-bold text-[#18212B] mb-2">사용자/권한 관리</h1>
            <p className="text-[#5B6773]">시스템 사용자 및 권한 관리</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-[#5B6773] mb-1">전체 사용자</p>
                  <p className="text-3xl font-bold text-[#18212B]">{totalUsers}</p>
                  <p className="text-xs text-[#5B6773] mt-1">명</p>
                </div>
                <Users className="w-10 h-10 text-[#163A5F] opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-[#5B6773] mb-1">활성 계정</p>
                  <p className="text-3xl font-bold text-[#2E7D5B]">{activeUsers}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3 text-[#2E7D5B]" />
                    <p className="text-xs text-[#2E7D5B]">정상</p>
                  </div>
                </div>
                <CheckCircle2 className="w-10 h-10 text-[#2E7D5B] opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-[#5B6773] mb-1">휴면 계정</p>
                  <p className="text-3xl font-bold text-[#C58A2B]">{dormantUsers}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-[#C58A2B]" />
                    <p className="text-xs text-[#C58A2B]">미사용</p>
                  </div>
                </div>
                <Clock className="w-10 h-10 text-[#C58A2B] opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-[#5B6773] mb-1">권한그룹</p>
                  <p className="text-3xl font-bold text-[#5B8DB8]">7</p>
                  <p className="text-xs text-[#5B6773] mt-1">개</p>
                </div>
                <Key className="w-10 h-10 text-[#5B8DB8] opacity-20" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-[#D7DEE6] bg-white rounded-t-lg">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-6 py-3 text-sm font-bold transition-colors border-b-2 ${
                    activeTab === 'users'
                      ? 'border-[#163A5F] text-[#163A5F]'
                      : 'border-transparent text-[#5B6773] hover:text-[#163A5F]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    사용자 목록
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('permissions')}
                  className={`px-6 py-3 text-sm font-bold transition-colors border-b-2 ${
                    activeTab === 'permissions'
                      ? 'border-[#163A5F] text-[#163A5F]'
                      : 'border-transparent text-[#5B6773] hover:text-[#163A5F]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    권한 매트릭스
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-lg border border-[#D7DEE6] shadow-sm">
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-[#D7DEE6]">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1 lg:w-80">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5B6773]" />
                      <input
                        type="text"
                        placeholder="이름, 이메일, 부서 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-[#5B6773]" />
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2.5 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                      >
                        <option value="전체">전체 권한</option>
                        <option value="대표">대표</option>
                        <option value="영업팀">영업팀</option>
                        <option value="운영팀">운영팀</option>
                        <option value="물류팀">물류팀</option>
                        <option value="A/S팀">A/S팀</option>
                        <option value="정산팀">정산팀</option>
                        <option value="읽기전용">읽기전용</option>
                      </select>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                      >
                        <option value="전체">전체 상태</option>
                        <option value="활성">활성</option>
                        <option value="휴면">휴면</option>
                        <option value="비활성">비활성</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors text-sm font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    사용자 추가
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                {/* Mobile Card View */}
                <div className="lg:hidden p-4 space-y-3">
                  {filteredUsers.map((user, index) => (
                    <div 
                      key={index}
                      className="border border-[#D7DEE6] rounded-lg p-4 hover:bg-[#F4F7FA] transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-[#18212B] mb-1">{user.name}</p>
                          <p className="text-xs text-[#5B6773] mb-1">{user.department} · {user.position}</p>
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${getRoleColor(user.roleGroup)}`}>
                            <Key className="w-3 h-3" />
                            {user.roleGroup}
                          </span>
                        </div>
                        <StatusBadge status={user.status} />
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2 mb-3 pt-3 border-t border-[#D7DEE6]">
                        <div>
                          <p className="text-[10px] text-[#5B6773] mb-0.5">이메일</p>
                          <p className="text-xs text-[#18212B]">{user.email}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#5B6773] mb-0.5">연락처</p>
                          <p className="text-xs text-[#18212B]">{user.phone}</p>
                        </div>
                      </div>
                      
                      <button 
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors text-sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsFormOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                        수정
                      </button>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <table className="w-full hidden lg:table">
                  <thead>
                    <tr className="border-b-2 border-[#D7DEE6] bg-[#163A5F]">
                      <th className="text-left py-4 px-4 text-sm font-bold text-white min-w-[100px]">이름</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-white min-w-[100px]">부서</th>
                      <th className="text-center py-4 px-4 text-sm font-bold text-white min-w-[100px]">직책</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-white min-w-[200px]">이메일</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-white min-w-[130px]">연락처</th>
                      <th className="text-center py-4 px-4 text-sm font-bold text-white min-w-[120px]">권한그룹</th>
                      <th className="text-center py-4 px-4 text-sm font-bold text-white min-w-[100px]">상태</th>
                      <th className="text-center py-4 px-4 text-sm font-bold text-white min-w-[80px]">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr key={index} className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors">
                        <td className="py-4 px-4 text-sm font-bold text-[#18212B]">{user.name}</td>
                        <td className="py-4 px-4 text-sm text-[#5B6773]">{user.department}</td>
                        <td className="py-4 px-4 text-sm text-center text-[#5B6773]">{user.position}</td>
                        <td className="py-4 px-4 text-sm text-[#5B6773]">{user.email}</td>
                        <td className="py-4 px-4 text-sm text-[#5B6773]">{user.phone}</td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.roleGroup)}`}>
                            <Key className="w-3 h-3" />
                            {user.roleGroup}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <StatusBadge status={user.status} />
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button 
                            className="p-1.5 hover:bg-[#E8EEF3] rounded transition-colors"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsFormOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4 text-[#5B8DB8]" />
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
                  전체 {filteredUsers.length}명
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
          )}

          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <div className="bg-white rounded-lg border border-[#D7DEE6] shadow-sm">
              <div className="px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F]">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  권한 매트릭스
                </h3>
                <p className="text-sm text-white/80 mt-1">각 권한그룹별 시스템 모듈 접근 권한</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-[#D7DEE6] bg-[#F4F7FA]">
                      <th className="text-left py-4 px-4 text-sm font-bold text-[#18212B] min-w-[150px] sticky left-0 bg-[#F4F7FA]">
                        모듈
                      </th>
                      {Object.keys(permissions).map(role => (
                        <th key={role} className="text-center py-4 px-3 text-xs font-bold text-[#18212B] min-w-[100px]">
                          <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full ${getRoleColor(role)}`}>
                            <Key className="w-3 h-3" />
                            {role}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map((module, idx) => (
                      <tr key={idx} className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors">
                        <td className="py-3 px-4 text-sm font-semibold text-[#18212B] sticky left-0 bg-white">
                          {module}
                        </td>
                        {Object.keys(permissions).map(role => (
                          <td key={role} className="py-3 px-3 text-center">
                            {getPermissionBadge(permissions[role as keyof typeof permissions][module])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="px-6 py-4 border-t border-[#D7DEE6] bg-[#F4F7FA]">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#18212B]">권한 범례</p>
                  <div className="flex items-center gap-4">
                    {getPermissionBadge('전체')}
                    {getPermissionBadge('쓰기')}
                    {getPermissionBadge('읽기')}
                    {getPermissionBadge('없음')}
                  </div>
                </div>
                <div className="mt-3 text-xs text-[#5B6773] space-y-1">
                  <p>• <strong>전체</strong>: 조회, 등록, 수정, 삭제 모든 권한</p>
                  <p>• <strong>쓰기</strong>: 조회, 등록, 수정 가능 (삭제 불가)</p>
                  <p>• <strong>읽기</strong>: 조회만 가능</p>
                  <p>• <strong>없음</strong>: 접근 불가</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* User Form Modal */}
      <UserForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedUser}
      />
    </div>
  );
}