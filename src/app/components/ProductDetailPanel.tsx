import { X, Package, Hash, Building2, FileText, Calendar, CheckCircle, XCircle, Layers } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface Product {
  code: string;
  name: string;
  modelName: string;
  category: string;
  manufacturer: string;
  approvalNumber: string;
  lotManagement: boolean;
  serialManagement: boolean;
  expiryManagement: boolean;
  stockQuantity: number;
  status: string;
  registrationDate: string;
}

interface ProductDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[] | null;
  title: string;
}

export function ProductDetailPanel({ isOpen, onClose, products, title }: ProductDetailPanelProps) {
  if (!isOpen || !products) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F]">
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="text-sm text-[#5B8DB8] mt-1">총 {products.length}개</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {products.map((product) => (
              <div 
                key={product.code}
                className="border border-[#D7DEE6] rounded-lg p-5 hover:bg-[#F4F7FA] transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-[#163A5F]" />
                      <h3 className="text-lg font-bold text-[#18212B]">{product.name}</h3>
                    </div>
                    <p className="text-sm text-[#5B6773] font-mono">{product.code}</p>
                  </div>
                  <StatusBadge status={product.status} />
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-[#D7DEE6]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Hash className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">모델명</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{product.modelName}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Layers className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">카테고리</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{product.category}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">제조사</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{product.manufacturer}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">허가번호</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{product.approvalNumber}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">등록일</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{product.registrationDate}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">재고수량</p>
                    </div>
                    <p className={`text-sm font-bold ml-6 ${product.stockQuantity < 10 ? 'text-[#B94A48]' : 'text-[#2E7D5B]'}`}>
                      {product.stockQuantity}개
                    </p>
                  </div>
                </div>

                {/* Management Flags */}
                <div className="bg-[#F4F7FA] rounded-lg p-4 border border-[#D7DEE6]">
                  <p className="text-xs text-[#5B6773] mb-3 font-semibold">관리 항목</p>
                  <div className="flex flex-wrap gap-2">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border ${product.lotManagement ? 'bg-[#E8F4F8] border-[#5B8DB8] text-[#163A5F]' : 'bg-white border-[#D7DEE6] text-[#5B6773]'}`}>
                      {product.lotManagement ? (
                        <CheckCircle className="w-3.5 h-3.5 text-[#2E7D5B]" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-[#B94A48]" />
                      )}
                      <span className="text-xs font-semibold">로트관리</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border ${product.serialManagement ? 'bg-[#E8F4F8] border-[#5B8DB8] text-[#163A5F]' : 'bg-white border-[#D7DEE6] text-[#5B6773]'}`}>
                      {product.serialManagement ? (
                        <CheckCircle className="w-3.5 h-3.5 text-[#2E7D5B]" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-[#B94A48]" />
                      )}
                      <span className="text-xs font-semibold">시리얼관리</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border ${product.expiryManagement ? 'bg-[#E8F4F8] border-[#5B8DB8] text-[#163A5F]' : 'bg-white border-[#D7DEE6] text-[#5B6773]'}`}>
                      {product.expiryManagement ? (
                        <CheckCircle className="w-3.5 h-3.5 text-[#2E7D5B]" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-[#B94A48]" />
                      )}
                      <span className="text-xs font-semibold">유효기한관리</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Summary */}
        <div className="px-6 py-4 border-t border-[#D7DEE6] bg-[#F4F7FA]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#18212B]">
              총 재고수량
            </p>
            <p className="text-xl font-bold text-[#163A5F]">
              {products.reduce((sum, product) => sum + product.stockQuantity, 0).toLocaleString('ko-KR')}개
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
