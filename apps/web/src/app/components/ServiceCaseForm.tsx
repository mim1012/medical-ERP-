import { X } from "lucide-react";
import { useState } from "react";
import type { Client } from "../../hooks/use-clients";
import type { ServiceType, ServiceStatus } from "../../hooks/use-service";

interface ServiceCaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { clientId: string; type: ServiceType; description: string; assignee: string }) => void;
  clients: Client[];
  isSubmitting?: boolean;
}

export function ServiceCaseForm({ isOpen, onClose, onSubmit, clients, isSubmitting }: ServiceCaseFormProps) {
  const [clientId, setClientId] = useState('');
  const [type, setType] = useState<ServiceType>('REPAIR');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ clientId, type, description, assignee });
    setClientId('');
    setType('REPAIR');
    setDescription('');
    setAssignee('');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F]">
          <h2 className="text-xl font-bold text-white">신규 A/S 접수</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-md transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#18212B] mb-2">
              거래처 <span className="text-[#B94A48]">*</span>
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white text-sm"
            >
              <option value="">거래처 선택</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#18212B] mb-2">
              유형 <span className="text-[#B94A48]">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ServiceType)}
              required
              className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white text-sm"
            >
              <option value="INSTALLATION">설치</option>
              <option value="REPAIR">수리</option>
              <option value="MAINTENANCE">유지보수</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#18212B] mb-2">내용</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white resize-none text-sm"
              placeholder="서비스 내용을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#18212B] mb-2">담당자</label>
            <input
              type="text"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white text-sm"
              placeholder="담당자 이름"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D7DEE6]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-[#D7DEE6] rounded-md text-[#5B6773] hover:bg-[#F4F7FA] transition-colors font-semibold text-sm"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors font-semibold text-sm disabled:opacity-50"
            >
              {isSubmitting ? '접수 중...' : '접수'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
