import type { AmpValue, EvalContext } from '../types';
import { stringFunctions }        from './string';
import { mathFunctions }          from './math';
import { dateFunctions }          from './date';
import { utilityFunctions }       from './utility';
import { encryptionFunctions }    from './encryption';
import { contentFunctions }       from './content';
import { httpFunctions }          from './http';
import { sitesFunctions }         from './sites';
import { dataExtensionFunctions } from './dataextension';

type PureFunction = (...args: AmpValue[]) => AmpValue;
type ContextFunction = (args: AmpValue[], ctx: EvalContext) => AmpValue;

function wrapArrayFn(
  fn: (args: AmpValue[]) => AmpValue
): PureFunction {
  return (...args: AmpValue[]) => fn(args);
}

const pureFunctions: Record<string, PureFunction> = {
  ...stringFunctions,
  ...mathFunctions,
  ...dateFunctions,
  ...encryptionFunctions,
  ...Object.fromEntries(
    Object.entries(contentFunctions).map(([k, fn]) => [k, wrapArrayFn(fn)])
  ),
  ...Object.fromEntries(
    Object.entries(httpFunctions).map(([k, fn]) => [k, wrapArrayFn(fn)])
  ),
};

const contextFunctions: Record<string, ContextFunction> = {
  ...utilityFunctions,
  ...sitesFunctions,
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

  throw new Error(`Função desconhecida: ${name}()`);
}

export function getFunctionNames(): string[] {
  return [
    ...Object.keys(pureFunctions),
    ...Object.keys(contextFunctions),
  ].sort();
}
