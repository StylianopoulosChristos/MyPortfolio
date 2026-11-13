import type { YearMonth } from '@content/types';

// Fixed English names (not Intl) so output is identical on every machine.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatMonth(value: YearMonth): string {
  const [year, month] = value.split('-');
  const name = MONTHS[Number(month) - 1];
  if (!name) throw new Error(`content/experience.ts: "${value}" is not a valid YYYY-MM month`);
  return `${name} ${year}`;
}

export function formatPeriod(start: YearMonth, end?: YearMonth | 'present'): string {
  if (!end) return formatMonth(start);
  return `${formatMonth(start)} – ${end === 'present' ? 'Present' : formatMonth(end)}`;
}
