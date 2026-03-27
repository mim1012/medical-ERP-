import { X, Plus, Trash2, Package } from "lucide-react";
import { useState } from "react";

interface ShipmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

interface ShipmentItem {
  id: string;
  productName: string;
  lotNumber: string;
  serialNumber: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  availableStock: number;
}

export function ShipmentForm({ isOpen, onClose, onSubmit, initialData }: ShipmentFormProps) {
  const [shipmentItems, setShipmentItems] = useState<ShipmentItem[]>([
    { 
      id: '1', 
      productName: '', 
      lotNumber: '', 
      serialNumber: '', 
      quantity: 1, 
      unitPrice: 0, 
      totalPrice: 0,
      availableStock: 0
    }
  ]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    onSubmit({ ...data, items: shipmentItems });
  };

  const addShipmentItem = () => {
    setShipmentItems([...shipmentItems, { 
      id: Date.now().toString(), 
      productName: '', 
      lotNumber: '', 
      serialNumber: '', 
      quantity: 1, 
      unitPrice: 0, 
      totalPrice: 0,
      availableStock: 0
    }]);
  };

  const removeShipmentItem = (id: string) => {
    setShipmentItems(shipmentItems.filter(item => item.id !== id));
  };

  const updateShipmentItem = (id: string, field: string, value: any) => {
    setShipmentItems(shipmentItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.totalPrice = updated.quantity * updated.unitPrice;
        }
        // Mock available stock based on product name
        if (field === 'productName' && value) {
          updated.availableStock = Math.floor(Math.random() * 500) + 50;
        }
        return updated;
      }
      return item;
    }));
  };

  const calculateSubtotal = () => {
    return shipmentItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const calculateTax = () => {
    return Math.round(calculateSubtotal() * 0.1);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F]">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">
              {initialData ? '출고서 수정' : '신규 출고 등록'}
            </h2>
          </div>
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
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                출고 기본 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    출고번호 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="text"
                    name="shipmentNumber"
                    defaultValue={initialData?.shipmentNumber || '자동생성'}
                    readOnly
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md bg-[#F4F7FA] text-[#5B6773]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    출고일 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="date"
                    name="shipmentDate"
                    defaultValue={initialData?.shipmentDate || new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    납품예정일 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="date"
                    name="deliveryDate"
                    defaultValue={initialData?.deliveryDate}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Customer and Staff Information */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                거래처 및 담당자 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    거래처명 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="client"
                    defaultValue={initialData?.client || ''}
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
                    담당 영업사원 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="salesRep"
                    defaultValue={initialData?.salesRep || ''}
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
              </div>
            </div>

            {/* Warehouse and Type */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                출고 세부 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    출고창고 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="warehouse"
                    defaultValue={initialData?.warehouse || ''}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="">선택하세요</option>
                    <option value="본사창고">본사창고</option>
                    <option value="지점창고">지점창고</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    출고유형 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="shipmentType"
                    defaultValue={initialData?.shipmentType || ''}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="">선택하세요</option>
                    <option value="일반판매">일반판매</option>
                    <option value="렌탈">렌탈</option>
                    <option value="시연">시연</option>
                    <option value="AS교체">AS교체</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Shipment Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#18212B] pb-2 border-b-2 border-[#163A5F]">
                  출고 품목
                </h3>
                <button
                  type="button"
                  onClick={addShipmentItem}
                  className="flex items-center gap-2 px-4 py-2 bg-[#5B8DB8] text-white rounded-md hover:bg-[#4A7A9D] transition-colors text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  품목 추가
                </button>
              </div>
              <div className="border border-[#D7DEE6] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#F4F7FA] border-b border-[#D7DEE6]">
                        <th className="text-left py-3 px-3 text-sm font-semibold text-[#18212B] min-w-[200px]">품목명</th>
                        <th className="text-left py-3 px-3 text-sm font-semibold text-[#18212B] min-w-[130px]">로트번호</th>
                        <th className="text-left py-3 px-3 text-sm font-semibold text-[#18212B] min-w-[130px]">시리얼번호</th>
                        <th className="text-center py-3 px-3 text-sm font-semibold text-[#18212B] min-w-[90px]">재고수량</th>
                        <th className="text-center py-3 px-3 text-sm font-semibold text-[#18212B] min-w-[90px]">출고수량</th>
                        <th className="text-right py-3 px-3 text-sm font-semibold text-[#18212B] min-w-[120px]">단가</th>
                        <th className="text-right py-3 px-3 text-sm font-semibold text-[#18212B] min-w-[130px]">금액</th>
                        <th className="text-center py-3 px-3 text-sm font-semibold text-[#18212B] min-w-[60px]">삭제</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shipmentItems.map((item) => (
                        <tr key={item.id} className="border-b border-[#D7DEE6]">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={item.productName}
                              onChange={(e) => updateShipmentItem(item.id, 'productName', e.target.value)}
                              className="w-full px-2 py-1.5 border border-[#D7DEE6] rounded text-sm"
                              placeholder="품목명 입력"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={item.lotNumber}
                              onChange={(e) => updateShipmentItem(item.id, 'lotNumber', e.target.value)}
                              className="w-full px-2 py-1.5 border border-[#D7DEE6] rounded text-sm font-mono"
                              placeholder="LOT-0000-A000"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={item.serialNumber}
                              onChange={(e) => updateShipmentItem(item.id, 'serialNumber', e.target.value)}
                              className="w-full px-2 py-1.5 border border-[#D7DEE6] rounded text-sm font-mono"
                              placeholder="SN-XX-000000"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <div className="text-center text-sm font-semibold text-[#2E7D5B]">
                              {item.availableStock > 0 ? formatCurrency(item.availableStock) : '-'}
                            </div>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateShipmentItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                              className="w-full px-2 py-1.5 border border-[#D7DEE6] rounded text-sm text-center"
                              min="1"
                              max={item.availableStock}
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => updateShipmentItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                              className="w-full px-2 py-1.5 border border-[#D7DEE6] rounded text-sm text-right"
                              min="0"
                            />
                          </td>
                          <td className="py-2 px-3 text-right text-sm font-semibold text-[#18212B]">
                            {formatCurrency(item.totalPrice)}원
                          </td>
                          <td className="py-2 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => removeShipmentItem(item.id)}
                              className="p-1 hover:bg-[#F4F7FA] rounded transition-colors"
                              disabled={shipmentItems.length === 1}
                            >
                              <Trash2 className="w-4 h-4 text-[#B94A48]" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                금액 정보
              </h3>
              <div className="bg-[#F4F7FA] rounded-lg p-6 border border-[#D7DEE6]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#5B6773]">공급가액</span>
                    <span className="text-lg font-bold text-[#18212B]">{formatCurrency(calculateSubtotal())}원</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#5B6773]">부가세 (10%)</span>
                    <span className="text-lg font-bold text-[#18212B]">{formatCurrency(calculateTax())}원</span>
                  </div>
                  <div className="pt-3 border-t-2 border-[#163A5F] flex items-center justify-between">
                    <span className="text-base font-bold text-[#163A5F]">총 출고금액</span>
                    <span className="text-2xl font-bold text-[#163A5F]">{formatCurrency(calculateTotal())}원</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Memo */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                메모
              </h3>
              <textarea
                name="memo"
                defaultValue={initialData?.memo}
                rows={4}
                className="w-full px-4 py-3 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white resize-none text-sm"
                placeholder="특이사항, 배송 지시사항 등을 입력하세요"
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
              {initialData ? '수정' : '출고 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
