import { useState } from 'react';
import { X, Search, AlertTriangle, CheckCircle, Package, TrendingDown, ShoppingCart, RefreshCw } from 'lucide-react';

interface StockItem {
  productId: string;
  productName: string;
  category: string;
  currentStock: number;
  reservedStock: number;
  safetyStock: number;
  supplier: string;
  unitPrice: number;
  lastOrderDate: string;
}

interface StockShortageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePurchaseOrder: (items: StockItem[]) => void;
}

export function StockShortageModal({ isOpen, onClose, onCreatePurchaseOrder }: StockShortageModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [orderQuantities, setOrderQuantities] = useState<Record<string, number>>({});

  // 재고 부족 품목 데이터 (현재 재고 < 예약 재고)
  const stockShortageItems: StockItem[] = [
    {
      productId: 'PRD-001',
      productName: '초음파 프로브 A3',
      category: '장비',
      currentStock: 3,
      reservedStock: 8,
      safetyStock: 10,
      supplier: '삼성메디슨',
      unitPrice: 8000000,
      lastOrderDate: '2026-02-15'
    },
    {
      productId: 'PRD-002',
      productName: 'MRI 조영제 10ml',
      category: '소모품',
      currentStock: 50,
      reservedStock: 120,
      safetyStock: 100,
      supplier: '바이엘코리아',
      unitPrice: 50000,
      lastOrderDate: '2026-03-01'
    },
    {
      productId: 'PRD-005',
      productName: '심전도기 ECG-500',
      category: '장비',
      currentStock: 2,
      reservedStock: 9,
      safetyStock: 8,
      supplier: 'GE헬스케어',
      unitPrice: 5000000,
      lastOrderDate: '2026-02-20'
    },
    {
      productId: 'PRD-006',
      productName: '수술용 가위 세트',
      category: '기구',
      currentStock: 10,
      reservedStock: 25,
      safetyStock: 20,
      supplier: '메칼툴즈',
      unitPrice: 980000,
      lastOrderDate: '2026-02-28'
    },
    {
      productId: 'PRD-007',
      productName: '혈압계 디지털',
      category: '장비',
      currentStock: 5,
      reservedStock: 12,
      safetyStock: 15,
      supplier: '오므론헬스케어',
      unitPrice: 350000,
      lastOrderDate: '2026-02-10'
    },
    {
      productId: 'PRD-008',
      productName: '주사기 10ml (100개입)',
      category: '소모품',
      currentStock: 200,
      reservedStock: 450,
      safetyStock: 500,
      supplier: '동아제약',
      unitPrice: 25000,
      lastOrderDate: '2026-03-05'
    }
  ];

  const filteredItems = stockShortageItems.filter(item =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getShortageQuantity = (item: StockItem) => {
    return item.reservedStock - item.currentStock;
  };

  const getRecommendedQuantity = (item: StockItem) => {
    const shortage = getShortageQuantity(item);
    const toSafety = item.safetyStock - item.currentStock;
    return Math.max(shortage, toSafety);
  };

  const toggleItemSelection = (productId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
      const newQuantities = { ...orderQuantities };
      delete newQuantities[productId];
      setOrderQuantities(newQuantities);
    } else {
      newSelected.add(productId);
      const item = stockShortageItems.find(i => i.productId === productId);
      if (item) {
        setOrderQuantities({
          ...orderQuantities,
          [productId]: getRecommendedQuantity(item)
        });
      }
    }
    setSelectedItems(newSelected);
  };

  const selectAllShortage = () => {
    const allIds = new Set(filteredItems.map(item => item.productId));
    setSelectedItems(allIds);
    const newQuantities: Record<string, number> = {};
    filteredItems.forEach(item => {
      newQuantities[item.productId] = getRecommendedQuantity(item);
    });
    setOrderQuantities(newQuantities);
  };

  const deselectAll = () => {
    setSelectedItems(new Set());
    setOrderQuantities({});
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setOrderQuantities({
      ...orderQuantities,
      [productId]: Math.max(1, quantity)
    });
  };

  const handleCreateOrder = () => {
    const itemsToOrder = stockShortageItems
      .filter(item => selectedItems.has(item.productId))
      .map(item => ({
        ...item,
        orderQuantity: orderQuantities[item.productId] || getRecommendedQuantity(item)
      }));

    if (itemsToOrder.length === 0) {
      alert('발주할 품목을 선택해주세요.');
      return;
    }

    onCreatePurchaseOrder(itemsToOrder as any);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR');
  };

  const getTotalAmount = () => {
    return Array.from(selectedItems).reduce((sum, productId) => {
      const item = stockShortageItems.find(i => i.productId === productId);
      if (item) {
        const quantity = orderQuantities[productId] || getRecommendedQuantity(item);
        return sum + (item.unitPrice * quantity);
      }
      return sum;
    }, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7DEE6] bg-gradient-to-r from-[#B94A48] to-[#8B3634]">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              재고 부족 품목 발주
            </h2>
            <p className="text-sm text-white/90 mt-1">
              현재 재고가 예약 수량보다 부족한 품목입니다
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alert Banner */}
        <div className="px-6 py-4 bg-[#FFF4F4] border-b border-[#D7DEE6]">
          <div className="flex items-start gap-3">
            <TrendingDown className="w-5 h-5 text-[#B94A48] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-[#B94A48] font-bold mb-1">
                총 {stockShortageItems.length}개 품목의 재고가 부족합니다
              </p>
              <p className="text-sm text-[#5B6773]">
                현재 재고보다 예약된 수량이 많아 즉시 발주가 필요한 품목들입니다. 
                안전재고 수준까지 보충하는 것을 권장합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="px-6 py-4 border-b border-[#D7DEE6] bg-[#F4F7FA]">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5B6773]" />
              <input
                type="text"
                placeholder="품목명, 품목코드, 공급사로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border-2 border-[#D7DEE6] rounded-lg focus:outline-none focus:border-[#5B8DB8] text-[#18212B]"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={selectAllShortage}
                className="px-4 py-2.5 bg-white border-2 border-[#5B8DB8] text-[#5B8DB8] rounded-lg hover:bg-[#5B8DB8] hover:text-white transition-all font-bold text-sm"
              >
                전체 선택
              </button>
              <button
                onClick={deselectAll}
                className="px-4 py-2.5 bg-white border-2 border-[#D7DEE6] text-[#5B6773] rounded-lg hover:bg-[#F4F7FA] transition-all font-bold text-sm"
              >
                선택 해제
              </button>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 360px)' }}>
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const shortage = getShortageQuantity(item);
              const recommended = getRecommendedQuantity(item);
              const isSelected = selectedItems.has(item.productId);
              const orderQty = orderQuantities[item.productId] || recommended;

              return (
                <div
                  key={item.productId}
                  className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#5B8DB8] bg-[#EEF5FB] shadow-md'
                      : 'border-[#D7DEE6] bg-white hover:border-[#5B8DB8]'
                  }`}
                  onClick={() => toggleItemSelection(item.productId)}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <div className="flex items-center pt-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-5 h-5 rounded border-2 border-[#5B8DB8] text-[#163A5F] focus:ring-2 focus:ring-[#5B8DB8] cursor-pointer"
                      />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Package className="w-5 h-5 text-[#163A5F]" />
                            <h3 className="text-lg font-bold text-[#18212B]">{item.productName}</h3>
                            <span className="px-2 py-0.5 bg-[#5B8DB8] text-white text-xs rounded-full font-bold">
                              {item.category}
                            </span>
                            <span className="px-2 py-0.5 bg-[#B94A48] text-white text-xs rounded-full font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              부족 {shortage}개
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-[#5B6773]">
                            <span>품목코드: {item.productId}</span>
                            <span>•</span>
                            <span>공급사: {item.supplier}</span>
                            <span>•</span>
                            <span>최근 발주: {item.lastOrderDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stock Info Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
                        <div className="bg-white border border-[#D7DEE6] rounded-lg p-3">
                          <p className="text-xs text-[#5B6773] mb-1">현재 재고</p>
                          <p className="text-lg font-bold text-[#18212B]">{item.currentStock}개</p>
                        </div>
                        <div className="bg-white border-2 border-[#C58A2B] rounded-lg p-3">
                          <p className="text-xs text-[#C58A2B] mb-1 font-bold">예약 수량</p>
                          <p className="text-lg font-bold text-[#C58A2B]">{item.reservedStock}개</p>
                        </div>
                        <div className="bg-white border-2 border-[#B94A48] rounded-lg p-3">
                          <p className="text-xs text-white bg-[#B94A48] px-2 py-0.5 rounded mb-1 inline-block font-bold">
                            부족 수량
                          </p>
                          <p className="text-lg font-bold text-[#B94A48]">{shortage}개</p>
                        </div>
                        <div className="bg-white border border-[#D7DEE6] rounded-lg p-3">
                          <p className="text-xs text-[#5B6773] mb-1">안전 재고</p>
                          <p className="text-lg font-bold text-[#5B6773]">{item.safetyStock}개</p>
                        </div>
                        <div className="bg-white border border-[#D7DEE6] rounded-lg p-3">
                          <p className="text-xs text-[#5B6773] mb-1">단가</p>
                          <p className="text-sm font-bold text-[#18212B]">{formatCurrency(item.unitPrice)}원</p>
                        </div>
                      </div>

                      {/* Order Quantity Input */}
                      {isSelected && (
                        <div className="bg-gradient-to-r from-[#163A5F] to-[#0F2942] rounded-lg p-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                            <div className="flex-1">
                              <label className="block text-sm font-bold text-white mb-2">
                                발주 수량 설정
                              </label>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateQuantity(item.productId, orderQty - 1);
                                  }}
                                  className="w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold text-lg transition-colors"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  value={orderQty}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    updateQuantity(item.productId, parseInt(e.target.value) || 1);
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-24 px-4 py-2 text-center text-lg font-bold border-2 border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-white/50"
                                  min="1"
                                />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateQuantity(item.productId, orderQty + 1);
                                  }}
                                  className="w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold text-lg transition-colors"
                                >
                                  +
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateQuantity(item.productId, recommended);
                                  }}
                                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                  권장수량 ({recommended}개)
                                </button>
                              </div>
                            </div>
                            <div className="lg:text-right">
                              <p className="text-sm text-white/80 mb-1">발주 금액</p>
                              <p className="text-2xl font-bold text-white">
                                {formatCurrency(item.unitPrice * orderQty)}원
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t-2 border-[#D7DEE6] bg-[#F4F7FA]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-lg px-4 py-3 border-2 border-[#163A5F]">
                <p className="text-sm text-[#5B6773] mb-1">선택된 품목</p>
                <p className="text-2xl font-bold text-[#163A5F]">{selectedItems.size}개</p>
              </div>
              <div className="bg-gradient-to-r from-[#163A5F] to-[#0F2942] rounded-lg px-4 py-3">
                <p className="text-sm text-white/80 mb-1">총 발주 금액</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(getTotalAmount())}원</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 lg:flex-none px-6 py-3 border-2 border-[#D7DEE6] text-[#5B6773] rounded-lg hover:bg-white font-bold transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleCreateOrder}
                disabled={selectedItems.size === 0}
                className="flex-1 lg:flex-none px-6 py-3 bg-gradient-to-r from-[#163A5F] to-[#0F2942] text-white rounded-lg hover:shadow-lg font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                발주서 생성 ({selectedItems.size}개 품목)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
