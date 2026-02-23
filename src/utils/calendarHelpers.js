const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export { DAY_NAMES, MONTH_NAMES }

/**
 * Get all days to display for a month view (including leading/trailing days from adjacent months).
 */
export function getMonthGrid(year, month) {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startDay = first.getDay()
  const daysInMonth = last.getDate()

  // Days from previous month
  const prevMonth = new Date(year, month, 0)
  const daysInPrevMonth = prevMonth.getDate()
  const leading = []
  for (let i = startDay - 1; i >= 0; i--) {
    leading.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    })
  }

  const current = []
  for (let d = 1; d <= daysInMonth; d++) {
    current.push({
      date: new Date(year, month, d),
      isCurrentMonth: true,
    })
  }

  const all = [...leading, ...current]
  const remainder = 42 - all.length // 6 rows * 7 days
  const trailing = []
  for (let d = 1; d <= remainder; d++) {
    trailing.push({
      date: new Date(year, month + 1, d),
      isCurrentMonth: false,
    })
  }

  return [...all, ...trailing]
}

/**
 * Get assignments for a specific date (YYYY-MM-DD).
 */
export function getAssignmentsForDate(assignments, date) {
  if (!assignments || assignments.length === 0) return []
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const key = `${y}-${m}-${d}`
  return assignments.filter((a) => a.due !== 'TBD' && a.due === key)
}

/**
 * Get the week containing the given date (Sun-Sat).
 */
export function getWeekContaining(date) {
  const d = new Date(date)
  const day = d.getDay()
  const start = new Date(d)
  start.setDate(d.getDate() - day)
  const days = []
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(start)
    dayDate.setDate(start.getDate() + i)
    days.push(dayDate)
  }
  return days
}

/**
 * Format date as YYYY-MM-DD.
 */
export function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
