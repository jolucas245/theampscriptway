import type { ScalarValue } from '../types';
import { toString, toNumber } from '../evaluator';

function parseDate(v: ScalarValue): Date {
  if (v instanceof Date) return v;
  if (typeof v === 'number') return new Date(v);
  const s = toString(v);
  if (!s) return new Date();
  const d = new Date(s);
  return isNaN(d.getTime()) ? new Date() : d;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

export const dateFunctions: Record<string, (...args: ScalarValue[]) => ScalarValue> = {

  NOW() {
    return new Date().toISOString();
  },

  GETSENDTIME() {
    return new Date().toISOString();
  },

  FORMATDATE(dateVal, format, _locale?) {
    const d = parseDate(dateVal);
    const fmt = toString(format);

    const pad = (n: number) => String(n).padStart(2, '0');
    const hours24 = d.getHours();
    const hours12 = hours24 % 12 || 12;
    const ampm = hours24 < 12 ? 'AM' : 'PM';

    return fmt.replace(
      /YYYY|YY|MMMM|MMM|MM|M|DDDD|DDD|DD|D|HH|hh|mm|ss/g,
      (token) => {
        switch (token) {
          case 'YYYY': return String(d.getFullYear());
          case 'YY':   return String(d.getFullYear()).slice(-2);
          case 'MMMM': return MONTH_NAMES[d.getMonth()];
          case 'MMM':  return MONTH_NAMES[d.getMonth()].slice(0, 3);
          case 'MM':   return pad(d.getMonth() + 1);
          case 'M':    return String(d.getMonth() + 1);
          case 'DDDD': return DAY_NAMES[d.getDay()];
          case 'DDD':  return DAY_NAMES[d.getDay()].slice(0, 3);
          case 'DD':   return pad(d.getDate());
          case 'D':    return String(d.getDate());
          case 'HH':   return pad(hours24);
          case 'hh':   return pad(hours12);
          case 'mm':   return pad(d.getMinutes());
          case 'ss':   return pad(d.getSeconds());
          default:     return token;
        }
      }
    )
      .replace(/TT/g,   ampm)
      .replace(/tt/g,   ampm.toLowerCase());
  },

  DATEADD(dateVal, amount, unit) {
    const d = new Date(parseDate(dateVal).getTime());
    const n = toNumber(amount);
    const u = toString(unit).toUpperCase();

    switch (u) {
      case 'Y':  d.setFullYear(d.getFullYear() + n); break;
      case 'M':  d.setMonth(d.getMonth() + n);       break;
      case 'D':  d.setDate(d.getDate() + n);         break;
      case 'H':  d.setHours(d.getHours() + n);       break;
      case 'MI': d.setMinutes(d.getMinutes() + n);   break;
      case 'S':  d.setSeconds(d.getSeconds() + n);   break;
      default: throw new Error(`DATEADD: unidade desconhecida "${unit}". Use Y, M, D, H, MI ou S`);
    }
    return d.toISOString();
  },

  DATEDIFF(dateA, dateB, unit) {
    const a = parseDate(dateA).getTime();
    const b = parseDate(dateB).getTime();
    const diffMs = b - a;
    const u = toString(unit).toUpperCase();

    switch (u) {
      case 'Y':  return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
      case 'M':  return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.44));
      case 'D':  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
      case 'H':  return Math.floor(diffMs / (1000 * 60 * 60));
      case 'MI': return Math.floor(diffMs / (1000 * 60));
      case 'S':  return Math.floor(diffMs / 1000);
      default: throw new Error(`DATEDIFF: unidade desconhecida "${unit}". Use Y, M, D, H, MI ou S`);
    }
  },

  DATEPART(dateVal, part) {
    const d = parseDate(dateVal);
    const p = toString(part).toUpperCase();

    switch (p) {
      case 'Y':  return d.getFullYear();
      case 'M':  return d.getMonth() + 1;
      case 'D':  return d.getDate();
      case 'H':  return d.getHours();
      case 'MI': return d.getMinutes();
      case 'S':  return d.getSeconds();
      case 'DW': return d.getDay() + 1;
      case 'DY': {
        const start = new Date(d.getFullYear(), 0, 0);
        return Math.floor((d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      }
      default: throw new Error(`DATEPART: parte desconhecida "${part}". Use Y, M, D, H, MI, S, DW ou DY`);
    }
  },

  DATEPARSE(str) {
    const d = new Date(toString(str));
    return isNaN(d.getTime()) ? null : d.toISOString();
  },

  STRINGTODATE(str) {
    return dateFunctions.DATEPARSE(str);
  },

  LOCALDATETOSYSTEMDATE(dateVal) {
    return parseDate(dateVal).toISOString();
  },

  SYSTEMDATETOLOCALDATE(dateVal) {
    return parseDate(dateVal).toISOString();
  },
};