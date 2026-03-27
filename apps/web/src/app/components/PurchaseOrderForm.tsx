import { X, Plus, Trash2, Upload } from "lucide-react";
import { useState } from "react";

interface PurchaseOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

interface OrderItem {
  id: string;
  productCode: string;
  productName: string;
  spec: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export function PurchaseOrderForm({ isOpen, onClose, onSubmit, initialData }: PurchaseOrderFormProps) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { id: '1', productCode: '', productName: '', spec: '', quantity: 1, unitPrice: 0, totalPrice: 0 }
  ]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    onSubmit({ ...data, items: orderItems });
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { 
      id: Date.now().toString(), 
      productCode: '', 
      productName: '', 
      spec: '', 
      quantity: 1, 
      unitPrice: 0, 
      totalPrice: 0 
    }]);
  };

  const removeOrderItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const updateOrderItem = (id: string, field: string, value: any) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.totalPrice = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    }));
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
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
          <h2 className="text-xl font-bold text-white">
            {initialData ? '발주서 수정' : '신규 발주서 작성'}
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
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                발주 기본 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    발주번호 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="text"
                    name="poNumber"
                    defaultValue={initialData?.poNumber || '자동생성'}
                    readOnly
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md bg-[#F4F7FA] text-[#5B6773]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    발주일 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="date"
                    name="orderDate"
                    defaultValue={initialData?.orderDate || new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    입고예정일 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="date"
                    name="expectedDate"
                    defaultValue={initialData?.expectedDate}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Supplier Information */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                공급사 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    공급사 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="supplier"
                    defaultValue={initialData?.supplier || ''}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="">선택하세요</option>
                    <option value="삼성메디슨">삼성메디슨</option>
                    <option value="바이엘코리아">바이엘코리아</option>
                    <option value="GE헬스케어">GE헬스케어</option>
                    <option value="필립스">필립스</option>
                    <option value="메디칼툴즈">메디칼툴즈</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    담당자 <span className="text-[#B94A48]">*</span>
                  </label>
                  <input
                    type="text"
                    name="manager"
                    defaultValue={initialData?.manager}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    placeholder="담당자명"
                  />
                </div>
              </div>
            </div>

            {/* Payment Terms */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                결제 조건
              </h3>
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
                </select>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#18212B] pb-2 border-b-2 border-[#163A5F]">
                  발주 품목
                </h3>
                <button
                  type="button"
                  onClick={addOrderItem}
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
                        <th className="text-left py-3 px-3 text-sm font-semibold text-[#18212B] min-w-[120px]">품목코드</th>
                        <th className="text-left py-3 px-3 text-sm font-semibold text-[#18212B] min-w-[200px]">품목명</th>
                        <th className="text-left py-3 px-3 text-sm font-semibold text-[#18212B] min-w-[150px]">규격</th>
                        <th className="text-center py-3 px-3 text-sm font-semibold text-[#18212B] min-w-[100px]">수량</th>
                        <th className="text-right py-3 px-3 text-sm font-semibold text-[#18212B] min-w-[120px]">단가</th>
                        <th className="text-right py-3 px-3 text-sm font-semibold text-[#18212B] min-w-[130px]">공급가액</th>
                        <th className="text-center py-3 px-3 text-sm font-semibold text-[#18212B] min-w-[60px]">삭제</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item) => (
                        <tr key={item.id} className="border-b border-[#D7DEE6]">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={item.productCode}
                              onChange={(e) => updateOrderItem(item.id, 'productCode', e.target.value)}
                              className="w-full px-2 py-1.5 border border-[#D7DEE6] rounded text-sm"
                              placeholder="PRD-0000"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={item.productName}
                              onChange={(e) => updateOrderItem(item.id, 'productName', e.target.value)}
                              className="w-full px-2 py-1.5 border border-[#D7DEE6] rounded text-sm"
                              placeholder="품목명"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={item.spec}
                              onChange={(e) => updateOrderItem(item.id, 'spec', e.target.value)}
                              className="w-full px-2 py-1.5 border border-[#D7DEE6] rounded text-sm"
                              placeholder="규격/모델"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateOrderItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                              className="w-full px-2 py-1.5 border border-[#D7DEE6] rounded text-sm text-center"
                              min="1"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => updateOrderItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
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
                              onClick={() => removeOrderItem(item.id)}
                              className="p-1 hover:bg-[#F4F7FA] rounded transition-colors"
                              disabled={orderItems.length === 1}
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
                    <span className="text-sm font-semibold text-[#5B6773]">합계금액</span>
                    <span className="text-lg font-bold text-[#18212B]">{formatCurrency(calculateSubtotal())}원</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#5B6773]">부가세 (10%)</span>
                    <span className="text-lg font-bold text-[#18212B]">{formatCurrency(calculateTax())}원</span>
                  </div>
                  <div className="pt-3 border-t-2 border-[#163A5F] flex items-center justify-between">
                    <span className="text-base font-bold text-[#163A5F]">총 발주금액</span>
                    <span className="text-2xl font-bold text-[#163A5F]">{formatCurrency(calculateTotal())}원</span>
                  </div>
                </div>
              </div>
            </div>

            {/* File Attachment */}
            <div>
              <h3 className="text-lg font-bold text-[#18212B] mb-4 pb-2 border-b-2 border-[#163A5F]">
                첨부파일
              </h3>
              <div className="border-2 border-dashed border-[#D7DEE6] rounded-lg p-6 text-center hover:border-[#5B8DB8] transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-[#5B6773] mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#18212B] mb-1">클릭하여 파일 업로드</p>
                <p className="text-xs text-[#5B6773]">견적서, 사양서, 계약서 등</p>
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
              {initialData ? '수정' : '발주 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
