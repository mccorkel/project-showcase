import React, { useEffect, useRef } from 'react';
import { View } from '@aws-amplify/ui-react';

// Import Monaco Editor types
type Monaco = typeof import('monaco-editor');
type MonacoEditor = import('monaco-editor').editor.IStandaloneCodeEditor;

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'html' | 'css' | 'javascript';
  height?: string;
  width?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  height = '300px',
  width = '100%'
}) => {
  const editorRef = useRef<MonacoEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<Monaco | null>(null);

  // Load Monaco Editor dynamically
  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      // Dynamic import of Monaco Editor
      import('monaco-editor').then(monaco => {
        monacoRef.current = monaco;

        // Configure Monaco Editor
        if (containerRef.current) {
          // Create editor instance
          editorRef.current = monaco.editor.create(containerRef.current, {
            value,
            language,
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            tabSize: 2,
            wordWrap: 'on'
          });

          // Add change event listener
          editorRef.current.onDidChangeModelContent(() => {
            const newValue = editorRef.current?.getValue() || '';
            onChange(newValue);
          });
        }
      }).catch(error => {
        console.error('Failed to load Monaco Editor:', error);
      });
    }

    // Cleanup function
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
  }, []);

  // Update editor value when prop changes
  useEffect(() => {
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      if (value !== currentValue) {
        editorRef.current.setValue(value);
      }
    }
  }, [value]);

  // Update editor language when prop changes
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monacoRef.current.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

  return (
    <View
      ref={containerRef}
      style={{
        height,
        width,
        border: '1px solid #ccc',
        borderRadius: '4px',
        overflow: 'hidden'
      }}
    />
  );
};

export default CodeEditor; 