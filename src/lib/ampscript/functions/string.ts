import type { ScalarValue } from '../types';
import { toString, toNumber } from '../evaluator';

export const stringFunctions: Record<string, (...args: ScalarValue[]) => ScalarValue> = {

  CONCAT(...args) {
    return args.map(a => toString(a)).join('');
  },

  UPPERCASE(str) {
    return toString(str).toUpperCase();
  },

  LOWERCASE(str) {
    return toString(str).toLowerCase();
  },

  PROPERCASE(str) {
    return toString(str).replace(/\b\w/g, c => c.toUpperCase());
  },

  TRIM(str) {
    return toString(str).trim();
  },

  LENGTH(str) {
    return toString(str).length;
  },

  SUBSTRING(str, start, length) {
    const s = toString(str);
    const startIdx = toNumber(start) - 1;
    if (length !== null && length !== undefined) {
      return s.substr(startIdx, toNumber(length));
    }
    return s.substring(startIdx);
  },

  INDEXOF(str, search) {
    const s = toString(str);
    const q = toString(search);
    const idx = s.toLowerCase().indexOf(q.toLowerCase());
    return idx === -1 ? 0 : idx + 1;
  },

  REPLACE(str, search, replacement) {
    const s = toString(str);
    const q = toString(search);
    const r = toString(replacement ?? '');
    return s.replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), r);
  },

  REPLACELIST(str, search, replacement, delimiter) {
    let s = toString(str);
    const delim = toString(delimiter ?? ',');
    const searches     = toString(search).split(delim);
    const replacements = toString(replacement).split(delim);
    for (let i = 0; i < searches.length; i++) {
      const from = searches[i] ?? '';
      const to   = replacements[i] ?? replacements[replacements.length - 1] ?? '';
      s = s.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), to);
    }
    return s;
  },

  REGEXMATCH(str, pattern) {
    try {
      return new RegExp(toString(pattern)).test(toString(str));
    } catch {
      return false;
    }
  },

  CHAR(code) {
    return String.fromCharCode(toNumber(code));
  },

  DOMAIN(email) {
    const e = toString(email);
    const at = e.indexOf('@');
    return at === -1 ? '' : e.substring(at + 1);
  },

  FORMAT(value, format) {
    const n = toNumber(value);
    const f = toString(format);
    try {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: (f.match(/0+$/) ?? [''])[0].length,
        maximumFractionDigits: (f.match(/0+$/) ?? [''])[0].length,
      }).format(n);
    } catch {
      return String(n);
    }
  },

  FORMATCURRENCY(value, locale?) {
    const n = toNumber(value);
    const l = locale ? toString(locale) : 'en-US';
    try {
      return new Intl.NumberFormat(l, { style: 'currency', currency: 'USD' }).format(n);
    } catch {
      return `$${n.toFixed(2)}`;
    }
  },

  FORMATNUMBER(value, decimals?) {
    const n = toNumber(value);
    const d = decimals != null ? toNumber(decimals) : 2;
    return n.toFixed(d);
  },

  URLENCODE(str) {
    return encodeURIComponent(toString(str));
  },

  STRINGTOHEX(str) {
    return Array.from(toString(str))
      .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
  },
};
