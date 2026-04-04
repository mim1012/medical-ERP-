import { useState, useMemo } from "react";
import { useLogs } from "../../hooks/use-log";
import type { AuditLog } from "../../hooks/use-log";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { LogDetailPanel } from "../components/LogDetailPanel";
import {
  Search,
  Eye,
  FileText,
  Calendar,
  Users,
  Database,
} from "lucide-react";

export function LogHistory() {
  const [activeMenu, setActiveMenu] = useState('logs');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [resourceFilter, setResourceFilter] = useState('전체');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { data: logs = [], isLoading } = useLogs({
    from: dateFrom || undefined,
    to: dateTo || undefined,
  });

  const uniqueResources = useMemo(() => {
    const set = new Set(logs.map(l => l.resource));
    return Array.from(set).sort();
  }, [logs]);

  const today = new Date().toISOString().slice(0, 10);

  const filtered = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return logs.filter(l => {
      const matchesSearch =
        l.action.toLowerCase().includes(search) ||
        l.resource.toLowerCase().includes(search);
      const matchesResource = resourceFilter === '전체' || l.resource === resourceFilter;
      return matchesSearch && matchesResource;
    });
  }, [logs, searchTerm, resourceFilter]);

  const totalLogs = logs.length;
  const todayLogs = logs.filter(l => l.createdAt.startsWith(today)).length;
  const uniqueResourceCount = uniqueResources.length;
  const uniqueUserCount = useMemo(() => {
    return new Set(logs.map(l => l.userId).filter(Boolean)).size;
  }, [logs]);

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
            <h1 className="text-3xl font-bold text-[#18212B] mb-2">로그 이력</h1>
            <p className="text-[#5B6773]">시스템 작업 이력 추적 및 감사</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#5B6773] mb-1">총 로그</p>
                  <p className="text-3xl font-bold text-[#18212B]">{totalLogs}</p>
                  <p className="text-xs text-[#5B6773] mt-1">건</p>
                </div>
                <FileText className="w-9 h-9 text-[#163A5F] opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#5B6773] mb-1">오늘 로그</p>
                  <p className="text-3xl font-bold text-[#5B8DB8]">{todayLogs}</p>
                  <p className="text-xs text-[#5B6773] mt-1">건</p>
                </div>
                <Calendar className="w-9 h-9 text-[#5B8DB8] opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#5B6773] mb-1">리소스 종류</p>
                  <p className="text-3xl font-bold text-[#2E7D5B]">{uniqueResourceCount}</p>
                  <p className="text-xs text-[#5B6773] mt-1">종</p>
                </div>
                <Database className="w-9 h-9 text-[#2E7D5B] opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#5B6773] mb-1">활동 사용자</p>
                  <p className="text-3xl font-bold text-[#C58A2B]">{uniqueUserCount}</p>
                  <p className="text-xs text-[#5B6773] mt-1">명</p>
                </div>
                <Users className="w-9 h-9 text-[#C58A2B] opacity-20" />
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg border border-[#D7DEE6] shadow-sm">
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-[#D7DEE6]">
              <div className="flex flex-col gap-3">
                {/* Row 1: search + resource filter */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6773]" />
                    <input
                      type="text"
                      placeholder="action, resource 검색..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] w-56"
                    />
                  </div>

                  <select
                    value={resourceFilter}
                    onChange={e => setResourceFilter(e.target.value)}
                    className="px-3 py-2 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                  >
                    <option value="전체">전체 리소스</option>
                    {uniqueResources.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {/* Row 2: date range */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-[#5B6773]">기간</span>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={e => setDateFrom(e.target.value)}
                    className="px-3 py-2 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                  />
                  <span className="text-sm text-[#5B6773]">~</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={e => setDateTo(e.target.value)}
                    className="px-3 py-2 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                  />
                  {(dateFrom || dateTo) && (
                    <button
                      onClick={() => { setDateFrom(''); setDateTo(''); }}
                      className="text-xs text-[#5B6773] hover:text-[#B94A48] underline"
                    >
                      초기화
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-12 text-center text-[#5B6773]">로딩 중...</div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center text-[#5B6773]">로그가 없습니다.</div>
              ) : (
                <>
                  {/* Mobile Card View */}
                  <div className="lg:hidden p-4 space-y-3">
                    {filtered.map(log => (
                      <div
                        key={log.id}
                        className="border border-[#D7DEE6] rounded-lg p-4 hover:bg-[#F4F7FA] transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-bold text-[#18212B]">{log.action}</p>
                            <p className="text-xs text-[#5B6773]">{log.resource}</p>
                          </div>
                          <p className="text-xs font-mono text-[#5B6773]">{log.createdAt.slice(0, 10)}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-[#5B6773]">
                          <div>
                            <span className="text-[10px] uppercase">Resource ID</span>
                            <p className="font-mono truncate">{log.resourceId ? log.resourceId.slice(0, 12) + '...' : '-'}</p>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase">User ID</span>
                            <p className="font-mono truncate">{log.userId ? log.userId.slice(0, 12) + '...' : '-'}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-[#163A5F] text-white rounded-md text-sm hover:bg-[#0F2942] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          상세보기
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table */}
                  <table className="w-full hidden lg:table">
                    <thead>
                      <tr className="border-b-2 border-[#D7DEE6] bg-[#163A5F]">
                        <th className="text-left py-3 px-4 text-sm font-bold text-white min-w-[160px]">일시</th>
                        <th className="text-left py-3 px-4 text-sm font-bold text-white min-w-[130px]">액션</th>
                        <th className="text-left py-3 px-4 text-sm font-bold text-white min-w-[130px]">리소스</th>
                        <th className="text-left py-3 px-4 text-sm font-bold text-white min-w-[150px]">리소스 ID</th>
                        <th className="text-left py-3 px-4 text-sm font-bold text-white min-w-[150px]">사용자 ID</th>
                        <th className="text-center py-3 px-4 text-sm font-bold text-white min-w-[70px]">상세</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(log => (
                        <tr key={log.id} className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors">
                          <td className="py-3 px-4 text-xs text-[#5B6773] font-mono">
                            {log.createdAt.replace('T', ' ').slice(0, 19)}
                          </td>
                          <td className="py-3 px-4 text-sm font-semibold text-[#18212B]">{log.action}</td>
                          <td className="py-3 px-4 text-sm text-[#5B6773]">{log.resource}</td>
                          <td className="py-3 px-4 text-xs text-[#5B6773] font-mono">
                            {log.resourceId ? log.resourceId.slice(0, 16) + (log.resourceId.length > 16 ? '...' : '') : '-'}
                          </td>
                          <td className="py-3 px-4 text-xs text-[#5B6773] font-mono">
                            {log.userId ? log.userId.slice(0, 16) + (log.userId.length > 16 ? '...' : '') : '-'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => setSelectedLog(log)}
                              className="p-1.5 hover:bg-[#E8EEF3] rounded transition-colors"
                              title="상세보기"
                            >
                              <Eye className="w-4 h-4 text-[#5B8DB8]" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-[#D7DEE6] bg-[#F4F7FA]">
              <p className="text-sm text-[#5B6773]">전체 {filtered.length}건</p>
            </div>
          </div>
        </div>
      </main>

      {/* Log Detail Panel */}
      <LogDetailPanel
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        log={selectedLog}
      />
    </div>
  );
}
