import React, { useEffect, useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import styles from './Playground.module.css';

interface Props {
  code: string;
  onChange: (value: string) => void;
}

function registerAmpscript(monaco: any) {
  const LANG = 'ampscript';
  if (monaco.languages.getLanguages().some((l: any) => l.id === LANG)) return;

  monaco.languages.register({ id: LANG });

  monaco.languages.setMonarchTokensProvider(LANG, {
    ignoreCase: true,
    tokenizer: {
      root: [
        [/%%\[/, { token: 'delimiter.ampscript', next: '@ampBlock' }],
        [/%%=/, { token: 'delimiter.ampscript', next: '@ampInline' }],
        [/%%[A-Za-z_][A-Za-z0-9_]*%%/, 'variable.other'],
        [/<\/?[a-z][^>]*>/i, 'tag'],
        [/<!--/, { token: 'comment', next: '@htmlComment' }],
      ],
      ampBlock: [
        [/\]\s*%%/, { token: 'delimiter.ampscript', next: '@pop' }],
        { include: '@ampCommon' },
      ],
      ampInline: [
        [/=%%/, { token: 'delimiter.ampscript', next: '@pop' }],
        { include: '@ampCommon' },
      ],
      ampCommon: [
        [/\/\*/, { token: 'comment', next: '@blockComment' }],
        [/\b(VAR|SET|IF|ELSEIF|ELSE|ENDIF|FOR|TO|DO|NEXT|STEP|THEN|AND|OR|NOT)\b/i, 'keyword'],
        [/\b(TRUE|FALSE|NULL)\b/i, 'constant.language'],
        [/@[A-Za-z_][A-Za-z0-9_]*/, 'variable'],
        [/[A-Za-z_][A-Za-z0-9_]*(?=\s*\()/, 'entity.name.function'],
        [/"([^"\\]|\\.)*"/, 'string'],
        [/'([^'\\]|\\.)*'/, 'string'],
        [/\b\d+(\.\d+)?\b/, 'number'],
        [/[().,]/, 'delimiter'],
        [/[+\-*/<>=!]+/, 'operator'],
        [/\s+/, ''],
      ],
      blockComment: [
        [/\*\//, { token: 'comment', next: '@pop' }],
        [/./, 'comment'],
      ],
      htmlComment: [
        [/-->/, { token: 'comment', next: '@pop' }],
        [/./, 'comment'],
      ],
    },
  });

  monaco.editor.defineTheme('ampscript-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'delimiter.ampscript',  foreground: 'FFD700', fontStyle: 'bold' },
      { token: 'keyword',              foreground: '569CD6', fontStyle: 'bold' },
      { token: 'constant.language',    foreground: '569CD6' },
      { token: 'variable',             foreground: '9CDCFE' },
      { token: 'variable.other',       foreground: 'C586C0' },
      { token: 'entity.name.function', foreground: 'DCDCAA' },
      { token: 'string',               foreground: 'CE9178' },
      { token: 'number',               foreground: 'B5CEA8' },
      { token: 'comment',              foreground: '6A9955', fontStyle: 'italic' },
      { token: 'tag',                  foreground: '4EC9B0' },
      { token: 'operator',             foreground: 'D4D4D4' },
      { token: 'delimiter',            foreground: 'D4D4D4' },
    ],
    colors: {
      'editor.background':              '#1e1e1e',
      'editor.lineHighlightBackground': '#2a2a2a',
      'editorLineNumber.foreground':    '#555555',
      'editorCursor.foreground':        '#FFD700',
    },
  });

  monaco.editor.defineTheme('ampscript-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'delimiter.ampscript',  foreground: 'B8860B', fontStyle: 'bold' },
      { token: 'keyword',              foreground: '0000FF', fontStyle: 'bold' },
      { token: 'constant.language',    foreground: '0000FF' },
      { token: 'variable',             foreground: '1971C2' },
      { token: 'variable.other',       foreground: '7B3FC0' },
      { token: 'entity.name.function', foreground: '5F3DC4' },
      { token: 'string',               foreground: 'C2410C' },
      { token: 'number',               foreground: '2F9E44' },
      { token: 'comment',              foreground: '6A737D', fontStyle: 'italic' },
      { token: 'tag',                  foreground: '0C8599' },
      { token: 'operator',             foreground: '333333' },
      { token: 'delimiter',            foreground: '333333' },
    ],
    colors: {
      'editor.background':              '#f4f5f7',
      'editor.lineHighlightBackground': '#eaedf5',
      'editorLineNumber.foreground':    '#a0a8c0',
      'editorCursor.foreground':        '#B8860B',
      'editor.selectionBackground':     '#c8d3f5',
    },
  });

  monaco.languages.registerCompletionItemProvider(LANG, {
    provideCompletionItems(model: any, position: any) {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber:   position.lineNumber,
        startColumn:     word.startColumn,
        endColumn:       word.endColumn,
      };

      const keywords = [
        'VAR', 'SET', 'IF', 'ELSEIF', 'ELSE', 'ENDIF',
        'FOR', 'TO', 'DO', 'NEXT', 'STEP', 'THEN',
        'AND', 'OR', 'NOT', 'TRUE', 'FALSE', 'NULL',
      ];

      const functions = [
        'CONCAT', 'UPPERCASE', 'LOWERCASE', 'PROPERCASE',
        'TRIM', 'TRIMLEFT', 'TRIMRIGHT', 'LENGTH',
        'SUBSTRING', 'INDEXOF', 'REPLACE', 'REGEXMATCH', 'REGEXREPLACE',
        'CHAR', 'DOMAIN', 'FORMAT', 'FORMATCURRENCY', 'FORMATNUMBER',
        'URLENCODE', 'URLDECODE', 'STRINGTOHEX', 'WRAPTEXT',
        'ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE', 'MOD',
        'ABS', 'CEILING', 'FLOOR', 'ROUND', 'SQRT', 'POWER',
        'RANDOM', 'MAX', 'MIN',
        'NOW', 'GETSENDTIME', 'SYSTEMDATE', 'FORMATDATE',
        'DATEADD', 'DATEDIFF', 'DATEPART', 'DATEPARSE',
        'STRINGTODATE', 'LOCALDATETOSYSTEMDATE', 'SYSTEMDATETOLOCALDATE',
        'OUTPUT', 'OUTPUTLINE', 'V', 'EMPTY', 'ISNULL', 'ISNULLDEFAULT',
        'IIF', 'TOSTRING', 'NOT', 'ATTRIBUTEVALUE',
        'BASE64ENCODE', 'BASE64DECODE', 'MD5', 'SHA256', 'GUID',
        'RAISEERROR', 'TREATASCONTENT',
        'LOOKUP', 'LOOKUPROWS', 'LOOKUPORDEREDROWS', 'LOOKUPORDEREDROWSCS',
        'ROW', 'ROWCOUNT', 'FIELD', 'DATAEXTENSIONROWCOUNT',
        'INSERTDE', 'UPDATEDE', 'UPSERTDE', 'DELETEDE',
      ];

      const kwSuggestions = keywords.map(kw => ({
        label: kw,
        kind:  monaco.languages.CompletionItemKind.Keyword,
        insertText: kw,
        range,
      }));

      const fnSuggestions = functions.map(fn => ({
        label:      fn,
        kind:       monaco.languages.CompletionItemKind.Function,
        insertText: `${fn}($1)`,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      }));

      return { suggestions: [...kwSuggestions, ...fnSuggestions] };
    },
  });
}

function useDocusaurusTheme(): 'dark' | 'light' {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof document === 'undefined') return 'dark';
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const t = document.documentElement.getAttribute('data-theme');
      setTheme(t === 'dark' ? 'dark' : 'light');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}

export function EditorPanel({ code, onChange }: Props) {
  const monaco = useMonaco();
  const docTheme = useDocusaurusTheme();
  const monacoTheme = docTheme === 'dark' ? 'ampscript-dark' : 'ampscript-light';

  useEffect(() => {
    if (monaco) registerAmpscript(monaco);
  }, [monaco]);

  useEffect(() => {
    if (monaco) {
      monaco.editor.setTheme(monacoTheme);
    }
  }, [monaco, monacoTheme]);

  return (
    <div className={styles.editorWrap}>
      <Editor
        height="100%"
        language="ampscript"
        theme={monacoTheme}
        value={code}
        onChange={v => onChange(v ?? '')}
        options={{
          fontSize:                   14,
          minimap:                    { enabled: false },
          wordWrap:                   'on',
          scrollBeyondLastLine:       false,
          tabSize:                    2,
          lineNumbers:                'on',
          renderWhitespace:           'none',
          automaticLayout:            true,
          suggestOnTriggerCharacters: true,
          quickSuggestions:           true,
          folding:                    true,
        }}
      />
    </div>
  );
}