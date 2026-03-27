import { X, FileText, DollarSign, TrendingUp } from "lucide-react";

interface AlertDetailProps {
  isOpen: boolean;
  onClose: () => void;
  alert: any;
  onUpdate: (data: any) => void;
}

export function AlertDetailPanel({ isOpen, onClose, alert, onUpdate }: AlertDetailProps) {
  if (!isOpen || !alert) return null;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    onUpdate({ ...alert, ...data });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case '긴급': return 'bg-[#FCEBE9] text-[#B94A48]';
      case '높음': return 'bg-[#FFF4E5] text-[#C58A2B]';
      case '보통': return 'bg-[#E8EEF3] text-[#5B8DB8]';
      case '낮음': return 'bg-[#F4F7FA] text-[#5B6773]';
      default: return 'bg-[#F4F7FA] text-[#5B6773]';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F]">
          <h2 className="text-xl font-bold text-white">알림 상세 및 조치</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleUpdate} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Alert Info */}
            <div className="bg-[#F4F7FA] border border-[#D7DEE6] rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#5B6773] mb-1">알림번호</p>
                  <p className="text-sm font-bold text-[#163A5F]">{alert.alertNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-[#5B6773] mb-1">알림유형</p>
                  <p className="text-sm font-semibold text-[#18212B]">{alert.type}</p>
                </div>
                <div>
                  <p className="text-xs text-[#5B6773] mb-1">발생일</p>
                  <p className="text-sm text-[#18212B]">{alert.issueDate}</p>
                </div>
                <div>
                  <p className="text-xs text-[#5B6773] mb-1">우선순위</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${getPriorityColor(alert.priority)}`}>
                    {alert.priority}
                  </span>
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <h3 className="text-base font-bold text-[#18212B] mb-3 pb-2 border-b-2 border-[#163A5F]">
                알림 내용
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-[#18212B] mb-1">제목</p>
                  <p className="text-sm text-[#5B6773]">{alert.title}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#18212B] mb-1">대상명</p>
                  <p className="text-sm text-[#5B6773]">{alert.target}</p>
                </div>
                {alert.relatedClient && (
                  <div>
                    <p className="text-sm font-semibold text-[#18212B] mb-1">관련 거래처</p>
                    <p className="text-sm text-[#5B6773]">{alert.relatedClient}</p>
                  </div>
                )}
                {alert.relatedProduct && (
                  <div>
                    <p className="text-sm font-semibold text-[#18212B] mb-1">관련 품목</p>
                    <p className="text-sm text-[#5B6773]">{alert.relatedProduct}</p>
                  </div>
                )}
                {alert.relatedNumber && (
                  <div>
                    <p className="text-sm font-semibold text-[#18212B] mb-1">관련번호</p>
                    <p className="text-sm text-[#5B8DB8] font-semibold">{alert.relatedNumber}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 세금계산서 미발행일 때 매출 상세 정보 표시 */}
            {alert.type === '세금계산서 미발행' && (
              <div>
                <h3 className="text-base font-bold text-[#18212B] mb-3 pb-2 border-b-2 border-[#163A5F] flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#2563EB]" />
                  이번 달 매출 상세
                </h3>

                {/* Summary */}
                <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-lg p-6 mb-6 text-white">
                  <p className="text-sm opacity-90 mb-2">총 매출액</p>
                  <p className="text-3xl font-bold mb-1">423,000,000원</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-[#16A34A] rounded text-xs font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      ↑ 23.5%
                    </span>
                    <span className="text-xs opacity-75">전월 대비 증가</span>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-[#18212B] mb-3">카테고리별 매출</h4>
                  <div className="space-y-3">
                    <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-[#1E293B]">의료기기</span>
                        <span className="text-sm font-bold text-[#0F172A]">298,500,000원</span>
                      </div>
                      <div className="w-full bg-[#E2E8F0] rounded-full h-2">
                        <div className="bg-[#2563EB] h-2 rounded-full" style={{ width: '70.6%' }}></div>
                      </div>
                      <p className="text-xs text-[#475569] mt-1">전체의 70.6%</p>
                    </div>

                    <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-[#1E293B]">의료 소모품</span>
                        <span className="text-sm font-bold text-[#0F172A]">124,500,000원</span>
                      </div>
                      <div className="w-full bg-[#E2E8F0] rounded-full h-2">
                        <div className="bg-[#16A34A] h-2 rounded-full" style={{ width: '29.4%' }}></div>
                      </div>
                      <p className="text-xs text-[#475569] mt-1">전체의 29.4%</p>
                    </div>
                  </div>
                </div>

                {/* Top Clients */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-[#18212B] mb-3">상위 거래처 (Top 5)</h4>
                  <div className="space-y-2">
                    {[
                      { name: '서울대병원', amount: 125000000, rank: 1 },
                      { name: '삼성서울병원', amount: 98000000, rank: 2 },
                      { name: '세브란스병원', amount: 87000000, rank: 3 },
                      { name: '아산병원', amount: 65000000, rank: 4 },
                      { name: '서울성모병원', amount: 48000000, rank: 5 },
                    ].map((client) => (
                      <div key={client.name} className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                        <div className="w-8 h-8 bg-[#0F172A] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">{client.rank}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-[#1E293B]">{client.name}</p>
                          <p className="text-xs text-[#475569]">{client.amount.toLocaleString()}원</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-[#DBEAFE] rounded-lg border-l-4 border-[#2563EB]">
                  <p className="text-sm text-[#1E40AF] font-semibold">
                    💡 세금계산서를 발행하여 매출을 정산하세요
                  </p>
                </div>
              </div>
            )}

            {/* Action Fields */}
            <div>
              <h3 className="text-base font-bold text-[#18212B] mb-3 pb-2 border-b-2 border-[#163A5F]">
                처리 정보
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#18212B] mb-2">
                      담당자 <span className="text-[#B94A48]">*</span>
                    </label>
                    <select
                      name="manager"
                      defaultValue={alert.manager || ''}
                      required
                      className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    >
                      <option value="">선택하세요</option>
                      <option value="이영업">이영업</option>
                      <option value="박운영">박운영</option>
                      <option value="최물류">최물류</option>
                      <option value="정서비스">정서비스</option>
                      <option value="강정산">강정산</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#18212B] mb-2">
                      조치기한
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      defaultValue={alert.deadline}
                      className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    처리 상태 <span className="text-[#B94A48]">*</span>
                  </label>
                  <select
                    name="status"
                    defaultValue={alert.status}
                    required
                    className="w-full px-4 py-2.5 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white"
                  >
                    <option value="미확인">미확인</option>
                    <option value="확인완료">확인완료</option>
                    <option value="처리중">처리중</option>
                    <option value="처리완료">처리완료</option>
                    <option value="보류">보류</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    조치내용
                  </label>
                  <textarea
                    name="actionNote"
                    defaultValue={alert.actionNote}
                    rows={4}
                    className="w-full px-4 py-3 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white resize-none text-sm"
                    placeholder="처리한 내용을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-2">
                    내부 메모
                  </label>
                  <textarea
                    name="internalMemo"
                    defaultValue={alert.internalMemo}
                    rows={3}
                    className="w-full px-4 py-3 border border-[#D7DEE6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] bg-white resize-none text-sm"
                    placeholder="내부 참고용 메모"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#D7DEE6] bg-[#F4F7FA] sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-[#D7DEE6] rounded-md text-[#5B6773] hover:bg-white transition-colors font-semibold"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors font-semibold"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}