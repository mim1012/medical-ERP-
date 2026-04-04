import { X, Upload, FileText } from "lucide-react";
import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../../lib/supabase-client";
import { useClients } from "../../hooks/use-clients";
import type { DocumentType, CreateDocumentDto } from "../../hooks/use-document";

interface DocumentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDocumentDto) => void;
  initialData?: Partial<CreateDocumentDto & { id: string }>;
}

export function DocumentForm({ isOpen, onClose, onSubmit, initialData }: DocumentFormProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileUrl, setFileUrl] = useState<string>(initialData?.fileUrl ?? '');
  const [fileName, setFileName] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { data: clients = [] } = useClients();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);

    const dto: CreateDocumentDto = {
      title: fd.get('title') as string,
      type: fd.get('type') as DocumentType,
    };

    const clientId = fd.get('clientId') as string;
    if (clientId) dto.clientId = clientId;

    const expiresAt = fd.get('expiresAt') as string;
    if (expiresAt) dto.expiresAt = expiresAt;

    const notes = fd.get('notes') as string;
    if (notes) dto.notes = notes;

    if (fileUrl) dto.fileUrl = fileUrl;

    onSubmit(dto);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const organizationId = user?.id ?? 'unknown';
    const ext = file.name.split('.').pop();
    const key = `${organizationId}/${Date.now()}.${ext}`;

    setUploading(true);
    setUploadError(null);

    const { error } = await supabase.storage
      .from('documents')
      .upload(key, file, { upsert: false });

    if (error) {
      setUploadError(`파일 업로드 실패: ${error.message}`);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('documents').getPublicUrl(key);
    setFileUrl(data.publicUrl);
    setFileName(file.name);
    setUploading(false);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F]">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">
              {initialData?.id ? '문서 정보 수정' : '신규 문서 등록'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-md transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-[#18212B] mb-2">
                문서명 <span className="text-[#B94A48]">*</span>
              </label>
              <input
                type="text"
                name="title"
                defaultValue={initialData?.title}
                required
                className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white text-sm"
                placeholder="문서명을 입력하세요"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-semibold text-[#18212B] mb-2">
                문서유형 <span className="text-[#B94A48]">*</span>
              </label>
              <select
                name="type"
                defaultValue={initialData?.type ?? ''}
                required
                className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white text-sm"
              >
                <option value="">선택하세요</option>
                <option value="CONTRACT">계약서</option>
                <option value="CERTIFICATE">인증서</option>
                <option value="MANUAL">설명서</option>
                <option value="WARRANTY">보증서</option>
                <option value="OTHER">기타</option>
              </select>
            </div>

            {/* Client */}
            <div>
              <label className="block text-sm font-semibold text-[#18212B] mb-2">
                관련 거래처 <span className="text-xs text-[#5B6773] font-normal">(선택)</span>
              </label>
              <select
                name="clientId"
                defaultValue={initialData?.clientId ?? ''}
                className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white text-sm"
              >
                <option value="">공통 문서 (거래처 없음)</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Expires At */}
            <div>
              <label className="block text-sm font-semibold text-[#18212B] mb-2">
                만료일 <span className="text-xs text-[#5B6773] font-normal">(선택)</span>
              </label>
              <input
                type="date"
                name="expiresAt"
                defaultValue={initialData?.expiresAt ? initialData.expiresAt.slice(0, 10) : ''}
                className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white text-sm"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-[#18212B] mb-2">
                파일 업로드 <span className="text-xs text-[#5B6773] font-normal">(선택)</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                className="hidden"
                onChange={handleFileChange}
              />
              {fileUrl ? (
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#F4F7FA] border border-[#D7DEE6] rounded-md">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#5B8DB8]" />
                    <a href={fileUrl} target="_blank" rel="noreferrer" className="text-sm text-[#163A5F] hover:underline truncate max-w-xs">
                      {fileName || fileUrl.split('/').pop()}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setFileUrl(''); setFileName(''); }}
                    className="text-xs text-[#B94A48] hover:underline ml-2"
                  >
                    삭제
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#D7DEE6] rounded-lg p-6 text-center hover:border-[#5B8DB8] hover:bg-[#F4F7FA] transition-colors cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-[#5B6773] mx-auto mb-2" />
                  {uploading ? (
                    <p className="text-sm font-semibold text-[#5B8DB8]">업로드 중...</p>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-[#18212B] mb-1">클릭하여 파일 업로드</p>
                      <p className="text-xs text-[#5B6773]">PDF, DOC, DOCX, XLS, XLSX (최대 50MB)</p>
                    </>
                  )}
                </div>
              )}
              {uploadError && <p className="mt-2 text-xs text-[#B94A48]">{uploadError}</p>}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-[#18212B] mb-2">
                메모 <span className="text-xs text-[#5B6773] font-normal">(선택)</span>
              </label>
              <textarea
                name="notes"
                defaultValue={initialData?.notes ?? ''}
                rows={3}
                className="w-full px-4 py-3 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white resize-none text-sm"
                placeholder="문서에 대한 메모를 입력하세요"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#D7DEE6] bg-[#F4F7FA] sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-[#D7DEE6] rounded-md text-[#5B6773] hover:bg-white transition-colors font-semibold text-sm"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors font-semibold text-sm"
            >
              {initialData?.id ? '수정' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
