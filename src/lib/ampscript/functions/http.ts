import type { AmpValue } from '../types';
import { toString } from '../evaluator';

export const httpFunctions: Record<string, (args: AmpValue[]) => AmpValue> = {

  ISCHTMLBROWSER(_args) {
    return false;
  },

  WRAPLONGURL(args) {
    return toString(args[0]);
  },
};
