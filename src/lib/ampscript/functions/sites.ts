import type { AmpValue, EvalContext } from '../types';
import { toString } from '../evaluator';

function getQueryParam(name: string): string | null {
  try {
    const params = new URLSearchParams(
      typeof window !== 'undefined' ? window.location.search : ''
    );
    const lower = name.toLowerCase();
    for (const [key, value] of params.entries()) {
      if (key.toLowerCase() === lower) return value;
    }
    return null;
  } catch {
    return null;
  }
}

export const sitesFunctions: Record<string, (args: AmpValue[], ctx: EvalContext) => AmpValue> = {

  QUERYPARAMETER(args) {
    return getQueryParam(toString(args[0]));
  },

  REQUESTPARAMETER(args) {
    return getQueryParam(toString(args[0]));
  },
};
