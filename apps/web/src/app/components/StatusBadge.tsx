interface StatusBadgeProps {
  status: string;
  type?: 'status' | 'priority' | 'payment';
}

export function StatusBadge({ status, type = 'status' }: StatusBadgeProps) {
  const getStatusStyle = () => {
    const lowerStatus = status.toLowerCase();
    
    // Payment status
    if (lowerStatus.includes('완료') || lowerStatus.includes('입금') || lowerStatus.includes('발행')) {
      return 'bg-[#2E7D5B] text-white';
    }
    if (lowerStatus.includes('미수') || lowerStatus.includes('미발행') || lowerStatus.includes('지연')) {
      return 'bg-[#B94A48] text-white';
    }
    if (lowerStatus.includes('진행') || lowerStatus.includes('대기') || lowerStatus.includes('예정')) {
      return 'bg-[#C58A2B] text-white';
    }
    if (lowerStatus.includes('정상') || lowerStatus.includes('승인')) {
      return 'bg-[#2E7D5B] text-white';
    }
    
    // Default
    return 'bg-[#5B8DB8] text-white';
  };
  
  return (
    <span className={`px-2.5 py-1 rounded text-xs font-semibold ${getStatusStyle()}`}>
      {status}
    </span>
  );
}
