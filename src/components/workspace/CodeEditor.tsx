import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

interface CodeEditorProps {
  code: string;
  filename: string;
  onChange?: (value: string) => void;
}

const CodeEditor = ({ code, filename, onChange }: CodeEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Create editor
    monacoRef.current = monaco.editor.create(editorRef.current, {
      value: code,
      language: getLanguage(filename),
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
    });

    // Listen for changes
    monacoRef.current.onDidChangeModelContent(() => {
      if (monacoRef.current && onChange) {
        onChange(monacoRef.current.getValue());
      }
    });

    return () => {
      monacoRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (monacoRef.current) {
      const currentValue = monacoRef.current.getValue();
      if (currentValue !== code) {
        monacoRef.current.setValue(code);
      }
    }
  }, [code]);

  const getLanguage = (filename: string): string => {
    if (filename.endsWith('.html')) return 'html';
    if (filename.endsWith('.css')) return 'css';
    if (filename.endsWith('.js')) return 'javascript';
    if (filename.endsWith('.json')) return 'json';
    return 'plaintext';
  };

  return <div ref={editorRef} className="h-full w-full" />;
};

export default CodeEditor;
