import { X, FileText, Calendar, Building2, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import type { DocumentRecord, DocumentType } from "../../hooks/use-document";
import { getDaysUntilExpiry } from "../../lib/format";

interface DocumentDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentRecord | null;
}

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

export function DocumentDetailPanel({ isOpen, onClose, document }: DocumentDetailPanelProps) {
  if (!isOpen || !document) return null;

  const days = getDaysUntilExpiry(document.expiresAt);
  const isExpired = days !== null && days <= 0;
  const isExpiringSoon = days !== null && days > 0 && days <= 30;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F]">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-white" />
            <h2 className="text-lg font-bold text-white">문서 상세</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-md transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title + Type */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-xl font-bold text-[#18212B]">{document.title}</h3>
              <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${TYPE_COLORS[document.type]}`}>
                {TYPE_LABELS[document.type]}
              </span>
            </div>
          </div>

          {/* Expiry alert */}
          {isExpired && (
            <div className="flex items-center gap-2 p-3 bg-[#FCEBE9] border border-[#B94A48]/20 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-[#B94A48] flex-shrink-0" />
              <p className="text-sm font-semibold text-[#B94A48]">만료된 문서입니다</p>
            </div>
          )}
          {isExpiringSoon && (
            <div className="flex items-center gap-2 p-3 bg-[#FFF4E5] border border-[#C58A2B]/20 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-[#C58A2B] flex-shrink-0" />
              <p className="text-sm font-semibold text-[#C58A2B]">만료 {days}일 전입니다</p>
            </div>
          )}
          {days !== null && !isExpired && !isExpiringSoon && (
            <div className="flex items-center gap-2 p-3 bg-[#E6F4EA] border border-[#2E7D5B]/20 rounded-lg">
              <CheckCircle className="w-4 h-4 text-[#2E7D5B] flex-shrink-0" />
              <p className="text-sm font-semibold text-[#2E7D5B]">유효 ({days}일 남음)</p>
            </div>
          )}

          {/* Details */}
          <div className="bg-[#F4F7FA] rounded-lg p-5 space-y-4">
            <div className="flex items-start gap-3">
              <Building2 className="w-4 h-4 text-[#5B6773] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-[#5B6773] mb-0.5">관련 거래처</p>
                <p className="text-sm font-semibold text-[#18212B]">
                  {document.client?.name ?? '공통'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-[#5B6773] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-[#5B6773] mb-0.5">만료일</p>
                <p className={`text-sm font-semibold ${isExpired ? 'text-[#B94A48]' : isExpiringSoon ? 'text-[#C58A2B]' : 'text-[#18212B]'}`}>
                  {document.expiresAt ? document.expiresAt.slice(0, 10) : '-'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-[#5B6773] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-[#5B6773] mb-0.5">등록일</p>
                <p className="text-sm text-[#5B6773]">{document.createdAt.slice(0, 10)}</p>
              </div>
            </div>
          </div>

          {/* File link */}
          {document.fileUrl && (
            <div>
              <p className="text-sm font-semibold text-[#18212B] mb-2">첨부 파일</p>
              <a
                href={document.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-3 border border-[#D7DEE6] rounded-lg hover:bg-[#F4F7FA] transition-colors text-sm text-[#163A5F] font-semibold"
              >
                <FileText className="w-4 h-4" />
                <span className="truncate flex-1">{document.fileUrl.split('/').pop()}</span>
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
              </a>
            </div>
          )}

          {/* Notes */}
          {document.notes && (
            <div>
              <p className="text-sm font-semibold text-[#18212B] mb-2">메모</p>
              <div className="bg-[#F4F7FA] border border-[#D7DEE6] rounded-lg p-4 text-sm text-[#5B6773]">
                {document.notes}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#D7DEE6] bg-[#F4F7FA]">
          <button
            onClick={onClose}
            className="w-full px-6 py-2.5 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors font-semibold text-sm"
          >
            닫기
          </button>
        </div>
      </div>
    </>
  );
}
