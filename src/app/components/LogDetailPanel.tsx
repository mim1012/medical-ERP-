import { X } from "lucide-react";

interface LogDetailProps {
  isOpen: boolean;
  onClose: () => void;
  log: any;
}

export function LogDetailPanel({ isOpen, onClose, log }: LogDetailProps) {
  if (!isOpen || !log) return null;

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

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F]">
          <h2 className="text-xl font-bold text-white">로그 상세 정보</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
          >
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
                <p className="text-sm font-bold text-[#18212B]">{log.timestamp}</p>
              </div>
              <div className="bg-[#F4F7FA] border border-[#D7DEE6] rounded-lg p-4">
                <p className="text-xs font-semibold text-[#5B6773] mb-1">작업유형</p>
                <span className={`inline-block px-3 py-1 rounded text-xs font-bold ${getActionColor(log.action)}`}>
                  {log.action}
                </span>
              </div>
              <div className="bg-[#F4F7FA] border border-[#D7DEE6] rounded-lg p-4">
                <p className="text-xs font-semibold text-[#5B6773] mb-1">사용자명</p>
                <p className="text-sm font-bold text-[#18212B]">{log.userName}</p>
              </div>
              <div className="bg-[#F4F7FA] border border-[#D7DEE6] rounded-lg p-4">
                <p className="text-xs font-semibold text-[#5B6773] mb-1">부서</p>
                <p className="text-sm text-[#5B6773]">{log.department}</p>
              </div>
            </div>
          </div>

          {/* Target Info */}
          <div>
            <h3 className="text-base font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
              대상 정보
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-[#18212B] mb-1">메뉴명</p>
                <p className="text-sm text-[#5B6773]">{log.menu}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#18212B] mb-1">대상번호</p>
                  <p className="text-sm text-[#5B8DB8] font-semibold">{log.targetNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#18212B] mb-1">대상명</p>
                  <p className="text-sm text-[#5B6773]">{log.target}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Change Details */}
          {(log.beforeValue || log.afterValue) && (
            <div>
              <h3 className="text-base font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                변경 내역
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {log.beforeValue && (
                  <div className="border border-[#D7DEE6] rounded-lg p-4 bg-[#FFF4E5]">
                    <p className="text-xs font-bold text-[#C58A2B] mb-2">변경 전 값</p>
                    <div className="bg-white rounded p-3 text-sm text-[#18212B] font-mono text-xs break-all">
                      {log.beforeValue}
                    </div>
                  </div>
                )}
                {log.afterValue && (
                  <div className="border border-[#D7DEE6] rounded-lg p-4 bg-[#E6F4EA]">
                    <p className="text-xs font-bold text-[#2E7D5B] mb-2">변경 후 값</p>
                    <div className="bg-white rounded p-3 text-sm text-[#18212B] font-mono text-xs break-all">
                      {log.afterValue}
                    </div>
                  </div>
                )}
              </div>
              {log.reason && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-[#18212B] mb-2">변경 사유</p>
                  <div className="bg-[#F4F7FA] border border-[#D7DEE6] rounded-lg p-3 text-sm text-[#5B6773]">
                    {log.reason}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* System Info */}
          <div>
            <h3 className="text-base font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
              시스템 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-[#18212B] mb-1">IP 주소</p>
                <p className="text-sm text-[#5B6773] font-mono">{log.ip}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#18212B] mb-1">디바이스 정보</p>
                <p className="text-sm text-[#5B6773]">{log.device || 'Windows 10, Chrome 120'}</p>
              </div>
            </div>
            {log.note && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-[#18212B] mb-2">비고</p>
                <div className="bg-[#F4F7FA] border border-[#D7DEE6] rounded-lg p-3 text-sm text-[#5B6773]">
                  {log.note}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#D7DEE6] bg-[#F4F7FA]">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors font-semibold"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
