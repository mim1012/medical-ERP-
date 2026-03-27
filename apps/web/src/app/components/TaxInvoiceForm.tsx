import { X } from "lucide-react";
import { useState } from "react";

interface TaxInvoiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function TaxInvoiceForm({ isOpen, onClose, onSubmit, initialData }: TaxInvoiceFormProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  const calculateTotal = () => {
    const supplyInput = document.querySelector('input[name="supplyAmount"]') as HTMLInputElement;
    const taxInput = document.querySelector('input[name="taxAmount"]') as HTMLInputElement;
    const totalInput = document.querySelector('input[name="totalAmount"]') as HTMLInputElement;
    
    if (supplyInput && taxInput && totalInput) {
      const supply = parseFloat(supplyInput.value) || 0;
      const tax = parseFloat(taxInput.value) || 0;
      totalInput.value = (supply + tax).toString();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F]">
          <h2 className="text-xl font-bold text-white">
            {initialData ? '세금계산서 수정' : '세금계산서 발행'}
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
            {/* Invoice Info */}
            <div>
              <h3 className="text-base font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                계산서 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    발행번호 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="text"
                    name="invoiceNumber"
                    defaultValue={initialData?.invoiceNumber || `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    발행월 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="month"
                    name="issueMonth"
                    defaultValue={initialData?.issueMonth || new Date().toISOString().slice(0, 7)}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  />
                </div>
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
              </div>
            </div>

            {/* Client Info */}
            <div>
              <h3 className="text-base font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                거래처 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    거래처명 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="clientName"
                    defaultValue={initialData?.clientName || ''}
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
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    대표자명 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="text"
                    name="ceoName"
                    defaultValue={initialData?.ceoName}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    수신 이메일 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={initialData?.email}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Amount Info */}
            <div>
              <h3 className="text-base font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                금액 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    과세 구분 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="taxType"
                    defaultValue={initialData?.taxType || '과세'}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="과세">과세</option>
                    <option value="영세율">영세율</option>
                    <option value="면세">면세</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    공급가액 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="number"
                    name="supplyAmount"
                    defaultValue={initialData?.supplyAmount}
                    required
                    onChange={calculateTotal}
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    부가세 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="number"
                    name="taxAmount"
                    defaultValue={initialData?.taxAmount}
                    required
                    onChange={calculateTotal}
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    총액
                  </label>
                  <input
                    type="number"
                    name="totalAmount"
                    defaultValue={initialData?.totalAmount}
                    readOnly
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md bg-[#F4F7FA] text-[#18212B] font-bold"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Related Info */}
            <div>
              <h3 className="text-base font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                연관 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    관련 출고번호
                  </label>
                  <input
                    type="text"
                    name="shippingNumber"
                    defaultValue={initialData?.shippingNumber}
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="SHP-2026-0001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    관련 정산번호
                  </label>
                  <input
                    type="text"
                    name="settlementNumber"
                    defaultValue={initialData?.settlementNumber}
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="STL-2026-001"
                  />
                </div>
              </div>
            </div>

            {/* Status Info */}
            <div>
              <h3 className="text-base font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                발행 상태
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    발행 상태 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="status"
                    defaultValue={initialData?.status || '발행대기'}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="발행대기">발행대기</option>
                    <option value="발행완료">발행완료</option>
                    <option value="미발행">미발행</option>
                    <option value="수정발행">수정발행</option>
                    <option value="발행오류">발행오류</option>
                    <option value="취소">취소</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    수정발행 여부
                  </label>
                  <select
                    name="isRevised"
                    defaultValue={initialData?.isRevised || '아니오'}
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="아니오">아니오</option>
                    <option value="예">예</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    담당자
                  </label>
                  <select
                    name="manager"
                    defaultValue={initialData?.manager}
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="">선택하세요</option>
                    <option value="강정산">강정산</option>
                    <option value="김경리">김경리</option>
                    <option value="이회계">이회계</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Error & Memo */}
            <div>
              <h3 className="text-base font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                기타 정보
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    오류 사유
                  </label>
                  <input
                    type="text"
                    name="errorReason"
                    defaultValue={initialData?.errorReason}
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="발행 오류가 있는 경우 사유를 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    메모
                  </label>
                  <textarea
                    name="memo"
                    defaultValue={initialData?.memo}
                    rows={3}
                    className="w-full px-4 py-3 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white resize-none text-sm"
                    placeholder="내부 참고사항을 입력하세요"
                  />
                </div>
              </div>
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
              {initialData ? '수정' : '발행'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
