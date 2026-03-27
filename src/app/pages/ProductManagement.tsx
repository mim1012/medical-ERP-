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
  AlertTriangle,
  Clock,
  DollarSign,
  FileText,
  X,
  Shield,
  TrendingUp
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

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
  // 추가 정보
  deviceGrade?: string;
  standardPrice?: number;
  supplyPrice?: number;
  salePrice?: number;
  safetyStock?: number;
  minStock?: number;
  maxStock?: number;
  insuranceCode?: string;
  insuranceCovered?: boolean;
  expiryDate?: string;
  manufacturingCountry?: string;
  originCountry?: string;
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
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  // Mock data with enhanced fields
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
      registrationDate: '2024-01-15',
      deviceGrade: '3등급',
      standardPrice: 8500000,
      supplyPrice: 7200000,
      salePrice: 9500000,
      safetyStock: 5,
      minStock: 3,
      maxStock: 20,
      insuranceCode: 'Z1234-001',
      insuranceCovered: true,
      manufacturingCountry: '대한민국',
      originCountry: '대한민국'
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
      registrationDate: '2024-02-20',
      deviceGrade: '2등급',
      standardPrice: 45000,
      supplyPrice: 38000,
      salePrice: 52000,
      safetyStock: 100,
      minStock: 50,
      maxStock: 500,
      insuranceCode: 'M5678-002',
      insuranceCovered: true,
      expiryDate: '2026-08-20',
      manufacturingCountry: '독일',
      originCountry: '독일'
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
      registrationDate: '2024-03-10',
      deviceGrade: '1등급',
      standardPrice: 850000,
      supplyPrice: 720000,
      salePrice: 950000,
      safetyStock: 10,
      minStock: 5,
      maxStock: 30,
      insuranceCode: 'S9012-003',
      insuranceCovered: false,
      manufacturingCountry: '일본',
      originCountry: '일본'
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
      registrationDate: '2024-04-05',
      deviceGrade: '2등급',
      standardPrice: 280000,
      supplyPrice: 240000,
      salePrice: 320000,
      safetyStock: 15,
      minStock: 10,
      maxStock: 50,
      insuranceCode: '',
      insuranceCovered: false,
      manufacturingCountry: '중국',
      originCountry: '일본'
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
      registrationDate: '2024-05-25',
      deviceGrade: '3등급',
      standardPrice: 3500000,
      supplyPrice: 2950000,
      salePrice: 3850000,
      safetyStock: 3,
      minStock: 2,
      maxStock: 10,
      insuranceCode: 'E3456-004',
      insuranceCovered: true,
      manufacturingCountry: '네덜란드',
      originCountry: '네덜란드'
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
      registrationDate: '2024-06-18',
      deviceGrade: '2등급',
      standardPrice: 125000,
      supplyPrice: 105000,
      salePrice: 145000,
      safetyStock: 80,
      minStock: 50,
      maxStock: 300,
      insuranceCode: 'C7890-005',
      insuranceCovered: true,
      expiryDate: '2026-04-15',
      manufacturingCountry: '미국',
      originCountry: '미국'
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
      registrationDate: '2024-07-12',
      deviceGrade: '1등급',
      standardPrice: 150,
      supplyPrice: 120,
      salePrice: 180,
      safetyStock: 1000,
      minStock: 500,
      maxStock: 10000,
      insuranceCode: 'D2345-006',
      insuranceCovered: true,
      expiryDate: '2027-12-31',
      manufacturingCountry: '대한민국',
      originCountry: '대한민국'
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
      registrationDate: '2024-08-03',
      deviceGrade: '4등급',
      standardPrice: 28000000,
      supplyPrice: 24000000,
      salePrice: 32000000,
      safetyStock: 1,
      minStock: 1,
      maxStock: 5,
      insuranceCode: '',
      insuranceCovered: false,
      manufacturingCountry: '대한민국',
      originCountry: '대한민국'
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
      registrationDate: '2024-09-21',
      deviceGrade: '1등급',
      standardPrice: 35000,
      supplyPrice: 28000,
      salePrice: 42000,
      safetyStock: 20,
      minStock: 10,
      maxStock: 100,
      insuranceCode: '',
      insuranceCovered: false,
      manufacturingCountry: '중국',
      originCountry: '중국'
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
      registrationDate: '2024-10-07',
      deviceGrade: '4등급',
      standardPrice: 4500000,
      supplyPrice: 3800000,
      salePrice: 5200000,
      safetyStock: 5,
      minStock: 3,
      maxStock: 20,
      insuranceCode: 'K1111-007',
      insuranceCovered: true,
      manufacturingCountry: '미국',
      originCountry: '미국'
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

  const formatCurrency = (amount: number) => {
    if (amount >= 10000) {
      return `${(amount / 10000).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}만원`;
    }
    return `${amount.toLocaleString('ko-KR')}원`;
  };

  // 유효기간 만료까지 남은 일수
  const getDaysUntilExpiry = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const today = new Date('2026-03-15');
    const expiry = new Date(expiryDate);
    const diff = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // 재고 상태 계산
  const getStockStatus = (product: Product) => {
    if (product.stockQuantity === 0) return 'outOfStock';
    if (product.minStock && product.stockQuantity <= product.minStock) return 'low';
    if (product.safetyStock && product.stockQuantity <= product.safetyStock) return 'warning';
    return 'normal';
  };

  // 의료기기 등급 배지
  const getDeviceGradeBadge = (grade?: string) => {
    const gradeColors: { [key: string]: string } = {
      '1등급': 'bg-[#E6F4EA] text-[#2E7D5B] border-[#2E7D5B]',
      '2등급': 'bg-[#E8EEF3] text-[#5B8DB8] border-[#5B8DB8]',
      '3등급': 'bg-[#FFF4E6] text-[#C58A2B] border-[#C58A2B]',
      '4등급': 'bg-[#FCEBE9] text-[#B94A48] border-[#B94A48]'
    };

    if (!grade) return null;

    return (
      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${gradeColors[grade]}`}>
        {grade}
      </span>
    );
  };

  // 월별 출고 추이 Mock 데이터
  const getProductMonthlyShipment = (productCode: string) => {
    return [
      { month: '9월', quantity: 12, revenue: 18500000 },
      { month: '10월', quantity: 15, revenue: 22800000 },
      { month: '11월', quantity: 18, revenue: 27200000 },
      { month: '12월', quantity: 14, revenue: 21300000 },
      { month: '1월', quantity: 20, revenue: 30500000 },
      { month: '2월', quantity: 16, revenue: 24800000 },
    ];
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
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#18212B] mb-2">품목 관리</h1>
            <p className="text-sm lg:text-base text-[#5B6773]">의료기기 및 소모품 마스터 관리</p>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 lg:gap-4 mb-6 lg:mb-8">
            <div 
              onClick={() => {
                setDetailPanelProducts(products);
                setDetailPanelTitle('전체 품목 목록');
              }}
              className="bg-white rounded-lg border border-[#D7DEE6] p-4 shadow-sm cursor-pointer hover:border-[#5B8DB8] hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Package className="w-3.5 h-3.5 text-[#18212B] flex-shrink-0" />
                <p className="text-xs text-[#5B6773]">전체 품목</p>
              </div>
              <p className="text-2xl font-bold text-[#18212B] mb-0.5">{products.length}</p>
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
              className="bg-white rounded-lg border border-[#D7DEE6] p-4 shadow-sm cursor-pointer hover:border-[#5B8DB8] hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Layers className="w-3.5 h-3.5 text-[#5B8DB8] flex-shrink-0" />
                <p className="text-xs text-[#5B6773]">로트 관리</p>
              </div>
              <p className="text-2xl font-bold text-[#5B8DB8] mb-0.5">{products.filter(p => p.lotManagement).length}</p>
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
              className="bg-white rounded-lg border border-[#D7DEE6] p-4 shadow-sm cursor-pointer hover:border-[#5B8DB8] hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Hash className="w-3.5 h-3.5 text-[#35556E] flex-shrink-0" />
                <p className="text-xs text-[#5B6773]">시리얼 관리</p>
              </div>
              <p className="text-2xl font-bold text-[#35556E] mb-0.5">{products.filter(p => p.serialManagement).length}</p>
              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#E8EEF3] text-[#35556E]">
                {Math.round(products.filter(p => p.serialManagement).length / products.length * 100)}%
              </span>
            </div>
            
            <div 
              onClick={() => {
                const expiringProducts = products.filter(p => {
                  const days = getDaysUntilExpiry(p.expiryDate);
                  return days !== null && days <= 90 && days > 0;
                });
                setDetailPanelProducts(expiringProducts);
                setDetailPanelTitle('유효기간 임박 (90일 이내)');
              }}
              className="bg-white rounded-lg border border-[#D7DEE6] p-4 shadow-sm cursor-pointer hover:border-[#C58A2B] hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-[#C58A2B] flex-shrink-0" />
                <p className="text-xs text-[#5B6773]">유효기간 임박</p>
              </div>
              <p className="text-2xl font-bold text-[#C58A2B] mb-0.5">
                {products.filter(p => {
                  const days = getDaysUntilExpiry(p.expiryDate);
                  return days !== null && days <= 90 && days > 0;
                }).length}
              </p>
              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FFF4E6] text-[#C58A2B]">
                90일 이내
              </span>
            </div>
            
            <div 
              onClick={() => {
                const lowStockProducts = products.filter(p => p.status === '재고부족' || p.status === '품절');
                setDetailPanelProducts(lowStockProducts);
                setDetailPanelTitle('재고 부족/품절 품목');
              }}
              className="bg-white rounded-lg border border-[#D7DEE6] p-4 shadow-sm cursor-pointer hover:border-[#B94A48] hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-[#B94A48] flex-shrink-0" />
                <p className="text-xs text-[#5B6773]">재고 부족</p>
              </div>
              <p className="text-2xl font-bold text-[#B94A48] mb-0.5">{products.filter(p => p.status === '재고부족' || p.status === '품절').length}</p>
              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FCEBE9] text-[#B94A48]">
                품절 {products.filter(p => p.status === '품절').length}개
              </span>
            </div>
            
            <div 
              onClick={() => {
                const insuredProducts = products.filter(p => p.insuranceCovered);
                setDetailPanelProducts(insuredProducts);
                setDetailPanelTitle('보험급여 품목');
              }}
              className="bg-white rounded-lg border border-[#D7DEE6] p-4 shadow-sm cursor-pointer hover:border-[#2E7D5B] hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Shield className="w-3.5 h-3.5 text-[#2E7D5B] flex-shrink-0" />
                <p className="text-xs text-[#5B6773]">보험급여</p>
              </div>
              <p className="text-2xl font-bold text-[#2E7D5B] mb-0.5">{products.filter(p => p.insuranceCovered).length}</p>
              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#E6F4EA] text-[#2E7D5B]">
                {Math.round(products.filter(p => p.insuranceCovered).length / products.length * 100)}%
              </span>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg border border-[#D7DEE6] shadow-sm">
            {/* Table Header */}
            <div className="px-4 lg:px-6 py-4 border-b border-[#D7DEE6]">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
                <div className="flex items-center gap-3 flex-1">
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
                  <button className="hidden md:flex items-center gap-2 px-4 py-2.5 border border-[#D7DEE6] rounded-md text-[#5B6773] hover:bg-[#F4F7FA] transition-colors text-sm font-semibold">
                    <Upload className="w-4 h-4" />
                    <span className="hidden lg:inline">가져오기</span>
                  </button>
                  <button className="hidden md:flex items-center gap-2 px-4 py-2.5 border border-[#D7DEE6] rounded-md text-[#5B6773] hover:bg-[#F4F7FA] transition-colors text-sm font-semibold">
                    <Download className="w-4 h-4" />
                    <span className="hidden lg:inline">내보내기</span>
                  </button>
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors text-sm font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>신규 등록</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#D7DEE6] bg-[#F4F7FA]">
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#18212B]">등급</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#18212B]">품목명</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#18212B]">모델명</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#18212B]">분류</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#18212B]">제조사</th>
                    <th className="text-right py-4 px-4 text-sm font-semibold text-[#18212B]">판매가</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#18212B]">재고</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#18212B]">유효기한</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#18212B]">보험</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#18212B]">상태</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#18212B]">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product);
                    const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate);

                    return (
                      <tr key={product.code} className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors">
                        <td className="py-4 px-4 text-center">
                          {getDeviceGradeBadge(product.deviceGrade)}
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-sm font-semibold text-[#18212B]">{product.name}</p>
                            <p className="text-xs text-[#5B6773]">{product.code}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-[#5B6773]">{product.modelName}</td>
                        <td className="py-4 px-4 text-sm text-[#5B6773]">{product.category}</td>
                        <td className="py-4 px-4 text-sm text-[#18212B]">{product.manufacturer}</td>
                        <td className="py-4 px-4 text-sm text-right font-semibold text-[#18212B]">
                          {product.salePrice ? formatCurrency(product.salePrice) : '-'}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className={`text-sm font-semibold ${
                              stockStatus === 'outOfStock' ? 'text-[#B94A48]' :
                              stockStatus === 'low' ? 'text-[#C58A2B]' :
                              'text-[#18212B]'
                            }`}>
                              {formatNumber(product.stockQuantity)}
                            </span>
                            {product.safetyStock && (
                              <span className="text-xs text-[#5B6773]">
                                (안전: {product.safetyStock})
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {daysUntilExpiry !== null ? (
                            <span className={`text-sm font-semibold ${
                              daysUntilExpiry <= 30 ? 'text-[#B94A48]' :
                              daysUntilExpiry <= 90 ? 'text-[#C58A2B]' :
                              'text-[#2E7D5B]'
                            }`}>
                              {daysUntilExpiry}일
                            </span>
                          ) : (
                            <span className="text-sm text-[#5B6773]">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {product.insuranceCovered ? (
                            <CheckCircle className="w-5 h-5 text-[#2E7D5B] mx-auto" />
                          ) : (
                            <XCircle className="w-5 h-5 text-[#D7DEE6] mx-auto" />
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <StatusBadge status={product.status} />
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button 
                              className="p-1.5 hover:bg-[#E8EEF3] rounded transition-colors" 
                              title="상세보기"
                              onClick={() => setSelectedProductDetail(product)}
                            >
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
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-[#D7DEE6]">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate);

                return (
                  <div key={product.code} className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-[#18212B]">{product.name}</h3>
                          {getDeviceGradeBadge(product.deviceGrade)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#5B6773]">{product.category}</span>
                          <span className="text-[#D7DEE6]">•</span>
                          <span className="text-sm text-[#5B6773]">{product.modelName}</span>
                        </div>
                      </div>
                      <StatusBadge status={product.status} />
                    </div>
                    
                    <div className="bg-[#F4F7FA] rounded-lg p-4 mb-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#5B6773] font-medium">제조사</span>
                        <span className="text-sm text-[#18212B] font-semibold">{product.manufacturer}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#5B6773] font-medium">판매가</span>
                        <span className="text-sm text-[#18212B] font-semibold">
                          {product.salePrice ? formatCurrency(product.salePrice) : '-'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#5B6773] font-medium">재고</span>
                        <span className={`text-base font-bold ${
                          stockStatus === 'outOfStock' ? 'text-[#B94A48]' :
                          stockStatus === 'low' ? 'text-[#C58A2B]' :
                          'text-[#18212B]'
                        }`}>
                          {formatNumber(product.stockQuantity)}
                        </span>
                      </div>
                      {daysUntilExpiry !== null && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#5B6773] font-medium">유효기간</span>
                          <span className={`text-sm font-semibold ${
                            daysUntilExpiry <= 30 ? 'text-[#B94A48]' :
                            daysUntilExpiry <= 90 ? 'text-[#C58A2B]' :
                            'text-[#2E7D5B]'
                          }`}>
                            {daysUntilExpiry}일 남음
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#5B6773] font-medium">보험급여</span>
                        <div className="flex items-center gap-1">
                          {product.insuranceCovered ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-[#2E7D5B]" />
                              <span className="text-sm font-semibold text-[#2E7D5B]">적용</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-[#5B6773]" />
                              <span className="text-sm text-[#5B6773]">미적용</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedProductDetail(product)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#D7DEE6] rounded-lg text-[#5B6773] hover:bg-[#F4F7FA] hover:border-[#5B8DB8] transition-all font-semibold"
                      >
                        <Eye className="w-5 h-5" />
                        상세
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsFormOpen(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#163A5F] text-white rounded-lg hover:bg-[#0F2942] transition-all font-semibold"
                      >
                        <Edit className="w-5 h-5" />
                        수정
                      </button>
                      <button className="p-3 border-2 border-[#D7DEE6] rounded-lg hover:bg-[#FEF2F2] hover:border-[#B94A48] transition-all">
                        <Trash2 className="w-5 h-5 text-[#B94A48]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="px-4 lg:px-6 py-4 border-t border-[#D7DEE6] flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs lg:text-sm text-[#5B6773]">
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

      {/* Enhanced Product Detail Modal */}
      {selectedProductDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[#D7DEE6] p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-[#5B8DB8]" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-[#18212B]">{selectedProductDetail.name}</h2>
                    {getDeviceGradeBadge(selectedProductDetail.deviceGrade)}
                  </div>
                  <p className="text-sm text-[#5B6773]">{selectedProductDetail.code} • {selectedProductDetail.modelName}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProductDetail(null)}
                className="p-2 hover:bg-[#F4F7FA] rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-[#5B6773]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#F4F7FA] rounded-lg p-4">
                  <p className="text-xs text-[#5B6773] mb-1">분류</p>
                  <p className="text-lg font-semibold text-[#18212B]">{selectedProductDetail.category}</p>
                </div>
                <div className="bg-[#F4F7FA] rounded-lg p-4">
                  <p className="text-xs text-[#5B6773] mb-1">제조사</p>
                  <p className="text-lg font-semibold text-[#18212B]">{selectedProductDetail.manufacturer}</p>
                </div>
                <div className="bg-[#F4F7FA] rounded-lg p-4">
                  <p className="text-xs text-[#5B6773] mb-1">허가번호</p>
                  <p className="text-lg font-semibold text-[#5B8DB8]">{selectedProductDetail.approvalNumber}</p>
                </div>
                <div className="bg-[#F4F7FA] rounded-lg p-4">
                  <p className="text-xs text-[#5B6773] mb-1">상태</p>
                  <StatusBadge status={selectedProductDetail.status} />
                </div>
              </div>

              {/* Price Info */}
              <div className="bg-gradient-to-br from-[#F4F7FA] to-[#E8EEF3] rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#18212B] mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#5B8DB8]" />
                  가격 정보
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-[#5B6773] mb-2">표준단가</p>
                    <p className="text-base font-semibold text-[#18212B]">
                      {selectedProductDetail.standardPrice ? formatCurrency(selectedProductDetail.standardPrice) : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#5B6773] mb-2">공급가</p>
                    <p className="text-base font-semibold text-[#5B8DB8]">
                      {selectedProductDetail.supplyPrice ? formatCurrency(selectedProductDetail.supplyPrice) : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#5B6773] mb-2">판매가</p>
                    <p className="text-base font-semibold text-[#2E7D5B]">
                      {selectedProductDetail.salePrice ? formatCurrency(selectedProductDetail.salePrice) : '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stock & Management Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Stock Info */}
                <div className="bg-white border border-[#D7DEE6] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-[#18212B] mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#5B8DB8]" />
                    재고 관리
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#5B6773]">현재 재고</span>
                      <span className="text-lg font-bold text-[#18212B]">
                        {formatNumber(selectedProductDetail.stockQuantity)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#5B6773]">안전재고</span>
                      <span className="text-base font-semibold text-[#C58A2B]">
                        {selectedProductDetail.safetyStock || '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#5B6773]">최소재고</span>
                      <span className="text-base font-semibold text-[#B94A48]">
                        {selectedProductDetail.minStock || '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#5B6773]">최대재고</span>
                      <span className="text-base font-semibold text-[#2E7D5B]">
                        {selectedProductDetail.maxStock || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Management Options */}
                <div className="bg-white border border-[#D7DEE6] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-[#18212B] mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#5B8DB8]" />
                    관리 옵션
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#5B6773]">로트 관리</span>
                      {selectedProductDetail.lotManagement ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-5 h-5 text-[#2E7D5B]" />
                          <span className="text-sm font-semibold text-[#2E7D5B]">활성화</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <XCircle className="w-5 h-5 text-[#5B6773]" />
                          <span className="text-sm text-[#5B6773]">비활성화</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#5B6773]">시리얼 관리</span>
                      {selectedProductDetail.serialManagement ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-5 h-5 text-[#2E7D5B]" />
                          <span className="text-sm font-semibold text-[#2E7D5B]">활성화</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <XCircle className="w-5 h-5 text-[#5B6773]" />
                          <span className="text-sm text-[#5B6773]">비활성화</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#5B6773]">유효기간 관리</span>
                      {selectedProductDetail.expiryManagement ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-5 h-5 text-[#2E7D5B]" />
                          <span className="text-sm font-semibold text-[#2E7D5B]">활성화</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <XCircle className="w-5 h-5 text-[#5B6773]" />
                          <span className="text-sm text-[#5B6773]">비활성화</span>
                        </div>
                      )}
                    </div>
                    {selectedProductDetail.expiryDate && (
                      <div className="flex items-center justify-between pt-3 border-t border-[#D7DEE6]">
                        <span className="text-sm text-[#5B6773]">유효기간</span>
                        <div className="text-right">
                          <p className="text-base font-semibold text-[#18212B]">{selectedProductDetail.expiryDate}</p>
                          {getDaysUntilExpiry(selectedProductDetail.expiryDate) !== null && (
                            <p className={`text-sm font-semibold ${
                              getDaysUntilExpiry(selectedProductDetail.expiryDate)! <= 30 ? 'text-[#B94A48]' :
                              getDaysUntilExpiry(selectedProductDetail.expiryDate)! <= 90 ? 'text-[#C58A2B]' :
                              'text-[#2E7D5B]'
                            }`}>
                              {getDaysUntilExpiry(selectedProductDetail.expiryDate)}일 남음
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Insurance & Origin Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-[#D7DEE6] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-[#18212B] mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#5B8DB8]" />
                    보험 정보
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#5B6773]">보험급여</span>
                      {selectedProductDetail.insuranceCovered ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-5 h-5 text-[#2E7D5B]" />
                          <span className="text-sm font-semibold text-[#2E7D5B]">적용</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <XCircle className="w-5 h-5 text-[#5B6773]" />
                          <span className="text-sm text-[#5B6773]">비급여</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#5B6773]">보험코드</span>
                      <span className="text-base font-semibold text-[#18212B]">
                        {selectedProductDetail.insuranceCode || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[#D7DEE6] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-[#18212B] mb-4">원산지 정보</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#5B6773]">제조국</span>
                      <span className="text-base font-semibold text-[#18212B]">
                        {selectedProductDetail.manufacturingCountry || '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#5B6773]">원산지</span>
                      <span className="text-base font-semibold text-[#18212B]">
                        {selectedProductDetail.originCountry || '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Shipment Chart */}
              <div className="bg-white border border-[#D7DEE6] rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#18212B] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#5B8DB8]" />
                  월별 출고 추이
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={getProductMonthlyShipment(selectedProductDetail.code)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D7DEE6" />
                    <XAxis dataKey="month" stroke="#5B6773" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#5B6773" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      formatter={(value: number, name: string) => {
                        if (name === 'quantity') return [value + '개', '출고수량'];
                        return [formatCurrency(value), '매출'];
                      }}
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #D7DEE6', borderRadius: '6px', fontSize: '12px' }}
                    />
                    <Bar dataKey="quantity" fill="#5B8DB8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-[#D7DEE6]">
                  <div className="text-center">
                    <p className="text-xs text-[#5B6773] mb-1">월평균 출고</p>
                    <p className="text-lg font-bold text-[#18212B]">16개</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#5B6773] mb-1">월평균 매출</p>
                    <p className="text-lg font-bold text-[#5B8DB8]">2,520만원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#5B6773] mb-1">전월대비</p>
                    <p className="text-lg font-bold text-[#B94A48]">-18.5%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-white border-t border-[#D7DEE6] p-6 flex items-center justify-end gap-3">
              <button 
                onClick={() => setSelectedProductDetail(null)}
                className="px-6 py-2.5 border border-[#D7DEE6] rounded-lg text-[#5B6773] hover:bg-[#F4F7FA] transition-colors font-semibold"
              >
                닫기
              </button>
              <button 
                onClick={() => {
                  setSelectedProduct(selectedProductDetail);
                  setSelectedProductDetail(null);
                  setIsFormOpen(true);
                }}
                className="px-6 py-2.5 bg-[#163A5F] text-white rounded-lg hover:bg-[#0F2942] transition-colors font-semibold"
              >
                수정하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
