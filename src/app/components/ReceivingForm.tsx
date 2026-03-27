import { X } from "lucide-react";
import { useState } from "react";

interface ReceivingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  purchaseOrder?: any;
}

interface ReceivingItem {
  id: string;
  productCode: string;
  productName: string;
  orderedQty: number;
  receivedQty: number;
  lotNumber: string;
  expiryDate: string;
  serialNumber: string;
  defectQty: number;
  note: string;
}

export function ReceivingForm({ isOpen, onClose, onSubmit, purchaseOrder }: ReceivingFormProps) {
  const [receivingItems, setReceivingItems] = useState<ReceivingItem[]>(() => {
    if (purchaseOrder?.items && Array.isArray(purchaseOrder.items)) {
      return purchaseOrder.items.map((item: any) => ({
        id: item.id,
        productCode: item.productCode,
        productName: item.productName,
        orderedQty: item.quantity,
        receivedQty: 0,
        lotNumber: '',
        expiryDate: '',
        serialNumber: '',
        defectQty: 0,
        note: ''
      }));
    }
    return [];
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    onSubmit({ ...data, items: receivingItems });
  };

  const updateReceivingItem = (id: string, field: string, value: any) => {
    setReceivingItems(receivingItems.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
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
            <h2 className="text-xl font-bold text-white">입고 처리</h2>
            <p className="text-sm text-[#5B8DB8] mt-1">발주번호: {purchaseOrder?.poNumber || 'N/A'}</p>
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
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                입고 기본 정보
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#18212B] mb-2">
                      발주번호
                    </label>
                    <input
                      type="text"
                      value={purchaseOrder?.poNumber || ''}
                      readOnly
                      className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md bg-[#F4F7FA] text-[#5B6773]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#18212B] mb-2">
                      공급사명
                    </label>
                    <input
                      type="text"
                      value={purchaseOrder?.supplier || ''}
                      readOnly
                      className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md bg-[#F4F7FA] text-[#5B6773]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#18212B] mb-2">
                      입고일 <span className="text-[#B94A48]">*</span>
                    </label>
                    <input
                      type="date"
                      name="receivingDate"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#18212B] mb-2">
                      입고창고 <span className="text-[#B94A48]">*</span>
                    </label>
                    <select
                      name="warehouse"
                      required
                      className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    >
                      <option value="">선택하세요</option>
                      <option value="본사창고">본사창고</option>
                      <option value="지점창고">지점창고</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    검수상태 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="inspectionStatus"
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="">선택하세요</option>
                    <option value="합격">합격</option>
                    <option value="불합격">불합격</option>
                    <option value="부분합격">부분합격</option>
                    <option value="검수중">검수중</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Receiving Items */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                입고 품목 상세
              </h3>
              <div className="space-y-4">
                {receivingItems.map((item) => (
                  <div key={item.id} className="border border-[#D7DEE6] rounded-lg p-4 bg-[#F4F7FA]">
                    <div className="mb-3 pb-3 border-b border-[#D7DEE6]">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-[#18212B] mb-1">{item.productName}</p>
                          <p className="text-sm text-[#5B6773]">품목코드: {item.productCode}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-[#5B6773]">발주수량</p>
                          <p className="text-lg font-bold text-[#163A5F]">{item.orderedQty}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#18212B] mb-1.5">
                          입고수량 <span className="text-[#B94A48]">*</span>
                        </label>
                        <input
                          type="number"
                          value={item.receivedQty}
                          onChange={(e) => updateReceivingItem(item.id, 'receivedQty', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white text-sm"
                          min="0"
                          max={item.orderedQty}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#18212B] mb-1.5">
                          불량수량
                        </label>
                        <input
                          type="number"
                          value={item.defectQty}
                          onChange={(e) => updateReceivingItem(item.id, 'defectQty', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white text-sm"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 mt-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#18212B] mb-1.5">
                          로트번호
                        </label>
                        <input
                          type="text"
                          value={item.lotNumber}
                          onChange={(e) => updateReceivingItem(item.id, 'lotNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white text-sm font-mono"
                          placeholder="LOT-0000-A000"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#18212B] mb-1.5">
                          유효기간
                        </label>
                        <input
                          type="date"
                          value={item.expiryDate}
                          onChange={(e) => updateReceivingItem(item.id, 'expiryDate', e.target.value)}
                          className="w-full px-3 py-2 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#18212B] mb-1.5">
                          시리얼번호
                        </label>
                        <input
                          type="text"
                          value={item.serialNumber}
                          onChange={(e) => updateReceivingItem(item.id, 'serialNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white text-sm font-mono"
                          placeholder="SN-XX-000000"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs font-semibold text-[#18212B] mb-1.5">
                        비고
                      </label>
                      <textarea
                        value={item.note}
                        onChange={(e) => updateReceivingItem(item.id, 'note', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white text-sm resize-none"
                        placeholder="특이사항, 손상 여부 등"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                입고 요약
              </h3>
              <div className="bg-[#F4F7FA] rounded-lg p-5 border border-[#D7DEE6]">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-[#5B6773] mb-1">총 발주수량</p>
                    <p className="text-2xl font-bold text-[#18212B]">
                      {receivingItems.reduce((sum, item) => sum + item.orderedQty, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#5B6773] mb-1">총 입고수량</p>
                    <p className="text-2xl font-bold text-[#2E7D5B]">
                      {receivingItems.reduce((sum, item) => sum + item.receivedQty, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#5B6773] mb-1">총 불량수량</p>
                    <p className="text-2xl font-bold text-[#B94A48]">
                      {receivingItems.reduce((sum, item) => sum + item.defectQty, 0)}
                    </p>
                  </div>
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
              입고 처리
            </button>
          </div>
        </form>
      </div>
    </>
  );
}