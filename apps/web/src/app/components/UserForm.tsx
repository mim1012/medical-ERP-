import { X } from "lucide-react";
import type { User, UpdateUserDto, UserRole } from "../../hooks/use-users";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateUserDto) => void;
  user: User | null;
}

export function UserForm({ isOpen, onClose, onSubmit, user }: UserFormProps) {
  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const dto: UpdateUserDto = {
      name: fd.get('name') as string,
      role: fd.get('role') as UserRole,
    };
    onSubmit(dto);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F]">
          <h2 className="text-xl font-bold text-white">사용자 정보 수정</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-md transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-semibold text-[#18212B] mb-2">이메일</label>
              <input
                type="text"
                value={user.email}
                readOnly
                className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md bg-[#F4F7FA] text-sm text-[#5B6773] cursor-not-allowed"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-[#18212B] mb-2">
                이름 <span className="text-[#B94A48]">*</span>
              </label>
              <input
                type="text"
                name="name"
                defaultValue={user.name}
                required
                className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white text-sm"
                placeholder="이름을 입력하세요"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-[#18212B] mb-2">
                역할 <span className="text-[#B94A48]">*</span>
              </label>
              <select
                name="role"
                defaultValue={user.role}
                required
                className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white text-sm"
              >
                <option value="ADMIN">ADMIN (관리자)</option>
                <option value="MANAGER">MANAGER (매니저)</option>
                <option value="STAFF">STAFF (직원)</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#D7DEE6] bg-[#F4F7FA]">
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
              수정
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
