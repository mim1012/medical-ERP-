import { X, Upload } from "lucide-react";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function ProductForm({ isOpen, onClose, onSubmit, initialData }: ProductFormProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Side Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F]">
          <h2 className="text-xl font-bold text-white">
            {initialData ? '품목 정보 수정' : '신규 품목 등록'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                기본 정보
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    품목명 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="text"
                    name="productName"
                    defaultValue={initialData?.productName}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="품목명을 입력하세요"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#18212B] mb-2">
                      품목코드 <span className="text-[#B94A48]">*</span>
                    </label>
                    <input
                      type="text"
                      name="productCode"
                      defaultValue={initialData?.productCode}
                      required
                      className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                      placeholder="PRD-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#18212B] mb-2">
                      모델명
                    </label>
                    <input
                      type="text"
                      name="modelName"
                      defaultValue={initialData?.modelName}
                      className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                      placeholder="모델명"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#18212B] mb-2">
                      카테고리 <span className="text-[#B94A48]">*</span>
                    </label>
                    <select
                      name="category"
                      defaultValue={initialData?.category || ''}
                      required
                      className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    >
                      <option value="">선택하세요</option>
                      <option value="영상진단기기">영상진단기기</option>
                      <option value="검사장비">검사장비</option>
                      <option value="수술기구">수술기구</option>
                      <option value="치료기기">치료기기</option>
                      <option value="소모품">소모품</option>
                      <option value="시약">시약</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#18212B] mb-2">
                      품목구분 <span className="text-[#B94A48]">*</span>
                    </label>
                    <select
                      name="productType"
                      defaultValue={initialData?.productType || ''}
                      required
                      className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    >
                      <option value="">선택하세요</option>
                      <option value="완제품">완제품</option>
                      <option value="반제품">반제품</option>
                      <option value="부품">부품</option>
                      <option value="소모품">소모품</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Manufacturer Information */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                제조사 정보
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#18212B] mb-2">
                      제조사 <span className="text-[#B94A48]">*</span>
                    </label>
                    <input
                      type="text"
                      name="manufacturer"
                      defaultValue={initialData?.manufacturer}
                      required
                      className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                      placeholder="제조사명"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#18212B] mb-2">
                      수입사
                    </label>
                    <input
                      type="text"
                      name="importer"
                      defaultValue={initialData?.importer}
                      className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                      placeholder="수입사명"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    브랜드
                  </label>
                  <input
                    type="text"
                    name="brand"
                    defaultValue={initialData?.brand}
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="브랜드명"
                  />
                </div>
              </div>
            </div>

            {/* Regulatory Information */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                인허가 정보
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    의료기기 분류 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="deviceClass"
                    defaultValue={initialData?.deviceClass || ''}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="">선택하세요</option>
                    <option value="1등급">1등급 (낮은 위해도)</option>
                    <option value="2등급">2등급 (낮은 위해도)</option>
                    <option value="3등급">3등급 (중등도 위해도)</option>
                    <option value="4등급">4등급 (높은 위해도)</option>
                    <option value="해당없음">해당없음</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#18212B] mb-2">
                      허가번호
                    </label>
                    <input
                      type="text"
                      name="approvalNumber"
                      defaultValue={initialData?.approvalNumber}
                      className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                      placeholder="식약처 허가번호"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#18212B] mb-2">
                      인증번호
                    </label>
                    <input
                      type="text"
                      name="certificationNumber"
                      defaultValue={initialData?.certificationNumber}
                      className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                      placeholder="CE/FDA 등"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    보험코드
                  </label>
                  <input
                    type="text"
                    name="insuranceCode"
                    defaultValue={initialData?.insuranceCode}
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="건강보험 청구코드"
                  />
                </div>
              </div>
            </div>

            {/* Management Settings */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                관리 설정
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-[#F4F7FA] rounded-lg border border-[#D7DEE6]">
                    <input
                      type="checkbox"
                      name="lotManagement"
                      id="lotManagement"
                      defaultChecked={initialData?.lotManagement}
                      className="w-5 h-5 text-[#163A5F] border-[#D7DEE6] rounded focus:ring-[#5B8DB8]"
                    />
                    <label htmlFor="lotManagement" className="text-sm font-semibold text-[#18212B] cursor-pointer">
                      로트 관리 여부
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-[#F4F7FA] rounded-lg border border-[#D7DEE6]">
                    <input
                      type="checkbox"
                      name="serialManagement"
                      id="serialManagement"
                      defaultChecked={initialData?.serialManagement}
                      className="w-5 h-5 text-[#163A5F] border-[#D7DEE6] rounded focus:ring-[#5B8DB8]"
                    />
                    <label htmlFor="serialManagement" className="text-sm font-semibold text-[#18212B] cursor-pointer">
                      시리얼 관리 여부
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-[#F4F7FA] rounded-lg border border-[#D7DEE6]">
                    <input
                      type="checkbox"
                      name="expiryManagement"
                      id="expiryManagement"
                      defaultChecked={initialData?.expiryManagement}
                      className="w-5 h-5 text-[#163A5F] border-[#D7DEE6] rounded focus:ring-[#5B8DB8]"
                    />
                    <label htmlFor="expiryManagement" className="text-sm font-semibold text-[#18212B] cursor-pointer">
                      유효기간 관리 여부
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-[#F4F7FA] rounded-lg border border-[#D7DEE6]">
                    <input
                      type="checkbox"
                      name="installationRequired"
                      id="installationRequired"
                      defaultChecked={initialData?.installationRequired}
                      className="w-5 h-5 text-[#163A5F] border-[#D7DEE6] rounded focus:ring-[#5B8DB8]"
                    />
                    <label htmlFor="installationRequired" className="text-sm font-semibold text-[#18212B] cursor-pointer">
                      설치 대상 여부
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-[#F4F7FA] rounded-lg border border-[#D7DEE6]">
                    <input
                      type="checkbox"
                      name="asRequired"
                      id="asRequired"
                      defaultChecked={initialData?.asRequired}
                      className="w-5 h-5 text-[#163A5F] border-[#D7DEE6] rounded focus:ring-[#5B8DB8]"
                    />
                    <label htmlFor="asRequired" className="text-sm font-semibold text-[#18212B] cursor-pointer">
                      A/S 대상 여부
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-[#18212B] mb-2">
                      보증기간 (개월)
                    </label>
                    <input
                      type="number"
                      name="warrantyPeriod"
                      defaultValue={initialData?.warrantyPeriod}
                      className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Settings */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                재고 관리
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    안전재고
                  </label>
                  <input
                    type="number"
                    name="safetyStock"
                    defaultValue={initialData?.safetyStock}
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    재주문 기준수량
                  </label>
                  <input
                    type="number"
                    name="reorderPoint"
                    defaultValue={initialData?.reorderPoint}
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                가격 정보
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#18212B] mb-2">
                      매입단가 (원)
                    </label>
                    <input
                      type="number"
                      name="purchasePrice"
                      defaultValue={initialData?.purchasePrice}
                      className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#18212B] mb-2">
                      공급단가 (원)
                    </label>
                    <input
                      type="number"
                      name="supplyPrice"
                      defaultValue={initialData?.supplyPrice}
                      className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#18212B] mb-2">
                      권장판매가 (원)
                    </label>
                    <input
                      type="number"
                      name="retailPrice"
                      defaultValue={initialData?.retailPrice}
                      className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                문서 첨부
              </h3>
              <div className="border-2 border-dashed border-[#D7DEE6] rounded-lg p-6 text-center hover:border-[#5B8DB8] transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-[#5B6773] mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#18212B] mb-1">클릭하여 파일 업로드</p>
                <p className="text-xs text-[#5B6773]">인증서, 매뉴얼, 카탈로그 등</p>
              </div>
            </div>

            {/* Memo */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                내부 메모
              </h3>
              <div>
                <textarea
                  name="memo"
                  defaultValue={initialData?.memo}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white resize-none"
                  placeholder="품목 관련 메모를 입력하세요"
                />
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
              {initialData ? '수정' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
