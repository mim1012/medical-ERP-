import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  menuId: string;
}

export function PlaceholderPage({ title, description, menuId }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-[#F4F7FA]">
      <Sidebar activeMenu={menuId} onMenuClick={() => {}} />
      <Header />
      
      <main className="ml-64 pt-16">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#18212B] mb-2">{title}</h1>
            <p className="text-[#5B6773]">{description}</p>
          </div>

          <div className="bg-white rounded-lg border border-[#D7DEE6] shadow-sm p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-[#F4F7FA] rounded-full flex items-center justify-center mb-6">
                <Construction className="w-10 h-10 text-[#5B8DB8]" />
              </div>
              <h2 className="text-2xl font-bold text-[#18212B] mb-2">페이지 준비 중</h2>
              <p className="text-[#5B6773] mb-4">
                이 페이지는 현재 개발 중입니다.
              </p>
              <p className="text-sm text-[#5B6773]">
                곧 사용하실 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
