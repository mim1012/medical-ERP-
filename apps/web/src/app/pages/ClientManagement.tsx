import { useState } from "react";
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from "../../../hooks/use-clients";
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
  Eye,
  TrendingUp,
  Award,
  FileCheck,
  AlertCircle,
  CreditCard,
  Building2,
  Calendar,
  X
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  // 추가 정보
  contractStart?: string;
  contractEnd?: string;
  beds?: number;
  departments?: string[];
  annualRevenue?: number;
  documentStatus?: {
    businessLicense: boolean;
    bankAccount: boolean;
    medicalLicense: boolean;
    contract: boolean;
  };
}

export function ClientManagement() {
  const [activeMenu, setActiveMenu] = useState('clients');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [detailPanelClients, setDetailPanelClients] = useState<Client[] | null>(null);
  const [detailPanelTitle, setDetailPanelTitle] = useState('');
  const [selectedClientDetail, setSelectedClientDetail] = useState<Client | null>(null);

  const { data: clients = [], isLoading, error } = useClients({ search: searchTerm });
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();


  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleFormSubmit = (data: any) => {
    if (selectedClient?.id) {
      updateClient.mutate({ id: selectedClient.id, ...data }, {
        onSuccess: () => { setIsFormOpen(false); setSelectedClient(null); }
      });
    } else {
      createClient.mutate(data, {
        onSuccess: () => { setIsFormOpen(false); setSelectedClient(null); }
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR');
  };

  const getGradeBadge = (grade?: string) => {
    const gradeColors = {
      VIP: 'bg-gradient-to-r from-[#B8860B] to-[#FFD700] text-white',
      Gold: 'bg-gradient-to-r from-[#CD7F32] to-[#FFA500] text-white',
      Silver: 'bg-gradient-to-r from-[#C0C0C0] to-[#E8E8E8] text-[#18212B]',
      Bronze: 'bg-gradient-to-r from-[#8B4513] to-[#CD853F] text-white'
    };

    if (!grade) return null;

    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${gradeColors[grade as keyof typeof gradeColors]}`}>
        {grade}
      </span>
    );
  };

  // 거래처별 월별 매출 Mock 데이터
  const getClientMonthlyRevenue = (clientCode: string) => {
    return [
      { month: '9월', revenue: 45000000 },
      { month: '10월', revenue: 62000000 },
      { month: '11월', revenue: 58000000 },
      { month: '12월', revenue: 71000000 },
      { month: '1월', revenue: 68000000 },
      { month: '2월', revenue: 82000000 },
    ];
  };

  // 필수 문서 완성도
  const getDocumentCompleteness = (docs?: Client['documentStatus']) => {
    if (!docs) return 0;
    const total = Object.keys(docs).length;
    const completed = Object.values(docs).filter(v => v).length;
    return Math.round((completed / total) * 100);
  };

  // 계약 만료까지 남은 일수
  const getDaysUntilContractEnd = (endDate?: string) => {
    if (!endDate) return null;
    const today = new Date('2026-03-15');
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
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

          {/* Enhanced Stats Cards */}
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
                const expiringSoon = clients.filter(c => {
                  const days = getDaysUntilContractEnd(c.contractEnd);
                  return days !== null && days <= 90 && days > 0;
                });
                setDetailPanelClients(expiringSoon);
                setDetailPanelTitle('계약 만료 임박 (90일 이내)');
              }}
              className="bg-white rounded-lg border border-[#D7DEE6] p-4 lg:p-6 shadow-sm cursor-pointer hover:border-[#C58A2B] hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3 text-[#C58A2B]" />
                <p className="text-xs lg:text-sm text-[#5B6773]">계약 만료 임박</p>
              </div>
              <p className="text-xl lg:text-3xl font-bold text-[#C58A2B]">
                {clients.filter(c => {
                  const days = getDaysUntilContractEnd(c.contractEnd);
                  return days !== null && days <= 90 && days > 0;
                }).length}
              </p>
              <p className="text-[10px] lg:text-xs text-[#C58A2B] mt-1">90일 이내</p>
            </div>

            <div 
              onClick={() => {
                const incompleteDoc = clients.filter(c => getDocumentCompleteness(c.documentStatus) < 100);
                setDetailPanelClients(incompleteDoc);
                setDetailPanelTitle('문서 미비 거래처');
              }}
              className="bg-white rounded-lg border border-[#D7DEE6] p-4 lg:p-6 shadow-sm cursor-pointer hover:border-[#B94A48] hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-1 mb-1">
                <FileCheck className="w-3 h-3 text-[#B94A48]" />
                <p className="text-xs lg:text-sm text-[#5B6773]">문서 미비</p>
              </div>
              <p className="text-xl lg:text-3xl font-bold text-[#B94A48]">
                {clients.filter(c => getDocumentCompleteness(c.documentStatus) < 100).length}
              </p>
              <p className="text-[10px] lg:text-xs text-[#B94A48] mt-1">서류 불완전</p>
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
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#18212B]">등급</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#18212B]">거래처명</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#18212B]">유형</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#18212B]">담당자</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#18212B]">지역</th>
                    <th className="text-right py-4 px-4 text-sm font-semibold text-[#18212B]">연매출</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#18212B]">계약만료</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#18212B]">문서</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#18212B]">상태</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#18212B]">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => {
                    const docComplete = getDocumentCompleteness(client.documentStatus);
                    const daysLeft = getDaysUntilContractEnd(client.contractEnd);

                    return (
                      <tr key={client.code} className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors">
                        <td className="py-4 px-4 text-center">
                          {getGradeBadge(client.grade)}
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-sm font-semibold text-[#18212B]">{client.name}</p>
                            <p className="text-xs text-[#5B6773]">{client.code}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-[#5B6773]">{client.type}</td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-sm text-[#18212B]">{client.contactPerson}</p>
                            <p className="text-xs text-[#5B6773]">{client.phone}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-center text-[#5B6773]">{client.region}</td>
                        <td className="py-4 px-4 text-sm text-right font-semibold text-[#18212B]">
                          {client.annualRevenue ? `${(client.annualRevenue / 100000000).toFixed(1)}억` : '-'}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {daysLeft !== null ? (
                            <span className={`text-sm font-semibold ${daysLeft <= 30 ? 'text-[#B94A48]' : daysLeft <= 90 ? 'text-[#C58A2B]' : 'text-[#2E7D5B]'}`}>
                              {daysLeft}일
                            </span>
                          ) : (
                            <span className="text-sm text-[#5B6773]">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className={`text-xs font-semibold ${docComplete === 100 ? 'text-[#2E7D5B]' : 'text-[#B94A48]'}`}>
                              {docComplete}%
                            </span>
                            {docComplete < 100 && <AlertCircle className="w-3 h-3 text-[#B94A48]" />}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <StatusBadge status={client.status} />
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button 
                              className="p-1.5 hover:bg-[#E8EEF3] rounded transition-colors" 
                              title="상세보기"
                              onClick={() => setSelectedClientDetail(client)}
                            >
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
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-[#D7DEE6]">
              {filteredClients.map((client) => {
                const docComplete = getDocumentCompleteness(client.documentStatus);
                const daysLeft = getDaysUntilContractEnd(client.contractEnd);

                return (
                  <div key={client.code} className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-[#18212B]">{client.name}</h3>
                          {getGradeBadge(client.grade)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#5B6773]">{client.region}</span>
                          <span className="text-[#D7DEE6]">•</span>
                          <span className="text-sm text-[#5B6773]">{client.type}</span>
                        </div>
                      </div>
                      <StatusBadge status={client.status} />
                    </div>
                    
                    <div className="bg-[#F4F7FA] rounded-lg p-4 mb-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#5B6773] font-medium">담당자</span>
                        <span className="text-sm text-[#18212B] font-semibold">{client.contactPerson}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#5B6773] font-medium">연매출</span>
                        <span className="text-sm text-[#18212B] font-semibold">
                          {client.annualRevenue ? `${(client.annualRevenue / 100000000).toFixed(1)}억원` : '-'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#5B6773] font-medium">계약만료</span>
                        {daysLeft !== null ? (
                          <span className={`text-sm font-semibold ${daysLeft <= 30 ? 'text-[#B94A48]' : daysLeft <= 90 ? 'text-[#C58A2B]' : 'text-[#2E7D5B]'}`}>
                            {daysLeft}일 남음
                          </span>
                        ) : (
                          <span className="text-sm text-[#5B6773]">-</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#5B6773] font-medium">문서 완성도</span>
                        <div className="flex items-center gap-1">
                          <span className={`text-sm font-semibold ${docComplete === 100 ? 'text-[#2E7D5B]' : 'text-[#B94A48]'}`}>
                            {docComplete}%
                          </span>
                          {docComplete < 100 && <AlertCircle className="w-4 h-4 text-[#B94A48]" />}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedClientDetail(client)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#D7DEE6] rounded-lg text-[#5B6773] hover:bg-[#F4F7FA] hover:border-[#5B8DB8] transition-all font-semibold"
                      >
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
                );
              })}
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

      {/* Enhanced Client Detail Modal */}
      {selectedClientDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[#D7DEE6] p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-[#5B8DB8]" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-[#18212B]">{selectedClientDetail.name}</h2>
                    {getGradeBadge(selectedClientDetail.grade)}
                  </div>
                  <p className="text-sm text-[#5B6773]">{selectedClientDetail.code}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedClientDetail(null)}
                className="p-2 hover:bg-[#F4F7FA] rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-[#5B6773]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#F4F7FA] rounded-lg p-4">
                  <p className="text-xs text-[#5B6773] mb-1">대표자</p>
                  <p className="text-lg font-semibold text-[#18212B]">{selectedClientDetail.representative}</p>
                </div>
                <div className="bg-[#F4F7FA] rounded-lg p-4">
                  <p className="text-xs text-[#5B6773] mb-1">담당자</p>
                  <p className="text-lg font-semibold text-[#18212B]">{selectedClientDetail.contactPerson}</p>
                </div>
                <div className="bg-[#F4F7FA] rounded-lg p-4">
                  <p className="text-xs text-[#5B6773] mb-1">연락처</p>
                  <p className="text-lg font-semibold text-[#5B8DB8]">{selectedClientDetail.phone}</p>
                </div>
                <div className="bg-[#F4F7FA] rounded-lg p-4">
                  <p className="text-xs text-[#5B6773] mb-1">지역</p>
                  <p className="text-lg font-semibold text-[#18212B]">{selectedClientDetail.region}</p>
                </div>
              </div>

              {/* Medical Institution Info */}
              <div className="bg-gradient-to-br from-[#F4F7FA] to-[#E8EEF3] rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#18212B] mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#5B8DB8]" />
                  의료기관 정보
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-[#5B6773] mb-2">기관 유형</p>
                    <p className="text-base font-semibold text-[#18212B]">{selectedClientDetail.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#5B6773] mb-2">병상 수</p>
                    <p className="text-base font-semibold text-[#18212B]">{selectedClientDetail.beds?.toLocaleString()}개</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#5B6773] mb-2">주요 진료과</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedClientDetail.departments?.map((dept, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white rounded text-xs font-semibold text-[#5B8DB8]">
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Credit Info */}
                <div className="bg-white border border-[#D7DEE6] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-[#18212B] mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#5B8DB8]" />
                    여신 관리
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#5B6773]">여신 한도</span>
                      <span className="text-lg font-bold text-[#18212B]">
                        {selectedClientDetail.creditLimit ? `${(selectedClientDetail.creditLimit / 100000000).toFixed(1)}억원` : '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#5B6773]">사용 금액</span>
                      <span className="text-lg font-bold text-[#B94A48]">
                        {selectedClientDetail.creditUsed ? `${(selectedClientDetail.creditUsed / 100000000).toFixed(1)}억원` : '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#5B6773]">잔여 한도</span>
                      <span className="text-lg font-bold text-[#2E7D5B]">
                        {selectedClientDetail.creditLimit && selectedClientDetail.creditUsed 
                          ? `${((selectedClientDetail.creditLimit - selectedClientDetail.creditUsed) / 100000000).toFixed(1)}억원` 
                          : '-'}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-[#D7DEE6]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#5B6773]">사용률</span>
                        <span className={`text-lg font-bold ${getCreditUsageRate(selectedClientDetail) >= 80 ? 'text-[#B94A48]' : getCreditUsageRate(selectedClientDetail) >= 50 ? 'text-[#C58A2B]' : 'text-[#2E7D5B]'}`}>
                          {getCreditUsageRate(selectedClientDetail)}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-[#E8EEF3] rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getCreditUsageRate(selectedClientDetail) >= 80 ? 'bg-[#B94A48]' : getCreditUsageRate(selectedClientDetail) >= 50 ? 'bg-[#C58A2B]' : 'bg-[#2E7D5B]'}`}
                          style={{ width: `${getCreditUsageRate(selectedClientDetail)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contract Info */}
                <div className="bg-white border border-[#D7DEE6] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-[#18212B] mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#5B8DB8]" />
                    계약 정보
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#5B6773]">계약 시작일</span>
                      <span className="text-base font-semibold text-[#18212B]">
                        {selectedClientDetail.contractStart || '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#5B6773]">계약 종료일</span>
                      <span className="text-base font-semibold text-[#18212B]">
                        {selectedClientDetail.contractEnd || '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#5B6773]">남은 기간</span>
                      {getDaysUntilContractEnd(selectedClientDetail.contractEnd) !== null ? (
                        <span className={`text-lg font-bold ${getDaysUntilContractEnd(selectedClientDetail.contractEnd)! <= 30 ? 'text-[#B94A48]' : getDaysUntilContractEnd(selectedClientDetail.contractEnd)! <= 90 ? 'text-[#C58A2B]' : 'text-[#2E7D5B]'}`}>
                          {getDaysUntilContractEnd(selectedClientDetail.contractEnd)}일
                        </span>
                      ) : (
                        <span className="text-base text-[#5B6773]">-</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[#D7DEE6]">
                      <span className="text-sm text-[#5B6773]">등록일</span>
                      <span className="text-base font-semibold text-[#18212B]">
                        {selectedClientDetail.registrationDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Status */}
              <div className="bg-white border border-[#D7DEE6] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#18212B] flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-[#5B8DB8]" />
                    필수 문서 현황
                  </h3>
                  <span className={`text-lg font-bold ${getDocumentCompleteness(selectedClientDetail.documentStatus) === 100 ? 'text-[#2E7D5B]' : 'text-[#B94A48]'}`}>
                    {getDocumentCompleteness(selectedClientDetail.documentStatus)}%
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className={`p-3 rounded-lg border-2 ${selectedClientDetail.documentStatus?.businessLicense ? 'border-[#2E7D5B] bg-[#F0F9F4]' : 'border-[#B94A48] bg-[#FEF2F2]'}`}>
                    <p className="text-xs text-[#5B6773] mb-1">사업자등록증</p>
                    <p className={`text-sm font-bold ${selectedClientDetail.documentStatus?.businessLicense ? 'text-[#2E7D5B]' : 'text-[#B94A48]'}`}>
                      {selectedClientDetail.documentStatus?.businessLicense ? '✓ 완료' : '✗ 미제출'}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg border-2 ${selectedClientDetail.documentStatus?.bankAccount ? 'border-[#2E7D5B] bg-[#F0F9F4]' : 'border-[#B94A48] bg-[#FEF2F2]'}`}>
                    <p className="text-xs text-[#5B6773] mb-1">통장사본</p>
                    <p className={`text-sm font-bold ${selectedClientDetail.documentStatus?.bankAccount ? 'text-[#2E7D5B]' : 'text-[#B94A48]'}`}>
                      {selectedClientDetail.documentStatus?.bankAccount ? '✓ 완료' : '✗ 미제출'}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg border-2 ${selectedClientDetail.documentStatus?.medicalLicense ? 'border-[#2E7D5B] bg-[#F0F9F4]' : 'border-[#B94A48] bg-[#FEF2F2]'}`}>
                    <p className="text-xs text-[#5B6773] mb-1">개설허가증</p>
                    <p className={`text-sm font-bold ${selectedClientDetail.documentStatus?.medicalLicense ? 'text-[#2E7D5B]' : 'text-[#B94A48]'}`}>
                      {selectedClientDetail.documentStatus?.medicalLicense ? '✓ 완료' : '✗ 미제출'}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg border-2 ${selectedClientDetail.documentStatus?.contract ? 'border-[#2E7D5B] bg-[#F0F9F4]' : 'border-[#B94A48] bg-[#FEF2F2]'}`}>
                    <p className="text-xs text-[#5B6773] mb-1">계약서</p>
                    <p className={`text-sm font-bold ${selectedClientDetail.documentStatus?.contract ? 'text-[#2E7D5B]' : 'text-[#B94A48]'}`}>
                      {selectedClientDetail.documentStatus?.contract ? '✓ 완료' : '✗ 미제출'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sales Trend Chart */}
              <div className="bg-white border border-[#D7DEE6] rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#18212B] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#5B8DB8]" />
                  월별 매출 추이
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={getClientMonthlyRevenue(selectedClientDetail.code)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D7DEE6" />
                    <XAxis dataKey="month" stroke="#5B6773" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#5B6773" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      formatter={(value: number) => `${(value / 10000000).toFixed(0)}천만원`}
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #D7DEE6', borderRadius: '6px', fontSize: '12px' }}
                    />
                    <Bar dataKey="revenue" fill="#5B8DB8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-[#D7DEE6]">
                  <div className="text-center">
                    <p className="text-xs text-[#5B6773] mb-1">연매출</p>
                    <p className="text-lg font-bold text-[#18212B]">
                      {selectedClientDetail.annualRevenue ? `${(selectedClientDetail.annualRevenue / 100000000).toFixed(1)}억원` : '-'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#5B6773] mb-1">월평균</p>
                    <p className="text-lg font-bold text-[#5B8DB8]">
                      {selectedClientDetail.annualRevenue ? `${(selectedClientDetail.annualRevenue / 12 / 10000000).toFixed(0)}천만원` : '-'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#5B6773] mb-1">전월대비</p>
                    <p className="text-lg font-bold text-[#2E7D5B]">+18.2%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-white border-t border-[#D7DEE6] p-6 flex items-center justify-end gap-3">
              <button 
                onClick={() => setSelectedClientDetail(null)}
                className="px-6 py-2.5 border border-[#D7DEE6] rounded-lg text-[#5B6773] hover:bg-[#F4F7FA] transition-colors font-semibold"
              >
                닫기
              </button>
              <button 
                onClick={() => {
                  setSelectedClient(selectedClientDetail);
                  setSelectedClientDetail(null);
                  setIsFormOpen(true);
                }}
                className="px-6 py-2.5 bg-[#163A5F] text-white rounded-lg hover:bg-[#0F2942] transition-colors font-semibold"
              >
                수정하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}