import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { ClientForm } from "../components/ClientForm";
import { ClientDetailPanel } from "../components/ClientDetailPanel";
import { StatusBadge } from "../components/StatusBadge";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from "lucide-react";

interface Client {
  code: string;
  name: string;
  type: string;
  representative: string;
  contactPerson: string;
  phone: string;
  region: string;
  unpaidBalance: number;
  lastTransaction: string;
  status: string;
  registrationDate: string;
}

export function ClientManagement() {
  const [activeMenu, setActiveMenu] = useState('clients');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [detailPanelClients, setDetailPanelClients] = useState<Client[] | null>(null);
  const [detailPanelTitle, setDetailPanelTitle] = useState('');

  // Mock data
  const clients: Client[] = [
    {
      code: 'CL-2024-001',
      name: '서울대학교병원',
      type: '종합병원',
      representative: '김병원',
      contactPerson: '이담당',
      phone: '02-2072-2114',
      region: '서울',
      unpaidBalance: 45000000,
      lastTransaction: '2026-03-01',
      status: '정상',
      registrationDate: '2024-01-15'
    },
    {
      code: 'CL-2024-002',
      name: '삼성서울병원',
      type: '종합병원',
      representative: '박의사',
      contactPerson: '최담당',
      phone: '02-3410-2114',
      region: '서울',
      unpaidBalance: 0,
      lastTransaction: '2026-03-02',
      status: '정상',
      registrationDate: '2024-02-20'
    },
    {
      code: 'CL-2024-003',
      name: '세브란스병원',
      type: '종합병원',
      representative: '정원장',
      contactPerson: '강담당',
      phone: '02-2228-5800',
      region: '서울',
      unpaidBalance: 23000000,
      lastTransaction: '2026-02-28',
      status: '정상',
      registrationDate: '2024-03-10'
    },
    {
      code: 'CL-2024-004',
      name: '아산병원',
      type: '종합병원',
      representative: '송대표',
      contactPerson: '윤담당',
      phone: '02-3010-3114',
      region: '서울',
      unpaidBalance: 0,
      lastTransaction: '2026-03-01',
      status: '정상',
      registrationDate: '2024-04-05'
    },
    {
      code: 'CL-2024-005',
      name: '강남병원',
      type: '병원',
      representative: '조원장',
      contactPerson: '임담당',
      phone: '02-1234-5678',
      region: '서울',
      unpaidBalance: 12000000,
      lastTransaction: '2026-02-25',
      status: '보류',
      registrationDate: '2024-05-25'
    },
    {
      code: 'CL-2024-006',
      name: '부산대학교병원',
      type: '종합병원',
      representative: '한원장',
      contactPerson: '신담당',
      phone: '051-240-7000',
      region: '부산',
      unpaidBalance: 8500000,
      lastTransaction: '2026-02-20',
      status: '정상',
      registrationDate: '2024-06-10'
    },
    {
      code: 'CL-2024-007',
      name: '경희의료원',
      type: '의원',
      representative: '오원장',
      contactPerson: '유담당',
      phone: '02-958-8114',
      region: '서울',
      unpaidBalance: 0,
      lastTransaction: '2026-02-28',
      status: '정상',
      registrationDate: '2024-07-01'
    },
    {
      code: 'CL-2024-008',
      name: '청담의원',
      type: '의원',
      representative: '서원장',
      contactPerson: '황담당',
      phone: '02-3456-7890',
      region: '서울',
      unpaidBalance: 5200000,
      lastTransaction: '2026-02-15',
      status: '중지',
      registrationDate: '2024-08-15'
    },
  ];

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleFormSubmit = (data: any) => {
    console.log('Form submitted:', data);
    setIsFormOpen(false);
    setSelectedClient(null);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR');
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
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#18212B] mb-2">거래처 관리</h1>
            <p className="text-sm lg:text-base text-[#5B6773]">거래처 정보 조회 및 관리</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
            <div 
              onClick={() => {
                setDetailPanelClients(clients);
                setDetailPanelTitle('전체 거래처 목록');
              }}
              className="bg-white rounded-lg border border-[#D7DEE6] p-4 lg:p-6 shadow-sm cursor-pointer hover:border-[#5B8DB8] hover:shadow-md transition-all"
            >
              <p className="text-xs lg:text-sm text-[#5B6773] mb-1">전체 거래처</p>
              <p className="text-xl lg:text-3xl font-bold text-[#18212B]">{clients.length}</p>
              <p className="text-[10px] lg:text-xs text-[#2E7D5B] mt-1">활성: {clients.filter(c => c.status === '정상').length}개</p>
            </div>
            <div 
              onClick={() => {
                const unpaidClients = clients.filter(c => c.unpaidBalance > 0);
                setDetailPanelClients(unpaidClients);
                setDetailPanelTitle('미수금 보유 거래처');
              }}
              className="bg-white rounded-lg border border-[#D7DEE6] p-4 lg:p-6 shadow-sm cursor-pointer hover:border-[#B94A48] hover:shadow-md transition-all"
            >
              <p className="text-xs lg:text-sm text-[#5B6773] mb-1">총 미수금</p>
              <p className="text-xl lg:text-3xl font-bold text-[#B94A48]">{(clients.reduce((sum, c) => sum + c.unpaidBalance, 0) / 10000).toFixed(0)}만원</p>
              <p className="text-[10px] lg:text-xs text-[#5B6773] mt-1">미수: {clients.filter(c => c.unpaidBalance > 0).length}개</p>
            </div>
            <div 
              onClick={() => {
                const newClients = clients.filter(c => {
                  const regDate = new Date(c.registrationDate);
                  const currentDate = new Date('2026-03-03');
                  return regDate.getMonth() === currentDate.getMonth() && regDate.getFullYear() === currentDate.getFullYear();
                });
                setDetailPanelClients(newClients);
                setDetailPanelTitle('이번 달 신규 거래처');
              }}
              className="bg-white rounded-lg border border-[#D7DEE6] p-4 lg:p-6 shadow-sm cursor-pointer hover:border-[#5B8DB8] hover:shadow-md transition-all"
            >
              <p className="text-xs lg:text-sm text-[#5B6773] mb-1">이번 달 신규</p>
              <p className="text-xl lg:text-3xl font-bold text-[#5B8DB8]">3개</p>
              <p className="text-[10px] lg:text-xs text-[#2E7D5B] mt-1">전월 +2개</p>
            </div>
            <div 
              onClick={() => {
                const suspendedClients = clients.filter(c => c.status === '중지' || c.status === '보류');
                setDetailPanelClients(suspendedClients);
                setDetailPanelTitle('거래 중지/보류 거래처');
              }}
              className="bg-white rounded-lg border border-[#D7DEE6] p-4 lg:p-6 shadow-sm cursor-pointer hover:border-[#C58A2B] hover:shadow-md transition-all"
            >
              <p className="text-xs lg:text-sm text-[#5B6773] mb-1">거래 중지</p>
              <p className="text-xl lg:text-3xl font-bold text-[#C58A2B]">{clients.filter(c => c.status === '중지').length}개</p>
              <p className="text-[10px] lg:text-xs text-[#5B6773] mt-1">보류: {clients.filter(c => c.status === '보류').length}개</p>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg border border-[#D7DEE6] shadow-sm">
            {/* Table Header */}
            <div className="px-4 lg:px-6 py-4 border-b border-[#D7DEE6]">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative flex-1 lg:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5B6773]" />
                    <input
                      type="text"
                      placeholder="거래처명, 코드, 담당자 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="hidden md:flex items-center gap-2 px-4 py-2.5 border border-[#D7DEE6] rounded-md text-[#5B6773] hover:bg-[#F4F7FA] transition-colors text-sm font-semibold">
                    <Upload className="w-4 h-4" />
                    <span className="hidden lg:inline">가져오기</span>
                  </button>
                  <button className="hidden md:flex items-center gap-2 px-4 py-2.5 border border-[#D7DEE6] rounded-md text-[#5B6773] hover:bg-[#F4F7FA] transition-colors text-sm font-semibold">
                    <Download className="w-4 h-4" />
                    <span className="hidden lg:inline">내보내기</span>
                  </button>
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors text-sm font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>신규 등록</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#D7DEE6] bg-[#F4F7FA]">
                    <th className="text-center py-4 px-6 text-sm font-semibold text-[#18212B] min-w-[120px]">등록일</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-[#18212B] min-w-[200px]">거래처명</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-[#18212B] min-w-[120px]">대표자명</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-[#18212B] min-w-[120px]">담당자명</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-[#18212B] min-w-[140px]">연락처</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-[#18212B] min-w-[100px]">지역</th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-[#18212B] min-w-[140px]">미수금</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-[#18212B] min-w-[120px]">최근거래일</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-[#18212B] min-w-[100px]">상태</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-[#18212B] min-w-[100px]">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.code} className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors">
                      <td className="py-4 px-6 text-sm text-center text-[#5B6773]">{client.registrationDate}</td>
                      <td className="py-4 px-6 text-sm font-semibold text-[#18212B]">{client.name}</td>
                      <td className="py-4 px-6 text-sm text-[#18212B]">{client.representative}</td>
                      <td className="py-4 px-6 text-sm text-[#18212B]">{client.contactPerson}</td>
                      <td className="py-4 px-6 text-sm text-[#5B6773]">{client.phone}</td>
                      <td className="py-4 px-6 text-sm text-center text-[#5B6773]">{client.region}</td>
                      <td className="py-4 px-6 text-sm text-right">
                        <span className={client.unpaidBalance > 0 ? 'text-[#B94A48] font-semibold' : 'text-[#2E7D5B]'}>
                          {client.unpaidBalance > 0 ? formatCurrency(client.unpaidBalance) : '-'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-center text-[#5B6773]">{client.lastTransaction}</td>
                      <td className="py-4 px-6 text-center">
                        <StatusBadge status={client.status} />
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 hover:bg-[#E8EEF3] rounded transition-colors" title="상세보기">
                            <Eye className="w-4 h-4 text-[#5B6773]" />
                          </button>
                          <button 
                            className="p-1.5 hover:bg-[#E8EEF3] rounded transition-colors"
                            title="수정"
                            onClick={() => {
                              setSelectedClient(client);
                              setIsFormOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4 text-[#5B8DB8]" />
                          </button>
                          <button className="p-1.5 hover:bg-[#E8EEF3] rounded transition-colors" title="삭제">
                            <Trash2 className="w-4 h-4 text-[#B94A48]" />
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
              {filteredClients.map((client) => (
                <div key={client.code} className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#18212B] mb-2">{client.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#5B6773]">{client.region}</span>
                        <span className="text-[#D7DEE6]">•</span>
                        <span className="text-sm text-[#5B6773]">{client.registrationDate}</span>
                      </div>
                    </div>
                    <StatusBadge status={client.status} />
                  </div>
                  
                  <div className="bg-[#F4F7FA] rounded-lg p-4 mb-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#5B6773] font-medium">대표자</span>
                      <span className="text-sm text-[#18212B] font-semibold">{client.representative}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#5B6773] font-medium">담당자</span>
                      <span className="text-sm text-[#18212B] font-semibold">{client.contactPerson}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#5B6773] font-medium">연락처</span>
                      <span className="text-sm text-[#5B8DB8] font-semibold">{client.phone}</span>
                    </div>
                    <div className="h-px bg-[#D7DEE6] my-2"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#5B6773] font-medium">미수금</span>
                      <span className={`text-base font-bold ${client.unpaidBalance > 0 ? 'text-[#B94A48]' : 'text-[#2E7D5B]'}`}>
                        {client.unpaidBalance > 0 ? formatCurrency(client.unpaidBalance) + '원' : '없음'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#5B6773] font-medium">최근거래일</span>
                      <span className="text-sm text-[#18212B] font-semibold">{client.lastTransaction}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#D7DEE6] rounded-lg text-[#5B6773] hover:bg-[#F4F7FA] hover:border-[#5B8DB8] transition-all font-semibold">
                      <Eye className="w-5 h-5" />
                      상세
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedClient(client);
                        setIsFormOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#163A5F] text-white rounded-lg hover:bg-[#0F2942] transition-all font-semibold"
                    >
                      <Edit className="w-5 h-5" />
                      수정
                    </button>
                    <button className="p-3 border-2 border-[#D7DEE6] rounded-lg hover:bg-[#FEF2F2] hover:border-[#B94A48] transition-all">
                      <Trash2 className="w-5 h-5 text-[#B94A48]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="px-4 lg:px-6 py-4 border-t border-[#D7DEE6] flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs lg:text-sm text-[#5B6773]">
                전체 {filteredClients.length}개 중 1-{Math.min(10, filteredClients.length)}개 표시
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

      {/* Client Form Modal */}
      <ClientForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedClient(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedClient}
      />

      {/* Client Detail Panel */}
      <ClientDetailPanel
        isOpen={!!detailPanelClients}
        clients={detailPanelClients}
        title={detailPanelTitle}
        onClose={() => {
          setDetailPanelClients(null);
          setDetailPanelTitle('');
        }}
      />
    </div>
  );
}
