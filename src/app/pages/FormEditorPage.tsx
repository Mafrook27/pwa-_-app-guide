import React from 'react';
import { EditorProvider } from '@/app/form-editor/EditorContext';
import { EditorLayout } from '@/app/form-editor/EditorLayout';

export default function FormEditorPage() {
  return (
    <EditorProvider>
      <EditorLayout />
    </EditorProvider>
  );
}
