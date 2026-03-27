import { X, Calendar } from "lucide-react";
import { useState } from "react";

interface InstallationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function InstallationForm({ isOpen, onClose, onSubmit, initialData }: InstallationFormProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F]">
          <h2 className="text-xl font-bold text-white">
            {initialData ? '설치 정보 수정' : '신규 설치 등록'}
          </h2>
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
            {/* Hospital Information */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                병원 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    병원명 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="hospitalName"
                    defaultValue={initialData?.hospitalName || ''}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="">선택하세요</option>
                    <option value="서울대병원">서울대병원</option>
                    <option value="삼성서울병원">삼성서울병원</option>
                    <option value="세브란스병원">세브란스병원</option>
                    <option value="아산병원">아산병원</option>
                    <option value="서울성모병원">서울성모병원</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    담당자 연락처
                  </label>
                  <input
                    type="tel"
                    name="hospitalContact"
                    defaultValue={initialData?.hospitalContact}
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="02-0000-0000"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-[#18212B] mb-2">
                  설치 장소
                </label>
                <input
                  type="text"
                  name="installLocation"
                  defaultValue={initialData?.installLocation}
                  className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  placeholder="예: 3층 영상의학과"
                />
              </div>
            </div>

            {/* Device Information */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                장비 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    장비명 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="text"
                    name="equipmentName"
                    defaultValue={initialData?.equipmentName}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="장비명 입력"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    모델명 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="text"
                    name="modelName"
                    defaultValue={initialData?.modelName}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="모델명 입력"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    시리얼번호 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="text"
                    name="serialNumber"
                    defaultValue={initialData?.serialNumber}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white font-mono"
                    placeholder="SN-XX-000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    장비상태 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="equipmentStatus"
                    defaultValue={initialData?.equipmentStatus || '정상'}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="정상">정상</option>
                    <option value="점검필요">점검필요</option>
                    <option value="수리중">수리중</option>
                    <option value="중단">중단</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Installation Details */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                설치 상세 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    설치일 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="date"
                    name="installationDate"
                    defaultValue={initialData?.installationDate || new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    보증기간 (개월) <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="warrantyPeriod"
                    defaultValue={initialData?.warrantyPeriod || '12'}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="12">12개월</option>
                    <option value="24">24개월</option>
                    <option value="36">36개월</option>
                    <option value="60">60개월</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    담당기사 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="engineer"
                    defaultValue={initialData?.engineer || ''}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="">선택하세요</option>
                    <option value="김기사">김기사</option>
                    <option value="이기사">이기사</option>
                    <option value="박기사">박기사</option>
                    <option value="최기사">최기사</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    기사 연락처
                  </label>
                  <input
                    type="tel"
                    name="engineerContact"
                    defaultValue={initialData?.engineerContact}
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                설치 메모
              </h3>
              <textarea
                name="notes"
                defaultValue={initialData?.notes}
                rows={4}
                className="w-full px-4 py-3 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white resize-none text-sm"
                placeholder="설치 특이사항, 주의사항 등을 입력하세요"
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
