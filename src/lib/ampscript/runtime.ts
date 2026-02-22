import { parse } from './parser';
import { evaluate, toString } from './evaluator';
import type { AmpValue, EvalContext, DataExtension, SubscriberAttributes, AmpError } from './types';

export interface RunOptions {
  subscriberAttributes?: SubscriberAttributes;
  dataExtensions?: DataExtension[];
}

export interface RunResult {
  html: string;
  errors: AmpError[];
}

type Segment =
  | { kind: 'html';            content: string }
  | { kind: 'block';           content: string; line: number }
  | { kind: 'inline';          content: string; line: number }
  | { kind: 'personalization'; content: string };

function segmentize(template: string): Segment[] {
  const segments: Segment[] = [];
  let pos = 0;
  let line = 1;

  function countLines(str: string) {
    for (const ch of str) if (ch === '\n') line++;
  }

  function peek(offset = 0) {
    return template[pos + offset] ?? '';
  }

  while (pos < template.length) {
    if (peek() === '%' && peek(1) === '%' && peek(2) === '[') {
      const startLine = line;
      pos += 3;
      let depth = 1;
      let content = '';
      while (pos < template.length) {
        if (peek() === '[') depth++;
        if (peek() === ']' && peek(1) === '%' && peek(2) === '%') {
          pos += 3;
          depth--;
          if (depth === 0) break;
        }
        const ch = template[pos++];
        if (ch === '\n') line++;
        content += ch;
      }
      segments.push({ kind: 'block', content, line: startLine });
      continue;
    }

    if (peek() === '%' && peek(1) === '%' && peek(2) === '=') {
      const startLine = line;
      pos += 3;
      let content = '';
      while (pos < template.length) {
        if (peek() === '=' && peek(1) === '%' && peek(2) === '%') {
          pos += 3;
          break;
        }
        const ch = template[pos++];
        if (ch === '\n') line++;
        content += ch;
      }
      segments.push({ kind: 'inline', content, line: startLine });
      continue;
    }

    if (peek() === '%' && peek(1) === '%') {
      const ahead = template.indexOf('%%', pos + 2);
      if (ahead !== -1) {
        const inner = template.slice(pos + 2, ahead);
        if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(inner)) {
          pos = ahead + 2;
          countLines(inner);
          segments.push({ kind: 'personalization', content: inner });
          continue;
        }
      }
    }

    let html = '';
    while (pos < template.length) {
      if (peek() === '%' && peek(1) === '%') break;
      const ch = template[pos++];
      if (ch === '\n') line++;
      html += ch;
    }
    if (html) segments.push({ kind: 'html', content: html });
  }

  return segments;
}

export function run(template: string, options: RunOptions = {}): RunResult {
  const errors: AmpError[] = [];
  const outputParts: string[] = [];

  const ctx: EvalContext = {
    variables:            new Map(),
    subscriberAttributes: options.subscriberAttributes ?? {},
    dataExtensions:       options.dataExtensions
                            ? options.dataExtensions.map(de => ({
                                ...de,
                                rows: de.rows.map(r => ({ ...r })),
                              }))
                            : [],
    outputBuffer:         [],
  };

  const segments = segmentize(template);

  for (const seg of segments) {
    try {
      switch (seg.kind) {

        case 'html':
          outputParts.push(seg.content);
          break;

        case 'block': {
          const ast = parse(seg.content);
          evaluate(ast, ctx);
          if (ctx.outputBuffer.length > 0) {
            outputParts.push(...ctx.outputBuffer);
            ctx.outputBuffer = [];
          }
          break;
        }

        case 'inline': {
          const ast = parse(seg.content);
          let result: AmpValue = null;
          if (ast.body.length > 0) {
            const node = ast.body[0];
            if (node.kind === 'ExprStmt') {
              result = evaluate(node.expr, ctx);
            } else {
              result = evaluate(node, ctx);
            }
          }
          outputParts.push(toString(result));
          break;
        }

        case 'personalization': {
          const key = seg.content.toLowerCase();
          const found = Object.keys(ctx.subscriberAttributes).find(
            k => k.toLowerCase() === key
          );
          if (found !== undefined) {
            outputParts.push(toString(ctx.subscriberAttributes[found]));
          } else {
            outputParts.push(`%%${seg.content}%%`);
          }
          break;
        }
      }
    } catch (err: any) {
      const ampErr: AmpError = {
        message: err.message ?? String(err),
        line:    seg.kind !== 'html' && seg.kind !== 'personalization' ? seg.line : undefined,
      };
      errors.push(ampErr);
    }
  }

  return {
    html:   outputParts.join(''),
    errors,
  };
}