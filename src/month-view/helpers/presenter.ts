import { page, getLocale } from '../../dateutils';

const XDate = require('xdate');

function formatXDateToYYYYMMDD(xd: { getFullYear(): number; getMonth(): number; getDate(): number }): string {
  const y = xd.getFullYear();
  const m = xd.getMonth() + 1;
  const d = xd.getDate();
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/**
 * Get all dates for a month grid (including padding days from prev/next months).
 * Builds YYYY-MM-DD strings from XDate without Date/getCalendarDateString pipeline.
 */
export function getMonthDates(date: string, firstDayOfWeek: number = 0, showSixWeeks: boolean = true): string[] {
  const d = date ? new XDate(date) : new XDate();
  const dates = page(d, firstDayOfWeek, showSixWeeks);
  return dates.map((xd: any) => formatXDateToYYYYMMDD(xd));
}

/**
 * Get formatted month title (e.g., "February 2026")
 */
export function getMonthTitle(date: string): string {
  const d = date ? new XDate(date) : new XDate();
  const locale = getLocale();
  const monthNames = locale?.monthNames || [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthName = monthNames[d.getMonth()];
  const year = d.getFullYear();
  return `${monthName} ${year}`;
}

/**
 * Check if a date is in the given month (YYYY-MM-DD string comparison, no XDate)
 */
export function isDayInCurrentMonth(dayDate: string, monthDate: string): boolean {
  return dayDate.substring(0, 7) === monthDate.substring(0, 7);
}

/**
 * Get the first day of a month (YYYY-MM-DD string arithmetic, no XDate)
 */
export function getMonthStart(date: string): string {
  return date.substring(0, 8) + '01';
}

/**
 * Get month offset from a reference date (for pagination)
 */
export function getMonthOffset(referenceDate: string, targetDate: string): number {
  const ref = new XDate(referenceDate);
  const target = new XDate(targetDate);
  
  const yearDiff = target.getFullYear() - ref.getFullYear();
  const monthDiff = target.getMonth() - ref.getMonth();
  
  return yearDiff * 12 + monthDiff;
}

/**
 * Add months to a date
 */
export function addMonths(date: string, months: number): string {
  const d = new XDate(date);
  d.addMonths(months);
  return formatXDateToYYYYMMDD(d);
}

/**
 * Generate an array of month start dates centered around a given date
 */
export function generateMonthPages(centerDate: string, totalPages: number): string[] {
  const pages: string[] = [];
  const halfPages = Math.floor(totalPages / 2);
  
  for (let i = -halfPages; i < totalPages - halfPages; i++) {
    pages.push(addMonths(getMonthStart(centerDate), i));
  }
  
  return pages;
}

/**
 * Check if the current page index is near the edge of the pages array
 */
export function isNearEdge(pageIndex: number, totalPages: number, threshold: number): boolean {
  return pageIndex < threshold || pageIndex >= totalPages - threshold;
}
