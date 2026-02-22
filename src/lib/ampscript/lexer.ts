export type TokenType =
  | 'STRING' | 'NUMBER' | 'BOOLEAN'
  | 'VAR' | 'SET' | 'IF' | 'ELSEIF' | 'ELSE' | 'ENDIF'
  | 'FOR' | 'TO' | 'STEP' | 'DO' | 'NEXT' | 'THEN'
  | 'AND' | 'OR' | 'NOT'
  | 'TRUE' | 'FALSE' | 'NULL'
  | 'IDENT' | 'VARIABLE'
  | 'LPAREN' | 'RPAREN' | 'COMMA' | 'DOT'
  | 'PLUS' | 'MINUS' | 'STAR' | 'SLASH' | 'MOD'
  | 'EQ' | 'NEQ' | 'LT' | 'LTE' | 'GT' | 'GTE'
  | 'ASSIGN'
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
}

const KEYWORDS: Record<string, TokenType> = {
  var: 'VAR', set: 'SET',
  if: 'IF', elseif: 'ELSEIF', else: 'ELSE', endif: 'ENDIF',
  for: 'FOR', to: 'TO', step: 'STEP', do: 'DO', next: 'NEXT', then: 'THEN',
  and: 'AND', or: 'OR', not: 'NOT',
  true: 'TRUE', false: 'FALSE', null: 'NULL',
};

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;
  let line = 1;

  function peek(offset = 0): string {
    return input[pos + offset] ?? '';
  }

  function advance(): string {
    const ch = input[pos++];
    if (ch === '\n') line++;
    return ch;
  }

  function addToken(type: TokenType, value: string) {
    tokens.push({ type, value, line });
  }

  function skipWhitespaceAndComments() {
    while (pos < input.length) {
      const ch = peek();
      if (ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n') {
        advance();
        continue;
      }
      if (ch === '/' && peek(1) === '*') {
        pos += 2;
        while (pos < input.length) {
          if (peek() === '*' && peek(1) === '/') {
            pos += 2;
            break;
          }
          advance();
        }
        continue;
      }

      break;
    }
  }

  function readString(quote: string): Token {
    const startLine = line;
    advance();
    let value = '';
    while (pos < input.length) {
      const ch = peek();
      if (ch === '\\') {
        advance();
        const escaped = advance();
        const escapes: Record<string, string> = {
          n: '\n', t: '\t', r: '\r',
          '"': '"', "'": "'", '\\': '\\',
        };
        value += escapes[escaped] ?? escaped;
      } else if (ch === quote) {
        advance();
        break;
      } else {
        value += advance();
      }
    }
    return { type: 'STRING', value, line: startLine };
  }

  function readNumber(): Token {
    const startLine = line;
    let value = '';
    while (pos < input.length && /[\d.]/.test(peek())) {
      value += advance();
    }
    return { type: 'NUMBER', value, line: startLine };
  }

  function readIdent(): Token {
    const startLine = line;
    let value = '';
    while (pos < input.length && /[A-Za-z0-9_]/.test(peek())) {
      value += advance();
    }
    const lower = value.toLowerCase();
    const kwType = KEYWORDS[lower];
    return { type: kwType ?? 'IDENT', value, line: startLine };
  }

  function readVariable(): Token {
    const startLine = line;
    advance();
    let value = '@';
    while (pos < input.length && /[A-Za-z0-9_]/.test(peek())) {
      value += advance();
    }
    return { type: 'VARIABLE', value, line: startLine };
  }

  while (pos < input.length) {
    skipWhitespaceAndComments();
    if (pos >= input.length) break;

    const ch = peek();

    if (ch === '"' || ch === "'") {
      tokens.push(readString(ch));
      continue;
    }

    if (/\d/.test(ch)) {
      tokens.push(readNumber());
      continue;
    }

    if (ch === '@') {
      tokens.push(readVariable());
      continue;
    }

    if (/[A-Za-z_]/.test(ch)) {
      tokens.push(readIdent());
      continue;
    }

    advance();
    switch (ch) {
      case '(': addToken('LPAREN', ch); break;
      case ')': addToken('RPAREN', ch); break;
      case ',': addToken('COMMA', ch); break;
      case '.': addToken('DOT', ch); break;
      case '+': addToken('PLUS', ch); break;
      case '-': addToken('MINUS', ch); break;
      case '*': addToken('STAR', ch); break;
      case '/': addToken('SLASH', ch); break;
      case '%': addToken('MOD', ch); break;
      case '=':
        if (peek() === '=') { advance(); addToken('EQ', '=='); }
        else addToken('ASSIGN', '=');
        break;
      case '!':
        if (peek() === '=') { advance(); addToken('NEQ', '!='); }
        break;
      case '<':
        if (peek() === '=') { advance(); addToken('LTE', '<='); }
        else addToken('LT', '<');
        break;
      case '>':
        if (peek() === '=') { advance(); addToken('GTE', '>='); }
        else addToken('GT', '>');
        break;
    }
  }

  addToken('EOF', '');
  return tokens;
}
