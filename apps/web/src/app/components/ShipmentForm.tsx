import { X, Plus, Trash2, Package } from "lucide-react";
import { useState } from "react";
import { useClients } from "../../hooks/use-clients";
import { useProducts } from "../../hooks/use-products";
import type { CreateShipmentDto } from "../../hooks/use-shipping";

interface FormItem {
  localId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
}

interface ShipmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateShipmentDto) => void;
  isSubmitting?: boolean;
}

export function ShipmentForm({ isOpen, onClose, onSubmit, isSubmitting }: ShipmentFormProps) {
  const [clientId, setClientId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<FormItem[]>([
    { localId: '1', productId: '', quantity: 1, unitPrice: 0 },
  ]);

  const { data: clients = [] } = useClients();
  const { data: products = [] } = useProducts();

  if (!isOpen) return null;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('ko-KR').format(amount);

  const addItem = () => {
    setItems([...items, { localId: Date.now().toString(), productId: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (localId: string) => {
    if (items.length === 1) return;
    setItems(items.filter((i) => i.localId !== localId));
  };

  const updateItem = (localId: string, field: keyof Omit<FormItem, 'localId'>, value: string | number) => {
    setItems(items.map((item) => {
      if (item.localId !== localId) return item;
      if (field === 'productId') {
        const product = products.find((p) => p.id === value);
        return {
          ...item,
          productId: value as string,
          unitPrice: product?.unitPrice ? parseFloat(product.unitPrice) : item.unitPrice,
        };
      }
      return { ...item, [field]: value };
    }));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;
    const validItems = items.filter((i) => i.productId && i.quantity > 0);
    if (validItems.length === 0) return;
    onSubmit({
      clientId,
      notes: notes || undefined,
      items: validItems.map(({ productId, quantity, unitPrice }) => ({ productId, quantity, unitPrice })),
    });
  };

  const resetForm = () => {
    setClientId('');
    setNotes('');
    setItems([{ localId: '1', productId: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F]">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">신규 출고 등록</h2>
          </div>
          <button onClick={handleClose} className="p-1 hover:bg-white/10 rounded-md transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Client selection */}
            <div>
              <label className="block text-sm font-semibold text-[#18212B] mb-2">
                거래처 <span className="text-[#B94A48]">*</span>
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
              >
                <option value="">거래처 선택</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-[#18212B]">출고 품목</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#5B8DB8] text-white rounded-md hover:bg-[#4A7A9D] transition-colors text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  품목 추가
                </button>
              </div>

              <div className="border border-[#D7DEE6] rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F4F7FA] border-b border-[#D7DEE6]">
                      <th className="text-left py-3 px-3 text-sm font-semibold text-[#18212B] min-w-[200px]">품목</th>
                      <th className="text-center py-3 px-3 text-sm font-semibold text-[#18212B] w-24">수량</th>
                      <th className="text-right py-3 px-3 text-sm font-semibold text-[#18212B] w-36">단가</th>
                      <th className="text-right py-3 px-3 text-sm font-semibold text-[#18212B] w-36">소계</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.localId} className="border-b border-[#D7DEE6]">
                        <td className="py-2 px-3">
                          <select
                            value={item.productId}
                            onChange={(e) => updateItem(item.localId, 'productId', e.target.value)}
                            className="w-full px-2 py-1.5 border border-[#D7DEE6] rounded text-sm bg-white"
                          >
                            <option value="">품목 선택</option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.localId, 'quantity', parseInt(e.target.value) || 1)}
                            min="1"
                            className="w-full px-2 py-1.5 border border-[#D7DEE6] rounded text-sm text-center"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.localId, 'unitPrice', parseFloat(e.target.value) || 0)}
                            min="0"
                            className="w-full px-2 py-1.5 border border-[#D7DEE6] rounded text-sm text-right"
                          />
                        </td>
                        <td className="py-2 px-3 text-right text-sm font-semibold text-[#18212B]">
                          ₩{formatCurrency(item.quantity * item.unitPrice)}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(item.localId)}
                            disabled={items.length === 1}
                            className="p-1 hover:bg-[#F4F7FA] rounded transition-colors disabled:opacity-30"
                          >
                            <Trash2 className="w-4 h-4 text-[#B94A48]" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 text-right">
                <span className="text-sm text-[#5B6773]">합계: </span>
                <span className="text-lg font-bold text-[#163A5F]">₩{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-[#18212B] mb-2">메모</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white resize-none text-sm"
                placeholder="특이사항 등을 입력하세요"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#D7DEE6] bg-[#F4F7FA]">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 border border-[#D7DEE6] rounded-md text-[#5B6773] hover:bg-white transition-colors font-semibold"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors font-semibold disabled:opacity-60"
            >
              {isSubmitting ? '등록 중...' : '출고 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
