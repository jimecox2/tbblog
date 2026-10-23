// Dates as "October 23, 2026" (UTC, so server and browser agree).
export const formatDate = iso =>
  iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }) : ''
