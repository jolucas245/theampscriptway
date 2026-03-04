import type { AmpValue } from '../types';
import { toString } from '../evaluator';

export const httpFunctions: Record<string, (args: AmpValue[]) => AmpValue> = {

  // Retorna sempre false no playground — no SFMC detecta browsers CHTML (WAP)
  ISCHTMLBROWSER(_args) {
    return false;
  },

  // WrapLongURL(url, maxLength)
  // No SFMC, envolve URLs longas para evitar quebra em clientes de e-mail.
  // No playground, simplesmente retorna a URL — o comportamento real
  // depende do sistema de rastreamento do SFMC.
  WRAPLONGURL(args) {
    return toString(args[0]);
  },
};
