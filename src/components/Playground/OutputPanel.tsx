import React, { useState } from 'react';
import type { RunResult } from '../../lib/ampscript/runtime';
import styles from './Playground.module.css';

interface Props {
  result: RunResult | null;
}

export function OutputPanel({ result }: Props) {
  const [view, setView] = useState<'preview' | 'html'>('preview');

  if (!result) {
    return (
      <div className={styles.outputPanel}>
        <div className={styles.outputEmpty}>
          <span>Clique em Executar para visualizar a saída</span>
          <span className={styles.outputEmptyKbd}>Ctrl + Enter</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.outputPanel}>
      <div className={styles.viewToggle}>
        <button
          className={`${styles.viewBtn} ${view === 'preview' ? styles.viewActive : ''}`}
          onClick={() => setView('preview')}
        >
          Preview
        </button>
        <button
          className={`${styles.viewBtn} ${view === 'html' ? styles.viewActive : ''}`}
          onClick={() => setView('html')}
        >
          HTML Source
        </button>
      </div>

      {view === 'preview' ? (
        <div
          className={styles.preview}
          dangerouslySetInnerHTML={{ __html: result.html }}
        />
      ) : (
        <pre className={styles.htmlSource}>{result.html}</pre>
      )}
    </div>
  );
}
