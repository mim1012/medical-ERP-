import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { ProductForm } from "../components/ProductForm";
import { ProductDetailPanel } from "../components/ProductDetailPanel";
import { StatusBadge } from "../components/StatusBadge";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Package,
  Layers,
  Hash,
  AlertTriangle
} from "lucide-react";

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

export function ProductManagement() {
  const [activeMenu, setActiveMenu] = useState('products');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('전체');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [detailPanelProducts, setDetailPanelProducts] = useState<Product[] | null>(null);
  const [detailPanelTitle, setDetailPanelTitle] = useState('');

  // Mock data
  const products: Product[] = [
    {
      code: 'PRD-2024-001',
      name: '초음파 프로브 A3',
      modelName: 'USP-A300',
      category: '영상진단기기',
      manufacturer: '삼성메디슨',
      approvalNumber: '제허16-123호',
      lotManagement: true,
      serialManagement: true,
      expiryManagement: false,
      stockQuantity: 15,
      status: '정상',
      registrationDate: '2024-01-15'
    },
    {
      code: 'PRD-2024-002',
      name: 'MRI 조영제 10ml',
      modelName: 'MRC-10',
      category: '시약',
      manufacturer: '바이엘코리아',
      approvalNumber: '제허18-456호',
      lotManagement: true,
      serialManagement: false,
      expiryManagement: true,
      stockQuantity: 240,
      status: '정상',
      registrationDate: '2024-02-20'
    },
    {
      code: 'PRD-2024-003',
      name: '수술용 가위 세트',
      modelName: 'SS-PRO',
      category: '수술기구',
      manufacturer: '메디칼툴즈',
      approvalNumber: '제허19-789호',
      lotManagement: false,
      serialManagement: true,
      expiryManagement: false,
      stockQuantity: 8,
      status: '재고부족',
      registrationDate: '2024-03-10'
    },
    {
      code: 'PRD-2024-004',
      name: '혈압계 BP-200',
      modelName: 'BP-200',
      category: '검사장비',
      manufacturer: '오므론헬스케어',
      approvalNumber: '제허17-321호',
      lotManagement: false,
      serialManagement: true,
      expiryManagement: false,
      stockQuantity: 32,
      status: '정상',
      registrationDate: '2024-04-05'
    },
    {
      code: 'PRD-2024-005',
      name: '심전도기 ECG-500',
      modelName: 'ECG-500',
      category: '검사장비',
      manufacturer: '필립스',
      approvalNumber: '제허20-654호',
      lotManagement: false,
      serialManagement: true,
      expiryManagement: false,
      stockQuantity: 5,
      status: '정상',
      registrationDate: '2024-05-25'
    },
    {
      code: 'PRD-2024-006',
      name: 'CT 조영제 50ml',
      modelName: 'CTC-50',
      category: '시약',
      manufacturer: 'GE헬스케어',
      approvalNumber: '제허18-987호',
      lotManagement: true,
      serialManagement: false,
      expiryManagement: true,
      stockQuantity: 180,
      status: '정상',
      registrationDate: '2024-06-18'
    },
    {
      code: 'PRD-2024-007',
      name: '일회용 주사기 5ml',
      modelName: 'SYR-5',
      category: '소모품',
      manufacturer: '태웅메디칼',
      approvalNumber: '제허15-111호',
      lotManagement: true,
      serialManagement: false,
      expiryManagement: true,
      stockQuantity: 5000,
      status: '정상',
      registrationDate: '2024-07-12'
    },
    {
      code: 'PRD-2024-008',
      name: '의료용 레이저',
      modelName: 'ML-X1',
      category: '치료기기',
      manufacturer: '루트로닉',
      approvalNumber: '제허21-555호',
      lotManagement: false,
      serialManagement: true,
      expiryManagement: false,
      stockQuantity: 2,
      status: '단종예정',
      registrationDate: '2024-08-03'
    },
    {
      code: 'PRD-2024-009',
      name: '수술용 메스',
      modelName: 'SC-15',
      category: '수술기구',
      manufacturer: '아이즈메디칼',
      approvalNumber: '제허16-444호',
      lotManagement: false,
      serialManagement: false,
      expiryManagement: false,
      stockQuantity: 0,
      status: '품절',
      registrationDate: '2024-09-21'
    },
    {
      code: 'PRD-2024-010',
      name: '인공관절 무릎',
      modelName: 'KJ-PRO',
      category: '치료기기',
      manufacturer: '스트라이커',
      approvalNumber: '제허19-222호',
      lotManagement: true,
      serialManagement: true,
      expiryManagement: false,
      stockQuantity: 12,
      status: '정상',
      registrationDate: '2024-10-07'
    },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === '전체' || product.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleFormSubmit = (data: any) => {
    console.log('Form submitted:', data);
    setIsFormOpen(false);
    setSelectedProduct(null);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

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
        <div className="p-4 lg:p-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#18212B] mb-2">품목 관리</h1>
            <p className="text-[#5B6773]">의료기기 및 소모품 마스터 관리</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
            <div 
              onClick={() => {
                setDetailPanelProducts(products);
                setDetailPanelTitle('전체 품목 목록');
              }}
              className="bg-white rounded-lg border border-[#D7DEE6] p-3 shadow-sm cursor-pointer hover:border-[#5B8DB8] hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Package className="w-3.5 h-3.5 text-[#18212B] flex-shrink-0" />
                <p className="text-[10px] font-bold text-[#5B6773] uppercase tracking-wide truncate">전체 품목</p>
              </div>
              <p className="text-xl font-bold text-[#18212B] leading-none mb-1">{products.length}</p>
              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#E6F4EA] text-[#2E7D5B]">
                활성 {products.filter(p => p.status === '정상').length}개
              </span>
            </div>
            <div 
              onClick={() => {
                const lotProducts = products.filter(p => p.lotManagement);
                setDetailPanelProducts(lotProducts);
                setDetailPanelTitle('로트 관리 품목');
              }}
              className="bg-white rounded-lg border border-[#D7DEE6] p-3 shadow-sm cursor-pointer hover:border-[#5B8DB8] hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Layers className="w-3.5 h-3.5 text-[#5B8DB8] flex-shrink-0" />
                <p className="text-[10px] font-bold text-[#5B6773] uppercase tracking-wide truncate">로트 관리</p>
              </div>
              <p className="text-xl font-bold text-[#5B8DB8] leading-none mb-1">{products.filter(p => p.lotManagement).length}</p>
              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#E8EEF3] text-[#5B8DB8]">
                {Math.round(products.filter(p => p.lotManagement).length / products.length * 100)}%
              </span>
            </div>
            <div 
              onClick={() => {
                const serialProducts = products.filter(p => p.serialManagement);
                setDetailPanelProducts(serialProducts);
                setDetailPanelTitle('시리얼 관리 품목');
              }}
              className="bg-white rounded-lg border border-[#D7DEE6] p-3 shadow-sm cursor-pointer hover:border-[#5B8DB8] hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Hash className="w-3.5 h-3.5 text-[#35556E] flex-shrink-0" />
                <p className="text-[10px] font-bold text-[#5B6773] uppercase tracking-wide truncate">시리얼 관리</p>
              </div>
              <p className="text-xl font-bold text-[#35556E] leading-none mb-1">{products.filter(p => p.serialManagement).length}</p>
              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#E8EEF3] text-[#35556E]">
                {Math.round(products.filter(p => p.serialManagement).length / products.length * 100)}%
              </span>
            </div>
            <div 
              onClick={() => {
                const lowStockProducts = products.filter(p => p.status === '재고부족' || p.status === '품절');
                setDetailPanelProducts(lowStockProducts);
                setDetailPanelTitle('재고 부족/품절 품목');
              }}
              className="bg-white rounded-lg border border-[#D7DEE6] p-3 shadow-sm cursor-pointer hover:border-[#C58A2B] hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-[#C58A2B] flex-shrink-0" />
                <p className="text-[10px] font-bold text-[#5B6773] uppercase tracking-wide truncate">재고 부족</p>
              </div>
              <p className="text-xl font-bold text-[#C58A2B] leading-none mb-1">{products.filter(p => p.status === '재고부족' || p.status === '품절').length}</p>
              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FCEBE9] text-[#B94A48]">
                품절 {products.filter(p => p.status === '품절').length}개
              </span>
            </div>
            <div 
              onClick={() => {
                const discontinuedProducts = products.filter(p => p.status === '단종예정');
                setDetailPanelProducts(discontinuedProducts);
                setDetailPanelTitle('단종 예정 품목');
              }}
              className="bg-white rounded-lg border border-[#D7DEE6] p-3 shadow-sm cursor-pointer hover:border-[#B94A48] hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <XCircle className="w-3.5 h-3.5 text-[#B94A48] flex-shrink-0" />
                <p className="text-[10px] font-bold text-[#5B6773] uppercase tracking-wide truncate">단종 예정</p>
              </div>
              <p className="text-xl font-bold text-[#B94A48] leading-none mb-1">{products.filter(p => p.status === '단종예정').length}</p>
              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FCEBE9] text-[#B94A48]">
                조치 필요
              </span>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg border border-[#D7DEE6] shadow-sm">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-[#D7DEE6]">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 lg:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5B6773]" />
                    <input
                      type="text"
                      placeholder="품목명, 코드, 모델명, 제조사 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-[#5B6773]" />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-4 py-2.5 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    >
                      <option value="전체">전체</option>
                      <option value="영상진단기기">영상진단기기</option>
                      <option value="검사장비">검사장비</option>
                      <option value="수술기구">수술기구</option>
                      <option value="치료기기">치료기기</option>
                      <option value="소모품">소모품</option>
                      <option value="시약">시약</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-[#D7DEE6] rounded-md text-[#5B6773] hover:bg-[#F4F7FA] transition-colors text-sm font-semibold">
                    <Upload className="w-4 h-4" />
                    가져오기
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-[#D7DEE6] rounded-md text-[#5B6773] hover:bg-[#F4F7FA] transition-colors text-sm font-semibold">
                    <Download className="w-4 h-4" />
                    내보내기
                  </button>
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors text-sm font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    신규 등록
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#D7DEE6] bg-[#F4F7FA]">
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#18212B] min-w-[100px]">등록일</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#18212B] min-w-[200px]">품목명</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#18212B] min-w-[120px]">모델명</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#18212B] min-w-[120px]">분류</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#18212B] min-w-[130px]">제조사</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#18212B] min-w-[120px]">허가번호</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#18212B] min-w-[90px]">로트관리</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#18212B] min-w-[100px]">시리얼관리</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#18212B] min-w-[120px]">유효기간관리</th>
                    <th className="text-right py-4 px-4 text-sm font-semibold text-[#18212B] min-w-[100px]">재고수량</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#18212B] min-w-[100px]">상태</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#18212B] min-w-[80px]">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.code} className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors">
                      <td className="py-4 px-4 text-sm text-center text-[#5B6773]">{product.registrationDate}</td>
                      <td className="py-4 px-4 text-sm font-semibold text-[#18212B]">{product.name}</td>
                      <td className="py-4 px-4 text-sm text-[#5B6773]">{product.modelName}</td>
                      <td className="py-4 px-4 text-sm text-[#5B6773]">{product.category}</td>
                      <td className="py-4 px-4 text-sm text-[#18212B]">{product.manufacturer}</td>
                      <td className="py-4 px-4 text-sm text-[#5B6773]">{product.approvalNumber}</td>
                      <td className="py-4 px-4 text-center">
                        {product.lotManagement ? (
                          <CheckCircle className="w-5 h-5 text-[#2E7D5B] mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-[#D7DEE6] mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {product.serialManagement ? (
                          <CheckCircle className="w-5 h-5 text-[#2E7D5B] mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-[#D7DEE6] mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {product.expiryManagement ? (
                          <CheckCircle className="w-5 h-5 text-[#2E7D5B] mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-[#D7DEE6] mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm text-right">
                        <span className={
                          product.stockQuantity === 0 ? 'text-[#B94A48] font-semibold' :
                          product.stockQuantity < 10 ? 'text-[#C58A2B] font-semibold' :
                          'text-[#18212B] font-semibold'
                        }>
                          {formatNumber(product.stockQuantity)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <StatusBadge status={product.status} />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 hover:bg-[#E8EEF3] rounded transition-colors" title="상세보기">
                            <Eye className="w-4 h-4 text-[#5B6773]" />
                          </button>
                          <button 
                            className="p-1.5 hover:bg-[#E8EEF3] rounded transition-colors"
                            title="수정"
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsFormOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4 text-[#5B8DB8]" />
                          </button>
                          <button className="p-1.5 hover:bg-[#E8EEF3] rounded transition-colors" title="삭제">
                            <Trash2 className="w-4 h-4 text-[#B94A48]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-[#D7DEE6]">
              {filteredProducts.map((product) => (
                <div key={product.code} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-[#18212B] mb-1">{product.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-[#5B6773]">
                        <span>{product.modelName}</span>
                        <span>•</span>
                        <span>{product.category}</span>
                      </div>
                    </div>
                    <StatusBadge status={product.status} />
                  </div>
                  
                  <div className="bg-[#F4F7FA] rounded-lg p-3 mb-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#5B6773]">제조사</span>
                      <span className="font-semibold text-[#18212B]">{product.manufacturer}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#5B6773]">허가번호</span>
                      <span className="font-semibold text-[#18212B]">{product.approvalNumber}</span>
                    </div>
                    <div className="h-px bg-[#D7DEE6] my-1.5"></div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <p className="text-[#5B6773] mb-1">로트</p>
                        {product.lotManagement ? (
                          <CheckCircle className="w-4 h-4 text-[#2E7D5B] mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-[#D7DEE6] mx-auto" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-[#5B6773] mb-1">시리얼</p>
                        {product.serialManagement ? (
                          <CheckCircle className="w-4 h-4 text-[#2E7D5B] mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-[#D7DEE6] mx-auto" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-[#5B6773] mb-1">유효기간</p>
                        {product.expiryManagement ? (
                          <CheckCircle className="w-4 h-4 text-[#2E7D5B] mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-[#D7DEE6] mx-auto" />
                        )}
                      </div>
                    </div>
                    <div className="h-px bg-[#D7DEE6] my-1.5"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#5B6773]">재고수량</span>
                      <span className={`text-base font-bold ${
                        product.stockQuantity === 0 ? 'text-[#B94A48]' :
                        product.stockQuantity < 10 ? 'text-[#C58A2B]' :
                        'text-[#18212B]'
                      }`}>
                        {formatNumber(product.stockQuantity)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-[#D7DEE6] rounded-lg text-[#5B6773] hover:bg-[#F4F7FA] transition-colors text-sm">
                      <Eye className="w-4 h-4" />
                      상세
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsFormOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#163A5F] text-white rounded-lg hover:bg-[#0F2942] transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      수정
                    </button>
                    <button className="p-2 border border-[#D7DEE6] rounded-lg hover:bg-[#FEF2F2] hover:border-[#B94A48] transition-colors">
                      <Trash2 className="w-4 h-4 text-[#B94A48]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-[#D7DEE6] flex items-center justify-between">
              <p className="text-sm text-[#5B6773]">
                전체 {filteredProducts.length}개 중 1-{Math.min(10, filteredProducts.length)}개 표시
              </p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 border border-[#D7DEE6] rounded text-sm text-[#5B6773] hover:bg-[#F4F7FA] transition-colors">
                  이전
                </button>
                <button className="px-3 py-1.5 bg-[#163A5F] text-white rounded text-sm">1</button>
                <button className="px-3 py-1.5 border border-[#D7DEE6] rounded text-sm text-[#5B6773] hover:bg-[#F4F7FA] transition-colors">
                  2
                </button>
                <button className="px-3 py-1.5 border border-[#D7DEE6] rounded text-sm text-[#5B6773] hover:bg-[#F4F7FA] transition-colors">
                  다음
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Product Form Side Drawer */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedProduct}
      />

      {/* Product Detail Panel */}
      <ProductDetailPanel
        isOpen={!!detailPanelProducts}
        products={detailPanelProducts}
        title={detailPanelTitle}
        onClose={() => setDetailPanelProducts(null)}
      />
    </div>
  );
}
