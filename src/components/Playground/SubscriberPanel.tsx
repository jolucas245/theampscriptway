import React, { useState } from 'react';
import type { SubscriberAttributes } from '../../lib/ampscript/types';
import styles from './Playground.module.css';

interface Props {
  attributes: SubscriberAttributes;
  onChange: (attrs: SubscriberAttributes) => void;
}

export function SubscriberPanel({ attributes, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newVal, setNewVal] = useState('');

  const keys = Object.keys(attributes);

  function update(key: string, value: string) {
    onChange({ ...attributes, [key]: value });
  }

  function remove(key: string) {
    const next = { ...attributes };
    delete next[key];
    onChange(next);
  }

  function add() {
    const k = newKey.trim();
    if (!k) return;
    onChange({ ...attributes, [k]: newVal });
    setNewKey('');
    setNewVal('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') add();
  }

  return (
    <div className={styles.panel}>
      <button
        className={styles.panelHeader}
        onClick={() => setOpen(o => !o)}
      >
        Subscriber Attributes ({keys.length}) {open ? '▲' : '▼'}
      </button>

      {open && (
        <div className={styles.panelBody}>
          {keys.map(key => (
            <div key={key} className={styles.attrRow}>
              <span className={styles.attrKey} title={key}>{key}</span>
              <input
                className={styles.attrInput}
                value={String(attributes[key] ?? '')}
                onChange={e => update(key, e.target.value)}
              />
              <button
                className={styles.removeBtn}
                onClick={() => remove(key)}
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}

          <div className={styles.attrRow}>
            <input
              className={styles.attrInput}
              placeholder="Attribute name"
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <input
              className={styles.attrInput}
              placeholder="Value"
              value={newVal}
              onChange={e => setNewVal(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className={styles.addBtn}
              onClick={add}
              title="Add attribute"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}