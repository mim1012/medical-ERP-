export function formatDate(iso: string): string {
  return iso.slice(0, 10)
}

export function getDaysUntilExpiry(date: string | null | undefined): number | null {
  if (!date) return null
  return Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

export function isThisMonth(iso: string): boolean {
  const d = new Date(iso)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
}

export function formatKRW(amount: number, options?: { abbreviate?: boolean }): string {
  if (options?.abbreviate) {
    if (amount >= 100_000_000) return `${(amount / 100_000_000).toFixed(1)}억`
    if (amount >= 10_000) return `${Math.floor(amount / 10_000)}만`
  }
  return amount.toLocaleString('ko-KR')
}
