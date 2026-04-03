import { useState, useEffect } from "react";
import { useShipping, useCreateShipment, useUpdateShipmentStatus } from "../../hooks/use-shipping";
import { useProducts } from "../../hooks/use-products";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { StatusBadge } from "../components/StatusBadge";
import { InspectorPanel } from "../components/InspectorPanel";
import {
  Search,
  Package,
  Building2,
  ShoppingCart,
  AlertCircle,
  CheckCircle2,
  FileText,
  Save,
  Send,
  X
} from "lucide-react";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  type: 'equipment' | 'consumable';
  lotEnabled: boolean;
  serialEnabled: boolean;
  availableQty: number;
  status: string;
}

interface Client {
  id: string;
  name: string;
  code: string;
  contactName: string;
  phone: string;
  defaultPrice: number;
  recentTrade: boolean;
  unpaidAmount: number;
  status: '정상' | '주의' | '중지';
}

interface LotInfo {
  lotNumber: string;
  expiryDate: string;
  available: number;
  warehouse: string;
}

interface SerialInfo {
  serialNumber: string;
  warehouse: string;
  installDate?: string;
  status: '출고가능' | '설치중' | '점검중';
}

interface ShipmentItem {
  product: Product;
  client: Client;
  lot?: string;
  serial?: string;
  quantity: number;
  unitPrice: number;
  supplyAmount: number;
  taxAmount: number;
  totalAmount: number;
}

export function ShippingManagement() {
  const [activeMenu, setActiveMenu] = useState('shipping');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Inspector Panel state
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [inspectorType, setInspectorType] = useState<string | null>(null);
  
  // View Mode: 'create' or 'list'
  const [viewMode, setViewMode] = useState<'create' | 'list'>('list');
  
  // Selection states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [shipmentItems, setShipmentItems] = useState<ShipmentItem[]>([]);
  
  // Form states
  const [quantity, setQuantity] = useState(1);
  const [selectedLot, setSelectedLot] = useState('');
  const [selectedSerial, setSelectedSerial] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchProductTerm, setSearchProductTerm] = useState('');
  const [searchClientTerm, setSearchClientTerm] = useState('');

  const debouncedSearchProductTerm = useDebounce(searchProductTerm, 300);

  const { data: shipments = [], isLoading, error } = useShipping({ search: searchTerm });
  const createShipment = useCreateShipment();
  const updateShipmentStatus = useUpdateShipmentStatus();

  const { data: rawProducts = [] } = useProducts({ search: debouncedSearchProductTerm });
  const products: Product[] = rawProducts.map((p) => ({
    id: p.id ?? '',
    name: p.name,
    code: p.code,
    category: p.category,
    type: p.serialManagement ? 'equipment' : 'consumable',
    lotEnabled: p.lotManagement,
    serialEnabled: p.serialManagement,
    availableQty: p.stockQuantity,
    status: p.status,
  }));
  const productClientMapping: Record<string, Client[]> = {};
  const lotData: Record<string, LotInfo[]> = {};
  const serialData: Record<string, SerialInfo[]> = {};

  // Mobile step state
  const [mobileStep, setMobileStep] = useState<1 | 2 | 3>(1);


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSelectedClient(null);
    setQuantity(1);
    setSelectedLot('');
    setSelectedSerial('');
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
  };

  const handleAddToCart = () => {
    if (!selectedProduct || !selectedClient) return;
    
    if (selectedProduct.lotEnabled && !selectedLot) {
      alert('LOT 번호를 선택해주세요.');
      return;
    }
    
    if (selectedProduct.serialEnabled && !selectedSerial) {
      alert('시리얼 번호를 선택해주세요.');
      return;
    }

    // 장비 품목은 시리얼 선택 방식이므로 수량은 항상 1
    const finalQuantity = selectedProduct.serialEnabled ? 1 : quantity;
    
    const supplyAmount = selectedClient.defaultPrice * finalQuantity;
    const taxAmount = Math.round(supplyAmount * 0.1);
    const totalAmount = supplyAmount + taxAmount;

    const newItem: ShipmentItem = {
      product: selectedProduct,
      client: selectedClient,
      lot: selectedLot || undefined,
      serial: selectedSerial || undefined,
      quantity: finalQuantity,
      unitPrice: selectedClient.defaultPrice,
      supplyAmount,
      taxAmount,
      totalAmount
    };

    setShipmentItems([...shipmentItems, newItem]);
    
    // Reset
    setSelectedProduct(null);
    setSelectedClient(null);
    setQuantity(1);
    setSelectedLot('');
    setSelectedSerial('');
  };

  const handleRemoveItem = (index: number) => {
    setShipmentItems(shipmentItems.filter((_, i) => i !== index));
  };

  const handleSaveDraft = () => {
    alert('임시저장되었습니다.');
  };

  const handleConfirm = () => {
    if (shipmentItems.length === 0) {
      alert('출고할 품목을 추가해주세요.');
      return;
    }
    
    alert(
      '출고가 확정되었습니다.\n\n' +
      '✓ 재고가 차감됩니다.\n' +
      '✓ 세금계산서가 "발행대기" 상태로 자동 생성됩니다.\n' +
      '✓ 정산 화면에 연결됩니다.'
    );
    
    // Reset
    setShipmentItems([]);
  };

  const getTotalAmounts = () => {
    const supplyAmount = shipmentItems.reduce((sum, item) => sum + item.supplyAmount, 0);
    const taxAmount = shipmentItems.reduce((sum, item) => sum + item.taxAmount, 0);
    const totalAmount = shipmentItems.reduce((sum, item) => sum + item.totalAmount, 0);
    return { supplyAmount, taxAmount, totalAmount };
  };

  const connectedClients = selectedProduct 
    ? (productClientMapping[selectedProduct.id] || []).filter(client =>
        client.name.toLowerCase().includes(searchClientTerm.toLowerCase())
      )
    : [];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchProductTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchProductTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F7FA]">
      <Sidebar 
        activeMenu={activeMenu} 
        onMenuClick={setActiveMenu}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="lg:ml-64 pt-16">
        {/* Page Title */}
        <div className="bg-white border-b border-[#D7DEE6] px-4 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-[#18212B] mb-2">출고/판매 관리</h1>
          <p className="text-[#5B6773]">품목 기준(Product-first) 출고 등록</p>
        </div>

        {/* 3-Panel Layout - Desktop Only */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 p-8 h-[calc(100vh-200px)]">
          {/* Left Panel - Product Selection */}
          <div className="col-span-3 bg-white rounded-lg border border-[#D7DEE6] shadow-sm flex flex-col">
            <div className="px-4 py-3 border-b border-[#D7DEE6] bg-[#163A5F]">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5" />
                품목 선택
              </h2>
            </div>
            
            {/* Product Search */}
            <div className="p-4 border-b border-[#D7DEE6]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6773]" />
                <input
                  type="text"
                  placeholder="품목명, 코드 검색..."
                  value={searchProductTerm}
                  onChange={(e) => setSearchProductTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-[#D7DEE6] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                />
              </div>
            </div>

            {/* Product List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedProduct?.id === product.id
                      ? 'border-[#163A5F] bg-[#E8EEF3]'
                      : 'border-[#D7DEE6] hover:border-[#5B8DB8] hover:bg-[#F4F7FA]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#18212B] mb-0.5">{product.name}</p>
                      <p className="text-xs text-[#5B6773]">{product.code}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#D7DEE6]">
                    <div className="flex items-center gap-1">
                      {product.lotEnabled && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-[#FFF4E5] text-[#C58A2B] rounded font-bold">LOT</span>
                      )}
                      {product.serialEnabled && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-[#E6F4EA] text-[#2E7D5B] rounded font-bold">S/N</span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-[#163A5F]">{formatCurrency(product.availableQty)}개</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Center Panel - Connected Clients */}
          <div className="col-span-4 bg-white rounded-lg border border-[#D7DEE6] shadow-sm flex flex-col">
            <div className="px-4 py-3 border-b border-[#D7DEE6] bg-[#163A5F]">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                연결 거래처
              </h2>
            </div>

            {selectedProduct ? (
              <>
                {/* Selected Product Info */}
                <div className="p-4 border-b border-[#D7DEE6] bg-[#E8EEF3]">
                  <p className="text-xs text-[#5B6773] mb-1">선택된 품목</p>
                  <p className="text-sm font-bold text-[#163A5F]">{selectedProduct.name}</p>
                  <p className="text-xs text-[#5B6773] mt-0.5">{selectedProduct.code} · 가용재고 {formatCurrency(selectedProduct.availableQty)}개</p>
                </div>

                {/* Client Search */}
                <div className="p-4 border-b border-[#D7DEE6]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6773]" />
                    <input
                      type="text"
                      placeholder="거래처명 검색..."
                      value={searchClientTerm}
                      onChange={(e) => setSearchClientTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-[#D7DEE6] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    />
                  </div>
                </div>

                {/* Client List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {connectedClients.length > 0 ? (
                    connectedClients.map((client) => (
                      <button
                        key={client.id}
                        onClick={() => handleClientSelect(client)}
                        disabled={client.status === '중지'}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          client.status === '중지'
                            ? 'border-[#D7DEE6] bg-gray-50 opacity-50 cursor-not-allowed'
                            : selectedClient?.id === client.id
                            ? 'border-[#163A5F] bg-[#E8EEF3]'
                            : 'border-[#D7DEE6] hover:border-[#5B8DB8] hover:bg-[#F4F7FA]'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-bold text-[#18212B]">{client.name}</p>
                              {client.recentTrade && (
                                <span className="text-[9px] px-1.5 py-0.5 bg-[#E6F4EA] text-[#2E7D5B] rounded font-bold">최근거래</span>
                              )}
                            </div>
                            <p className="text-xs text-[#5B6773]">{client.contactName} · {client.phone}</p>
                          </div>
                          <StatusBadge status={client.status} />
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-[#D7DEE6]">
                          <p className="text-xs text-[#5B6773]">기본단가</p>
                          <p className="text-sm font-bold text-[#163A5F]">₩{formatCurrency(client.defaultPrice)}</p>
                        </div>
                        
                        {client.unpaidAmount > 0 && (
                          <div className="mt-2 p-2 bg-[#FFF4E5] rounded border border-[#C58A2B]">
                            <div className="flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-[#C58A2B]" />
                              <p className="text-[10px] font-bold text-[#C58A2B]">
                                미수금 ₩{formatCurrency(client.unpaidAmount)}
                              </p>
                            </div>
                          </div>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Building2 className="w-12 h-12 text-[#D7DEE6] mx-auto mb-3" />
                      <p className="text-sm text-[#5B6773]">연결된 거래처가 없습니다</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Package className="w-16 h-16 text-[#D7DEE6] mx-auto mb-4" />
                  <p className="text-sm font-bold text-[#5B6773]">품목을 먼저 선택해주세요</p>
                  <p className="text-xs text-[#5B6773] mt-1">연결된 거래처가 표시됩니다</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Shipment Input */}
          <div className="col-span-5 bg-white rounded-lg border border-[#D7DEE6] shadow-sm flex flex-col">
            <div className="px-4 py-3 border-b border-[#D7DEE6] bg-[#163A5F]">
              <h2 className="font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                출고 입력
              </h2>
            </div>

            {selectedProduct && selectedClient ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Selected Info */}
                <div className="p-4 bg-[#E8EEF3] rounded-lg">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-[#5B6773] mb-1">품목</p>
                      <p className="text-sm font-bold text-[#163A5F]">{selectedProduct.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#5B6773] mb-1">거래처</p>
                      <p className="text-sm font-bold text-[#163A5F]">{selectedClient.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#5B6773] mb-1">기본단가</p>
                      <p className="text-sm font-bold text-[#18212B]">₩{formatCurrency(selectedClient.defaultPrice)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#5B6773] mb-1">가용재고</p>
                      <p className="text-sm font-bold text-[#2E7D5B]">{formatCurrency(selectedProduct.availableQty)}개</p>
                    </div>
                  </div>
                </div>

                {/* LOT Selection */}
                {selectedProduct.lotEnabled && (
                  <div>
                    <label className="block text-sm font-bold text-[#18212B] mb-2">
                      LOT 번호 <span className="text-[#B94A48]">*</span>
                    </label>
                    <select
                      value={selectedLot}
                      onChange={(e) => setSelectedLot(e.target.value)}
                      className="w-full px-3 py-2 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    >
                      <option value="">LOT 선택</option>
                      {lotData[selectedProduct.id]?.map((lot) => (
                        <option key={lot.lotNumber} value={lot.lotNumber}>
                          {lot.lotNumber} (만료: {lot.expiryDate}, 가용: {formatCurrency(lot.available)}개)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Serial Selection - Equipment only */}
                {selectedProduct.serialEnabled && (
                  <div>
                    <label className="block text-sm font-bold text-[#18212B] mb-2">
                      시리얼 번호 <span className="text-[#B94A48]">*</span>
                    </label>
                    <p className="text-xs text-[#5B6773] mb-2">
                      장비 추적 및 A/S 이력 관리를 위해 시리얼 번호를 선택해주세요
                    </p>
                    <select
                      value={selectedSerial}
                      onChange={(e) => setSelectedSerial(e.target.value)}
                      className="w-full px-3 py-2 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    >
                      <option value="">시리얼 번호 선택</option>
                      {serialData[selectedProduct.id]?.filter(s => s.status === '출고가능').map((serial) => (
                        <option key={serial.serialNumber} value={serial.serialNumber}>
                          {serial.serialNumber} ({serial.warehouse})
                        </option>
                      ))}
                    </select>
                    {selectedSerial && (
                      <div className="mt-2 p-3 bg-[#E6F4EA] rounded-lg border border-[#2E7D5B]">
                        <p className="text-xs font-bold text-[#2E7D5B]">
                          선택된 시리얼: {selectedSerial}
                        </p>
                        <p className="text-[10px] text-[#5B6773] mt-1">
                          이 장비는 설치 후 A/S 이력 및 보증 관리에 활용됩니다
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Quantity - Consumable only */}
                {selectedProduct.lotEnabled && !selectedProduct.serialEnabled && (
                  <div>
                    <label className="block text-sm font-bold text-[#18212B] mb-2">
                      수량 <span className="text-[#B94A48]">*</span>
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      min="1"
                      max={selectedProduct.availableQty}
                      className="w-full px-3 py-2 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    />
                  </div>
                )}

                {/* Amount Preview */}
                <div className="p-4 bg-[#F4F7FA] rounded-lg border border-[#D7DEE6]">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#5B6773]">공급가액</p>
                      <p className="text-sm font-bold text-[#18212B]">
                        ₩{formatCurrency(selectedClient.defaultPrice * quantity)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#5B6773]">부가세 (10%)</p>
                      <p className="text-sm font-bold text-[#18212B]">
                        ₩{formatCurrency(Math.round(selectedClient.defaultPrice * quantity * 0.1))}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#D7DEE6]">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-[#18212B]">합계</p>
                        <p className="text-lg font-bold text-[#163A5F]">
                          ₩{formatCurrency(selectedClient.defaultPrice * quantity + Math.round(selectedClient.defaultPrice * quantity * 0.1))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 bg-[#163A5F] text-white rounded-lg hover:bg-[#0F2942] transition-colors font-bold flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  출고 리스트에 추가
                </button>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <ShoppingCart className="w-16 h-16 text-[#D7DEE6] mx-auto mb-4" />
                  <p className="text-sm font-bold text-[#5B6773]">품목과 거래처를 선택해주세요</p>
                  <p className="text-xs text-[#5B6773] mt-1">출고 정보를 입력할 수 있습니다</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Shipment Cart - Bottom Section */}
        {shipmentItems.length > 0 && (
          <div className="hidden lg:block px-8 pb-8">
            <div className="bg-white rounded-lg border border-[#D7DEE6] shadow-sm">
              <div className="px-6 py-4 border-b border-[#D7DEE6] bg-[#F4F7FA]">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#18212B] flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    출고 리스트 ({shipmentItems.length})
                  </h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSaveDraft}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-[#5B6773] text-[#5B6773] rounded-lg hover:bg-[#5B6773] hover:text-white transition-colors font-bold"
                    >
                      <Save className="w-4 h-4" />
                      임시저장
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="flex items-center gap-2 px-6 py-2 bg-[#163A5F] text-white rounded-lg hover:bg-[#0F2942] transition-colors font-bold"
                    >
                      <Send className="w-4 h-4" />
                      출고 확정
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3 mb-6">
                  {shipmentItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-[#F4F7FA] rounded-lg border border-[#D7DEE6]">
                      <div className="flex-1 grid grid-cols-6 gap-4">
                        <div>
                          <p className="text-xs text-[#5B6773] mb-1">품목</p>
                          <p className="text-sm font-bold text-[#18212B]">{item.product.name}</p>
                          <p className="text-xs text-[#5B6773]">{item.product.code}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#5B6773] mb-1">거래처</p>
                          <p className="text-sm font-bold text-[#18212B]">{item.client.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#5B6773] mb-1">LOT/시리얼</p>
                          <p className="text-sm font-bold text-[#18212B]">{item.lot || item.serial || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#5B6773] mb-1">수량</p>
                          <p className="text-sm font-bold text-[#18212B]">{formatCurrency(item.quantity)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#5B6773] mb-1">단가</p>
                          <p className="text-sm font-bold text-[#18212B]">₩{formatCurrency(item.unitPrice)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#5B6773] mb-1">합계</p>
                          <p className="text-sm font-bold text-[#163A5F]">₩{formatCurrency(item.totalAmount)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="ml-4 p-2 hover:bg-[#FCEBE9] rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-[#B94A48]" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Total Summary */}
                <div className="bg-[#E8EEF3] rounded-lg p-6 border-2 border-[#163A5F]">
                  {(() => {
                    const totals = getTotalAmounts();
                    return (
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <p className="text-sm text-[#5B6773] mb-1">총 공급가액</p>
                          <p className="text-2xl font-bold text-[#18212B]">₩{formatCurrency(totals.supplyAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#5B6773] mb-1">총 부가세</p>
                          <p className="text-2xl font-bold text-[#18212B]">₩{formatCurrency(totals.taxAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#5B6773] mb-1">총 합계</p>
                          <p className="text-3xl font-bold text-[#163A5F]">₩{formatCurrency(totals.totalAmount)}</p>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="mt-6 p-4 bg-[#E6F4EA] rounded-lg border border-[#2E7D5B]">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#2E7D5B] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-[#2E7D5B] mb-2">출고 확정 시 자동 처리</p>
                        <ul className="space-y-1 text-xs text-[#18212B]">
                          <li>• 재고가 즉시 차감됩니다</li>
                          <li>• 세금계산서가 "발행대기" 상태로 자동 생성됩니다</li>
                          <li>• 정산 화면에 연결됩니다</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile View - Coming Soon */}
        <div className="lg:hidden p-4">
          <div className="bg-white rounded-lg border border-[#D7DEE6] p-8 text-center">
            <Package className="w-16 h-16 text-[#D7DEE6] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#18212B] mb-2">모바일 버전 준비중</h3>
            <p className="text-sm text-[#5B6773]">
              출고 관리는 현재 데스크탑 환경에 최적화되어 있습니다.<br />
              PC에서 이용해주세요.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}