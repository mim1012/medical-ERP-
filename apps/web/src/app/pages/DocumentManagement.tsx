import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { DocumentForm } from "../components/DocumentForm";
import { DocumentDetailPanel } from "../components/DocumentDetailPanel";
import { StatusBadge } from "../components/StatusBadge";
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit,
  FileText,
  FolderOpen,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar
} from "lucide-react";

interface Document {
  documentName: string;
  documentType: string;
  relatedProduct: string;
  relatedClient: string;
  version: string;
  uploadDate: string;
  expiryDate: string;
  status: string;
  daysUntilExpiry?: number;
}

export function DocumentManagement() {
  const [activeMenu, setActiveMenu] = useState('documents');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [detailPanelDocuments, setDetailPanelDocuments] = useState<Document[] | null>(null);
  const [detailPanelTitle, setDetailPanelTitle] = useState('');

  // Mock data
  const documents: Document[] = [
    {
      documentName: 'MRI-3000 의료기기 인증서',
      documentType: '인증서',
      relatedProduct: 'MRI 스캐너',
      relatedClient: '성메디슨',
      version: '2.0',
      uploadDate: '2025-01-15',
      expiryDate: '2027-01-15',
      status: '유효',
      daysUntilExpiry: 683
    },
    {
      documentName: 'CT 스캐너 제조허가증',
      documentType: '인허가',
      relatedProduct: 'CT 스캐너',
      relatedClient: 'GE헬스케어',
      version: '1.5',
      uploadDate: '2024-06-20',
      expiryDate: '2026-06-20',
      status: '유효',
      daysUntilExpiry: 475
    },
    {
      documentName: '초음파 진단기 사용 매뉴얼',
      documentType: '매뉴얼',
      relatedProduct: '초음파 진단기',
      relatedClient: '필립스',
      version: '3.2',
      uploadDate: '2025-11-05',
      expiryDate: '-',
      status: '최신',
      daysUntilExpiry: 9999
    },
    {
      documentName: 'X-Ray 시스템 기술사양서',
      documentType: '기술문서',
      relatedProduct: 'X-Ray 시스템',
      relatedClient: 'GE헬스케어',
      version: '1.0',
      uploadDate: '2025-08-10',
      expiryDate: '-',
      status: '최신',
      daysUntilExpiry: 9999
    },
    {
      documentName: '심전도기 제품 브로슈어',
      documentType: '브로슈어',
      relatedProduct: '심전도기',
      relatedClient: '삼성메디슨',
      version: '2.1',
      uploadDate: '2025-09-20',
      expiryDate: '-',
      status: '최신',
      daysUntilExpiry: 9999
    },
    {
      documentName: '공급계약서 - 서울대병원',
      documentType: '계약서',
      relatedProduct: '-',
      relatedClient: '서울대병원',
      version: '1.0',
      uploadDate: '2024-01-01',
      expiryDate: '2026-04-15',
      status: '만료임박',
      daysUntilExpiry: 44
    },
    {
      documentName: '세금계산서 발행증명',
      documentType: '세무서류',
      relatedProduct: '-',
      relatedClient: '삼성서울병원',
      version: '1.0',
      uploadDate: '2026-02-28',
      expiryDate: '2027-02-28',
      status: '유효',
      daysUntilExpiry: 362
    },
    {
      documentName: 'ISO 13485 인증서',
      documentType: '인증서',
      relatedProduct: '-',
      relatedClient: '-',
      version: '1.0',
      uploadDate: '2023-05-10',
      expiryDate: '2026-03-10',
      status: '만료임박',
      daysUntilExpiry: 8
    },
    {
      documentName: 'MRI 소모품 납품계약',
      documentType: '계약서',
      relatedProduct: 'MRI 조영제',
      relatedClient: '바이엘코리아',
      version: '2.0',
      uploadDate: '2025-12-01',
      expiryDate: '2026-12-01',
      status: '유효',
      daysUntilExpiry: 274
    },
    {
      documentName: '의료기기 안전관리 지침서',
      documentType: '기술문서',
      relatedProduct: '-',
      relatedClient: '-',
      version: '4.0',
      uploadDate: '2026-01-05',
      expiryDate: '-',
      status: '최신',
      daysUntilExpiry: 9999
    },
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.relatedProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.relatedClient.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === '전체' || doc.documentType === typeFilter;
    const matchesStatus = statusFilter === '전체' || doc.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleFormSubmit = (data: any) => {
    console.log('Document submitted:', data);
    setIsFormOpen(false);
    setSelectedDocument(null);
  };

  const getExpiryBadge = (days: number | undefined, date: string) => {
    if (date === '-') return <span className="text-[#5B6773]">-</span>;
    if (!days) return <span className="text-[#5B6773]">{date}</span>;
    
    if (days <= 30) return <span className="text-[#B94A48] font-bold">{date} (D-{days})</span>;
    if (days <= 60) return <span className="text-[#C58A2B] font-semibold">{date} (D-{days})</span>;
    if (days <= 90) return <span className="text-[#C58A2B]">{date} (D-{days})</span>;
    return <span className="text-[#5B6773]">{date}</span>;
  };

  const getDocumentTypeIcon = (type: string) => {
    const icons: { [key: string]: JSX.Element } = {
      '인허가': <FileText className="w-4 h-4" />,
      '인증서': <CheckCircle className="w-4 h-4" />,
      '매뉴얼': <FolderOpen className="w-4 h-4" />,
      '브로슈어': <FileText className="w-4 h-4" />,
      '기술문서': <FileText className="w-4 h-4" />,
      '계약서': <FileText className="w-4 h-4" />,
      '세무서류': <FileText className="w-4 h-4" />,
    };
    return icons[type] || <FileText className="w-4 h-4" />;
  };

  const getDocumentTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      '인허가': 'bg-[#FCEBE9] text-[#B94A48]',
      '인증서': 'bg-[#E6F4EA] text-[#2E7D5B]',
      '매뉴얼': 'bg-[#E8EEF3] text-[#5B8DB8]',
      '브로슈어': 'bg-[#F0E6F4] text-[#7B4397]',
      '기술문서': 'bg-[#E8EEF3] text-[#163A5F]',
      '계약서': 'bg-[#FFF4E5] text-[#C58A2B]',
      '세무서류': 'bg-[#F4F7FA] text-[#5B6773]',
    };
    return colors[type] || 'bg-[#E8EEF3] text-[#5B6773]';
  };

  // Calculate statistics
  const expiringIn30Days = documents.filter(d => d.daysUntilExpiry && d.daysUntilExpiry <= 30 && d.daysUntilExpiry > 0).length;
  const validDocuments = documents.filter(d => d.status === '유효' || d.status === '최신').length;
  const totalDocuments = documents.length;
  const documentsByType = documents.reduce((acc, doc) => {
    acc[doc.documentType] = (acc[doc.documentType] || 0) + 1;
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
            <h1 className="text-3xl font-bold text-[#18212B] mb-2">문서 관리</h1>
            <p className="text-[#5B6773]">인증서, 계약서, 기술문서 통합 관리</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-[#5B6773] mb-1">총 문서</p>
                  <p className="text-3xl font-bold text-[#18212B]">{totalDocuments}</p>
                  <p className="text-xs text-[#5B6773] mt-1">건</p>
                </div>
                <FolderOpen className="w-10 h-10 text-[#163A5F] opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-[#5B6773] mb-1">유효 문서</p>
                  <p className="text-3xl font-bold text-[#2E7D5B]">{validDocuments}</p>
                  <p className="text-xs text-[#2E7D5B] mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    정상
                  </p>
                </div>
                <CheckCircle className="w-10 h-10 text-[#2E7D5B] opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-[#5B6773] mb-1">만료 임박</p>
                  <p className="text-3xl font-bold text-[#B94A48]">{expiringIn30Days}</p>
                  <p className="text-xs text-[#B94A48] mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    30일 이내
                  </p>
                </div>
                <AlertTriangle className="w-10 h-10 text-[#B94A48] opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-[#5B6773] mb-1">이번 달 업로드</p>
                  <p className="text-3xl font-bold text-[#5B8DB8]">3</p>
                  <p className="text-xs text-[#5B6773] mt-1">건</p>
                </div>
                <Calendar className="w-10 h-10 text-[#5B8DB8] opacity-20" />
              </div>
            </div>
          </div>

          {/* Document Type Quick Stats */}
          <div className="bg-white rounded-lg border border-[#D7DEE6] p-6 mb-8 shadow-sm">
            <h3 className="text-sm font-bold text-[#18212B] mb-4">문서 유형별 현황</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {Object.entries(documentsByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-[#F4F7FA] rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded ${getDocumentTypeColor(type)}`}>
                      {getDocumentTypeIcon(type)}
                    </div>
                    <div>
                      <p className="text-xs text-[#5B6773]">{type}</p>
                      <p className="text-lg font-bold text-[#18212B]">{count}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
                      placeholder="문서명, 품목, 거래처 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-[#5B6773]" />
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="px-4 py-2.5 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    >
                      <option value="전체">전체 유형</option>
                      <option value="인허가">인허가</option>
                      <option value="인증서">인증서</option>
                      <option value="매뉴얼">매뉴얼</option>
                      <option value="브로슈어">브로슈어</option>
                      <option value="기술문서">기술문서</option>
                      <option value="계약서">계약서</option>
                      <option value="세무서류">세무서류</option>
                    </select>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2.5 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    >
                      <option value="전체">전체 상태</option>
                      <option value="유효">유효</option>
                      <option value="최신">최신</option>
                      <option value="만료임박">만료임박</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-[#D7DEE6] rounded-md text-[#5B6773] hover:bg-[#F4F7FA] transition-colors text-sm font-semibold">
                    <Download className="w-4 h-4" />
                    내보내기
                  </button>
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors text-sm font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    문서 등록
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {/* Mobile Card View */}
              <div className="lg:hidden p-4 space-y-3">
                {filteredDocuments.map((doc, index) => (
                  <div 
                    key={index}
                    className="border border-[#D7DEE6] rounded-lg p-4 hover:bg-[#F4F7FA] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold mb-2 ${getDocumentTypeColor(doc.documentType)}`}>
                          {getDocumentTypeIcon(doc.documentType)}
                          {doc.documentType}
                        </span>
                        <p className="text-sm font-semibold text-[#18212B] mb-1">{doc.documentName}</p>
                        <p className="text-xs font-mono font-semibold text-[#163A5F]">v{doc.version}</p>
                      </div>
                      <StatusBadge status={doc.status} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3 pt-3 border-t border-[#D7DEE6]">
                      <div>
                        <p className="text-[10px] text-[#5B6773] mb-0.5">관련품목</p>
                        <p className="text-xs text-[#18212B]">{doc.relatedProduct}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#5B6773] mb-0.5">관련거래처</p>
                        <p className="text-xs text-[#18212B]">{doc.relatedClient}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#5B6773] mb-0.5">업로드일</p>
                        <p className="text-xs text-[#18212B]">{doc.uploadDate}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#5B6773] mb-0.5">만료일</p>
                        <p className="text-xs">{getExpiryBadge(doc.daysUntilExpiry, doc.expiryDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#F4F7FA] border border-[#D7DEE6] rounded-md text-sm text-[#5B6773] hover:bg-white transition-colors">
                        <Download className="w-4 h-4" />
                        다운로드
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors text-sm">
                        <Eye className="w-4 h-4" />
                        보기
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <table className="w-full hidden lg:table">
                <thead>
                  <tr className="border-b-2 border-[#D7DEE6] bg-[#163A5F]">
                    <th className="text-left py-4 px-4 text-sm font-bold text-white min-w-[250px]">문서명</th>
                    <th className="text-center py-4 px-4 text-sm font-bold text-white min-w-[120px]">문서유형</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-white min-w-[150px]">관련품목</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-white min-w-[150px]">관련거래처</th>
                    <th className="text-center py-4 px-4 text-sm font-bold text-white min-w-[80px]">버전</th>
                    <th className="text-center py-4 px-4 text-sm font-bold text-white min-w-[100px]">업로드일</th>
                    <th className="text-center py-4 px-4 text-sm font-bold text-white min-w-[140px]">만료일</th>
                    <th className="text-center py-4 px-4 text-sm font-bold text-white min-w-[100px]">상태</th>
                    <th className="text-center py-4 px-4 text-sm font-bold text-white min-w-[100px]">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc, index) => (
                    <tr key={index} className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors">
                      <td className="py-4 px-4 text-sm font-semibold text-[#18212B]">{doc.documentName}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getDocumentTypeColor(doc.documentType)}`}>
                          {getDocumentTypeIcon(doc.documentType)}
                          {doc.documentType}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-[#5B6773]">{doc.relatedProduct}</td>
                      <td className="py-4 px-4 text-sm text-[#5B6773]">{doc.relatedClient}</td>
                      <td className="py-4 px-4 text-sm text-center font-mono font-semibold text-[#163A5F]">{doc.version}</td>
                      <td className="py-4 px-4 text-sm text-center text-[#5B6773]">{doc.uploadDate}</td>
                      <td className="py-4 px-4 text-sm text-center">
                        {getExpiryBadge(doc.daysUntilExpiry, doc.expiryDate)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <StatusBadge status={doc.status} />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 hover:bg-[#E8EEF3] rounded transition-colors" title="다운로드">
                            <Download className="w-4 h-4 text-[#5B6773]" />
                          </button>
                          <button className="p-1.5 hover:bg-[#E8EEF3] rounded transition-colors" title="미리보기">
                            <Eye className="w-4 h-4 text-[#5B8DB8]" />
                          </button>
                          <button 
                            className="p-1.5 hover:bg-[#E8EEF3] rounded transition-colors"
                            title="수정"
                            onClick={() => {
                              setSelectedDocument(doc);
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

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-[#D7DEE6] flex items-center justify-between bg-[#F4F7FA]">
              <p className="text-sm text-[#5B6773]">
                전체 {filteredDocuments.length}개 문서
              </p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 border border-[#D7DEE6] rounded text-sm text-[#5B6773] hover:bg-white transition-colors">
                  이전
                </button>
                <button className="px-3 py-1.5 bg-[#163A5F] text-white rounded text-sm">1</button>
                <button className="px-3 py-1.5 border border-[#D7DEE6] rounded text-sm text-[#5B6773] hover:bg-white transition-colors">
                  2
                </button>
                <button className="px-3 py-1.5 border border-[#D7DEE6] rounded text-sm text-[#5B6773] hover:bg-white transition-colors">
                  다음
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Document Form Modal */}
      <DocumentForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedDocument(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedDocument}
      />

      {/* Document Detail Panel */}
      <DocumentDetailPanel
        isOpen={!!detailPanelDocuments}
        documents={detailPanelDocuments}
        title={detailPanelTitle}
        onClose={() => setDetailPanelDocuments(null)}
      />
    </div>
  );
}