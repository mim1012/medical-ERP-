import { X } from "lucide-react";

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function ClientForm({ isOpen, onClose, onSubmit, initialData }: ClientFormProps) {
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
            {initialData ? '거래처 정보 수정' : '신규 거래처 등록'}
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
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b border-[#D7DEE6]">
                기본 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    거래처명 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    defaultValue={initialData?.clientName}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="거래처명을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    거래처코드 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="text"
                    name="clientCode"
                    defaultValue={initialData?.clientCode}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="CL-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    거래처구분 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="clientType"
                    defaultValue={initialData?.clientType || ''}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="">선택하세요</option>
                    <option value="종합병원">종합병원</option>
                    <option value="병원">병원</option>
                    <option value="의원">의원</option>
                    <option value="요양병원">요양병원</option>
                    <option value="한의원">한의원</option>
                    <option value="치과">치과</option>
                    <option value="대리점">대리점</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    대표자명 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="text"
                    name="representative"
                    defaultValue={initialData?.representative}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="대표자명을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    사업자등록번호 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessNumber"
                    defaultValue={initialData?.businessNumber}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="000-00-00000"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b border-[#D7DEE6]">
                담당자 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    담당자명 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    defaultValue={initialData?.contactPerson}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="담당자명을 입력하세요"
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
                    세금계산서 이메일
                  </label>
                  <input
                    type="email"
                    name="taxEmail"
                    defaultValue={initialData?.taxEmail}
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="tax@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b border-[#D7DEE6]">
                주소 정보
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    주소 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    defaultValue={initialData?.address}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="주소를 입력하세요"
                  />
                </div>
              </div>
            </div>

            {/* Transaction Terms */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b border-[#D7DEE6]">
                거래 조건
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    결제조건 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="paymentTerms"
                    defaultValue={initialData?.paymentTerms || ''}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="">선택하세요</option>
                    <option value="현금">현금</option>
                    <option value="30일">30일</option>
                    <option value="60일">60일</option>
                    <option value="90일">90일</option>
                    <option value="120일">120일</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    외상한도 (원)
                  </label>
                  <input
                    type="number"
                    name="creditLimit"
                    defaultValue={initialData?.creditLimit}
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    담당 영업사원 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="salesManager"
                    defaultValue={initialData?.salesManager || ''}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="">선택하세요</option>
                    <option value="김영업">김영업</option>
                    <option value="이영업">이영업</option>
                    <option value="박영업">박영업</option>
                    <option value="최영업">최영업</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    거래 상태 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="status"
                    defaultValue={initialData?.status || '정상'}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="정상">정상</option>
                    <option value="보류">보류</option>
                    <option value="중지">중지</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Memo */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b border-[#D7DEE6]">
                기타 정보
              </h3>
              <div>
                <label className="block text-sm font-semibold text-[#18212B] mb-2">
                  메모
                </label>
                <textarea
                  name="memo"
                  defaultValue={initialData?.memo}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white resize-none"
                  placeholder="거래처 관련 메모를 입력하세요"
                />
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
