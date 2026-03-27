import { X, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface ServiceCaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

interface ReplacedPart {
  id: string;
  partName: string;
  partNumber: string;
  quantity: number;
}

export function ServiceCaseForm({ isOpen, onClose, onSubmit, initialData }: ServiceCaseFormProps) {
  const [replacedParts, setReplacedParts] = useState<ReplacedPart[]>(
    initialData?.replacedParts || []
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    onSubmit({ ...data, replacedParts });
  };

  const addPart = () => {
    setReplacedParts([...replacedParts, { 
      id: Date.now().toString(), 
      partName: '', 
      partNumber: '', 
      quantity: 1 
    }]);
  };

  const removePart = (id: string) => {
    setReplacedParts(replacedParts.filter(part => part.id !== id));
  };

  const updatePart = (id: string, field: string, value: any) => {
    setReplacedParts(replacedParts.map(part => {
      if (part.id === id) {
        return { ...part, [field]: value };
      }
      return part;
    }));
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Side Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-4xl bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F]">
          <div>
            <h2 className="text-xl font-bold text-white">
              {initialData ? 'A/S 케이스 수정' : '신규 A/S 접수'}
            </h2>
            {initialData && (
              <p className="text-sm text-[#5B8DB8] mt-1">접수번호: {initialData.caseNumber}</p>
            )}
          </div>
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
            {/* Case Information */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                접수 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    접수번호
                  </label>
                  <input
                    type="text"
                    name="caseNumber"
                    defaultValue={initialData?.caseNumber || '자동생성'}
                    readOnly
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md bg-[#F4F7FA] text-[#5B6773]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    접수일 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="date"
                    name="caseDate"
                    defaultValue={initialData?.caseDate || new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    우선순위 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="priority"
                    defaultValue={initialData?.priority || '보통'}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="긴급">긴급</option>
                    <option value="높음">높음</option>
                    <option value="보통">보통</option>
                    <option value="낮음">낮음</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    처리상태 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="status"
                    defaultValue={initialData?.status || '접수'}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="접수">접수</option>
                    <option value="배정">배정</option>
                    <option value="진행중">진행중</option>
                    <option value="완료">완료</option>
                    <option value="보류">보류</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Hospital and Device */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                병원 및 장비 정보
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
              </div>
            </div>

            {/* Issue Details */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                고장 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    고장 유형 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="issueType"
                    defaultValue={initialData?.issueType || ''}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="">선택하세요</option>
                    <option value="전원문제">전원문제</option>
                    <option value="하드웨어고장">하드웨어고장</option>
                    <option value="소프트웨어오류">소프트웨어오류</option>
                    <option value="부품교체">부품교체</option>
                    <option value="정기점검">정기점검</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    방문예정일
                  </label>
                  <input
                    type="date"
                    name="visitDate"
                    defaultValue={initialData?.visitDate}
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-[#18212B] mb-2">
                  증상 설명 <span className="text-[#B94A48]">*</span>
                </label>
                <textarea
                  name="symptoms"
                  defaultValue={initialData?.symptoms}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white resize-none text-sm"
                  placeholder="고장 증상을 상세히 입력하세요"
                />
              </div>
            </div>

            {/* Engineer Assignment */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                담당자 배정
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Repair Result */}
            {initialData && (
              <div>
                <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                  조치 결과
                </h3>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    조치 내용
                  </label>
                  <textarea
                    name="repairResult"
                    defaultValue={initialData?.repairResult}
                    rows={3}
                    className="w-full px-4 py-3 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white resize-none text-sm"
                    placeholder="수리 및 조치 내용을 입력하세요"
                  />
                </div>
              </div>
            )}

            {/* Parts Replacement */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#18212B] pb-2 border-b-2 border-[#163A5F]">
                  교체 부품
                </h3>
                <button
                  type="button"
                  onClick={addPart}
                  className="flex items-center gap-2 px-4 py-2 bg-[#5B8DB8] text-white rounded-md hover:bg-[#4A7A9D] transition-colors text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  부품 추가
                </button>
              </div>
              {replacedParts.length > 0 ? (
                <div className="space-y-3">
                  {replacedParts.map((part) => (
                    <div key={part.id} className="border border-[#D7DEE6] rounded-lg p-4 bg-[#F4F7FA]">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#18212B] mb-1.5">
                            부품명
                          </label>
                          <input
                            type="text"
                            value={part.partName}
                            onChange={(e) => updatePart(part.id, 'partName', e.target.value)}
                            className="w-full px-3 py-2 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white text-sm"
                            placeholder="부품명 입력"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#18212B] mb-1.5">
                            부품번호
                          </label>
                          <input
                            type="text"
                            value={part.partNumber}
                            onChange={(e) => updatePart(part.id, 'partNumber', e.target.value)}
                            className="w-full px-3 py-2 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white text-sm font-mono"
                            placeholder="PART-0000"
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <label className="block text-xs font-semibold text-[#18212B] mb-1.5">
                              수량
                            </label>
                            <input
                              type="number"
                              value={part.quantity}
                              onChange={(e) => updatePart(part.id, 'quantity', parseInt(e.target.value) || 1)}
                              className="w-full px-3 py-2 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white text-sm"
                              min="1"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removePart(part.id)}
                            className="p-2 hover:bg-white rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-[#B94A48]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-[#F4F7FA] rounded-lg border border-[#D7DEE6]">
                  <p className="text-sm text-[#5B6773]">교체 부품이 없습니다</p>
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                추가 메모
              </h3>
              <textarea
                name="notes"
                defaultValue={initialData?.notes}
                rows={4}
                className="w-full px-4 py-3 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white resize-none text-sm"
                placeholder="추가 특이사항을 입력하세요"
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
              {initialData ? '수정' : '접수'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
