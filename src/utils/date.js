// Date helpers that work in the user's LOCAL timezone.
//
// `Date.prototype.toISOString()` always converts to UTC, and the JS `Date`
// constructor parses a plain "yyyy-mm-dd" string as UTC midnight too. Mixing
// those with local dates causes the displayed date to drift by a day for
// anyone not in the UTC timezone (e.g. "Today" showing yesterday's date for
// users ahead of UTC in the early hours, or showing tomorrow's date for
// users behind UTC). These helpers always operate on local date components
// instead, so "today" always means today wherever the user actually is.

// Format a Date as a local 'yyyy-mm-dd' key (NOT UTC).
export const toDateKey = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Parse a 'yyyy-mm-dd' key back into a local Date at local midnight
// (avoids the Date constructor's UTC-midnight parsing of date-only strings).
export const parseDateKey = (dateKey) => {
  if (!dateKey) return null
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}
