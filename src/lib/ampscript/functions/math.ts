import type { ScalarValue } from '../types';
import { toNumber } from '../evaluator';

export const mathFunctions: Record<string, (...args: ScalarValue[]) => ScalarValue> = {

  ADD(a, b) {
    return toNumber(a) + toNumber(b);
  },

  SUBTRACT(a, b) {
    return toNumber(a) - toNumber(b);
  },

  MULTIPLY(a, b) {
    return toNumber(a) * toNumber(b);
  },

  DIVIDE(a, b) {
    const divisor = toNumber(b);
    if (divisor === 0) throw new Error('DIVIDE: division by zero');
    return toNumber(a) / divisor;
  },

  MOD(a, b) {
    const divisor = toNumber(b);
    if (divisor === 0) throw new Error('MOD: division by zero');
    return toNumber(a) % divisor;
  },

  ABS(a) {
    return Math.abs(toNumber(a));
  },

  CEILING(a) {
    return Math.ceil(toNumber(a));
  },

  FLOOR(a) {
    return Math.floor(toNumber(a));
  },

  ROUND(a, decimals?) {
    const n = toNumber(a);
    const d = decimals != null ? toNumber(decimals) : 0;
    const factor = Math.pow(10, d);
    return Math.round(n * factor) / factor;
  },

  SQRT(a) {
    const n = toNumber(a);
    if (n < 0) throw new Error('SQRT: cannot take square root of a negative number');
    return Math.sqrt(n);
  },

  POWER(base, exp) {
    return Math.pow(toNumber(base), toNumber(exp));
  },

  RANDOM(min?, max?) {
    if (min == null && max == null) {
      return Math.random();
    }
    const lo = toNumber(min);
    const hi = max != null ? toNumber(max) : lo;
    return Math.floor(Math.random() * (hi - lo + 1)) + lo;
  },

  MAX(...args) {
    if (args.length === 0) return null;
    return Math.max(...args.map(toNumber));
  },

  MIN(...args) {
    if (args.length === 0) return null;
    return Math.min(...args.map(toNumber));
  },
};