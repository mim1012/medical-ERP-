import { X, Palette, Check } from "lucide-react";

export interface DesignTheme {
  id: number;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  border: string;
  sidebar: string;
  sidebarText: string;
  category: string;
  preview: string;
}

export const themes: DesignTheme[] = [
  // Original Medical Navy
  {
    id: 1,
    name: "메디컬 네이비",
    description: "전문적이고 신뢰감 있는 의료 전용 디자인",
    primary: "#163A5F",
    secondary: "#5B8DB8",
    accent: "#2E7D5B",
    background: "#F4F7FA",
    surface: "#FFFFFF",
    text: "#18212B",
    border: "#D7DEE6",
    sidebar: "#0F2942",
    sidebarText: "#FFFFFF",
    category: "클래식",
    preview: "기본"
  },
  
  // Dark Themes
  {
    id: 2,
    name: "다크 엘레강스",
    description: "눈의 피로를 줄이는 다크 모드",
    primary: "#1E293B",
    secondary: "#475569",
    accent: "#3B82F6",
    background: "#0F172A",
    surface: "#1E293B",
    text: "#F1F5F9",
    border: "#334155",
    sidebar: "#020617",
    sidebarText: "#F1F5F9",
    category: "다크",
    preview: "다크"
  },
  {
    id: 3,
    name: "미드나잇 블루",
    description: "깊은 밤하늘 같은 차분한 디자인",
    primary: "#1E3A8A",
    secondary: "#3B82F6",
    accent: "#60A5FA",
    background: "#0C1E3E",
    surface: "#1E293B",
    text: "#E0E7FF",
    border: "#1E40AF",
    sidebar: "#0A1628",
    sidebarText: "#E0E7FF",
    category: "다크",
    preview: "다크"
  },
  
  // Green Themes
  {
    id: 4,
    name: "메디컬 그린",
    description: "안정감 있는 메디컬 그린 컬러",
    primary: "#065F46",
    secondary: "#10B981",
    accent: "#34D399",
    background: "#F0FDF4",
    surface: "#FFFFFF",
    text: "#064E3B",
    border: "#D1FAE5",
    sidebar: "#064E3B",
    sidebarText: "#FFFFFF",
    category: "그린",
    preview: "그린"
  },
  {
    id: 5,
    name: "민트 프레시",
    description: "상쾌한 민트 톤의 경쾌한 디자인",
    primary: "#0D9488",
    secondary: "#14B8A6",
    accent: "#2DD4BF",
    background: "#F0FDFA",
    surface: "#FFFFFF",
    text: "#134E4A",
    border: "#CCFBF1",
    sidebar: "#115E59",
    sidebarText: "#FFFFFF",
    category: "그린",
    preview: "민트"
  },
  {
    id: 6,
    name: "에메랄드",
    description: "고급스러운 에메랄드 그린",
    primary: "#047857",
    secondary: "#059669",
    accent: "#10B981",
    background: "#ECFDF5",
    surface: "#FFFFFF",
    text: "#065F46",
    border: "#D1FAE5",
    sidebar: "#064E3B",
    sidebarText: "#FFFFFF",
    category: "그린",
    preview: "에메랄드"
  },
  
  // Purple Themes
  {
    id: 7,
    name: "로얄 퍼플",
    description: "프리미엄 느낌의 보라색 테마",
    primary: "#6B21A8",
    secondary: "#9333EA",
    accent: "#A855F7",
    background: "#FAF5FF",
    surface: "#FFFFFF",
    text: "#581C87",
    border: "#E9D5FF",
    sidebar: "#581C87",
    sidebarText: "#FFFFFF",
    category: "퍼플",
    preview: "퍼플"
  },
  {
    id: 8,
    name: "라벤더",
    description: "부드러운 라벤더 컬러",
    primary: "#7C3AED",
    secondary: "#8B5CF6",
    accent: "#A78BFA",
    background: "#F5F3FF",
    surface: "#FFFFFF",
    text: "#5B21B6",
    border: "#DDD6FE",
    sidebar: "#6D28D9",
    sidebarText: "#FFFFFF",
    category: "퍼플",
    preview: "라벤더"
  },
  {
    id: 9,
    name: "인디고",
    description: "현대적인 인디고 블루",
    primary: "#4338CA",
    secondary: "#6366F1",
    accent: "#818CF8",
    background: "#EEF2FF",
    surface: "#FFFFFF",
    text: "#3730A3",
    border: "#C7D2FE",
    sidebar: "#3730A3",
    sidebarText: "#FFFFFF",
    category: "퍼플",
    preview: "인디고"
  },
  
  // Orange & Red Themes
  {
    id: 10,
    name: "선셋 오렌지",
    description: "활기찬 오렌지 컬러",
    primary: "#C2410C",
    secondary: "#EA580C",
    accent: "#FB923C",
    background: "#FFF7ED",
    surface: "#FFFFFF",
    text: "#9A3412",
    border: "#FED7AA",
    sidebar: "#9A3412",
    sidebarText: "#FFFFFF",
    category: "웜",
    preview: "오렌지"
  },
  {
    id: 11,
    name: "코랄 핑크",
    description: "따뜻한 코랄 핑크",
    primary: "#BE123C",
    secondary: "#E11D48",
    accent: "#FB7185",
    background: "#FFF1F2",
    surface: "#FFFFFF",
    text: "#9F1239",
    border: "#FECDD3",
    sidebar: "#9F1239",
    sidebarText: "#FFFFFF",
    category: "웜",
    preview: "핑크"
  },
  {
    id: 12,
    name: "크림슨 레드",
    description: "강렬한 크림슨 레드",
    primary: "#991B1B",
    secondary: "#DC2626",
    accent: "#EF4444",
    background: "#FEF2F2",
    surface: "#FFFFFF",
    text: "#7F1D1D",
    border: "#FECACA",
    sidebar: "#7F1D1D",
    sidebarText: "#FFFFFF",
    category: "웜",
    preview: "레드"
  },
  
  // Blue Variants
  {
    id: 13,
    name: "스카이 블루",
    description: "맑은 하늘 같은 블루",
    primary: "#0369A1",
    secondary: "#0EA5E9",
    accent: "#38BDF8",
    background: "#F0F9FF",
    surface: "#FFFFFF",
    text: "#075985",
    border: "#BAE6FD",
    sidebar: "#075985",
    sidebarText: "#FFFFFF",
    category: "블루",
    preview: "스카이"
  },
  {
    id: 14,
    name: "오션 블루",
    description: "깊은 바다 같은 블루",
    primary: "#1E40AF",
    secondary: "#3B82F6",
    accent: "#60A5FA",
    background: "#EFF6FF",
    surface: "#FFFFFF",
    text: "#1E3A8A",
    border: "#BFDBFE",
    sidebar: "#1E3A8A",
    sidebarText: "#FFFFFF",
    category: "블루",
    preview: "오션"
  },
  {
    id: 15,
    name: "시안 블루",
    description: "생동감 있는 시안 컬러",
    primary: "#0E7490",
    secondary: "#06B6D4",
    accent: "#22D3EE",
    background: "#ECFEFF",
    surface: "#FFFFFF",
    text: "#164E63",
    border: "#A5F3FC",
    sidebar: "#164E63",
    sidebarText: "#FFFFFF",
    category: "블루",
    preview: "시안"
  },
  
  // Neutral & Professional
  {
    id: 16,
    name: "슬레이트 그레이",
    description: "차분한 슬레이트 그레이",
    primary: "#334155",
    secondary: "#475569",
    accent: "#64748B",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    text: "#1E293B",
    border: "#CBD5E1",
    sidebar: "#1E293B",
    sidebarText: "#FFFFFF",
    category: "뉴트럴",
    preview: "그레이"
  },
  {
    id: 17,
    name: "징크 프로",
    description: "전문가용 징크 컬러",
    primary: "#3F3F46",
    secondary: "#52525B",
    accent: "#71717A",
    background: "#FAFAFA",
    surface: "#FFFFFF",
    text: "#27272A",
    border: "#D4D4D8",
    sidebar: "#27272A",
    sidebarText: "#FFFFFF",
    category: "뉴트럴",
    preview: "징크"
  },
  {
    id: 18,
    name: "스톤 엘레강스",
    description: "우아한 스톤 톤",
    primary: "#44403C",
    secondary: "#57534E",
    accent: "#78716C",
    background: "#FAFAF9",
    surface: "#FFFFFF",
    text: "#292524",
    border: "#D6D3D1",
    sidebar: "#292524",
    sidebarText: "#FFFFFF",
    category: "뉴트럴",
    preview: "스톤"
  },
  
  // Warm Professional
  {
    id: 19,
    name: "앰버 골드",
    description: "따뜻한 앰버 골드",
    primary: "#92400E",
    secondary: "#D97706",
    accent: "#F59E0B",
    background: "#FFFBEB",
    surface: "#FFFFFF",
    text: "#78350F",
    border: "#FDE68A",
    sidebar: "#78350F",
    sidebarText: "#FFFFFF",
    category: "웜",
    preview: "골드"
  },
  {
    id: 20,
    name: "브라운 클래식",
    description: "클래식한 브라운",
    primary: "#713F12",
    secondary: "#92400E",
    accent: "#B45309",
    background: "#FEF3C7",
    surface: "#FFFFFF",
    text: "#78350F",
    border: "#FDE68A",
    sidebar: "#78350F",
    sidebarText: "#FFFFFF",
    category: "웜",
    preview: "브라운"
  },
  
  // Bright & Modern
  {
    id: 21,
    name: "라임 프레시",
    description: "산뜻한 라임 그린",
    primary: "#4D7C0F",
    secondary: "#65A30D",
    accent: "#84CC16",
    background: "#F7FEE7",
    surface: "#FFFFFF",
    text: "#3F6212",
    border: "#D9F99D",
    sidebar: "#3F6212",
    sidebarText: "#FFFFFF",
    category: "그린",
    preview: "라임"
  },
  {
    id: 22,
    name: "옐로우 선샤인",
    description: "밝은 옐로우 톤",
    primary: "#A16207",
    secondary: "#CA8A04",
    accent: "#EAB308",
    background: "#FEFCE8",
    surface: "#FFFFFF",
    text: "#854D0E",
    border: "#FEF08A",
    sidebar: "#854D0E",
    sidebarText: "#FFFFFF",
    category: "웜",
    preview: "옐로우"
  },
  
  // Cool Tones
  {
    id: 23,
    name: "퓨셔 핑크",
    description: "모던한 퓨셔 핑크",
    primary: "#A21CAF",
    secondary: "#C026D3",
    accent: "#D946EF",
    background: "#FAF5FF",
    surface: "#FFFFFF",
    text: "#86198F",
    border: "#F0ABFC",
    sidebar: "#86198F",
    sidebarText: "#FFFFFF",
    category: "퍼플",
    preview: "퓨셔"
  },
  {
    id: 24,
    name: "로즈 핑크",
    description: "우아한 로즈 핑크",
    primary: "#9F1239",
    secondary: "#BE123C",
    accent: "#E11D48",
    background: "#FFF1F2",
    surface: "#FFFFFF",
    text: "#881337",
    border: "#FECDD3",
    sidebar: "#881337",
    sidebarText: "#FFFFFF",
    category: "웜",
    preview: "로즈"
  },
  
  // High Contrast
  {
    id: 25,
    name: "하이 콘트라스트",
    description: "명확한 고대비 디자인",
    primary: "#000000",
    secondary: "#404040",
    accent: "#0066CC",
    background: "#FFFFFF",
    surface: "#F5F5F5",
    text: "#000000",
    border: "#CCCCCC",
    sidebar: "#000000",
    sidebarText: "#FFFFFF",
    category: "뉴트럴",
    preview: "흑백"
  },
  {
    id: 26,
    name: "다크 콘트라스트",
    description: "다크 고대비 모드",
    primary: "#FFFFFF",
    secondary: "#E0E0E0",
    accent: "#4A9EFF",
    background: "#121212",
    surface: "#1E1E1E",
    text: "#FFFFFF",
    border: "#404040",
    sidebar: "#000000",
    sidebarText: "#FFFFFF",
    category: "다크",
    preview: "다크 콘트라스트"
  },
  
  // Pastel Themes
  {
    id: 27,
    name: "파스텔 블루",
    description: "부드러운 파스텔 블루",
    primary: "#5B8FB9",
    secondary: "#8AB4D5",
    accent: "#A8D0E6",
    background: "#F0F7FB",
    surface: "#FFFFFF",
    text: "#2C5F7C",
    border: "#C9E0ED",
    sidebar: "#4A7C9D",
    sidebarText: "#FFFFFF",
    category: "파스텔",
    preview: "파스텔"
  },
  {
    id: 28,
    name: "파스텔 핑크",
    description: "사랑스러운 파스텔 핑크",
    primary: "#E07B9F",
    secondary: "#F0A0BC",
    accent: "#FFB6D2",
    background: "#FFF5F9",
    surface: "#FFFFFF",
    text: "#8F4A66",
    border: "#F7D3E0",
    sidebar: "#B8608B",
    sidebarText: "#FFFFFF",
    category: "파스텔",
    preview: "파스텔 핑크"
  },
  
  // Premium Themes
  {
    id: 29,
    name: "플래티넘",
    description: "프리미엄 플래티넘 실버",
    primary: "#5A6C7D",
    secondary: "#7A8E9E",
    accent: "#9BB0C1",
    background: "#F8F9FA",
    surface: "#FFFFFF",
    text: "#2C3E50",
    border: "#D0D8E0",
    sidebar: "#3D4F5F",
    sidebarText: "#FFFFFF",
    category: "프리미엄",
    preview: "플래티넘"
  },
  {
    id: 30,
    name: "샴페인 골드",
    description: "럭셔리 샴페인 골드",
    primary: "#9B8565",
    secondary: "#B8A17B",
    accent: "#D4BC92",
    background: "#FBF9F4",
    surface: "#FFFFFF",
    text: "#5C4F3B",
    border: "#E5DCC8",
    sidebar: "#7A6A4F",
    sidebarText: "#FFFFFF",
    category: "프리미엄",
    preview: "골드"
  }
];

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: DesignTheme;
  onThemeChange: (theme: DesignTheme) => void;
}

export function ThemeSelector({ isOpen, onClose, currentTheme, onThemeChange }: ThemeSelectorProps) {
  if (!isOpen) return null;

  const categories = Array.from(new Set(themes.map(t => t.category)));

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-6xl h-[85vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">디자인 테마 선택</h2>
              <p className="text-sm text-white/80">30가지 프리미엄 디자인 중 선택하세요</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {categories.map((category) => (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full" />
                {category} 테마
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {themes.filter(t => t.category === category).map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => onThemeChange(theme)}
                    className={`group relative p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                      currentTheme.id === theme.id
                        ? 'border-indigo-600 shadow-lg ring-2 ring-indigo-200'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    {/* Selected Badge */}
                    {currentTheme.id === theme.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}

                    {/* Color Preview */}
                    <div className="mb-3 rounded-lg overflow-hidden shadow-sm">
                      <div className="h-16 flex">
                        <div 
                          className="flex-1"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <div 
                          className="flex-1"
                          style={{ backgroundColor: theme.secondary }}
                        />
                        <div 
                          className="flex-1"
                          style={{ backgroundColor: theme.accent }}
                        />
                      </div>
                      <div className="h-8 flex items-center justify-center text-xs font-bold" style={{ backgroundColor: theme.background, color: theme.text }}>
                        {theme.preview}
                      </div>
                    </div>

                    {/* Theme Info */}
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-900 mb-1">{theme.name}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{theme.description}</p>
                    </div>

                    {/* Hover Effect */}
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
                      currentTheme.id === theme.id ? 'opacity-100' : ''
                    }`} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              현재 선택: <span className="font-bold text-gray-900">{currentTheme.name}</span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-bold shadow-md"
            >
              선택 완료
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
