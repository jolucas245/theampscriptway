import type { AmpValue, AmpRow, AmpRowset } from '../types';
import { toString } from '../evaluator';

export const contentFunctions: Record<string, (args: AmpValue[]) => AmpValue> = {

  // BuildRowsetFromString("val1,val2,val3", ",")
  // Retorna rowset onde cada linha tem uma coluna "@v" com o valor
  BUILDROWSETFROMSTRING(args) {
    const str   = toString(args[0]);
    const delim = args[1] !== null && args[1] !== undefined ? toString(args[1]) : ',';
    if (!str) return [];
    return str.split(delim).map((val): AmpRow => ({ '@v': val.trim() }));
  },

  // BuildRowsetFromJson('[{"Nome":"João"},{"Nome":"Maria"}]', "Nome,Idade")
  // Suporta array de objetos ou objeto simples
  BUILDROWSETFROMJSON(args) {
    const jsonStr = toString(args[0]);
    try {
      const parsed = JSON.parse(jsonStr);
      const data   = Array.isArray(parsed) ? parsed : [parsed];
      return data.map((item): AmpRow => {
        const row: AmpRow = {};
        for (const [key, value] of Object.entries(item)) {
          row[key] = value as AmpValue;
        }
        return row;
      }) as AmpRowset;
    } catch {
      return [];
    }
  },

  // BuildRowsetFromXml("<rows><row><Nome>João</Nome></row></rows>", "row", "Nome,Idade")
  // args[0] = XML string, args[1] = tag do elemento que representa cada linha
  BUILDROWSETFROMXML(args) {
    const xmlStr  = toString(args[0]);
    const rowTag  = args[1] !== null && args[1] !== undefined ? toString(args[1]) : 'row';
    try {
      const parser = new DOMParser();
      const doc    = parser.parseFromString(xmlStr, 'application/xml');
      const parseError = doc.querySelector('parsererror');
      if (parseError) return [];

      const elements = doc.getElementsByTagName(rowTag);
      const result: AmpRowset = [];

      for (let i = 0; i < elements.length; i++) {
        const el  = elements[i];
        const row: AmpRow = {};
        for (let j = 0; j < el.children.length; j++) {
          const child = el.children[j];
          row[child.tagName] = child.textContent ?? '';
        }
        result.push(row);
      }
      return result;
    } catch {
      return [];
    }
  },
};
