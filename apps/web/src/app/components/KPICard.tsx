import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'danger';
  onClick?: () => void;
}

export function KPICard({ title, value, subtitle, icon: Icon, trend, color = 'primary', onClick }: KPICardProps) {
  const colorClasses = {
    primary: 'text-[#5B8DB8] bg-[#E8EEF3]',
    success: 'text-[#2E7D5B] bg-[#E6F4EA]',
    warning: 'text-[#C58A2B] bg-[#FFF4E5]',
    danger: 'text-[#B94A48] bg-[#FCEBE9]',
  };

  const iconColorClasses = {
    primary: 'text-[#5B8DB8]',
    success: 'text-[#2E7D5B]',
    warning: 'text-[#C58A2B]',
    danger: 'text-[#B94A48]',
  };
  
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component 
      onClick={onClick}
      className={`bg-white rounded-lg border border-[#D7DEE6] p-3 shadow-sm ${onClick ? 'hover:shadow-md hover:border-[#5B8DB8] transition-all cursor-pointer text-left w-full' : ''}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${iconColorClasses[color]}`} />
            <p className="text-[10px] font-bold text-[#5B6773] uppercase tracking-wide truncate">{title}</p>
          </div>
          <p className={`text-xl font-bold leading-none mb-1 ${iconColorClasses[color]}`}>{value}</p>
          {subtitle && (
            <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${colorClasses[color]}`}>
              {subtitle}
            </span>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-1">
              <span className={`text-[10px] font-bold ${trend.isPositive ? 'text-[#2E7D5B]' : 'text-[#B94A48]'}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
            </div>
          )}
        </div>
      </div>
    </Component>
  );
}