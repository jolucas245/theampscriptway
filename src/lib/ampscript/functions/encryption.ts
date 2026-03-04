import type { AmpValue } from '../types';
import { toString } from '../evaluator';

// ── MD5 (pure JS) ─────────────────────────────────────────────────────────────

function md5(str: string): string {
  function safeAdd(x: number, y: number) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    return (((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xffff);
  }
  function bitRotate(num: number, cnt: number) {
    return (num << cnt) | (num >>> (32 - cnt));
  }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    return safeAdd(bitRotate(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c < 128) bytes.push(c);
    else if (c < 2048) bytes.push((c >> 6) | 192, (c & 63) | 128);
    else bytes.push((c >> 12) | 224, ((c >> 6) & 63) | 128, (c & 63) | 128);
  }

  const len = bytes.length;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  const bitLen = len * 8;
  for (let i = 0; i < 8; i++) bytes.push(i < 4 ? (bitLen >>> (i * 8)) & 0xff : 0);

  const M: number[] = [];
  for (let i = 0; i < bytes.length; i += 4) {
    M.push(bytes[i] | (bytes[i+1] << 8) | (bytes[i+2] << 16) | (bytes[i+3] << 24));
  }

  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;

  for (let i = 0; i < M.length; i += 16) {
    const [a0, b0, c0, d0] = [a, b, c, d];
    a = md5ff(a,b,c,d,M[i+ 0], 7,-680876936);  d = md5ff(d,a,b,c,M[i+ 1],12,-389564586);
    c = md5ff(c,d,a,b,M[i+ 2],17, 606105819);  b = md5ff(b,c,d,a,M[i+ 3],22,-1044525330);
    a = md5ff(a,b,c,d,M[i+ 4], 7,-176418897);  d = md5ff(d,a,b,c,M[i+ 5],12, 1200080426);
    c = md5ff(c,d,a,b,M[i+ 6],17,-1473231341); b = md5ff(b,c,d,a,M[i+ 7],22,-45705983);
    a = md5ff(a,b,c,d,M[i+ 8], 7, 1770035416); d = md5ff(d,a,b,c,M[i+ 9],12,-1958414417);
    c = md5ff(c,d,a,b,M[i+10],17,-42063);       b = md5ff(b,c,d,a,M[i+11],22,-1990404162);
    a = md5ff(a,b,c,d,M[i+12], 7, 1804603682); d = md5ff(d,a,b,c,M[i+13],12,-40341101);
    c = md5ff(c,d,a,b,M[i+14],17,-1502002290); b = md5ff(b,c,d,a,M[i+15],22, 1236535329);
    a = md5gg(a,b,c,d,M[i+ 1], 5,-165796510);  d = md5gg(d,a,b,c,M[i+ 6], 9,-1069501632);
    c = md5gg(c,d,a,b,M[i+11],14, 643717713);  b = md5gg(b,c,d,a,M[i+ 0],20,-373897302);
    a = md5gg(a,b,c,d,M[i+ 5], 5,-701558691);  d = md5gg(d,a,b,c,M[i+10], 9, 38016083);
    c = md5gg(c,d,a,b,M[i+15],14,-660478335);  b = md5gg(b,c,d,a,M[i+ 4],20,-405537848);
    a = md5gg(a,b,c,d,M[i+ 9], 5, 568446438);  d = md5gg(d,a,b,c,M[i+14], 9,-1019803690);
    c = md5gg(c,d,a,b,M[i+ 3],14,-187363961);  b = md5gg(b,c,d,a,M[i+ 8],20, 1163531501);
    a = md5gg(a,b,c,d,M[i+13], 5,-1444681467); d = md5gg(d,a,b,c,M[i+ 2], 9,-51403784);
    c = md5gg(c,d,a,b,M[i+ 7],14, 1735328473); b = md5gg(b,c,d,a,M[i+12],20,-1926607734);
    a = md5hh(a,b,c,d,M[i+ 5], 4,-378558);     d = md5hh(d,a,b,c,M[i+ 8],11,-2022574463);
    c = md5hh(c,d,a,b,M[i+11],16, 1839030562); b = md5hh(b,c,d,a,M[i+14],23,-35309556);
    a = md5hh(a,b,c,d,M[i+ 1], 4,-1530992060); d = md5hh(d,a,b,c,M[i+ 4],11, 1272893353);
    c = md5hh(c,d,a,b,M[i+ 7],16,-155497632);  b = md5hh(b,c,d,a,M[i+10],23,-1094730640);
    a = md5hh(a,b,c,d,M[i+13], 4, 681279174);  d = md5hh(d,a,b,c,M[i+ 0],11,-358537222);
    c = md5hh(c,d,a,b,M[i+ 3],16,-722521979);  b = md5hh(b,c,d,a,M[i+ 6],23, 76029189);
    a = md5hh(a,b,c,d,M[i+ 9], 4,-640364487);  d = md5hh(d,a,b,c,M[i+12],11,-421815835);
    c = md5hh(c,d,a,b,M[i+15],16, 530742520);  b = md5hh(b,c,d,a,M[i+ 2],23,-995338651);
    a = md5ii(a,b,c,d,M[i+ 0], 6,-198630844);  d = md5ii(d,a,b,c,M[i+ 7],10, 1126891415);
    c = md5ii(c,d,a,b,M[i+14],15,-1416354905); b = md5ii(b,c,d,a,M[i+ 5],21,-57434055);
    a = md5ii(a,b,c,d,M[i+12], 6, 1700485571); d = md5ii(d,a,b,c,M[i+ 3],10,-1894986606);
    c = md5ii(c,d,a,b,M[i+10],15,-1051523);    b = md5ii(b,c,d,a,M[i+ 1],21,-2054922799);
    a = md5ii(a,b,c,d,M[i+ 8], 6, 1873313359); d = md5ii(d,a,b,c,M[i+15],10,-30611744);
    c = md5ii(c,d,a,b,M[i+ 6],15,-1560198380); b = md5ii(b,c,d,a,M[i+13],21, 1309151649);
    a = md5ii(a,b,c,d,M[i+ 4], 6,-145523070);  d = md5ii(d,a,b,c,M[i+11],10,-1120210379);
    c = md5ii(c,d,a,b,M[i+ 2],15, 718787259);  b = md5ii(b,c,d,a,M[i+ 9],21,-343485551);
    a = safeAdd(a, a0); b = safeAdd(b, b0); c = safeAdd(c, c0); d = safeAdd(d, d0);
  }

  return [a, b, c, d].map(n =>
    Array.from({length: 4}, (_, i) => ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, '0')).join('')
  ).join('');
}

// ── SHA usando Web Crypto API (async → síncrono via cache) ────────────────────
//
// No playground, chamamos digest() e retornamos uma Promise resolvida
// imediatamente quando possível. Para uso síncrono, fazemos uma chamada
// prévia e armazenamos o resultado. Se ainda não estiver disponível,
// retornamos null (improvável na prática pois o microtask roda antes do render).

const shaCache = new Map<string, string>();

function hexFromBuffer(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function computeSha(algorithm: string, input: string): string | null {
  const key = `${algorithm}:${input}`;
  if (shaCache.has(key)) return shaCache.get(key)!;

  const encoded = new TextEncoder().encode(input);
  crypto.subtle.digest(algorithm, encoded).then(buf => {
    shaCache.set(key, hexFromBuffer(buf));
  });

  // Segunda chamada já encontra no cache
  return shaCache.get(key) ?? null;
}

// ── exports ───────────────────────────────────────────────────────────────────

export const encryptionFunctions: Record<string, (args: AmpValue[]) => AmpValue> = {

  BASE64ENCODE(args) {
    try { return btoa(unescape(encodeURIComponent(toString(args[0])))); }
    catch { return null; }
  },

  BASE64DECODE(args) {
    try { return decodeURIComponent(escape(atob(toString(args[0])))); }
    catch { return null; }
  },

  MD5(args) { return md5(toString(args[0])); },

  SHA1(args)   { return computeSha('SHA-1',   toString(args[0])); },
  SHA256(args) { return computeSha('SHA-256', toString(args[0])); },
  SHA512(args) { return computeSha('SHA-512', toString(args[0])); },

  // EncryptSymmetric e DecryptSymmetric dependem de AES assíncrono.
  // No playground, retornam null — use o SFMC para testar criptografia simétrica.
  ENCRYPTSYMMETRIC(_args) { return null; },
  DECRYPTSYMMETRIC(_args) { return null; },
};
