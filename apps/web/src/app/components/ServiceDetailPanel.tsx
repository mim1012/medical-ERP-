import { X, Wrench, Calendar, Building2, User, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";
import type { ServiceCase, ServiceStatus } from "../../hooks/use-service";
import { formatDate } from "../../lib/format";

interface ServiceDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  serviceCase: ServiceCase | null;
  onUpdateStatus: (id: string, status: ServiceStatus) => void;
  onUpdateAssignee: (id: string, assignee: string) => void;
  isUpdating?: boolean;
}

const STATUS_LABELS: Record<ServiceStatus, string> = {
  OPEN: '접수',
  IN_PROGRESS: '처리중',
  RESOLVED: '완료',
  CLOSED: '종료',
};

const STATUS_NEXT: Record<ServiceStatus, ServiceStatus | null> = {
  OPEN: 'IN_PROGRESS',
  IN_PROGRESS: 'RESOLVED',
  RESOLVED: 'CLOSED',
  CLOSED: null,
};

const TYPE_LABELS = {
  INSTALLATION: '설치',
  REPAIR: '수리',
  MAINTENANCE: '유지보수',
};

export function ServiceDetailPanel({
  isOpen,
  onClose,
  serviceCase,
  onUpdateStatus,
  onUpdateAssignee,
  isUpdating,
}: ServiceDetailPanelProps) {
  const [editingAssignee, setEditingAssignee] = useState(false);
  const [assigneeValue, setAssigneeValue] = useState('');

  if (!isOpen || !serviceCase) return null;

  const nextStatus = STATUS_NEXT[serviceCase.status];

  const handleAssigneeEdit = () => {
    setAssigneeValue(serviceCase.assignee ?? '');
    setEditingAssignee(true);
  };

  const handleAssigneeSave = () => {
    onUpdateAssignee(serviceCase.id, assigneeValue);
    setEditingAssignee(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-white z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F]">
          <div>
            <h2 className="text-xl font-bold text-white">케이스 상세</h2>
            <p className="text-sm text-[#5B8DB8] mt-1">#{serviceCase.id.slice(0, 8)}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-md transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status + Type */}
          <div className="flex items-center gap-3">
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
              serviceCase.status === 'OPEN' ? 'bg-gray-100 text-gray-600' :
              serviceCase.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' :
              serviceCase.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
              'bg-slate-100 text-slate-600'
            }`}>
              {STATUS_LABELS[serviceCase.status]}
            </span>
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
              serviceCase.type === 'INSTALLATION' ? 'bg-blue-100 text-blue-700' :
              serviceCase.type === 'REPAIR' ? 'bg-red-100 text-red-700' :
              'bg-green-100 text-green-700'
            }`}>
              {TYPE_LABELS[serviceCase.type]}
            </span>
          </div>

          {/* Client */}
          <div className="border border-[#D7DEE6] rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-[#163A5F]" />
              <span className="text-sm font-bold text-[#18212B]">거래처 정보</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-[#5B6773] mb-0.5">거래처명</p>
                <p className="font-semibold text-[#18212B]">{serviceCase.client.name}</p>
              </div>
              <div>
                <p className="text-xs text-[#5B6773] mb-0.5">연락처</p>
                <p className="text-[#18212B]">{serviceCase.client.phone ?? '-'}</p>
              </div>
              <div>
                <p className="text-xs text-[#5B6773] mb-0.5">담당자</p>
                <p className="text-[#18212B]">{serviceCase.client.manager ?? '-'}</p>
              </div>
              <div>
                <p className="text-xs text-[#5B6773] mb-0.5">주소</p>
                <p className="text-[#18212B]">{serviceCase.client.address ?? '-'}</p>
              </div>
            </div>
          </div>

          {/* Service details */}
          <div className="border border-[#D7DEE6] rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="w-4 h-4 text-[#163A5F]" />
              <span className="text-sm font-bold text-[#18212B]">서비스 정보</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-[#5B6773] mb-0.5">접수일</p>
                <p className="text-[#18212B]">{formatDate(serviceCase.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-[#5B6773] mb-0.5">완료일</p>
                <p className="text-[#18212B]">{serviceCase.resolvedAt ? formatDate(serviceCase.resolvedAt) : '-'}</p>
              </div>
            </div>
            {serviceCase.description && (
              <div>
                <p className="text-xs text-[#5B6773] mb-1">내용</p>
                <p className="text-sm text-[#18212B] bg-[#F4F7FA] rounded p-3">{serviceCase.description}</p>
              </div>
            )}
          </div>

          {/* Assignee */}
          <div className="border border-[#D7DEE6] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#163A5F]" />
                <span className="text-sm font-bold text-[#18212B]">담당자</span>
              </div>
              {!editingAssignee && (
                <button
                  onClick={handleAssigneeEdit}
                  className="text-xs text-[#5B8DB8] hover:underline"
                >
                  수정
                </button>
              )}
            </div>
            {editingAssignee ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={assigneeValue}
                  onChange={(e) => setAssigneeValue(e.target.value)}
                  className="flex-1 px-3 py-2 border border-[#D7DEE6] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                  placeholder="담당자 이름"
                />
                <button
                  onClick={handleAssigneeSave}
                  disabled={isUpdating}
                  className="px-3 py-2 bg-[#163A5F] text-white rounded-md text-sm hover:bg-[#0F2942] transition-colors disabled:opacity-50"
                >
                  저장
                </button>
                <button
                  onClick={() => setEditingAssignee(false)}
                  className="px-3 py-2 border border-[#D7DEE6] rounded-md text-sm text-[#5B6773] hover:bg-[#F4F7FA] transition-colors"
                >
                  취소
                </button>
              </div>
            ) : (
              <p className="text-sm text-[#18212B]">{serviceCase.assignee ?? '미배정'}</p>
            )}
          </div>

          {/* Status progression */}
          {nextStatus && (
            <div className="border border-[#D7DEE6] rounded-lg p-4">
              <p className="text-sm font-bold text-[#18212B] mb-3">상태 변경</p>
              <button
                onClick={() => onUpdateStatus(serviceCase.id, nextStatus)}
                disabled={isUpdating}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors font-semibold text-sm disabled:opacity-50"
              >
                {nextStatus === 'IN_PROGRESS' && <Clock className="w-4 h-4" />}
                {nextStatus === 'RESOLVED' && <CheckCircle2 className="w-4 h-4" />}
                {nextStatus === 'CLOSED' && <AlertCircle className="w-4 h-4" />}
                {STATUS_LABELS[serviceCase.status]} → {STATUS_LABELS[nextStatus]}으로 변경
              </button>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[#D7DEE6] bg-[#F4F7FA]">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md text-[#5B6773] hover:bg-white transition-colors font-semibold text-sm"
          >
            닫기
          </button>
        </div>
      </div>
    </>
  );
}
