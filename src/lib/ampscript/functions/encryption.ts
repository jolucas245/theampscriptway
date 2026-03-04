import type { AmpValue } from '../types';
import { toString } from '../evaluator';

// ── helpers ───────────────────────────────────────────────────────────────────

function strToBytes(str: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code < 128) {
      bytes.push(code);
    } else if (code < 2048) {
      bytes.push(0xC0 | (code >> 6), 0x80 | (code & 0x3F));
    } else {
      bytes.push(0xE0 | (code >> 12), 0x80 | ((code >> 6) & 0x3F), 0x80 | (code & 0x3F));
    }
  }
  return bytes;
}

function toHex(n: number, bytes = 4): string {
  return n.toString(16).padStart(bytes * 2, '0');
}

function rotLeft(n: number, s: number): number {
  return (n << s) | (n >>> (32 - s));
}

// ── MD5 (pure JS) ─────────────────────────────────────────────────────────────

function md5(input: string): string {
  function safe(x: number, y: number) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    return (((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xffff);
  }
  function rot(num: number, cnt: number) { return (num << cnt) | (num >>> (32 - cnt)); }
  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    return safe(rot(safe(safe(a, q), safe(x, t)), s), b);
  }
  const ff = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) =>
    cmn((b & c) | (~b & d), a, b, x, s, t);
  const gg = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) =>
    cmn((b & d) | (c & ~d), a, b, x, s, t);
  const hh = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) =>
    cmn(b ^ c ^ d, a, b, x, s, t);
  const ii = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) =>
    cmn(c ^ (b | ~d), a, b, x, s, t);

  const enc = unescape(encodeURIComponent(input));
  const len = enc.length;
  const nw  = (((len + 8) - ((len + 8) % 64)) / 64 + 1) * 16;
  const x: number[] = new Array(nw).fill(0);
  for (let i = 0; i < len; i++) x[i >> 2] |= enc.charCodeAt(i) << ((i % 4) * 8);
  x[len >> 2] |= 0x80 << ((len % 4) * 8);
  x[nw - 2] = len * 8;

  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
  for (let k = 0; k < x.length; k += 16) {
    const [A, B, C, D] = [a, b, c, d];
    a=ff(a,b,c,d,x[k],7,-680876936);      d=ff(d,a,b,c,x[k+1],12,-389564586);
    c=ff(c,d,a,b,x[k+2],17,606105819);    b=ff(b,c,d,a,x[k+3],22,-1044525330);
    a=ff(a,b,c,d,x[k+4],7,-176418897);    d=ff(d,a,b,c,x[k+5],12,1200080426);
    c=ff(c,d,a,b,x[k+6],17,-1473231341);  b=ff(b,c,d,a,x[k+7],22,-45705983);
    a=ff(a,b,c,d,x[k+8],7,1770035416);    d=ff(d,a,b,c,x[k+9],12,-1958414417);
    c=ff(c,d,a,b,x[k+10],17,-42063);      b=ff(b,c,d,a,x[k+11],22,-1990404162);
    a=ff(a,b,c,d,x[k+12],7,1804603682);   d=ff(d,a,b,c,x[k+13],12,-40341101);
    c=ff(c,d,a,b,x[k+14],17,-1502002290); b=ff(b,c,d,a,x[k+15],22,1236535329);
    a=gg(a,b,c,d,x[k+1],5,-165796510);    d=gg(d,a,b,c,x[k+6],9,-1069501632);
    c=gg(c,d,a,b,x[k+11],14,643717713);   b=gg(b,c,d,a,x[k],20,-373897302);
    a=gg(a,b,c,d,x[k+5],5,-701558691);    d=gg(d,a,b,c,x[k+10],9,38016083);
    c=gg(c,d,a,b,x[k+15],14,-660478335);  b=gg(b,c,d,a,x[k+4],20,-405537848);
    a=gg(a,b,c,d,x[k+9],5,568446438);     d=gg(d,a,b,c,x[k+14],9,-1019803690);
    c=gg(c,d,a,b,x[k+3],14,-187363961);   b=gg(b,c,d,a,x[k+8],20,1163531501);
    a=gg(a,b,c,d,x[k+13],5,-1444681467);  d=gg(d,a,b,c,x[k+2],9,-51403784);
    c=gg(c,d,a,b,x[k+7],14,1735328473);   b=gg(b,c,d,a,x[k+12],20,-1926607734);
    a=hh(a,b,c,d,x[k+5],4,-378558);       d=hh(d,a,b,c,x[k+8],11,-2022574463);
    c=hh(c,d,a,b,x[k+11],16,1839030562);  b=hh(b,c,d,a,x[k+14],23,-35309556);
    a=hh(a,b,c,d,x[k+1],4,-1530992060);   d=hh(d,a,b,c,x[k+4],11,1272893353);
    c=hh(c,d,a,b,x[k+7],16,-155497632);   b=hh(b,c,d,a,x[k+10],23,-1094730640);
    a=hh(a,b,c,d,x[k+13],4,681279174);    d=hh(d,a,b,c,x[k],11,-358537222);
    c=hh(c,d,a,b,x[k+3],16,-722521979);   b=hh(b,c,d,a,x[k+6],23,76029189);
    a=hh(a,b,c,d,x[k+9],4,-640364487);    d=hh(d,a,b,c,x[k+12],11,-421815835);
    c=hh(c,d,a,b,x[k+15],16,530742520);   b=hh(b,c,d,a,x[k+2],23,-995338651);
    a=ii(a,b,c,d,x[k],6,-198630844);      d=ii(d,a,b,c,x[k+7],10,1126891415);
    c=ii(c,d,a,b,x[k+14],15,-1416354905); b=ii(b,c,d,a,x[k+5],21,-57434055);
    a=ii(a,b,c,d,x[k+12],6,1700485571);   d=ii(d,a,b,c,x[k+3],10,-1894986606);
    c=ii(c,d,a,b,x[k+10],15,-1051523);    b=ii(b,c,d,a,x[k+1],21,-2054922799);
    a=ii(a,b,c,d,x[k+8],6,1873313359);    d=ii(d,a,b,c,x[k+15],10,-30611744);
    c=ii(c,d,a,b,x[k+6],15,-1560198380);  b=ii(b,c,d,a,x[k+13],21,1309151649);
    a=ii(a,b,c,d,x[k+4],6,-145523070);    d=ii(d,a,b,c,x[k+11],10,-1120210379);
    c=ii(c,d,a,b,x[k+2],15,718787259);    b=ii(b,c,d,a,x[k+9],21,-343485551);
    a=safe(a,A); b=safe(b,B); c=safe(c,C); d=safe(d,D);
  }
  const w = (v: number) =>
    Array.from({ length: 4 }, (_, i) => ('0' + ((v >> (i * 8)) & 0xff).toString(16)).slice(-2)).join('');
  return w(a) + w(b) + w(c) + w(d);
}

// ── SHA-1 (pure JS) ───────────────────────────────────────────────────────────

function sha1(str: string): string {
  const bytes = strToBytes(str);
  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (let i = 7; i >= 0; i--) bytes.push((bitLen / Math.pow(2, i * 8)) & 0xff);

  let h0 = 0x67452301, h1 = 0xEFCDAB89, h2 = 0x98BADCFE, h3 = 0x10325476, h4 = 0xC3D2E1F0;

  for (let i = 0; i < bytes.length; i += 64) {
    const w: number[] = [];
    for (let j = 0; j < 16; j++) {
      w[j] = (bytes[i + j * 4] << 24) | (bytes[i + j * 4 + 1] << 16) |
             (bytes[i + j * 4 + 2] << 8) | bytes[i + j * 4 + 3];
    }
    for (let j = 16; j < 80; j++) {
      w[j] = rotLeft(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
    }

    let [a, b, c, d, e] = [h0, h1, h2, h3, h4];
    for (let j = 0; j < 80; j++) {
      let f: number, k: number;
      if      (j < 20) { f = (b & c) | (~b & d); k = 0x5A827999; }
      else if (j < 40) { f = b ^ c ^ d;           k = 0x6ED9EBA1; }
      else if (j < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8F1BBCDC; }
      else             { f = b ^ c ^ d;           k = 0xCA62C1D6; }
      const tmp = (rotLeft(a, 5) + f + e + k + w[j]) | 0;
      e = d; d = c; c = rotLeft(b, 30); b = a; a = tmp;
    }
    h0 = (h0 + a) | 0; h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0; h3 = (h3 + d) | 0; h4 = (h4 + e) | 0;
  }
  return [h0, h1, h2, h3, h4].map(h => toHex(h >>> 0)).join('');
}

// ── SHA-256 (pure JS) ─────────────────────────────────────────────────────────

function sha256(str: string): string {
  const K = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2,
  ];
  const rotr = (n: number, s: number) => (n >>> s) | (n << (32 - s));

  const bytes = strToBytes(str);
  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (let i = 7; i >= 0; i--) bytes.push((bitLen / Math.pow(2, i * 8)) & 0xff);

  let [h0,h1,h2,h3,h4,h5,h6,h7] = [
    0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,
    0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19,
  ];

  for (let i = 0; i < bytes.length; i += 64) {
    const w: number[] = [];
    for (let j = 0; j < 16; j++) {
      w[j] = ((bytes[i+j*4]<<24)|(bytes[i+j*4+1]<<16)|(bytes[i+j*4+2]<<8)|bytes[i+j*4+3]) >>> 0;
    }
    for (let j = 16; j < 64; j++) {
      const s0 = rotr(w[j-15],7) ^ rotr(w[j-15],18) ^ (w[j-15]>>>3);
      const s1 = rotr(w[j-2],17) ^ rotr(w[j-2],19)  ^ (w[j-2]>>>10);
      w[j] = (w[j-16] + s0 + w[j-7] + s1) >>> 0;
    }
    let [a,b,c,d,e,f,g,h] = [h0,h1,h2,h3,h4,h5,h6,h7];
    for (let j = 0; j < 64; j++) {
      const S1  = rotr(e,6)  ^ rotr(e,11) ^ rotr(e,25);
      const ch  = (e & f) ^ (~e & g);
      const t1  = (h + S1 + ch + K[j] + w[j]) >>> 0;
      const S0  = rotr(a,2)  ^ rotr(a,13) ^ rotr(a,22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2  = (S0 + maj) >>> 0;
      h=g; g=f; f=e; e=(d+t1)>>>0; d=c; c=b; b=a; a=(t1+t2)>>>0;
    }
    h0=(h0+a)>>>0; h1=(h1+b)>>>0; h2=(h2+c)>>>0; h3=(h3+d)>>>0;
    h4=(h4+e)>>>0; h5=(h5+f)>>>0; h6=(h6+g)>>>0; h7=(h7+h)>>>0;
  }
  return [h0,h1,h2,h3,h4,h5,h6,h7].map(h => toHex(h)).join('');
}

// ── SHA-512 (pure JS) ─────────────────────────────────────────────────────────

function sha512(str: string): string {
  // SHA-512 usa aritmética de 64-bit — simulamos com pares de 32-bit [hi, lo]
  type U64 = [number, number];
  const add64 = (a: U64, b: U64): U64 => {
    const lo = (a[1] + b[1]) >>> 0;
    const hi = (a[0] + b[0] + (lo < a[1] ? 1 : 0)) >>> 0;
    return [hi, lo];
  };
  const rotr64 = (x: U64, n: number): U64 => n < 32
    ? [((x[0] >>> n) | (x[1] << (32 - n))) >>> 0, ((x[1] >>> n) | (x[0] << (32 - n))) >>> 0]
    : [((x[1] >>> (n - 32)) | (x[0] << (64 - n))) >>> 0, ((x[0] >>> (n - 32)) | (x[1] << (64 - n))) >>> 0];
  const shr64  = (x: U64, n: number): U64 => n < 32
    ? [(x[0] >>> n) >>> 0, ((x[1] >>> n) | (x[0] << (32 - n))) >>> 0]
    : [0, (x[0] >>> (n - 32)) >>> 0];
  const xor64  = (a: U64, b: U64): U64 => [(a[0] ^ b[0]) >>> 0, (a[1] ^ b[1]) >>> 0];
  const and64  = (a: U64, b: U64): U64 => [(a[0] & b[0]) >>> 0, (a[1] & b[1]) >>> 0];
  const not64  = (a: U64): U64 => [(~a[0]) >>> 0, (~a[1]) >>> 0];

  const K: U64[] = [
    [0x428a2f98,0xd728ae22],[0x71374491,0x23ef65cd],[0xb5c0fbcf,0xec4d3b2f],[0xe9b5dba5,0x8189dbbc],
    [0x3956c25b,0xf348b538],[0x59f111f1,0xb605d019],[0x923f82a4,0xaf194f9b],[0xab1c5ed5,0xda6d8118],
    [0xd807aa98,0xa3030242],[0x12835b01,0x45706fbe],[0x243185be,0x4ee4b28c],[0x550c7dc3,0xd5ffb4e2],
    [0x72be5d74,0xf27b896f],[0x80deb1fe,0x3b1696b1],[0x9bdc06a7,0x25c71235],[0xc19bf174,0xcf692694],
    [0xe49b69c1,0x9ef14ad2],[0xefbe4786,0x384f25e3],[0x0fc19dc6,0x8b8cd5b5],[0x240ca1cc,0x77ac9c65],
    [0x2de92c6f,0x592b0275],[0x4a7484aa,0x6ea6e483],[0x5cb0a9dc,0xbd41fbd4],[0x76f988da,0x831153b5],
    [0x983e5152,0xee66dfab],[0xa831c66d,0x2db43210],[0xb00327c8,0x98fb213f],[0xbf597fc7,0xbeef0ee4],
    [0xc6e00bf3,0x3da88fc2],[0xd5a79147,0x930aa725],[0x06ca6351,0xe003826f],[0x14292967,0x0a0e6e70],
    [0x27b70a85,0x46d22ffc],[0x2e1b2138,0x5c26c926],[0x4d2c6dfc,0x5ac42aed],[0x53380d13,0x9d95b3df],
    [0x650a7354,0x8baf63de],[0x766a0abb,0x3c77b2a8],[0x81c2c92e,0x47edaee6],[0x92722c85,0x1482353b],
    [0xa2bfe8a1,0x4cf10364],[0xa81a664b,0xbc423001],[0xc24b8b70,0xd0f89791],[0xc76c51a3,0x0654be30],
    [0xd192e819,0xd6ef5218],[0xd6990624,0x5565a910],[0xf40e3585,0x5771202a],[0x106aa070,0x32bbd1b8],
    [0x19a4c116,0xb8d2d0c8],[0x1e376c08,0x5141ab53],[0x2748774c,0xdf8eeb99],[0x34b0bcb5,0xe19b48a8],
    [0x391c0cb3,0xc5c95a63],[0x4ed8aa4a,0xe3418acb],[0x5b9cca4f,0x7763e373],[0x682e6ff3,0xd6b2b8a3],
    [0x748f82ee,0x5defb2fc],[0x78a5636f,0x43172f60],[0x84c87814,0xa1f0ab72],[0x8cc70208,0x1a6439ec],
    [0x90befffa,0x23631e28],[0xa4506ceb,0xde82bde9],[0xbef9a3f7,0xb2c67915],[0xc67178f2,0xe372532b],
    [0xca273ece,0xea26619c],[0xd186b8c7,0x21c0c207],[0xeada7dd6,0xcde0eb1e],[0xf57d4f7f,0xee6ed178],
    [0x06f067aa,0x72176fba],[0x0a637dc5,0xa2c898a6],[0x113f9804,0xbef90dae],[0x1b710b35,0x131c471b],
    [0x28db77f5,0x23047d84],[0x32caab7b,0x40c72493],[0x3c9ebe0a,0x15c9bebc],[0x431d67c4,0x9c100d4c],
    [0x4cc5d4be,0xcb3e42b6],[0x597f299c,0xfc657e2a],[0x5fcb6fab,0x3ad6faec],[0x6c44198c,0x4a475817],
  ];

  const bytes = strToBytes(str);
  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 128 !== 112) bytes.push(0);
  // 128-bit length (we only use lower 64 bits)
  for (let i = 0; i < 8; i++) bytes.push(0);
  for (let i = 7; i >= 0; i--) bytes.push((bitLen / Math.pow(2, i * 8)) & 0xff);

  let [h0,h1,h2,h3,h4,h5,h6,h7]: U64[] = [
    [0x6a09e667,0xf3bcc908],[0xbb67ae85,0x84caa73b],[0x3c6ef372,0xfe94f82b],[0xa54ff53a,0x5f1d36f1],
    [0x510e527f,0xade682d1],[0x9b05688c,0x2b3e6c1f],[0x1f83d9ab,0xfb41bd6b],[0x5be0cd19,0x137e2179],
  ];

  for (let i = 0; i < bytes.length; i += 128) {
    const w: U64[] = [];
    for (let j = 0; j < 16; j++) {
      const o = i + j * 8;
      w[j] = [
        ((bytes[o]<<24)|(bytes[o+1]<<16)|(bytes[o+2]<<8)|bytes[o+3]) >>> 0,
        ((bytes[o+4]<<24)|(bytes[o+5]<<16)|(bytes[o+6]<<8)|bytes[o+7]) >>> 0,
      ];
    }
    for (let j = 16; j < 80; j++) {
      const s0 = xor64(xor64(rotr64(w[j-15],1), rotr64(w[j-15],8)), shr64(w[j-15],7));
      const s1 = xor64(xor64(rotr64(w[j-2],19), rotr64(w[j-2],61)), shr64(w[j-2],6));
      w[j] = add64(add64(w[j-16], s0), add64(w[j-7], s1));
    }

    let [a,b,c,d,e,f,g,h] = [h0,h1,h2,h3,h4,h5,h6,h7];
    for (let j = 0; j < 80; j++) {
      const S1  = xor64(xor64(rotr64(e,14), rotr64(e,18)), rotr64(e,41));
      const ch  = xor64(and64(e,f), and64(not64(e),g));
      const t1  = add64(add64(h, S1), add64(ch, add64(K[j], w[j])));
      const S0  = xor64(xor64(rotr64(a,28), rotr64(a,34)), rotr64(a,39));
      const maj = xor64(xor64(and64(a,b), and64(a,c)), and64(b,c));
      const t2  = add64(S0, maj);
      h=g; g=f; f=e; e=add64(d,t1); d=c; c=b; b=a; a=add64(t1,t2);
    }
    h0=add64(h0,a); h1=add64(h1,b); h2=add64(h2,c); h3=add64(h3,d);
    h4=add64(h4,e); h5=add64(h5,f); h6=add64(h6,g); h7=add64(h7,h);
  }

  return [h0,h1,h2,h3,h4,h5,h6,h7]
    .map(([hi,lo]) => toHex(hi) + toHex(lo))
    .join('');
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

  MD5(args)    { return md5(toString(args[0])); },
  SHA1(args)   { return sha1(toString(args[0])); },
  SHA256(args) { return sha256(toString(args[0])); },
  SHA512(args) { return sha512(toString(args[0])); },
};

// ── EncryptSymmetric / DecryptSymmetric ───────────────────────────────────────
//
// Assinatura AMPScript:
//   EncryptSymmetric(plaintext, 'AES', @null, @key, @null, @IV)
//   DecryptSymmetric(ciphertext, 'AES', @null, @key, @null, @IV)
//
// O playground implementa AES-CBC em pure JS. A chave e o IV devem ser
// strings — elas são convertidas para blocos de 16 bytes (padding com zeros).
// O resultado é retornado em Base64.
//
// ⚠️ Esta implementação é para fins educacionais no playground.
//    No SFMC, use EncryptSymmetric com chaves gerenciadas pela plataforma.

function padTo16(str: string): number[] {
  const bytes = strToBytes(str);
  const padded = new Array(16).fill(0);
  for (let i = 0; i < Math.min(bytes.length, 16); i++) padded[i] = bytes[i];
  return padded;
}

// AES S-Box e tabelas de suporte
const SBOX = [
  0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
  0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
  0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
  0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
  0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
  0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
  0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
  0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
  0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
  0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
  0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
  0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
  0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
  0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
  0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
  0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16,
];

const RSBOX = new Array(256);
for (let i = 0; i < 256; i++) RSBOX[SBOX[i]] = i;

const RCON = [0,0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1b,0x36];

function xtime(a: number) { return ((a << 1) ^ ((a & 0x80) ? 0x1b : 0)) & 0xff; }
function mul(a: number, b: number) {
  return ((b & 1) ? a : 0) ^
    ((b >> 1 & 1) ? xtime(a) : 0) ^
    ((b >> 2 & 1) ? xtime(xtime(a)) : 0) ^
    ((b >> 3 & 1) ? xtime(xtime(xtime(a))) : 0) ^
    ((b >> 4 & 1) ? xtime(xtime(xtime(xtime(a)))) : 0);
}

type State = number[][];

function keyExpansion(key: number[]): number[][] {
  const Nk = 4, Nr = 10;
  const w: number[][] = [];
  for (let i = 0; i < Nk; i++) {
    w[i] = [key[4*i], key[4*i+1], key[4*i+2], key[4*i+3]];
  }
  for (let i = Nk; i < 4 * (Nr + 1); i++) {
    let temp = [...w[i-1]];
    if (i % Nk === 0) {
      temp = [SBOX[temp[1]] ^ RCON[i/Nk], SBOX[temp[2]], SBOX[temp[3]], SBOX[temp[0]]];
    }
    w[i] = w[i-Nk].map((b, j) => b ^ temp[j]);
  }
  return w;
}

function addRoundKey(state: State, w: number[][], round: number) {
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++)
      state[r][c] ^= w[round*4+c][r];
}

function subBytes(state: State) {
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) state[r][c] = SBOX[state[r][c]];
}
function invSubBytes(state: State) {
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) state[r][c] = RSBOX[state[r][c]];
}

function shiftRows(state: State) {
  for (let r = 1; r < 4; r++) {
    const tmp = [...state[r]];
    for (let c = 0; c < 4; c++) state[r][c] = tmp[(c + r) % 4];
  }
}
function invShiftRows(state: State) {
  for (let r = 1; r < 4; r++) {
    const tmp = [...state[r]];
    for (let c = 0; c < 4; c++) state[r][c] = tmp[(c - r + 4) % 4];
  }
}

function mixColumns(state: State) {
  for (let c = 0; c < 4; c++) {
    const s = state.map(r => r[c]);
    state[0][c] = mul(s[0],2) ^ mul(s[1],3) ^ s[2] ^ s[3];
    state[1][c] = s[0] ^ mul(s[1],2) ^ mul(s[2],3) ^ s[3];
    state[2][c] = s[0] ^ s[1] ^ mul(s[2],2) ^ mul(s[3],3);
    state[3][c] = mul(s[0],3) ^ s[1] ^ s[2] ^ mul(s[3],2);
  }
}
function invMixColumns(state: State) {
  for (let c = 0; c < 4; c++) {
    const s = state.map(r => r[c]);
    state[0][c] = mul(s[0],14) ^ mul(s[1],11) ^ mul(s[2],13) ^ mul(s[3],9);
    state[1][c] = mul(s[0],9)  ^ mul(s[1],14) ^ mul(s[2],11) ^ mul(s[3],13);
    state[2][c] = mul(s[0],13) ^ mul(s[1],9)  ^ mul(s[2],14) ^ mul(s[3],11);
    state[3][c] = mul(s[0],11) ^ mul(s[1],13) ^ mul(s[2],9)  ^ mul(s[3],14);
  }
}

function aesEncryptBlock(block: number[], w: number[][]): number[] {
  const state: State = [[],[],[],[]];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) state[r][c] = block[r + 4*c];
  addRoundKey(state, w, 0);
  for (let round = 1; round <= 10; round++) {
    subBytes(state); shiftRows(state);
    if (round < 10) mixColumns(state);
    addRoundKey(state, w, round);
  }
  const out: number[] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) out[r + 4*c] = state[r][c];
  return out;
}

function aesDecryptBlock(block: number[], w: number[][]): number[] {
  const state: State = [[],[],[],[]];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) state[r][c] = block[r + 4*c];
  addRoundKey(state, w, 10);
  for (let round = 9; round >= 0; round--) {
    invShiftRows(state); invSubBytes(state);
    addRoundKey(state, w, round);
    if (round > 0) invMixColumns(state);
  }
  const out: number[] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) out[r + 4*c] = state[r][c];
  return out;
}

function aesCBCEncrypt(plaintext: string, keyStr: string, ivStr: string): string {
  const key    = padTo16(keyStr);
  const iv     = padTo16(ivStr);
  const w      = keyExpansion(key);
  const bytes  = strToBytes(plaintext);

  // PKCS#7 padding
  const pad    = 16 - (bytes.length % 16);
  for (let i = 0; i < pad; i++) bytes.push(pad);

  const result: number[] = [];
  let prev = iv;

  for (let i = 0; i < bytes.length; i += 16) {
    const block = bytes.slice(i, i + 16).map((b, j) => b ^ prev[j]);
    prev = aesEncryptBlock(block, w);
    result.push(...prev);
  }
  return btoa(String.fromCharCode(...result));
}

function aesCBCDecrypt(cipherB64: string, keyStr: string, ivStr: string): string {
  const key     = padTo16(keyStr);
  const iv      = padTo16(ivStr);
  const w       = keyExpansion(key);
  const bytes   = Array.from(atob(cipherB64)).map(c => c.charCodeAt(0));
  const result: number[] = [];
  let prev = iv;

  for (let i = 0; i < bytes.length; i += 16) {
    const block    = bytes.slice(i, i + 16);
    const dec      = aesDecryptBlock(block, w).map((b, j) => b ^ prev[j]);
    prev = block;
    result.push(...dec);
  }

  // Remover padding PKCS#7
  const pad = result[result.length - 1];
  const unpadded = result.slice(0, result.length - pad);
  return new TextDecoder().decode(new Uint8Array(unpadded));
}

// Adicionar ao objeto exportado
Object.assign(encryptionFunctions, {

  // EncryptSymmetric(plaintext, 'AES', null, key, null, IV)
  ENCRYPTSYMMETRIC(args: AmpValue[]): AmpValue {
    const plaintext = toString(args[0]);
    // args[1] = cipher ('AES'), args[2] = null, args[3] = key, args[4] = null, args[5] = IV
    const key = toString(args[3] ?? '');
    const iv  = toString(args[5] ?? '');
    try {
      return aesCBCEncrypt(plaintext, key, iv);
    } catch {
      return null;
    }
  },

  // DecryptSymmetric(ciphertext, 'AES', null, key, null, IV)
  DECRYPTSYMMETRIC(args: AmpValue[]): AmpValue {
    const ciphertext = toString(args[0]);
    const key = toString(args[3] ?? '');
    const iv  = toString(args[5] ?? '');
    try {
      return aesCBCDecrypt(ciphertext, key, iv);
    } catch {
      return null;
    }
  },
});
