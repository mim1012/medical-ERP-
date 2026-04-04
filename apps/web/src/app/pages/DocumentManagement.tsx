import { useState, useMemo } from "react";
import {
  useDocuments,
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
} from "../../hooks/use-document";
import { getDaysUntilExpiry } from "../../lib/format";
import type { DocumentRecord, DocumentType, CreateDocumentDto } from "../../hooks/use-document";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { DocumentForm } from "../components/DocumentForm";
import { DocumentDetailPanel } from "../components/DocumentDetailPanel";
import {
  Plus,
  Search,
  Eye,
  Trash2,
  Edit,
  FileText,
  FolderOpen,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

const TYPE_LABELS: Record<DocumentType, string> = {
  CONTRACT: '계약서',
  CERTIFICATE: '인증서',
  MANUAL: '설명서',
  WARRANTY: '보증서',
  OTHER: '기타',
};

const TYPE_COLORS: Record<DocumentType, string> = {
  CONTRACT: 'bg-[#FFF4E5] text-[#C58A2B]',
  CERTIFICATE: 'bg-[#E6F4EA] text-[#2E7D5B]',
  MANUAL: 'bg-[#E8EEF3] text-[#5B8DB8]',
  WARRANTY: 'bg-[#F0E6F4] text-[#7B4397]',
  OTHER: 'bg-[#F4F7FA] text-[#5B6773]',
};

const TYPE_TABS: Array<{ label: string; value: DocumentType | '전체' }> = [
  { label: '전체', value: '전체' },
  { label: '계약서', value: 'CONTRACT' },
  { label: '인증서', value: 'CERTIFICATE' },
  { label: '설명서', value: 'MANUAL' },
  { label: '보증서', value: 'WARRANTY' },
  { label: '기타', value: 'OTHER' },
];

export function DocumentManagement() {
  const [activeMenu, setActiveMenu] = useState('documents');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentRecord | null>(null);
  const [detailDoc, setDetailDoc] = useState<DocumentRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<DocumentType | '전체'>('전체');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data: documents = [], isLoading } = useDocuments();
  const createDocument = useCreateDocument();
  const updateDocument = useUpdateDocument();
  const deleteDocument = useDeleteDocument();

  const filtered = useMemo(() => {
    return documents.filter(doc => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        doc.title.toLowerCase().includes(search) ||
        (doc.client?.name ?? '').toLowerCase().includes(search);
      const matchesType = typeFilter === '전체' || doc.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [documents, searchTerm, typeFilter]);

  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;

  const totalDocs = documents.length;
  const contractCount = documents.filter(d => d.type === 'CONTRACT').length;
  const expiringSoon = documents.filter(d => {
    if (!d.expiresAt) return false;
    const ms = new Date(d.expiresAt).getTime() - now;
    return ms > 0 && ms <= thirtyDays;
  }).length;
  const expired = documents.filter(d => {
    if (!d.expiresAt) return false;
    return new Date(d.expiresAt).getTime() <= now;
  }).length;

  const handleFormSubmit = (dto: CreateDocumentDto) => {
    if (editingDoc) {
      updateDocument.mutate(
        { id: editingDoc.id, ...dto },
        { onSuccess: () => { setIsFormOpen(false); setEditingDoc(null); } }
      );
    } else {
      createDocument.mutate(dto, {
        onSuccess: () => setIsFormOpen(false),
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteDocument.mutate(id, {
      onSuccess: () => setDeleteConfirmId(null),
    });
  };

  const getExpiryClass = (expiresAt: string | null) => {
    const days = getDaysUntilExpiry(expiresAt);
    if (days === null) return 'text-[#5B6773]';
    if (days <= 0) return 'text-[#B94A48] font-semibold';
    if (days <= 30) return 'text-[#C58A2B] font-semibold';
    return 'text-[#5B6773]';
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
            <h1 className="text-3xl font-bold text-[#18212B] mb-2">문서 관리</h1>
            <p className="text-[#5B6773]">인증서, 계약서, 기술문서 통합 관리</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#5B6773] mb-1">총 문서</p>
                  <p className="text-3xl font-bold text-[#18212B]">{totalDocs}</p>
                  <p className="text-xs text-[#5B6773] mt-1">건</p>
                </div>
                <FolderOpen className="w-9 h-9 text-[#163A5F] opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#5B6773] mb-1">계약서</p>
                  <p className="text-3xl font-bold text-[#C58A2B]">{contractCount}</p>
                  <p className="text-xs text-[#5B6773] mt-1">건</p>
                </div>
                <FileText className="w-9 h-9 text-[#C58A2B] opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#5B6773] mb-1">만료 임박</p>
                  <p className="text-3xl font-bold text-[#C58A2B]">{expiringSoon}</p>
                  <p className="text-xs text-[#C58A2B] mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    30일 이내
                  </p>
                </div>
                <AlertTriangle className="w-9 h-9 text-[#C58A2B] opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#5B6773] mb-1">만료됨</p>
                  <p className="text-3xl font-bold text-[#B94A48]">{expired}</p>
                  <p className="text-xs text-[#B94A48] mt-1">건</p>
                </div>
                <AlertTriangle className="w-9 h-9 text-[#B94A48] opacity-20" />
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg border border-[#D7DEE6] shadow-sm">
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-[#D7DEE6]">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Type Tabs */}
                <div className="flex flex-wrap gap-1">
                  {TYPE_TABS.map(tab => (
                    <button
                      key={tab.value}
                      onClick={() => setTypeFilter(tab.value)}
                      className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                        typeFilter === tab.value
                          ? 'bg-[#163A5F] text-white'
                          : 'text-[#5B6773] hover:bg-[#F4F7FA]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6773]" />
                    <input
                      type="text"
                      placeholder="문서명, 거래처 검색..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] w-56"
                    />
                  </div>
                  <button
                    onClick={() => { setEditingDoc(null); setIsFormOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors text-sm font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    문서 등록
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-12 text-center text-[#5B6773]">로딩 중...</div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center text-[#5B6773]">문서가 없습니다.</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-[#D7DEE6] bg-[#163A5F]">
                      <th className="text-left py-3 px-4 text-sm font-bold text-white min-w-[220px]">문서명</th>
                      <th className="text-center py-3 px-4 text-sm font-bold text-white min-w-[100px]">유형</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-white min-w-[150px]">거래처</th>
                      <th className="text-center py-3 px-4 text-sm font-bold text-white min-w-[110px]">만료일</th>
                      <th className="text-center py-3 px-4 text-sm font-bold text-white min-w-[80px]">파일</th>
                      <th className="text-center py-3 px-4 text-sm font-bold text-white min-w-[100px]">등록일</th>
                      <th className="text-center py-3 px-4 text-sm font-bold text-white min-w-[100px]">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(doc => {
                      const days = getDaysUntilExpiry(doc.expiresAt);
                      return (
                        <tr key={doc.id} className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors">
                          <td className="py-3 px-4 text-sm font-semibold text-[#18212B]">{doc.title}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${TYPE_COLORS[doc.type]}`}>
                              {TYPE_LABELS[doc.type]}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-[#5B6773]">
                            {doc.client?.name ?? '공통'}
                          </td>
                          <td className={`py-3 px-4 text-sm text-center ${getExpiryClass(doc.expiresAt)}`}>
                            {doc.expiresAt ? (
                              <>
                                {doc.expiresAt.slice(0, 10)}
                                {days !== null && days <= 30 && (
                                  <span className="ml-1 text-xs">
                                    {days <= 0 ? '(만료)' : `(D-${days})`}
                                  </span>
                                )}
                              </>
                            ) : '-'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {doc.fileUrl ? (
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center p-1 hover:bg-[#E8EEF3] rounded transition-colors"
                                title="파일 열기"
                              >
                                <ExternalLink className="w-4 h-4 text-[#5B8DB8]" />
                              </a>
                            ) : (
                              <span className="text-xs text-[#D7DEE6]">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-center text-[#5B6773]">
                            {doc.createdAt.slice(0, 10)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => setDetailDoc(doc)}
                                className="p-1.5 hover:bg-[#E8EEF3] rounded transition-colors"
                                title="상세보기"
                              >
                                <Eye className="w-4 h-4 text-[#5B8DB8]" />
                              </button>
                              <button
                                onClick={() => { setEditingDoc(doc); setIsFormOpen(true); }}
                                className="p-1.5 hover:bg-[#E8EEF3] rounded transition-colors"
                                title="수정"
                              >
                                <Edit className="w-4 h-4 text-[#5B8DB8]" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(doc.id)}
                                className="p-1.5 hover:bg-[#FCEBE9] rounded transition-colors"
                                title="삭제"
                              >
                                <Trash2 className="w-4 h-4 text-[#B94A48]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-[#D7DEE6] bg-[#F4F7FA]">
              <p className="text-sm text-[#5B6773]">전체 {filtered.length}건</p>
            </div>
          </div>
        </div>
      </main>

      {/* Document Form Modal */}
      <DocumentForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingDoc(null); }}
        onSubmit={handleFormSubmit}
        initialData={editingDoc ? {
          id: editingDoc.id,
          title: editingDoc.title,
          type: editingDoc.type,
          clientId: editingDoc.clientId ?? undefined,
          fileUrl: editingDoc.fileUrl ?? undefined,
          expiresAt: editingDoc.expiresAt ?? undefined,
          notes: editingDoc.notes ?? undefined,
        } : undefined}
      />

      {/* Document Detail Panel */}
      <DocumentDetailPanel
        isOpen={!!detailDoc}
        onClose={() => setDetailDoc(null)}
        document={detailDoc}
      />

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-sm shadow-2xl p-6">
            <h3 className="text-lg font-bold text-[#18212B] mb-2">문서 삭제</h3>
            <p className="text-sm text-[#5B6773] mb-6">이 문서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-[#D7DEE6] rounded-md text-[#5B6773] hover:bg-[#F4F7FA] text-sm font-semibold"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-[#B94A48] text-white rounded-md hover:bg-[#9B3D3B] text-sm font-semibold"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
