import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Warehouse, 
  ArrowDownToLine, 
  ArrowUpFromLine,
  Wrench,
  FileText,
  Calculator,
  Receipt,
  Bell,
  Shield,
  ClipboardList,
  X
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";

interface SidebarProps {
  activeMenu: string;
  onMenuClick: (menu: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ activeMenu, onMenuClick, isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTheme } = useTheme();
  
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: '메인 홈', path: '/' },
    { id: 'clients', icon: Users, label: '거래처 관리', path: '/clients' },
    { id: 'products', icon: Package, label: '품목 관리', path: '/products' },
    { id: 'inventory', icon: Warehouse, label: '재고 관리', path: '/inventory' },
    { id: 'receiving', icon: ArrowDownToLine, label: '입고/발주 관리', path: '/receiving' },
    { id: 'shipping', icon: ArrowUpFromLine, label: '출고/판매 관리', path: '/shipping' },
    { id: 'service', icon: Wrench, label: '설치/A/S 관리', path: '/service' },
    { id: 'documents', icon: FileText, label: '문서 관리', path: '/documents' },
    { id: 'settlement', icon: Calculator, label: '정산 관리', path: '/settlement' },
    { id: 'invoice', icon: Receipt, label: '세금계산서 관리', path: '/invoice' },
    { id: 'alerts', icon: Bell, label: '알림 센터', path: '/alerts' },
    { id: 'users', icon: Shield, label: '사용자/권한 관리', path: '/users' },
    { id: 'logs', icon: ClipboardList, label: '로그/이력 관리', path: '/logs' },
  ];

  // URL에 따라 activeMenu 자동 동기화
  useEffect(() => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    if (currentItem && activeMenu !== currentItem.id) {
      onMenuClick(currentItem.id);
    }
  }, [location.pathname]);

  const handleMenuClick = (item: typeof menuItems[0]) => {
    onMenuClick(item.id);
    navigate(item.path);
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          w-64 h-screen text-white flex flex-col fixed left-0 top-0 z-50 transition-all duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ backgroundColor: currentTheme.sidebar }}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-md lg:hidden transition-colors"
          style={{ 
            backgroundColor: `${currentTheme.primary}20`,
            color: currentTheme.sidebarText 
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${currentTheme.primary}40`}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${currentTheme.primary}20`}
        >
          <X className="w-5 h-5" />
        </button>

        <div 
          className="px-6 py-6 border-b"
          style={{ 
            borderColor: `${currentTheme.primary}80`,
            color: currentTheme.sidebarText 
          }}
        >
          <h1 className="text-xl font-bold">의료기기 ERP</h1>
          <p className="text-sm mt-1 opacity-75">Medical Device System</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className={`w-full px-6 py-3 flex items-center gap-3 transition-all ${
                  isActive ? 'border-l-4' : ''
                }`}
                style={{
                  backgroundColor: isActive ? currentTheme.primary : 'transparent',
                  borderLeftColor: isActive ? currentTheme.secondary : 'transparent',
                  color: isActive ? currentTheme.sidebarText : `${currentTheme.sidebarText}CC`
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = `${currentTheme.primary}80`;
                    e.currentTarget.style.color = currentTheme.sidebarText;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = `${currentTheme.sidebarText}CC`;
                  }
                }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div 
          className="px-6 py-4 border-t"
          style={{ 
            borderColor: `${currentTheme.primary}80`,
            color: currentTheme.sidebarText 
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${currentTheme.primary}80` }}
            >
              <span className="text-sm font-semibold">관리</span>
            </div>
            <div>
              <p className="text-sm font-semibold">관리자</p>
              <p className="text-xs opacity-75">admin@company.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}