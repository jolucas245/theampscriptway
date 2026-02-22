import React, { useState, useRef } from 'react';
import type { DataExtension } from '../../lib/ampscript/types';
import styles from './Playground.module.css';

interface Props {
  dataExtensions: DataExtension[];
  onChange: (des: DataExtension[]) => void;
}

export function DataExtensionPanel({ dataExtensions, onChange }: Props) {
  const [open, setOpen]                   = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [newDeName, setNewDeName]         = useState('');
  const [newColName, setNewColName]       = useState('');
  const [importOpen, setImportOpen]       = useState(false);
  const [csvText, setCsvText]             = useState('');
  const [csvError, setCsvError]           = useState('');
  const [importMode, setImportMode]       = useState<'replace' | 'append'>('replace');
  const newColRef = useRef<HTMLInputElement>(null);
  const selected = selectedIndex != null ? dataExtensions[selectedIndex] : null;
  const cols     = selected ? Object.keys(selected.rows[0] ?? {}) : [];

  function addDE() {
    const name = newDeName.trim();
    if (!name) return;
    if (dataExtensions.some(de => de.name.toLowerCase() === name.toLowerCase())) return;
    onChange([...dataExtensions, { name, rows: [{}] }]);
    setNewDeName('');
  }

  function removeDE(i: number) {
    const next = [...dataExtensions];
    next.splice(i, 1);
    onChange(next);
    if (selectedIndex === i) setSelectedIndex(null);
    else if (selectedIndex != null && selectedIndex > i) setSelectedIndex(selectedIndex - 1);
  }

  function addColumn() {
    const name = newColName.trim();
    if (!name || selectedIndex == null) return;
    if (cols.includes(name)) return;
    const next = [...dataExtensions];
    next[selectedIndex] = {
      ...next[selectedIndex],
      rows: next[selectedIndex].rows.map(r => ({ ...r, [name]: '' })),
    };
    onChange(next);
    setNewColName('');
    newColRef.current?.focus();
  }

  function removeColumn(col: string) {
    if (selectedIndex == null) return;
    const next = [...dataExtensions];
    next[selectedIndex] = {
      ...next[selectedIndex],
      rows: next[selectedIndex].rows.map(r => {
        const copy = { ...r };
        delete copy[col];
        return copy;
      }),
    };
    onChange(next);
  }

  function addRow() {
    if (selectedIndex == null) return;
    const next = [...dataExtensions];
    const emptyRow: Record<string, string> = {};
    cols.forEach(c => { emptyRow[c] = ''; });
    next[selectedIndex] = {
      ...next[selectedIndex],
      rows: [...next[selectedIndex].rows, emptyRow],
    };
    onChange(next);
  }

  function removeRow(rowIndex: number) {
    if (selectedIndex == null) return;
    const next = [...dataExtensions];
    const rows = [...next[selectedIndex].rows];
    rows.splice(rowIndex, 1);
    next[selectedIndex] = { ...next[selectedIndex], rows };
    onChange(next);
  }

  function updateCell(rowIndex: number, col: string, val: string) {
    if (selectedIndex == null) return;
    const next = [...dataExtensions];
    const rows = next[selectedIndex].rows.map((r, i) =>
      i === rowIndex ? { ...r, [col]: val } : r
    );
    next[selectedIndex] = { ...next[selectedIndex], rows };
    onChange(next);
  }

  function parseCSV(raw: string): { columns: string[]; rows: Record<string, string>[] } | null {
    const lines = raw.trim().split('\n').map(l => l.trimEnd());
    if (lines.length < 1) return null;

    const sep = lines[0].includes('\t') ? '\t' : ',';

    function splitLine(line: string): string[] {
      if (sep === '\t') return line.split('\t');
      const result: string[] = [];
      let cur = '', inQuote = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') { inQuote = !inQuote; continue; }
        if (ch === ',' && !inQuote) { result.push(cur); cur = ''; continue; }
        cur += ch;
      }
      result.push(cur);
      return result;
    }

    const columns = splitLine(lines[0]).map(c => c.trim()).filter(Boolean);
    if (columns.length === 0) return null;

    const rows = lines.slice(1)
      .filter(l => l.trim() !== '')
      .map(l => {
        const values = splitLine(l);
        const row: Record<string, string> = {};
        columns.forEach((col, i) => { row[col] = (values[i] ?? '').trim(); });
        return row;
      });

    return { columns, rows };
  }

  function handleImport() {
    setCsvError('');
    if (!csvText.trim()) { setCsvError('Paste some data first.'); return; }
    if (selectedIndex == null) { setCsvError('Select a DE first.'); return; }

    const parsed = parseCSV(csvText);
    if (!parsed) { setCsvError('Could not parse the data. Check the format.'); return; }

    const next = [...dataExtensions];

    if (importMode === 'replace') {
      next[selectedIndex] = { ...next[selectedIndex], rows: parsed.rows };
    } else {
      const existingRows = next[selectedIndex].rows.map(r => {
        const copy = { ...r };
        parsed.columns.forEach(c => { if (!(c in copy)) copy[c] = ''; });
        return copy;
      });
      const existingCols = Object.keys(next[selectedIndex].rows[0] ?? {});
      const newRows = parsed.rows.map(r => {
        const copy = { ...r };
        existingCols.forEach(c => { if (!(c in copy)) copy[c] = ''; });
        return copy;
      });
      next[selectedIndex] = { ...next[selectedIndex], rows: [...existingRows, ...newRows] };
    }

    onChange(next);
    setCsvText('');
    setImportOpen(false);
  }

  return (
    <div className={styles.panel}>
      <button className={styles.panelHeader} onClick={() => setOpen(o => !o)}>
        Data Extensions ({dataExtensions.length}) {open ? '▲' : '▼'}
      </button>

      {open && (
        <div className={styles.panelBody}>

          {/* Lista de DEs */}
          <div className={styles.deList}>
            {dataExtensions.map((de, i) => (
              <div key={i} className={styles.deItem}>
                <button
                  className={`${styles.deNameBtn} ${selectedIndex === i ? styles.deNameActive : ''}`}
                  onClick={() => { setSelectedIndex(selectedIndex === i ? null : i); setImportOpen(false); }}
                >
                  {de.name}
                </button>
                <button className={styles.removeBtn} onClick={() => removeDE(i)} title="Remove DE">×</button>
              </div>
            ))}
            <div className={styles.attrRow}>
              <input
                className={styles.attrInput}
                placeholder="New DE name"
                value={newDeName}
                onChange={e => setNewDeName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addDE()}
              />
              <button className={styles.addBtn} onClick={addDE}>+</button>
            </div>
          </div>

          {/* Área da DE selecionada */}
          {selected && (
            <div className={styles.deTable}>

              {/* Barra de ações */}
              <div className={styles.deTableActions}>
                <button onClick={addRow}>+ Row</button>
                <button
                  onClick={() => { setImportOpen(o => !o); setCsvError(''); }}
                  style={{ color: importOpen ? '#ffd700' : undefined }}
                >
                  {importOpen ? '✕ Close Import' : '⬇ Import'}
                </button>
              </div>

              {/* Painel de import — fica acima da tabela, sempre visível quando aberto */}
              {importOpen && (
                <div className={styles.csvImport}>
                  <p className={styles.csvHint}>
                    Accepts <strong>tab-separated</strong> (Excel / Google Sheets) or <strong>comma-separated</strong> (CSV).<br />
                    First row = column headers.
                  </p>
                  <textarea
                    className={styles.csvTextarea}
                    placeholder={'Name\tEmail\tCity\nMaria\tmaria@example.com\tSão Paulo\nJoão\tjoao@example.com\tCuritiba'}
                    value={csvText}
                    onChange={e => setCsvText(e.target.value)}
                    rows={4}
                    spellCheck={false}
                  />
                  <div className={styles.csvActions}>
                    <label className={styles.csvModeLabel}>
                      <input
                        type="radio"
                        name="importMode"
                        checked={importMode === 'replace'}
                        onChange={() => setImportMode('replace')}
                      />
                      Replace all rows
                    </label>
                    <label className={styles.csvModeLabel}>
                      <input
                        type="radio"
                        name="importMode"
                        checked={importMode === 'append'}
                        onChange={() => setImportMode('append')}
                      />
                      Append rows
                    </label>
                    <button className={styles.csvImportBtn} onClick={handleImport}>Import</button>
                  </div>
                  {csvError && <p className={styles.csvError}>{csvError}</p>}
                </div>
              )}

              {/* Tabela manual — sempre visível */}
              {cols.length === 0 ? (
                <p className={styles.deEmpty}>
                  No columns yet. Type a column name below and press Enter, or use Import.
                </p>
              ) : (
                <div className={styles.tableScroll}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        {cols.map(c => (
                          <th key={c}>
                            <div className={styles.colHeader}>
                              <span>{c}</span>
                              <button
                                className={styles.removeColBtn}
                                onClick={() => removeColumn(c)}
                                title={`Remove column ${c}`}
                              >×</button>
                            </div>
                          </th>
                        ))}
                        <th style={{ width: '20px' }} />
                      </tr>
                    </thead>
                    <tbody>
                      {selected.rows.map((row, ri) => (
                        <tr key={ri}>
                          {cols.map(c => (
                            <td key={c}>
                              <input
                                value={String(row[c] ?? '')}
                                onChange={e => updateCell(ri, c, e.target.value)}
                              />
                            </td>
                          ))}
                          <td style={{ textAlign: 'center' }}>
                            <button
                              className={styles.removeBtn}
                              onClick={() => removeRow(ri)}
                              title="Remove row"
                            >×</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Input de nova coluna — sempre visível abaixo da tabela */}
              <div className={styles.addColRow}>
                <input
                  ref={newColRef}
                  className={styles.attrInput}
                  placeholder="New column name"
                  value={newColName}
                  onChange={e => setNewColName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addColumn()}
                />
                <button className={styles.addBtn} onClick={addColumn}>+</button>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}