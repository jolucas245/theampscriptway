import { Token, TokenType, tokenize } from './lexer';

export type ASTNode =
  | ProgramNode
  | VarDeclStmt
  | SetStmt
  | IfStmt
  | ForStmt
  | ExprStmt
  | StringLiteral
  | NumberLiteral
  | BoolLiteral
  | NullLiteral
  | VariableRef
  | FunctionCall
  | BinaryExpr
  | UnaryExpr;

export interface ProgramNode    { kind: 'Program';      body: ASTNode[] }
export interface VarDeclStmt    { kind: 'VarDecl';      names: string[]; line: number }
export interface SetStmt        { kind: 'Set';          name: string; value: ASTNode; line: number }
export interface IfStmt         { kind: 'If';           condition: ASTNode; then: ASTNode[]; elseifs: ElseIf[]; else: ASTNode[] | null; line: number }
export interface ElseIf         { condition: ASTNode;   body: ASTNode[] }
export interface ForStmt        { kind: 'For';          variable: string; from: ASTNode; to: ASTNode; step: ASTNode | null; body: ASTNode[]; line: number }
export interface ExprStmt       { kind: 'ExprStmt';     expr: ASTNode }
export interface StringLiteral  { kind: 'String';       value: string }
export interface NumberLiteral  { kind: 'Number';       value: number }
export interface BoolLiteral    { kind: 'Bool';         value: boolean }
export interface NullLiteral    { kind: 'Null' }
export interface VariableRef    { kind: 'Variable';     name: string; line: number }
export interface FunctionCall   { kind: 'FunctionCall'; name: string; args: ASTNode[]; line: number }
export interface BinaryExpr     { kind: 'Binary';       op: string; left: ASTNode; right: ASTNode }
export interface UnaryExpr      { kind: 'Unary';        op: string; operand: ASTNode }

export function parse(input: string): ProgramNode {
  const tokens = tokenize(input);
  let pos = 0;

  function peek(offset = 0): Token {
    return tokens[Math.min(pos + offset, tokens.length - 1)];
  }

  function advance(): Token {
    const t = tokens[pos];
    if (pos < tokens.length - 1) pos++;
    return t;
  }

  function check(...types: TokenType[]): boolean {
    return types.includes(peek().type);
  }

  function match(...types: TokenType[]): Token | null {
    if (check(...types)) return advance();
    return null;
  }

  function expect(type: TokenType, msg?: string): Token {
    if (!check(type)) {
      throw new Error(msg ?? `Expected ${type} but got ${peek().type} ("${peek().value}") at line ${peek().line}`);
    }
    return advance();
  }

  function parseBody(stopAt: TokenType[]): ASTNode[] {
    const nodes: ASTNode[] = [];
    while (!check('EOF') && !check(...stopAt)) {
      nodes.push(parseStatement());
    }
    return nodes;
  }

  function parseStatement(): ASTNode {
    const t = peek();

    if (t.type === 'VAR')    return parseVarDecl();
    if (t.type === 'SET')    return parseSet();
    if (t.type === 'IF')     return parseIf();
    if (t.type === 'FOR')    return parseFor();
    const expr = parseExpr();
    return { kind: 'ExprStmt', expr };
  }

  function parseVarDecl(): VarDeclStmt {
    const line = peek().line;
    expect('VAR');
    const names: string[] = [];
    do {
      const t = expect('VARIABLE', 'Expected variable name after VAR');
      names.push(t.value);
    } while (match('COMMA'));
    return { kind: 'VarDecl', names, line };
  }

  function parseSet(): SetStmt {
    const line = peek().line;
    expect('SET');
    const varToken = expect('VARIABLE', 'Expected variable after SET');
    expect('ASSIGN', 'Expected = after variable in SET');
    const value = parseExpr();
    return { kind: 'Set', name: varToken.value, value, line };
  }

  function parseIf(): IfStmt {
    const line = peek().line;
    expect('IF');
    const condition = parseExpr();
    match('THEN');

    const thenBody = parseBody(['ELSEIF', 'ELSE', 'ENDIF']);
    const elseifs: ElseIf[] = [];
    let elseBody: ASTNode[] | null = null;

    while (check('ELSEIF')) {
      advance();
      const eic = parseExpr();
      match('THEN');
      const eib = parseBody(['ELSEIF', 'ELSE', 'ENDIF']);
      elseifs.push({ condition: eic, body: eib });
    }

    if (match('ELSE')) {
      elseBody = parseBody(['ENDIF']);
    }

    expect('ENDIF', 'Expected ENDIF');
    return { kind: 'If', condition, then: thenBody, elseifs, else: elseBody, line };
  }

  function parseFor(): ForStmt {
    const line = peek().line;
    expect('FOR');
    const varToken = expect('VARIABLE', 'Expected variable after FOR');
    expect('ASSIGN', 'Expected = after variable in FOR');
    const from = parseExpr();
    expect('TO', 'Expected TO in FOR loop');
    const to = parseExpr();
    let step: ASTNode | null = null;
    if (match('STEP')) {
      step = parseExpr();
    }
    match('DO');
    const body = parseBody(['NEXT']);
    expect('NEXT', 'Expected NEXT to close FOR loop');
    match('VARIABLE');
    return { kind: 'For', variable: varToken.value, from, to, step, body, line };
  }

  function parseExpr(): ASTNode {
    return parseOr();
  }

  function parseOr(): ASTNode {
    let left = parseAnd();
    while (check('OR')) {
      const op = advance().value;
      left = { kind: 'Binary', op, left, right: parseAnd() };
    }
    return left;
  }

  function parseAnd(): ASTNode {
    let left = parseNot();
    while (check('AND')) {
      const op = advance().value;
      left = { kind: 'Binary', op, left, right: parseNot() };
    }
    return left;
  }

  function parseNot(): ASTNode {
    if (check('NOT')) {
      advance();
      return { kind: 'Unary', op: 'NOT', operand: parseNot() };
    }
    return parseComparison();
  }

  function parseComparison(): ASTNode {
    let left = parseAddSub();
    while (check('EQ', 'NEQ', 'LT', 'LTE', 'GT', 'GTE')) {
      const op = advance().value;
      left = { kind: 'Binary', op, left, right: parseAddSub() };
    }
    return left;
  }

  function parseAddSub(): ASTNode {
    let left = parseMulDiv();
    while (check('PLUS', 'MINUS')) {
      const op = advance().value;
      left = { kind: 'Binary', op, left, right: parseMulDiv() };
    }
    return left;
  }

  function parseMulDiv(): ASTNode {
    let left = parseUnaryMinus();
    while (check('STAR', 'SLASH', 'MOD')) {
      const op = advance().value;
      left = { kind: 'Binary', op, left, right: parseUnaryMinus() };
    }
    return left;
  }

  function parseUnaryMinus(): ASTNode {
    if (check('MINUS')) {
      advance();
      return { kind: 'Unary', op: '-', operand: parsePrimary() };
    }
    return parsePrimary();
  }

  function parsePrimary(): ASTNode {
    const t = peek();

    if (t.type === 'STRING')   { advance(); return { kind: 'String', value: t.value }; }
    if (t.type === 'NUMBER')   { advance(); return { kind: 'Number', value: parseFloat(t.value) }; }
    if (t.type === 'TRUE')     { advance(); return { kind: 'Bool', value: true }; }
    if (t.type === 'FALSE')    { advance(); return { kind: 'Bool', value: false }; }
    if (t.type === 'NULL')     { advance(); return { kind: 'Null' }; }
    if (t.type === 'VARIABLE') { advance(); return { kind: 'Variable', name: t.value, line: t.line }; }

    if (t.type === 'LPAREN') {
      advance();
      const expr = parseExpr();
      expect('RPAREN', 'Expected closing )');
      return expr;
    }

    if (t.type === 'IDENT') {
      advance();
      if (check('LPAREN')) {
        advance();
        const args: ASTNode[] = [];
        if (!check('RPAREN')) {
          do {
            args.push(parseExpr());
          } while (match('COMMA'));
        }
        expect('RPAREN', `Expected ) after arguments of ${t.value}`);
        return { kind: 'FunctionCall', name: t.value.toUpperCase(), args, line: t.line };
      }
      return { kind: 'String', value: t.value };
    }

    throw new Error(`Unexpected token "${t.value}" (${t.type}) at line ${t.line}`);
  }


  const body = parseBody(['EOF']);
  return { kind: 'Program', body };
}