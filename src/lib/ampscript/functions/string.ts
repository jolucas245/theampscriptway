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

  TRIMLEFT(str) {
    return toString(str).trimStart();
  },

  TRIMRIGHT(str) {
    return toString(str).trimEnd();
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

  REGEXMATCH(str, pattern) {
    try {
      return new RegExp(toString(pattern)).test(toString(str));
    } catch {
      return false;
    }
  },

  REGEXREPLACE(str, pattern, replacement) {
    try {
      return toString(str).replace(new RegExp(toString(pattern), 'g'), toString(replacement ?? ''));
    } catch {
      return toString(str);
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

  URLDECODE(str) {
    try {
      return decodeURIComponent(toString(str));
    } catch {
      return toString(str);
    }
  },

  STRINGTOHEX(str) {
    return Array.from(toString(str))
      .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
  },

  WRAPTEXT(str, maxLen) {
    const s = toString(str);
    const max = toNumber(maxLen);
    if (!max || s.length <= max) return s;
    const words = s.split(' ');
    const lines: string[] = [];
    let current = '';
    for (const word of words) {
      if ((current + ' ' + word).trim().length > max) {
        if (current) lines.push(current);
        current = word;
      } else {
        current = (current + ' ' + word).trim();
      }
    }
    if (current) lines.push(current);
    return lines.join('\n');
  },
};