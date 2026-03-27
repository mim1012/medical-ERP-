import { Search, Bell, Settings, Menu, Home, Palette } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { ThemeSelector } from "./ThemeSelector";
import { useTheme } from "../contexts/ThemeContext";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const { currentTheme, setTheme } = useTheme();
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  return (
    <>
      <header className="h-16 bg-white border-b border-[#D7DEE6] flex items-center justify-between px-4 lg:px-8 fixed top-0 left-0 lg:left-64 right-0 z-30">
        {/* Mobile menu button */}
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-[#F4F7FA] rounded-md transition-colors lg:hidden"
        >
          <Menu className="w-6 h-6 text-[#5B6773]" />
        </button>

        {/* Home button (visible on desktop) */}
        <button 
          onClick={() => navigate('/')}
          className="p-2 hover:bg-[#F4F7FA] rounded-md transition-colors hidden lg:block"
          title="홈으로"
        >
          <Home className="w-5 h-5 text-[#5B8DB8]" />
        </button>

        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-xl hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5B6773]" />
            <input
              type="text"
              placeholder="거래처, 품목, 시리얼 번호 검색..."
              className="w-full pl-10 pr-4 py-2 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Theme Selector Button */}
          <button 
            onClick={() => setShowThemeSelector(true)}
            className="relative p-2 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 rounded-md transition-all group"
            title="디자인 테마 변경"
          >
            <Palette className="w-5 h-5 text-[#5B6773] group-hover:text-indigo-600 transition-colors" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full animate-pulse"></span>
          </button>

          <button className="relative p-2 hover:bg-[#F4F7FA] rounded-md transition-colors">
            <Bell className="w-5 h-5 text-[#5B6773]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#B94A48] rounded-full"></span>
          </button>
          
          <button className="p-2 hover:bg-[#F4F7FA] rounded-md transition-colors">
            <Settings className="w-5 h-5 text-[#5B6773]" />
          </button>
          
          <div className="w-px h-6 bg-[#D7DEE6] hidden lg:block"></div>
          
          <div className="items-center gap-2 hidden lg:flex">
            <span className="text-sm text-[#18212B]">2026년 3월 3일</span>
          </div>
        </div>
      </header>

      {/* Theme Selector Modal */}
      <ThemeSelector
        isOpen={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
        currentTheme={currentTheme}
        onThemeChange={(theme) => {
          setTheme(theme);
          setShowThemeSelector(false);
        }}
      />
    </>
  );
}