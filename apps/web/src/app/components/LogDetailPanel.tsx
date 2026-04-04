import { X } from "lucide-react";
import type { AuditLog } from "../../hooks/use-log";

interface LogDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  log: AuditLog | null;
}

export function LogDetailPanel({ isOpen, onClose, log }: LogDetailPanelProps) {
  if (!isOpen || !log) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F]">
          <h2 className="text-xl font-bold text-white">로그 상세 정보</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-md transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-base font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
              기본 정보
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F4F7FA] border border-[#D7DEE6] rounded-lg p-4">
                <p className="text-xs font-semibold text-[#5B6773] mb-1">작업일시</p>
                <p className="text-sm font-bold text-[#18212B]">{log.createdAt.replace('T', ' ').slice(0, 19)}</p>
              </div>
              <div className="bg-[#F4F7FA] border border-[#D7DEE6] rounded-lg p-4">
                <p className="text-xs font-semibold text-[#5B6773] mb-1">작업유형</p>
                <p className="text-sm font-bold text-[#18212B]">{log.action}</p>
              </div>
              <div className="bg-[#F4F7FA] border border-[#D7DEE6] rounded-lg p-4">
                <p className="text-xs font-semibold text-[#5B6773] mb-1">리소스</p>
                <p className="text-sm font-bold text-[#18212B]">{log.resource}</p>
              </div>
              <div className="bg-[#F4F7FA] border border-[#D7DEE6] rounded-lg p-4">
                <p className="text-xs font-semibold text-[#5B6773] mb-1">리소스 ID</p>
                <p className="text-sm text-[#5B6773] font-mono break-all">{log.resourceId ?? '-'}</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div>
            <h3 className="text-base font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
              사용자 정보
            </h3>
            <div className="bg-[#F4F7FA] border border-[#D7DEE6] rounded-lg p-4">
              <p className="text-xs font-semibold text-[#5B6773] mb-1">사용자 ID</p>
              <p className="text-sm text-[#5B6773] font-mono break-all">{log.userId ?? '-'}</p>
            </div>
          </div>

          {/* Details */}
          {log.details && (
            <div>
              <h3 className="text-base font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                상세 내용
              </h3>
              <pre className="bg-[#F4F7FA] border border-[#D7DEE6] rounded-lg p-4 text-xs font-mono text-[#18212B] overflow-x-auto whitespace-pre-wrap break-all">
                {JSON.stringify(log.details, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#D7DEE6] bg-[#F4F7FA]">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors font-semibold text-sm"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
