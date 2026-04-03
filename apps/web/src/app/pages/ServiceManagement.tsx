import { useState } from "react";
import { useService, useCreateService, useUpdateService } from "../../../hooks/use-service";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { InstallationForm } from "../components/InstallationForm";
import { ServiceCaseForm } from "../components/ServiceCaseForm";
import { ServiceDetailPanel } from "../components/ServiceDetailPanel";
import { StatusBadge } from "../components/StatusBadge";
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit,
  Monitor,
  Wrench,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";

interface InstalledDevice {
  equipmentName: string;
  modelName: string;
  serialNumber: string;
  hospitalName: string;
  installationDate: string;
  warrantyExpiry: string;
  engineer: string;
  status: string;
}

interface ServiceCase {
  caseNumber: string;
  caseDate: string;
  hospitalName: string;
  equipmentName: string;
  serialNumber: string;
  symptoms: string;
  priority: string;
  status: string;
  engineer: string;
}

export function ServiceManagement() {
  const [activeMenu, setActiveMenu] = useState('service');
  const [activeTab, setActiveTab] = useState<'devices' | 'cases'>('devices');
  const [isInstallFormOpen, setIsInstallFormOpen] = useState(false);
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<InstalledDevice | null>(null);
  const [selectedServiceCase, setSelectedServiceCase] = useState<ServiceCase | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [detailPanelCases, setDetailPanelCases] = useState<ServiceCase[] | null>(null);
  const [detailPanelTitle, setDetailPanelTitle] = useState('');

  const { data: serviceCases = [], isLoading, error } = useService({ search: searchTerm });
  const createService = useCreateService();
  const updateService = useUpdateService();


  const installedDevices: any[] = [];
  const filteredDevices = installedDevices.filter(device => {
    const matchesSearch =
      device.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.hospitalName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === '전체' || device.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredCases = serviceCases.filter(serviceCase => {
    const matchesSearch = 
      serviceCase.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceCase.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceCase.equipmentName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '전체' || serviceCase.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleInstallSubmit = (data: any) => {
    console.log('Installation submitted:', data);
    setIsInstallFormOpen(false);
    setSelectedDevice(null);
  };

  const handleServiceSubmit = (data: any) => {
    console.log('Service case submitted:', data);
    setIsServiceFormOpen(false);
    setSelectedServiceCase(null);
  };

  const getWarrantyStatus = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { label: '만료', color: 'text-[#B94A48]' };
    if (daysUntilExpiry <= 90) return { label: `${daysUntilExpiry}일 남음`, color: 'text-[#C58A2B]' };
    return { label: expiryDate, color: 'text-[#5B6773]' };
  };

  // Calculate statistics
  const totalDevices = installedDevices.length;
  const normalDevices = installedDevices.filter(d => d.status === '정상').length;
  const maintenanceNeeded = installedDevices.filter(d => d.status === '점검필요' || d.status === '수리중').length;
  const urgentCases = serviceCases.filter(c => c.priority === '긴급' && c.status !== '완료').length;

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
            <h1 className="text-3xl font-bold text-[#18212B] mb-2">설치/A/S 관리</h1>
            <p className="text-[#5B6773]">설치 장비 및 서비스 케이스 통합 관리</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div 
              onClick={() => {
                setDetailPanelCases(serviceCases);
                setDetailPanelTitle('전체 A/S 케이스');
              }}
              className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm cursor-pointer hover:border-[#163A5F] hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-[#5B6773] mb-1">총 설치 장비</p>
                  <p className="text-3xl font-bold text-[#18212B]">{totalDevices}</p>
                  <p className="text-xs text-[#5B6773] mt-1">대</p>
                </div>
                <Monitor className="w-10 h-10 text-[#163A5F] opacity-20" />
              </div>
            </div>
            <div 
              onClick={() => {
                const items = serviceCases.filter(c => c.status === '완료');
                setDetailPanelCases(items);
                setDetailPanelTitle('완료된 A/S');
              }}
              className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm cursor-pointer hover:border-[#2E7D5B] hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-[#5B6773] mb-1">정상 작동</p>
                  <p className="text-3xl font-bold text-[#2E7D5B]">{normalDevices}</p>
                  <p className="text-xs text-[#2E7D5B] mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    양호
                  </p>
                </div>
                <CheckCircle2 className="w-10 h-10 text-[#2E7D5B] opacity-20" />
              </div>
            </div>
            <div 
              onClick={() => {
                const items = serviceCases.filter(c => c.status === '진행중' || c.status === '접수' || c.status === '배정');
                setDetailPanelCases(items);
                setDetailPanelTitle('점검/수리 진행중');
              }}
              className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm cursor-pointer hover:border-[#C58A2B] hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-[#5B6773] mb-1">점검/수리 필요</p>
                  <p className="text-3xl font-bold text-[#C58A2B]">{maintenanceNeeded}</p>
                  <p className="text-xs text-[#C58A2B] mt-1">조치 필요</p>
                </div>
                <Wrench className="w-10 h-10 text-[#C58A2B] opacity-20" />
              </div>
            </div>
            <div 
              onClick={() => {
                const items = serviceCases.filter(c => c.priority === '긴급' && c.status !== '완료');
                setDetailPanelCases(items);
                setDetailPanelTitle('긴급 A/S 건');
              }}
              className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm cursor-pointer hover:border-[#B94A48] hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-[#5B6773] mb-1">긴급 A/S</p>
                  <p className="text-3xl font-bold text-[#B94A48]">{urgentCases}</p>
                  <p className="text-xs text-[#B94A48] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    즉시 대응
                  </p>
                </div>
                <AlertCircle className="w-10 h-10 text-[#B94A48] opacity-20" />
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-t-lg border border-b-0 border-[#D7DEE6] shadow-sm">
            <div className="flex border-b border-[#D7DEE6]">
              <button
                onClick={() => setActiveTab('devices')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'devices'
                    ? 'text-[#163A5F] border-b-4 border-[#163A5F] bg-[#F4F7FA]'
                    : 'text-[#5B6773] hover:bg-[#F4F7FA]'
                }`}
              >
                <Monitor className="w-5 h-5" />
                설치 장비 관리
              </button>
              <button
                onClick={() => setActiveTab('cases')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'cases'
                    ? 'text-[#163A5F] border-b-4 border-[#163A5F] bg-[#F4F7FA]'
                    : 'text-[#5B6773] hover:bg-[#F4F7FA]'
                }`}
              >
                <Wrench className="w-5 h-5" />
                A/S 케이스 관리
              </button>
            </div>

            {/* Table Header */}
            <div className="px-6 py-4 border-b border-[#D7DEE6] bg-[#F4F7FA]">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 lg:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5B6773]" />
                    <input
                      type="text"
                      placeholder={activeTab === 'devices' ? '장비명, 시리얼번호, 병원명...' : '접수번호, 병원명, 장비명...'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-[#5B6773]" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2.5 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                    >
                      {activeTab === 'devices' ? (
                        <>
                          <option value="전체">전체 상태</option>
                          <option value="정상">정상</option>
                          <option value="점검필요">점검필요</option>
                          <option value="수리중">수리중</option>
                          <option value="중단">중단</option>
                        </>
                      ) : (
                        <>
                          <option value="전체">전체 상태</option>
                          <option value="접수">접수</option>
                          <option value="배정">배정</option>
                          <option value="진행중">진행중</option>
                          <option value="완료">완료</option>
                          <option value="보류">보류</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-[#D7DEE6] rounded-md text-[#5B6773] hover:bg-white transition-colors text-sm font-semibold">
                    <Download className="w-4 h-4" />
                    내보내기
                  </button>
                  <button
                    onClick={() => activeTab === 'devices' ? setIsInstallFormOpen(true) : setIsServiceFormOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors text-sm font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    {activeTab === 'devices' ? '설치 등록' : 'A/S 접수'}
                  </button>
                </div>
              </div>
            </div>

            {/* Devices Table */}
            {activeTab === 'devices' && (
              <div className="overflow-x-auto">
                {/* Mobile Card View */}
                <div className="lg:hidden p-4 space-y-3">
                  {filteredDevices.map((device, index) => {
                    const warrantyStatus = getWarrantyStatus(device.warrantyExpiry);
                    
                    return (
                      <div 
                        key={index}
                        className="border border-[#D7DEE6] rounded-lg p-4 hover:bg-[#F4F7FA] transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="text-xs font-mono font-bold text-[#163A5F] mb-1">{device.serialNumber}</p>
                            <p className="text-sm font-semibold text-[#18212B] mb-1">{device.equipmentName}</p>
                            <p className="text-xs text-[#5B6773]">{device.modelName}</p>
                          </div>
                          <StatusBadge status={device.status} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mb-3 pt-3 border-t border-[#D7DEE6]">
                          <div>
                            <p className="text-[10px] text-[#5B6773] mb-0.5">병원명</p>
                            <p className="text-xs font-semibold text-[#18212B]">{device.hospitalName}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-[#5B6773] mb-0.5">담당기사</p>
                            <p className="text-xs text-[#18212B]">{device.engineer}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-[#5B6773] mb-0.5">설치일</p>
                            <p className="text-xs text-[#18212B]">{device.installationDate}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-[#5B6773] mb-0.5">보증만료일</p>
                            <p className={`text-xs font-semibold ${warrantyStatus.color}`}>
                              {warrantyStatus.label}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#F4F7FA] border border-[#D7DEE6] rounded-md text-sm text-[#5B6773] hover:bg-white transition-colors">
                            <Eye className="w-4 h-4" />
                            상세
                          </button>
                          <button 
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors text-sm"
                            onClick={() => {
                              setSelectedDevice(device);
                              setIsInstallFormOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                            수정
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Table View */}
                <table className="w-full hidden lg:table">
                  <thead>
                    <tr className="border-b-2 border-[#D7DEE6] bg-[#163A5F]">
                      <th className="text-left py-4 px-4 text-sm font-bold text-white min-w-[180px]">장비명</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-white min-w-[120px]">모델명</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-white min-w-[140px]">시리얼번호</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-white min-w-[140px]">병원명</th>
                      <th className="text-center py-4 px-4 text-sm font-bold text-white min-w-[100px]">설치일</th>
                      <th className="text-center py-4 px-4 text-sm font-bold text-white min-w-[120px]">보증만료일</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-white min-w-[100px]">담당기사</th>
                      <th className="text-center py-4 px-4 text-sm font-bold text-white min-w-[100px]">장비상태</th>
                      <th className="text-center py-4 px-4 text-sm font-bold text-white min-w-[100px]">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDevices.map((device, index) => {
                      const warrantyStatus = getWarrantyStatus(device.warrantyExpiry);
                      
                      return (
                        <tr key={index} className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors">
                          <td className="py-4 px-4 text-sm font-semibold text-[#18212B]">{device.equipmentName}</td>
                          <td className="py-4 px-4 text-sm text-[#5B6773]">{device.modelName}</td>
                          <td className="py-4 px-4 text-sm font-mono font-semibold text-[#163A5F]">{device.serialNumber}</td>
                          <td className="py-4 px-4 text-sm font-semibold text-[#18212B]">{device.hospitalName}</td>
                          <td className="py-4 px-4 text-sm text-center text-[#5B6773]">{device.installationDate}</td>
                          <td className="py-4 px-4 text-sm text-center">
                            <span className={`font-semibold ${warrantyStatus.color}`}>
                              {warrantyStatus.label}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-[#5B6773]">{device.engineer}</td>
                          <td className="py-4 px-4 text-center">
                            <StatusBadge status={device.status} />
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
                                  setSelectedDevice(device);
                                  setIsInstallFormOpen(true);
                                }}
                              >
                                <Edit className="w-4 h-4 text-[#5B8DB8]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Service Cases Table */}
            {activeTab === 'cases' && (
              <div className="overflow-x-auto">
                {/* Mobile Card View */}
                <div className="lg:hidden p-4 space-y-3">
                  {filteredCases.map((serviceCase) => (
                    <div 
                      key={serviceCase.caseNumber}
                      className="border border-[#D7DEE6] rounded-lg p-4 hover:bg-[#F4F7FA] transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-xs font-bold text-[#163A5F] mb-1">{serviceCase.caseNumber}</p>
                          <p className="text-sm font-semibold text-[#18212B] mb-1">{serviceCase.hospitalName}</p>
                          <p className="text-xs text-[#5B6773]">{serviceCase.equipmentName}</p>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            serviceCase.priority === '긴급' ? 'bg-[#FCEBE9] text-[#B94A48]' :
                            serviceCase.priority === '높음' ? 'bg-[#FFF4E5] text-[#C58A2B]' :
                            serviceCase.priority === '보통' ? 'bg-[#E6F4EA] text-[#2E7D5B]' :
                            'bg-[#E8EEF3] text-[#5B6773]'
                          }`}>
                            {serviceCase.priority}
                          </span>
                          <StatusBadge status={serviceCase.status} />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3 pt-3 border-t border-[#D7DEE6]">
                        <div>
                          <p className="text-[10px] text-[#5B6773] mb-0.5">시리얼번호</p>
                          <p className="text-xs font-mono font-semibold text-[#163A5F]">{serviceCase.serialNumber}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#5B6773] mb-0.5">접수일</p>
                          <p className="text-xs text-[#18212B]">{serviceCase.caseDate}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[10px] text-[#5B6773] mb-0.5">증상</p>
                          <p className="text-xs text-[#18212B]">{serviceCase.symptoms}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[10px] text-[#5B6773] mb-0.5">담당기사</p>
                          <p className="text-xs text-[#18212B]">{serviceCase.engineer}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#F4F7FA] border border-[#D7DEE6] rounded-md text-sm text-[#5B6773] hover:bg-white transition-colors">
                          <Eye className="w-4 h-4" />
                          상세
                        </button>
                        <button 
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors text-sm"
                          onClick={() => {
                            setSelectedServiceCase(serviceCase);
                            setIsServiceFormOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                          수정
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <table className="w-full hidden lg:table">
                  <thead>
                    <tr className="border-b-2 border-[#D7DEE6] bg-[#163A5F]">
                      <th className="text-left py-4 px-4 text-sm font-bold text-white min-w-[120px]">접수번호</th>
                      <th className="text-center py-4 px-4 text-sm font-bold text-white min-w-[100px]">접수일</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-white min-w-[140px]">병원명</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-white min-w-[150px]">장비명</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-white min-w-[140px]">시리얼번호</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-white min-w-[200px]">증상</th>
                      <th className="text-center py-4 px-4 text-sm font-bold text-white min-w-[90px]">우선순위</th>
                      <th className="text-center py-4 px-4 text-sm font-bold text-white min-w-[100px]">처리상태</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-white min-w-[100px]">담당자</th>
                      <th className="text-center py-4 px-4 text-sm font-bold text-white min-w-[100px]">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCases.map((serviceCase) => (
                      <tr key={serviceCase.caseNumber} className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors">
                        <td className="py-4 px-4 text-sm font-semibold text-[#163A5F]">{serviceCase.caseNumber}</td>
                        <td className="py-4 px-4 text-sm text-center text-[#5B6773]">{serviceCase.caseDate}</td>
                        <td className="py-4 px-4 text-sm font-semibold text-[#18212B]">{serviceCase.hospitalName}</td>
                        <td className="py-4 px-4 text-sm text-[#5B6773]">{serviceCase.equipmentName}</td>
                        <td className="py-4 px-4 text-sm font-mono font-semibold text-[#163A5F]">{serviceCase.serialNumber}</td>
                        <td className="py-4 px-4 text-sm text-[#5B6773]">{serviceCase.symptoms}</td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            serviceCase.priority === '긴급' ? 'bg-[#FCEBE9] text-[#B94A48]' :
                            serviceCase.priority === '높음' ? 'bg-[#FFF4E5] text-[#C58A2B]' :
                            serviceCase.priority === '보통' ? 'bg-[#E6F4EA] text-[#2E7D5B]' :
                            'bg-[#E8EEF3] text-[#5B6773]'
                          }`}>
                            {serviceCase.priority}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <StatusBadge status={serviceCase.status} />
                        </td>
                        <td className="py-4 px-4 text-sm text-[#5B6773]">{serviceCase.engineer}</td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button className="p-1.5 hover:bg-[#E8EEF3] rounded transition-colors" title="상세보기">
                              <Eye className="w-4 h-4 text-[#5B6773]" />
                            </button>
                            <button 
                              className="p-1.5 hover:bg-[#E8EEF3] rounded transition-colors"
                              title="수정"
                              onClick={() => {
                                setSelectedServiceCase(serviceCase);
                                setIsServiceFormOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4 text-[#5B8DB8]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-[#D7DEE6] flex items-center justify-between bg-[#F4F7FA]">
              <p className="text-sm text-[#5B6773]">
                전체 {activeTab === 'devices' ? filteredDevices.length : filteredCases.length}개 항목
              </p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 border border-[#D7DEE6] rounded text-sm text-[#5B6773] hover:bg-white transition-colors">
                  이전
                </button>
                <button className="px-3 py-1.5 bg-[#163A5F] text-white rounded text-sm">1</button>
                <button className="px-3 py-1.5 border border-[#D7DEE6] rounded text-sm text-[#5B6773] hover:bg-white transition-colors">
                  2
                </button>
                <button className="px-3 py-1.5 border border-[#D7DEE6] rounded text-sm text-[#5B6773] hover:bg-white transition-colors">
                  다음
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Installation Form Modal */}
      <InstallationForm
        isOpen={isInstallFormOpen}
        onClose={() => {
          setIsInstallFormOpen(false);
          setSelectedDevice(null);
        }}
        onSubmit={handleInstallSubmit}
        initialData={selectedDevice}
      />

      {/* Service Case Form Side Drawer */}
      <ServiceCaseForm
        isOpen={isServiceFormOpen}
        onClose={() => {
          setIsServiceFormOpen(false);
          setSelectedServiceCase(null);
        }}
        onSubmit={handleServiceSubmit}
        initialData={selectedServiceCase}
      />

      {/* Service Detail Panel */}
      <ServiceDetailPanel
        isOpen={!!detailPanelCases}
        cases={detailPanelCases}
        title={detailPanelTitle}
        onClose={() => setDetailPanelCases(null)}
      />
    </div>
  );
}