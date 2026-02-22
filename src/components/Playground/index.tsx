import React, { useState, useCallback, useEffect, useRef } from 'react';
import { run } from '../../lib/ampscript';
import type { RunResult } from '../../lib/ampscript/runtime';
import type { DataExtension, SubscriberAttributes } from '../../lib/ampscript/types';
import { EditorPanel } from './EditorPanel';
import { OutputPanel } from './OutputPanel';
import { SubscriberPanel } from './SubscriberPanel';
import { DataExtensionPanel } from './DataExtensionPanel';
import styles from './Playground.module.css';

const STORAGE_KEY = 'ampscript_playground_v1';

interface SavedState {
  code: string;
  subscriberAttributes: SubscriberAttributes;
  dataExtensions: DataExtension[];
  editorWidth: number;
}

function loadState(): SavedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(state: SavedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

const DEFAULT_CODE = `%%[
  VAR @firstName, @score, @grade

  SET @firstName = AttributeValue("FirstName")
  SET @score = 87

  IF @score >= 90 THEN
    SET @grade = "A"
  ELSEIF @score >= 80 THEN
    SET @grade = "B"
  ELSEIF @score >= 70 THEN
    SET @grade = "C"
  ELSE
    SET @grade = "F"
  ENDIF
]%%

<h2>Hello, %%=V(@firstName)=%%!</h2>
<p>Your score is <strong>%%=V(@score)=%%</strong> — Grade: <strong>%%=V(@grade)=%%</strong></p>
<p>Report generated on %%=FormatDate(Now(), "MMMM DD, YYYY")=%%</p>
`;

const DEFAULT_ATTRIBUTES: SubscriberAttributes = {
  FirstName:    'Maria',
  LastName:     'Silva',
  EmailAddress: 'maria@example.com',
};

const MIN_WIDTH = 280;
const DEFAULT_EDITOR_WIDTH = 55;

function ErrorsPanel({ result }: { result: RunResult | null }) {
  if (!result || result.errors.length === 0) {
    return <div className={styles.noErrors}>✓ No errors</div>;
  }
  return (
    <div className={styles.errorList}>
      {result.errors.map((err, i) => (
        <div key={i} className={styles.errorItem}>
          {err.line != null && (
            <span className={styles.errorLine}>Line {err.line}: </span>
          )}
          {err.message}
        </div>
      ))}
    </div>
  );
}

export default function Playground() {
  const saved = loadState();

  const [code, setCode] = useState<string>(saved?.code ?? DEFAULT_CODE);
  const [subscriberAttributes, setSubscriberAttributes] = useState<SubscriberAttributes>(
    saved?.subscriberAttributes ?? DEFAULT_ATTRIBUTES
  );
  const [dataExtensions, setDataExtensions] = useState<DataExtension[]>(
    saved?.dataExtensions ?? []
  );
  const [result, setResult]       = useState<RunResult | null>(null);
  const [activeTab, setActiveTab] = useState<'output' | 'errors'>('output');
  const [autoRun, setAutoRun]     = useState(true);

  const [editorWidthPct, setEditorWidthPct] = useState<number>(
    saved?.editorWidth ?? DEFAULT_EDITOR_WIDTH
  );
  const workspaceRef  = useRef<HTMLDivElement>(null);
  const isDragging    = useRef(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor  = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!isDragging.current || !workspaceRef.current) return;
      const rect  = workspaceRef.current.getBoundingClientRect();
      const total = rect.width;
      const x     = e.clientX - rect.left;
      const pct   = (x / total) * 100;

      const minPct = (MIN_WIDTH / total) * 100;
      const maxPct = 100 - minPct;

      setEditorWidthPct(Math.min(Math.max(pct, minPct), maxPct));
    }

    function onMouseUp() {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor    = '';
      document.body.style.userSelect = '';
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',   onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',   onMouseUp);
    };
  }, []);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const execute = useCallback(() => {
    const res = run(code, { subscriberAttributes, dataExtensions });
    setResult(res);
    setActiveTab(res.errors.length > 0 ? 'errors' : 'output');
  }, [code, subscriberAttributes, dataExtensions]);

  useEffect(() => {
    if (!autoRun) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(execute, 600);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [code, subscriberAttributes, dataExtensions, autoRun, execute]);

  useEffect(() => {
    saveState({ code, subscriberAttributes, dataExtensions, editorWidth: editorWidthPct });
  }, [code, subscriberAttributes, dataExtensions, editorWidthPct]);

  function handleClear() { setCode(''); setResult(null); }
  function handleReset() {
    setCode(DEFAULT_CODE);
    setSubscriberAttributes(DEFAULT_ATTRIBUTES);
    setDataExtensions([]);
    setEditorWidthPct(DEFAULT_EDITOR_WIDTH);
    setResult(null);
  }

  return (
    <div className={styles.container}>

      {}
      <div className={styles.toolbar}>
        <span className={styles.title}>AMPscript Playground</span>
        <label className={styles.autoRunLabel}>
          <input
            type="checkbox"
            checked={autoRun}
            onChange={e => setAutoRun(e.target.checked)}
          />
          Auto-run
        </label>
        <button className={styles.runBtn} onClick={execute}>▶ Run</button>
        <button className={styles.clearBtn} onClick={handleClear}>Clear</button>
        <button className={styles.clearBtn} onClick={handleReset}>Reset</button>
      </div>

      {/* Workspace */}
      <div className={styles.workspace} ref={workspaceRef}>

        {/* Editor */}
        <div
          className={styles.left}
          style={{ width: `${editorWidthPct}%` }}
        >
          <EditorPanel code={code} onChange={setCode} />
        </div>

        {/* Divisor arrastável */}
        <div
          className={styles.resizer}
          onMouseDown={onMouseDown}
          title="Drag to resize"
        />

        {/* Output + painéis */}
        <div className={styles.right} style={{ flex: 1 }}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'output' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('output')}
            >
              Output
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'errors' ? styles.tabActive : ''} ${
                result?.errors.length ? styles.tabError : ''
              }`}
              onClick={() => setActiveTab('errors')}
            >
              Errors{result?.errors.length ? ` (${result.errors.length})` : ''}
            </button>
          </div>

          {activeTab === 'output'
            ? <OutputPanel result={result} />
            : <ErrorsPanel result={result} />
          }

          <SubscriberPanel
            attributes={subscriberAttributes}
            onChange={setSubscriberAttributes}
          />
          <DataExtensionPanel
            dataExtensions={dataExtensions}
            onChange={setDataExtensions}
          />
        </div>
      </div>
    </div>
  );
}