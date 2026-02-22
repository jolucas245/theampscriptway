import type { AmpValue, EvalContext } from '../types';
import { stringFunctions } from './string';
import { mathFunctions } from './math';
import { dateFunctions } from './date';
import { utilityFunctions } from './utility';
import { dataExtensionFunctions } from './dataextension';

type PureFunction    = (...args: AmpValue[]) => AmpValue;
type ContextFunction = (args: AmpValue[], ctx: EvalContext) => AmpValue;

const pureFunctions: Record<string, PureFunction> = {
  ...stringFunctions,
  ...mathFunctions,
  ...dateFunctions,
};

const contextFunctions: Record<string, ContextFunction> = {
  ...utilityFunctions,
  ...dataExtensionFunctions,
};

export function callFunction(name: string, args: AmpValue[], ctx: EvalContext): AmpValue {
  const upper = name.toUpperCase();

  if (upper in contextFunctions) {
    return contextFunctions[upper](args, ctx);
  }

  if (upper in pureFunctions) {
    return pureFunctions[upper](...args);
  }

  throw new Error(`Unknown function: ${name}`);
}

export function getFunctionNames(): string[] {
  return [
    ...Object.keys(pureFunctions),
    ...Object.keys(contextFunctions),
  ].sort();
}