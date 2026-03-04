import type { AmpValue, EvalContext } from '../types';
import { toString } from '../evaluator';

// No SFMC, QueryParameter e RequestParameter lêem parâmetros da URL da
// CloudPage ou landing page. No playground, lemos window.location.search
// para que o desenvolvedor possa testar passando ?param=valor na URL.

function getQueryParam(name: string): string | null {
  try {
    const params = new URLSearchParams(
      typeof window !== 'undefined' ? window.location.search : ''
    );
    // case-insensitive: procura ignorando caixa
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

  // QueryParameter("nomeDoParametro")
  // Retorna o valor do parâmetro de query string da URL atual.
  QUERYPARAMETER(args) {
    return getQueryParam(toString(args[0]));
  },

  // RequestParameter("nomeDoParametro")
  // No SFMC aceita tanto query string quanto POST body.
  // No playground, comportamento idêntico ao QueryParameter.
  REQUESTPARAMETER(args) {
    return getQueryParam(toString(args[0]));
  },
};
