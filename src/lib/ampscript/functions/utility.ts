import type { ScalarValue, AmpValue, EvalContext } from '../types';
import { toString, toNumber, toBoolean } from '../evaluator';

export const utilityFunctions: Record<string, (args: AmpValue[], ctx: EvalContext) => AmpValue> = {

  OUTPUT(args) {
    const val = toString(args[0]);
    return val;
  },

  OUTPUTLINE(args) {
    const val = toString(args[0]);
    return val + '\n';
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

  TOSTRING(args) {
    return toString(args[0]);
  },

  NOT(args) {
    return !toBoolean(args[0]);
  },

  ATTRIBUTEVALUE(args, ctx) {
    const key = toString(args[0]).toLowerCase();
    const found = Object.keys(ctx.subscriberAttributes).find(
      k => k.toLowerCase() === key
    );
    return found !== undefined ? ctx.subscriberAttributes[found] : null;
  },

  BASE64ENCODE(args) {
    try {
      return btoa(unescape(encodeURIComponent(toString(args[0]))));
    } catch {
      return null;
    }
  },

  BASE64DECODE(args) {
    try {
      return decodeURIComponent(escape(atob(toString(args[0]))));
    } catch {
      return null;
    }
  },

  MD5(args) {
    const str = toString(args[0]);
    return md5(str);
  },

  SHA256(args) {
    return `sha256(${toString(args[0])})`;
  },

  GUID(args) {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  },

  RAISEERROR(args) {
    const msg = toString(args[0]);
    throw new Error(`RAISEERROR: ${msg}`);
  },

  TREATASCONTENT(args) {
    return toString(args[0]);
  },
};

function md5(input: string): string {
  function safeAdd(x: number, y: number) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    return (((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xffff);
  }
  function bitRotateLeft(num: number, cnt: number) {
    return (num << cnt) | (num >>> (32 - cnt));
  }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
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

  function utf8Encode(str: string): string {
    return unescape(encodeURIComponent(str));
  }

  function convertToWordArray(str: string): number[] {
    const lWordCount = [];
    const lMessageLength = str.length;
    const lNumberOfWords = (((lMessageLength + 8) - ((lMessageLength + 8) % 64)) / 64 + 1) * 16;
    for (let i = 0; i < lNumberOfWords; i++) lWordCount[i] = 0;
    for (let i = 0; i < lMessageLength; i++) {
      lWordCount[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
    }
    lWordCount[lMessageLength >> 2] |= 0x80 << ((lMessageLength % 4) * 8);
    lWordCount[lNumberOfWords - 2] = lMessageLength * 8;
    return lWordCount;
  }

  function wordToHex(lValue: number): string {
    let result = '';
    for (let i = 0; i <= 3; i++) {
      result += ('0' + ((lValue >> (i * 8)) & 0xff).toString(16)).slice(-2);
    }
    return result;
  }

  const encoded = utf8Encode(input);
  const x = convertToWordArray(encoded);
  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;

  for (let k = 0; k < x.length; k += 16) {
    const AA = a, BB = b, CC = c, DD = d;

    a = md5ff(a,b,c,d, x[k+0],  7, -680876936);  d = md5ff(d,a,b,c, x[k+1],  12, -389564586);
    c = md5ff(c,d,a,b, x[k+2],  17,  606105819);  b = md5ff(b,c,d,a, x[k+3],  22, -1044525330);
    a = md5ff(a,b,c,d, x[k+4],  7, -176418897);  d = md5ff(d,a,b,c, x[k+5],  12,  1200080426);
    c = md5ff(c,d,a,b, x[k+6],  17, -1473231341); b = md5ff(b,c,d,a, x[k+7],  22, -45705983);
    a = md5ff(a,b,c,d, x[k+8],  7,  1770035416);  d = md5ff(d,a,b,c, x[k+9],  12, -1958414417);
    c = md5ff(c,d,a,b, x[k+10], 17, -42063);       b = md5ff(b,c,d,a, x[k+11], 22, -1990404162);
    a = md5ff(a,b,c,d, x[k+12], 7,  1804603682);  d = md5ff(d,a,b,c, x[k+13], 12, -40341101);
    c = md5ff(c,d,a,b, x[k+14], 17, -1502002290); b = md5ff(b,c,d,a, x[k+15], 22,  1236535329);

    a = md5gg(a,b,c,d, x[k+1],  5, -165796510);   d = md5gg(d,a,b,c, x[k+6],  9, -1069501632);
    c = md5gg(c,d,a,b, x[k+11], 14,  643717713);   b = md5gg(b,c,d,a, x[k+0],  20, -373897302);
    a = md5gg(a,b,c,d, x[k+5],  5, -701558691);   d = md5gg(d,a,b,c, x[k+10], 9,   38016083);
    c = md5gg(c,d,a,b, x[k+15], 14, -660478335);   b = md5gg(b,c,d,a, x[k+4],  20, -405537848);
    a = md5gg(a,b,c,d, x[k+9],  5,  568446438);    d = md5gg(d,a,b,c, x[k+14], 9, -1019803690);
    c = md5gg(c,d,a,b, x[k+3],  14, -187363961);   b = md5gg(b,c,d,a, x[k+8],  20,  1163531501);
    a = md5gg(a,b,c,d, x[k+13], 5, -1444681467);   d = md5gg(d,a,b,c, x[k+2],  9,  -51403784);
    c = md5gg(c,d,a,b, x[k+7],  14,  1735328473);  b = md5gg(b,c,d,a, x[k+12], 20, -1926607734);

    a = md5hh(a,b,c,d, x[k+5],  4, -378558);       d = md5hh(d,a,b,c, x[k+8],  11, -2022574463);
    c = md5hh(c,d,a,b, x[k+11], 16,  1839030562);  b = md5hh(b,c,d,a, x[k+14], 23, -35309556);
    a = md5hh(a,b,c,d, x[k+1],  4, -1530992060);   d = md5hh(d,a,b,c, x[k+4],  11,  1272893353);
    c = md5hh(c,d,a,b, x[k+7],  16, -155497632);   b = md5hh(b,c,d,a, x[k+10], 23, -1094730640);
    a = md5hh(a,b,c,d, x[k+13], 4,  681279174);    d = md5hh(d,a,b,c, x[k+0],  11, -358537222);
    c = md5hh(c,d,a,b, x[k+3],  16, -722521979);   b = md5hh(b,c,d,a, x[k+6],  23,  76029189);
    a = md5hh(a,b,c,d, x[k+9],  4, -640364487);    d = md5hh(d,a,b,c, x[k+12], 11, -421815835);
    c = md5hh(c,d,a,b, x[k+15], 16,  530742520);   b = md5hh(b,c,d,a, x[k+2],  23, -995338651);

    a = md5ii(a,b,c,d, x[k+0],  6, -198630844);    d = md5ii(d,a,b,c, x[k+7],  10,  1126891415);
    c = md5ii(c,d,a,b, x[k+14], 15, -1416354905);  b = md5ii(b,c,d,a, x[k+5],  21, -57434055);
    a = md5ii(a,b,c,d, x[k+12], 6,  1700485571);   d = md5ii(d,a,b,c, x[k+3],  10, -1894986606);
    c = md5ii(c,d,a,b, x[k+10], 15, -1051523);      b = md5ii(b,c,d,a, x[k+1],  21, -2054922799);
    a = md5ii(a,b,c,d, x[k+8],  6,  1873313359);   d = md5ii(d,a,b,c, x[k+15], 10, -30611744);
    c = md5ii(c,d,a,b, x[k+6],  15, -1560198380);  b = md5ii(b,c,d,a, x[k+13], 21,  1309151649);
    a = md5ii(a,b,c,d, x[k+4],  6, -145523070);    d = md5ii(d,a,b,c, x[k+11], 10, -1120210379);
    c = md5ii(c,d,a,b, x[k+2],  15,  718787259);   b = md5ii(b,c,d,a, x[k+9],  21, -343485551);

    a = safeAdd(a, AA); b = safeAdd(b, BB);
    c = safeAdd(c, CC); d = safeAdd(d, DD);
  }

  return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
}