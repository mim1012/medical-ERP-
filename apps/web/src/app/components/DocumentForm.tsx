import { X, Upload, FileText } from "lucide-react";
import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../../lib/supabase-client";

interface UploadedFile {
  name: string;
  url: string;
}

interface DocumentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function DocumentForm({ isOpen, onClose, onSubmit, initialData }: DocumentFormProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(
    initialData?.files || []
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    onSubmit({ ...data, files: uploadedFiles });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const organizationId = user?.id ?? 'unknown';
    const ext = file.name.split('.').pop();
    const fileName = `${organizationId}/${Date.now()}.${ext}`;

    setUploading(true);
    setUploadError(null);

    const { error } = await supabase.storage
      .from('documents')
      .upload(fileName, file, { upsert: false });

    if (error) {
      setUploadError(`파일 업로드 실패: ${error.message}`);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('documents').getPublicUrl(fileName);
    setUploadedFiles(prev => [...prev, { name: file.name, url: data.publicUrl }]);
    setUploading(false);

    // Reset input so same file can be re-selected if needed
    e.target.value = '';
  };

  const removeFile = (url: string) => {
    setUploadedFiles(prev => prev.filter(f => f.url !== url));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F]">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">
              {initialData ? '문서 정보 수정' : '신규 문서 등록'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                기본 정보
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    문서명 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="text"
                    name="documentName"
                    defaultValue={initialData?.documentName}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="문서명을 입력하세요"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#18212B] mb-2">
                      문서유형 <span className="text-[#B94A48]">*</span>
                    </label>
                    <select
                      name="documentType"
                      defaultValue={initialData?.documentType || ''}
                      required
                      className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    >
                      <option value="">선택하세요</option>
                      <option value="인허가">인허가</option>
                      <option value="인증서">인증서</option>
                      <option value="매뉴얼">매뉴얼</option>
                      <option value="브로슈어">브로슈어</option>
                      <option value="기술문서">기술문서</option>
                      <option value="계약서">계약서</option>
                      <option value="세무서류">세무서류</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#18212B] mb-2">
                      버전
                    </label>
                    <input
                      type="text"
                      name="version"
                      defaultValue={initialData?.version || '1.0'}
                      className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                      placeholder="예: 1.0, 2.1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Related Information */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                연관 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    관련 품목
                  </label>
                  <select
                    name="relatedProduct"
                    defaultValue={initialData?.relatedProduct || ''}
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="">선택하세요</option>
                    <option value="MRI 스캐너">MRI 스캐너</option>
                    <option value="CT 스캐너">CT 스캐너</option>
                    <option value="초음파 진단기">초음파 진단기</option>
                    <option value="X-Ray 시스템">X-Ray 시스템</option>
                    <option value="심전도기">심전도기</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    관련 거래처
                  </label>
                  <select
                    name="relatedClient"
                    defaultValue={initialData?.relatedClient || ''}
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="">선택하세요</option>
                    <option value="삼성메디슨">삼성메디슨</option>
                    <option value="바이엘코리아">바이엘코리아</option>
                    <option value="GE헬스케어">GE헬스케어</option>
                    <option value="필립스">필립스</option>
                    <option value="메디칼툴즈">메디칼툴즈</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Date Information */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                날짜 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    발행일 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="date"
                    name="issueDate"
                    defaultValue={initialData?.issueDate || new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    만료일
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    defaultValue={initialData?.expiryDate}
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    담당자 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="manager"
                    defaultValue={initialData?.manager || ''}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="">선택하세요</option>
                    <option value="김문서">김문서</option>
                    <option value="이문서">이문서</option>
                    <option value="박문서">박문서</option>
                    <option value="최문서">최문서</option>
                  </select>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                파일 업로드
              </h3>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                className="hidden"
                onChange={handleFileChange}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#D7DEE6] rounded-lg p-8 text-center hover:border-[#5B8DB8] hover:bg-[#F4F7FA] transition-colors cursor-pointer"
              >
                <Upload className="w-12 h-12 text-[#5B6773] mx-auto mb-3" />
                {uploading ? (
                  <p className="text-sm font-semibold text-[#5B8DB8]">업로드 중...</p>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-[#18212B] mb-1">클릭하여 파일 업로드</p>
                    <p className="text-xs text-[#5B6773]">PDF, DOC, DOCX, XLS, XLSX (최대 50MB)</p>
                  </>
                )}
              </div>

              {uploadError && (
                <p className="mt-2 text-xs text-[#B94A48]">{uploadError}</p>
              )}

              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-semibold text-[#18212B] mb-2">업로드된 파일</p>
                  {uploadedFiles.map((file) => (
                    <div key={file.url} className="flex items-center justify-between px-4 py-2.5 bg-[#F4F7FA] border border-[#D7DEE6] rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#5B8DB8]" />
                        <a href={file.url} target="_blank" rel="noreferrer" className="text-sm text-[#18212B] hover:underline">
                          {file.name}
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(file.url)}
                        className="text-xs text-[#B94A48] hover:underline"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                문서 설명
              </h3>
              <textarea
                name="description"
                defaultValue={initialData?.description}
                rows={4}
                className="w-full px-4 py-3 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white resize-none text-sm"
                placeholder="문서에 대한 설명을 입력하세요"
              />
            </div>

            {/* Internal Notes */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                내부 메모
              </h3>
              <textarea
                name="internalNotes"
                defaultValue={initialData?.internalNotes}
                rows={3}
                className="w-full px-4 py-3 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white resize-none text-sm"
                placeholder="내부 참고용 메모 (고객에게 비공개)"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#D7DEE6] bg-[#F4F7FA] sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-[#D7DEE6] rounded-md text-[#5B6773] hover:bg-white transition-colors font-semibold"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors font-semibold"
            >
              {initialData ? '수정' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
