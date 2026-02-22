import type { ASTNode, ProgramNode } from './parser';
import type { AmpValue, ScalarValue, EvalContext } from './types';
import { callFunction } from './functions';

export function toString(v: AmpValue): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'number') {
    return Number.isInteger(v) ? String(v) : String(v);
  }
  if (Array.isArray(v)) return '[Rowset]';
  if (typeof v === 'object') return '[Row]';
  return String(v);
}

export function toNumber(v: AmpValue): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (typeof v === 'string') {
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

export function toBoolean(v: AmpValue): boolean {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v !== 0;
  if (typeof v === 'string') return v !== '' && v.toLowerCase() !== 'false';
  if (v === null || v === undefined) return false;
  return true;
}

export function evaluate(node: ASTNode, ctx: EvalContext): AmpValue {
  switch (node.kind) {

    case 'String':   return node.value;
    case 'Number':   return node.value;
    case 'Bool':     return node.value;
    case 'Null':     return null;

    case 'Variable': {
      const val = ctx.variables.get(node.name.toLowerCase());
      return val !== undefined ? val : null;
    }

    case 'Unary': {
      const operand = evaluate(node.operand, ctx);
      if (node.op === '-')   return -toNumber(operand);
      if (node.op === 'NOT') return !toBoolean(operand);
      return null;
    }

    case 'Binary': {
      if (node.op.toUpperCase() === 'AND') {
        return toBoolean(evaluate(node.left, ctx)) && toBoolean(evaluate(node.right, ctx));
      }
      if (node.op.toUpperCase() === 'OR') {
        return toBoolean(evaluate(node.left, ctx)) || toBoolean(evaluate(node.right, ctx));
      }

      const left  = evaluate(node.left, ctx);
      const right = evaluate(node.right, ctx);

      switch (node.op) {
        case '+': {
          if (typeof left === 'string' || typeof right === 'string') {
            return toString(left) + toString(right);
          }
          return toNumber(left) + toNumber(right);
        }
        case '-':  return toNumber(left) - toNumber(right);
        case '*':  return toNumber(left) * toNumber(right);
        case '/': {
          const divisor = toNumber(right);
          if (divisor === 0) throw new Error('Division by zero');
          return toNumber(left) / divisor;
        }
        case '%':  return toNumber(left) % toNumber(right);
        case '==': {
          if (typeof left === 'string' && typeof right === 'string') {
            return left.toLowerCase() === right.toLowerCase();
          }
          return left === right;
        }
        case '!=': {
          if (typeof left === 'string' && typeof right === 'string') {
            return left.toLowerCase() !== right.toLowerCase();
          }
          return left !== right;
        }
        case '<':  return toNumber(left) <  toNumber(right);
        case '<=': return toNumber(left) <= toNumber(right);
        case '>':  return toNumber(left) >  toNumber(right);
        case '>=': return toNumber(left) >= toNumber(right);
      }
      return null;
    }

    case 'FunctionCall': {
      const args = node.args.map(a => evaluate(a, ctx));
      return callFunction(node.name, args, ctx);
    }

    case 'VarDecl': {
      for (const name of node.names) {
        const key = name.toLowerCase();
        if (!ctx.variables.has(key)) {
          ctx.variables.set(key, null);
        }
      }
      return null;
    }

    case 'Set': {
      const val = evaluate(node.value, ctx);
      ctx.variables.set(node.name.toLowerCase(), val);
      return null;
    }

    case 'If': {
      if (toBoolean(evaluate(node.condition, ctx))) {
        executeBody(node.then, ctx);
      } else {
        let handled = false;
        for (const ei of node.elseifs) {
          if (toBoolean(evaluate(ei.condition, ctx))) {
            executeBody(ei.body, ctx);
            handled = true;
            break;
          }
        }
        if (!handled && node.else) {
          executeBody(node.else, ctx);
        }
      }
      return null;
    }

    case 'For': {
      const MAX_ITERATIONS = 10_000;
      let count = 0;

      let current = toNumber(evaluate(node.from, ctx));
      const end   = toNumber(evaluate(node.to,   ctx));
      const step  = node.step ? toNumber(evaluate(node.step, ctx)) : 1;

      if (step === 0) throw new Error('FOR loop step cannot be zero');

      const key = node.variable.toLowerCase();

      while (step > 0 ? current <= end : current >= end) {
        if (++count > MAX_ITERATIONS) {
          throw new Error(`FOR loop exceeded ${MAX_ITERATIONS} iterations`);
        }
        ctx.variables.set(key, current);
        executeBody(node.body, ctx);
        current += step;
      }
      return null;
    }

    case 'ExprStmt': {
      return evaluate(node.expr, ctx);
    }

    case 'Program': {
      executeBody(node.body, ctx);
      return null;
    }

    default: {
      throw new Error(`Unknown AST node: ${(node as any).kind}`);
    }
  }
}

export function executeBody(nodes: ASTNode[], ctx: EvalContext): void {
  for (const node of nodes) {
    evaluate(node, ctx);
  }
}