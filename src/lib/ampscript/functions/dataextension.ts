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

// case-insensitive match (padrão AMPScript)
function matchRows(rows: AmpRow[], keyField: string, keyValue: string): AmpRow[] {
  return rows.filter(r =>
    toString(getField(r, keyField)).toLowerCase() === keyValue.toLowerCase()
  );
}

// case-sensitive match (variante CS)
function matchRowsCS(rows: AmpRow[], keyField: string, keyValue: string): AmpRow[] {
  return rows.filter(r => toString(getField(r, keyField)) === keyValue);
}

export const dataExtensionFunctions: Record<string, (args: AmpValue[], ctx: EvalContext) => AmpValue> = {

  // ── Leitura ───────────────────────────────────────────────────────────────

  LOOKUP(args, ctx) {
    const [deName, retField, keyField, keyValue] = args.map(a => toString(a));
    const de = findDE(ctx, deName);
    if (!de) return null;
    const row = matchRows(de.rows, keyField, keyValue)[0] ?? null;
    return row ? getField(row, retField) : null;
  },

  LOOKUPROWS(args, ctx) {
    const [deName, keyField, keyValue] = args.map(a => toString(a));
    const de = findDE(ctx, deName);
    if (!de) return [];
    return matchRows(de.rows, keyField, keyValue);
  },

  // Versão case-sensitive — diferencia maiúsculas/minúsculas no valor de busca
  LOOKUPROWSCS(args, ctx) {
    const [deName, keyField, keyValue] = args.map(a => toString(a));
    const de = findDE(ctx, deName);
    if (!de) return [];
    return matchRowsCS(de.rows, keyField, keyValue);
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
    const parts     = orderBy.trim().split(/\s+/);
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
    const de = findDE(ctx, toString(args[0]));
    return de ? de.rows.length : 0;
  },

  // ── Escrita — variante DE (pares campo/valor simples) ─────────────────────

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

  // ── Escrita — variante Data (com filterCount) ─────────────────────────────
  //
  // InsertData tem a mesma sintaxe que InsertDE.
  //
  // UpdateData / UpsertData / DeleteData recebem um filterCount logo após o
  // nome da DE, indicando quantos pares campo/valor formam o filtro:
  //   UpdateData("DE", 1, "Email", @email, "Campo", @valor)
  //   UpsertData("DE", 1, "Email", @email, "Campo", @valor)
  //   DeleteData("DE", 1, "Email", @email)

  INSERTDATA(args, ctx) {
    return dataExtensionFunctions.INSERTDE(args, ctx);
  },

  UPDATEDATA(args, ctx) {
    const deName      = toString(args[0]);
    const filterCount = toNumber(args[1]);
    const de = findDE(ctx, deName);
    if (!de) return 0;

    // Monta filtro com filterCount pares
    const filterPairs: [string, string][] = [];
    for (let i = 0; i < filterCount; i++) {
      filterPairs.push([toString(args[2 + i * 2]), toString(args[3 + i * 2])]);
    }

    // Campos a atualizar começam após os pares de filtro
    const updateStart = 2 + filterCount * 2;

    let updated = 0;
    for (const row of de.rows) {
      const match = filterPairs.every(([field, value]) =>
        toString(getField(row, field)).toLowerCase() === value.toLowerCase()
      );
      if (match) {
        for (let i = updateStart; i < args.length - 1; i += 2) {
          row[toString(args[i])] = args[i + 1] as string;
        }
        updated++;
      }
    }
    return updated;
  },

  UPSERTDATA(args, ctx) {
    const deName    = toString(args[0]);
    const keyCount  = toNumber(args[1]);
    const de = findDE(ctx, deName);
    if (!de) return 0;

    // Monta chaves primárias com keyCount pares
    const keyPairs: [string, string][] = [];
    for (let i = 0; i < keyCount; i++) {
      keyPairs.push([toString(args[2 + i * 2]), toString(args[3 + i * 2])]);
    }

    const dataStart = 2 + keyCount * 2;

    const existing = de.rows.find(row =>
      keyPairs.every(([field, value]) =>
        toString(getField(row, field)).toLowerCase() === value.toLowerCase()
      )
    ) ?? null;

    if (existing) {
      for (let i = dataStart; i < args.length - 1; i += 2) {
        existing[toString(args[i])] = args[i + 1] as string;
      }
    } else {
      const row: AmpRow = {};
      for (const [field, value] of keyPairs) row[field] = value;
      for (let i = dataStart; i < args.length - 1; i += 2) {
        row[toString(args[i])] = args[i + 1] as string;
      }
      de.rows.push(row);
    }
    return 1;
  },

  DELETEDATA(args, ctx) {
    const deName      = toString(args[0]);
    const filterCount = toNumber(args[1]);
    const de = findDE(ctx, deName);
    if (!de) return 0;

    const filterPairs: [string, string][] = [];
    for (let i = 0; i < filterCount; i++) {
      filterPairs.push([toString(args[2 + i * 2]), toString(args[3 + i * 2])]);
    }

    const before = de.rows.length;
    de.rows = de.rows.filter(row =>
      !filterPairs.every(([field, value]) =>
        toString(getField(row, field)).toLowerCase() === value.toLowerCase()
      )
    );
    return before - de.rows.length;
  },
};
