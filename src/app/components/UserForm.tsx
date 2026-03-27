import { X } from "lucide-react";
import { useState } from "react";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function UserForm({ isOpen, onClose, onSubmit, initialData }: UserFormProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F]">
          <h2 className="text-xl font-bold text-white">
            {initialData ? '사용자 정보 수정' : '신규 사용자 등록'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-base font-bold text-[#18212B] mb-4 pb-2 border-b border-[#D7DEE6]">
                기본 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    이름 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={initialData?.name}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="이름을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    사원번호 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    defaultValue={initialData?.employeeId}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="예: EMP-001"
                  />
                </div>
              </div>
            </div>

            {/* Department & Position */}
            <div>
              <h3 className="text-base font-bold text-[#18212B] mb-4 pb-2 border-b border-[#D7DEE6]">
                조직 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    부서 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="department"
                    defaultValue={initialData?.department || ''}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="">선택하세요</option>
                    <option value="경영지원">경영지원</option>
                    <option value="영업팀">영업팀</option>
                    <option value="운영팀">운영팀</option>
                    <option value="물류팀">물류팀</option>
                    <option value="A/S팀">A/S팀</option>
                    <option value="정산팀">정산팀</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    직책 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="position"
                    defaultValue={initialData?.position || ''}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="">선택하세요</option>
                    <option value="대표이사">대표이사</option>
                    <option value="이사">이사</option>
                    <option value="부장">부장</option>
                    <option value="차장">차장</option>
                    <option value="과장">과장</option>
                    <option value="대리">대리</option>
                    <option value="사원">사원</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-base font-bold text-[#18212B] mb-4 pb-2 border-b border-[#D7DEE6]">
                연락처 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    이메일 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={initialData?.email}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    연락처 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={initialData?.phone}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>
            </div>

            {/* Permission Settings */}
            <div>
              <h3 className="text-base font-bold text-[#18212B] mb-4 pb-2 border-b border-[#D7DEE6]">
                권한 설정
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    권한그룹 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="roleGroup"
                    defaultValue={initialData?.roleGroup || ''}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="">선택하세요</option>
                    <option value="대표">대표</option>
                    <option value="영업팀">영업팀</option>
                    <option value="운영팀">운영팀</option>
                    <option value="물류팀">물류팀</option>
                    <option value="A/S팀">A/S팀</option>
                    <option value="정산팀">정산팀</option>
                    <option value="읽기전용">읽기전용</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    계정 상태 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="status"
                    defaultValue={initialData?.status || '활성'}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="활성">활성</option>
                    <option value="휴면">휴면</option>
                    <option value="비활성">비활성</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#D7DEE6] bg-[#F4F7FA]">
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
