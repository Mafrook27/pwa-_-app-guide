import React, { memo, useState } from 'react';
import { useEditor } from '../EditorContext';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PenTool, X, Upload } from 'lucide-react';
import type { SignatureBlockProps } from '../editorConfig';

export const SignatureBlock = memo(function SignatureBlock({ block }: { block: SignatureBlockProps }) {
  const { state, updateBlockWithHistory } = useEditor();
  const isPreview = state.isPreviewMode;
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempUrl, setTempUrl] = useState(block.signatureUrl || '');
  
  const handleInsertSignature = () => {
    // Insert a predefined signature placeholder or allow URL input
    setShowUrlInput(true);
  };
  
  const handleSaveUrl = () => {
    updateBlockWithHistory(block.id, { signatureUrl: tempUrl });
    setShowUrlInput(false);
  };
  
  const handleClearSignature = () => {
    updateBlockWithHistory(block.id, { signatureUrl: '' });
    setTempUrl('');
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        updateBlockWithHistory(block.id, { signatureUrl: dataUrl });
        setTempUrl(dataUrl);
        setShowUrlInput(false);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">
        {block.label}
        {block.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      {block.signatureUrl ? (
        <div className="relative border border-input rounded-md overflow-hidden bg-muted/10 p-4">
          <img 
            src={block.signatureUrl} 
            alt="Signature" 
            className="max-h-24 mx-auto"
          />
          {!isPreview && !block.locked && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 text-destructive hover:text-destructive"
              onClick={handleClearSignature}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div className="border border-dashed border-input rounded-md p-6 text-center bg-muted/5">
          {showUrlInput ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  type="url"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="Enter signature image URL..."
                  className="flex-1 h-9 text-sm"
                />
                <Button size="sm" className="h-9" onClick={handleSaveUrl}>
                  Save
                </Button>
                <Button variant="ghost" size="sm" className="h-9" onClick={() => setShowUrlInput(false)}>
                  Cancel
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Or upload a signature image:
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm cursor-pointer hover:bg-secondary/80 transition-colors">
                <Upload className="h-4 w-4" />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <>
              <PenTool className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                {block.helpText || 'Click to insert signature'}
              </p>
              {!isPreview && !block.locked && (
                <Button variant="outline" size="sm" onClick={handleInsertSignature}>
                  <PenTool className="h-4 w-4 mr-2" />
                  Insert Signature
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
});
