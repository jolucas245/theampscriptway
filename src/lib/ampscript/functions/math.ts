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
    if (divisor === 0) throw new Error('DIVIDE: divisão por zero');
    return toNumber(a) / divisor;
  },

  MOD(a, b) {
    const divisor = toNumber(b);
    if (divisor === 0) throw new Error('MOD: divisão por zero');
    return toNumber(a) % divisor;
  },

  RANDOM(min?, max?) {
    if (min == null && max == null) return Math.random();
    const lo = toNumber(min);
    const hi = max != null ? toNumber(max) : lo;
    return Math.floor(Math.random() * (hi - lo + 1)) + lo;
  },
};
