import { LucideIcon } from "lucide-react";

interface AlertCardProps {
  title: string;
  count: number;
  description: string;
  icon: LucideIcon;
  severity: 'high' | 'medium' | 'low';
  onClick?: () => void;
}

export function AlertCard({ title, count, description, icon: Icon, severity, onClick }: AlertCardProps) {
  const severityColors = {
    high: 'border-[#B94A48] bg-[#FCEBE9]',
    medium: 'border-[#C58A2B] bg-[#FFF4E5]',
    low: 'border-[#5B8DB8] bg-[#E8EEF3]',
  };
  
  const iconColors = {
    high: 'text-[#B94A48]',
    medium: 'text-[#C58A2B]',
    low: 'text-[#5B8DB8]',
  };
  
  return (
    <button
      onClick={onClick}
      className={`bg-white rounded-lg border-l-4 ${severityColors[severity]} p-3 shadow-sm hover:shadow-md transition-all cursor-pointer text-left w-full`}
    >
      <div className="flex items-start gap-2">
        <Icon className={`w-4 h-4 flex-shrink-0 ${iconColors[severity]} mt-0.5`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5 mb-0.5">
            <h3 className="text-xs font-bold text-[#18212B] truncate">{title}</h3>
            <span className={`text-lg font-bold ${iconColors[severity]} flex-shrink-0`}>{count}</span>
          </div>
          <p className="text-[10px] text-[#5B6773] leading-snug">{description}</p>
        </div>
      </div>
    </button>
  );
}