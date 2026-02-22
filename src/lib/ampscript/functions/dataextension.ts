import type { AmpValue, AmpRow, AmpRowset, EvalContext } from '../types';
import { toString, toNumber } from '../evaluator';

function findDE(ctx: EvalContext, name: string) {
  return ctx.dataExtensions.find(
    de => de.name.toLowerCase() === name.toLowerCase()
  ) ?? null;
}

function getField(row: AmpRow, field: string): AmpValue {
  const key = Object.keys(row).find(k => k.toLowerCase() === field.toLowerCase());
  return key !== undefined ? (row[key] ?? null) : null;
}

function matchRows(rows: AmpRow[], keyField: string, keyValue: string): AmpRow[] {
  return rows.filter(r =>
    toString(getField(r, keyField)).toLowerCase() === keyValue.toLowerCase()
  );
}

export const dataExtensionFunctions: Record<string, (args: AmpValue[], ctx: EvalContext) => AmpValue> = {

  LOOKUP(args, ctx) {
    const deName   = toString(args[0]);
    const retField = toString(args[1]);
    const keyField = toString(args[2]);
    const keyValue = toString(args[3]);

    const de = findDE(ctx, deName);
    if (!de) return null;

    const row = matchRows(de.rows, keyField, keyValue)[0] ?? null;
    return row ? getField(row, retField) : null;
  },

  LOOKUPROWS(args, ctx) {
    const deName   = toString(args[0]);
    const keyField = toString(args[1]);
    const keyValue = toString(args[2]);

    const de = findDE(ctx, deName);
    if (!de) return [];

    return matchRows(de.rows, keyField, keyValue);
  },

  LOOKUPORDEREDROWS(args, ctx) {
    const deName   = toString(args[0]);
    const maxRows  = toNumber(args[1]);
    const orderBy  = toString(args[2]);
    const keyField = toString(args[3]);
    const keyValue = toString(args[4]);

    const de = findDE(ctx, deName);
    if (!de) return [];

    let rows = matchRows(de.rows, keyField, keyValue);

    const parts = orderBy.trim().split(/\s+/);
    const sortField = parts[0];
    const dir       = (parts[1] ?? 'ASC').toUpperCase();

    rows = rows.sort((a, b) => {
      const av = toString(getField(a, sortField));
      const bv = toString(getField(b, sortField));
      return dir === 'DESC' ? bv.localeCompare(av) : av.localeCompare(bv);
    });

    return maxRows > 0 ? rows.slice(0, maxRows) : rows;
  },

  LOOKUPORDEREDROWSCS(args, ctx) {
    return dataExtensionFunctions.LOOKUPORDEREDROWS(args, ctx);
  },

  ROW(args) {
    const rowset = args[0] as AmpRowset;
    const index  = toNumber(args[1]);
    if (!Array.isArray(rowset)) return null;
    return rowset[index - 1] ?? null;
  },

  ROWCOUNT(args) {
    const rowset = args[0];
    if (!Array.isArray(rowset)) return 0;
    return rowset.length;
  },

  FIELD(args) {
    const row   = args[0] as AmpRow;
    const field = toString(args[1]);
    if (!row || typeof row !== 'object' || Array.isArray(row)) return null;
    return getField(row, field);
  },

  DATAEXTENSIONROWCOUNT(args, ctx) {
    const deName = toString(args[0]);
    const de = findDE(ctx, deName);
    return de ? de.rows.length : 0;
  },

  INSERTDE(args, ctx) {
    const deName = toString(args[0]);
    const de = findDE(ctx, deName);
    if (!de) return 0;

    const row: AmpRow = {};
    for (let i = 1; i < args.length - 1; i += 2) {
      row[toString(args[i])] = args[i + 1] as string;
    }
    de.rows.push(row);
    return 1;
  },

  UPDATEDE(args, ctx) {
    const deName   = toString(args[0]);
    const keyField = toString(args[1]);
    const keyValue = toString(args[2]);

    const de = findDE(ctx, deName);
    if (!de) return 0;

    let updated = 0;
    for (const row of de.rows) {
      if (toString(getField(row, keyField)).toLowerCase() === keyValue.toLowerCase()) {
        for (let i = 3; i < args.length - 1; i += 2) {
          row[toString(args[i])] = args[i + 1] as string;
        }
        updated++;
      }
    }
    return updated;
  },

  UPSERTDE(args, ctx) {
    const deName   = toString(args[0]);
    const keyField = toString(args[1]);
    const keyValue = toString(args[2]);

    const de = findDE(ctx, deName);
    if (!de) return 0;

    const existing = matchRows(de.rows, keyField, keyValue)[0] ?? null;

    if (existing) {
      for (let i = 3; i < args.length - 1; i += 2) {
        existing[toString(args[i])] = args[i + 1] as string;
      }
    } else {
      const row: AmpRow = { [keyField]: keyValue };
      for (let i = 3; i < args.length - 1; i += 2) {
        row[toString(args[i])] = args[i + 1] as string;
      }
      de.rows.push(row);
    }
    return 1;
  },

  DELETEDE(args, ctx) {
    const deName   = toString(args[0]);
    const keyField = toString(args[1]);
    const keyValue = toString(args[2]);

    const de = findDE(ctx, deName);
    if (!de) return 0;

    const before = de.rows.length;
    de.rows = de.rows.filter(r =>
      toString(getField(r, keyField)).toLowerCase() !== keyValue.toLowerCase()
    );
    return before - de.rows.length;
  },
};