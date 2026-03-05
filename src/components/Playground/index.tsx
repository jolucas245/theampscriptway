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

const DEFAULT_CODE = `%%[\n  VAR @firstName, @score, @grade\n\n  SET @firstName = AttributeValue("FirstName")\n  SET @score = 87\n\n  IF @score >= 90 THEN\n    SET @grade = "A"\n  ELSEIF @score >= 80 THEN\n    SET @grade = "B"\n  ELSEIF @score >= 70 THEN\n    SET @grade = "C"\n  ELSE\n    SET @grade = "F"\n  ENDIF\n]%%\n\n<h2>Hello, %%=V(@firstName)=%%!</h2>\n<p>Your score is <strong>%%=V(@score)=%%</strong> - Grade: <strong>%%=V(@grade)=%%</strong></p>\n<p>Report generated on %%=FormatDate(Now(), "MMMM DD, YYYY")=%%</p>\n`;

const DEFAULT_ATTRIBUTES: SubscriberAttributes = {
  FirstName:    'Maria',
  LastName:     'Silva',
  EmailAddress: 'maria@example.com',
};

const MIN_WIDTH = 280;
const DEFAULT_EDITOR_WIDTH = 55;

type RightTab = 'output' | 'errors' | 'subscriber' | 'dataextensions';

function ErrorsContent({ result }: { result: RunResult | null }) {
  if (!result || result.errors.length === 0) {
    return (
      <div className={styles.noErrors}>
        <span>✓</span> Nenhum erro
      </div>
    );
  }
  return (
    <div className={styles.errorList}>
      {result.errors.map((err, i) => (
        <div key={i} className={styles.errorItem}>
          {err.line != null && (
            <span className={styles.errorLine}>Line {err.line}:</span>
          )}
          {err.message}
        </div>
      ))}
    </div>
  );
}

export default function Playground() {
  const saved = loadState();

  const [code, setCode]     = useState<string>(saved?.code ?? DEFAULT_CODE);
  const [subscriberAttributes, setSubscriberAttributes] = useState<SubscriberAttributes>(
    saved?.subscriberAttributes ?? DEFAULT_ATTRIBUTES
  );
  const [dataExtensions, setDataExtensions] = useState<DataExtension[]>(
    saved?.dataExtensions ?? []
  );
  const [result, setResult]       = useState<RunResult | null>(null);
  const [activeTab, setActiveTab] = useState<RightTab>('output');
  const [runMs, setRunMs]         = useState<number | null>(null);

  const [editorWidthPct, setEditorWidthPct] = useState<number>(
    saved?.editorWidth ?? DEFAULT_EDITOR_WIDTH
  );
  const workspaceRef = useRef<HTMLDivElement>(null);
  const isDragging   = useRef(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current             = true;
    document.body.style.cursor     = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!isDragging.current || !workspaceRef.current) return;
      const rect   = workspaceRef.current.getBoundingClientRect();
      const pct    = ((e.clientX - rect.left) / rect.width) * 100;
      const minPct = (MIN_WIDTH / rect.width) * 100;
      const maxPct = 100 - minPct;
      setEditorWidthPct(Math.min(Math.max(pct, minPct), maxPct));
    }
    function onMouseUp() {
      if (!isDragging.current) return;
      isDragging.current             = false;
      document.body.style.cursor     = '';
      document.body.style.userSelect = '';
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',   onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',   onMouseUp);
    };
  }, []);

  const execute = useCallback(() => {
    const t0  = performance.now();
    const res = run(code, { subscriberAttributes, dataExtensions });
    setRunMs(performance.now() - t0);
    setResult(res);
    setActiveTab(res.errors.length > 0 ? 'errors' : 'output');
  }, [code, subscriberAttributes, dataExtensions]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        execute();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [execute]);

  useEffect(() => {
    saveState({ code, subscriberAttributes, dataExtensions, editorWidth: editorWidthPct });
  }, [code, subscriberAttributes, dataExtensions, editorWidthPct]);

  function handleClear() { setCode(''); setResult(null); setRunMs(null); }
  function handleReset() {
    setCode(DEFAULT_CODE);
    setSubscriberAttributes(DEFAULT_ATTRIBUTES);
    setDataExtensions([]);
    setEditorWidthPct(DEFAULT_EDITOR_WIDTH);
    setResult(null);
    setRunMs(null);
  }

  const errorCount = result?.errors.length ?? 0;
  const attrCount  = Object.keys(subscriberAttributes).length;
  const deCount    = dataExtensions.length;

  return (
    <div className={styles.container}>

      {}
      <div className={styles.toolbar}>
        <span className={styles.title}>
          <span className={styles.titleAccent}>AMPscript</span> Playground
        </span>

        <span className={styles.shortcut}>
          <span className={styles.kbd}>Ctrl</span>+<span className={styles.kbd}>↵</span>
        </span>

        <div className={styles.sep} />

        <button className={styles.runBtn} onClick={execute}>▶ Executar</button>
        <button className={styles.ghostBtn} onClick={handleClear}>Limpar</button>
        <button className={styles.ghostBtn} onClick={handleReset}>Resetar</button>
      </div>

      {}
      <div className={styles.workspace} ref={workspaceRef}>

        {}
        <div className={styles.left} style={{ width: `${editorWidthPct}%` }}>
          <div className={styles.editorWrap}>
            <EditorPanel code={code} onChange={setCode} />
          </div>
        </div>

        {}
        <div className={styles.resizer} onMouseDown={onMouseDown} title="Drag to resize" />

        {}
        <div className={styles.right}>

          {}
          <div className={styles.tabBar}>
            <button
              className={`${styles.tab} ${activeTab === 'output' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('output')}
            >
              Saída
            </button>

            <button
              className={`${styles.tab} ${activeTab === 'errors' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('errors')}
            >
              Erros
              {errorCount > 0 && (
                <span className={`${styles.tabBadge} ${styles.tabBadgeError}`}>
                  {errorCount}
                </span>
              )}
            </button>

            <button
              className={`${styles.tab} ${activeTab === 'subscriber' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('subscriber')}
            >
              Subscriber
              {attrCount > 0 && (
                <span className={styles.tabBadge}>{attrCount}</span>
              )}
            </button>

            <button
              className={`${styles.tab} ${activeTab === 'dataextensions' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('dataextensions')}
            >
              Data Extensions
              {deCount > 0 && (
                <span className={styles.tabBadge}>{deCount}</span>
              )}
            </button>
          </div>

          {}
          <div className={styles.tabContent}>
            {activeTab === 'output' && <OutputPanel result={result} />}

            {activeTab === 'errors' && <ErrorsContent result={result} />}

            {activeTab === 'subscriber' && (
              <div className={styles.dataPanel}>
                <div className={styles.dataSectionTitle}>Subscriber Attributes</div>
                <SubscriberPanel
                  attributes={subscriberAttributes}
                  onChange={setSubscriberAttributes}
                />
              </div>
            )}

            {activeTab === 'dataextensions' && (
              <div className={styles.dataPanel}>
                <div className={styles.dataSectionTitle}>Data Extensions</div>
                <DataExtensionPanel
                  dataExtensions={dataExtensions}
                  onChange={setDataExtensions}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {}
      <div className={styles.statusBar}>
        <div className={`${styles.statusDot} ${
          result && errorCount === 0 ? styles.statusDotOk :
          result && errorCount  > 0 ? styles.statusDotError : ''
        }`} />
        <span className={
          result && errorCount === 0 ? styles.statusOk :
          result && errorCount  > 0 ? styles.statusError : ''
        }>
          {!result && 'Ready'}
          {result && errorCount === 0 && `OK${runMs != null ? ` · ${runMs.toFixed(0)}ms` : ''}`}
          {result && errorCount  > 0 && `${errorCount} error${errorCount > 1 ? 's' : ''}`}
        </span>
        <div className={styles.statusSpacer} />
        <span>ampscriptway.com.br</span>
      </div>
    </div>
  );
}
