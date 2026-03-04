import type { AmpValue, EvalContext } from '../types';
import { toString, toBoolean } from '../evaluator';

export const utilityFunctions: Record<string, (args: AmpValue[], ctx: EvalContext) => AmpValue> = {

  OUTPUT(args) {
    return toString(args[0]);
  },

  OUTPUTLINE(args) {
    return toString(args[0]) + '\n';
  },

  V(args) {
    return args[0] ?? null;
  },

  EMPTY(args) {
    const v = args[0];
    if (v === null || v === undefined) return true;
    if (typeof v === 'string') return v.trim() === '';
    return false;
  },

  ISNULL(args) {
    return args[0] === null || args[0] === undefined;
  },

  ISNULLDEFAULT(args) {
    const v = args[0];
    return (v === null || v === undefined) ? (args[1] ?? null) : v;
  },

  IIF(args) {
    return toBoolean(args[0]) ? (args[1] ?? null) : (args[2] ?? null);
  },

  ISEMAILADDRESS(args) {
    const email = toString(args[0]);
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  ISPHONENUMBER(args) {
    const phone = toString(args[0]);
    const digits = phone.replace(/[\s\-().+]/g, '');
    return /^\d{7,15}$/.test(digits);
  },

  ATTRIBUTEVALUE(args, ctx) {
    const key = toString(args[0]).toLowerCase();
    const found = Object.keys(ctx.subscriberAttributes).find(
      k => k.toLowerCase() === key
    );
    return found !== undefined ? ctx.subscriberAttributes[found] : null;
  },

  GUID(_args) {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  },

  RAISEERROR(args) {
    const msg = toString(args[0]);
    throw new Error(`RaiseError: ${msg}`);
  },

  TREATASCONTENT(args) {
    return toString(args[0]);
  },
};
