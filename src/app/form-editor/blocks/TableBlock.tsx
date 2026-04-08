import React, { memo, useState, useRef, useEffect } from 'react';
import { useEditor } from '../EditorContext';
import { Button } from '@/components/ui/button';
import { Plus, Minus, GripVertical } from 'lucide-react';
import type { TableBlockProps } from '../editorConfig';

export const TableBlock = memo(function TableBlock({ block }: { block: TableBlockProps }) {
  const { state, updateBlockWithHistory } = useEditor();
  const isPreview = state.isPreviewMode;
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);
  
  const updateCell = (rowIdx: number, colIdx: number, value: string) => {
    const newRows = block.rows.map((row, ri) =>
      row.map((cell, ci) => (ri === rowIdx && ci === colIdx ? value : cell))
    );
    updateBlockWithHistory(block.id, { rows: newRows });
  };
  
  const addRow = () => {
    const colCount = block.rows[0]?.length || 3;
    const newRow = Array(colCount).fill('');
    updateBlockWithHistory(block.id, { rows: [...block.rows, newRow] });
  };
  
  const removeRow = (idx: number) => {
    if (block.rows.length <= 1) return;
    const newRows = block.rows.filter((_, i) => i !== idx);
    updateBlockWithHistory(block.id, { rows: newRows });
  };
  
  const addColumn = () => {
    const newRows = block.rows.map((row, idx) => [...row, idx === 0 && block.headerRow ? 'Header' : '']);
    updateBlockWithHistory(block.id, { rows: newRows });
  };
  
  const removeColumn = (colIdx: number) => {
    if ((block.rows[0]?.length || 0) <= 1) return;
    const newRows = block.rows.map(row => row.filter((_, ci) => ci !== colIdx));
    updateBlockWithHistory(block.id, { rows: newRows });
  };
  
  const handleCellClick = (rowIdx: number, colIdx: number) => {
    if (!isPreview && !block.locked) {
      setEditingCell({ row: rowIdx, col: colIdx });
    }
  };
  
  const handleCellBlur = () => {
    setEditingCell(null);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent, rowIdx: number, colIdx: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setEditingCell(null);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const nextCol = colIdx + 1;
      const colCount = block.rows[0]?.length || 0;
      if (nextCol < colCount) {
        setEditingCell({ row: rowIdx, col: nextCol });
      } else if (rowIdx + 1 < block.rows.length) {
        setEditingCell({ row: rowIdx + 1, col: 0 });
      } else {
        setEditingCell(null);
      }
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          {block.rows.map((row, rowIdx) => {
            const isHeader = block.headerRow && rowIdx === 0;
            const Tag = isHeader ? 'th' : 'td';
            const RowTag = isHeader ? 'thead' : 'tbody';
            
            return (
              <RowTag key={rowIdx}>
                <tr className={isHeader ? 'bg-muted/50' : rowIdx % 2 === 0 ? '' : 'bg-muted/20'}>
                  {row.map((cell, colIdx) => (
                    <Tag
                      key={colIdx}
                      className={`border border-border p-2 ${isHeader ? 'font-semibold text-left' : ''} ${
                        editingCell?.row === rowIdx && editingCell?.col === colIdx ? 'p-0' : ''
                      }`}
                      onClick={() => handleCellClick(rowIdx, colIdx)}
                    >
                      {editingCell?.row === rowIdx && editingCell?.col === colIdx ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={cell}
                          onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                          onBlur={handleCellBlur}
                          onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
                          className="w-full p-2 bg-background border-0 outline-none ring-2 ring-primary"
                        />
                      ) : (
                        <span className={!isPreview && !block.locked ? 'cursor-text hover:bg-primary/5 block px-1 -mx-1 rounded' : ''}>
                          {cell || (isPreview ? '' : <span className="text-muted-foreground/50">Click to edit</span>)}
                        </span>
                      )}
                    </Tag>
                  ))}
                  {!isPreview && !block.locked && (
                    <td className="border border-border p-1 w-8">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={() => removeRow(rowIdx)}
                        disabled={block.rows.length <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </td>
                  )}
                </tr>
              </RowTag>
            );
          })}
        </table>
      </div>
      
      {!isPreview && !block.locked && (
        <div className="flex items-center gap-2 justify-end">
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={addRow}>
            <Plus className="h-3 w-3" /> Row
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={addColumn}>
            <Plus className="h-3 w-3" /> Column
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={() => removeColumn(block.rows[0].length - 1)}
            disabled={(block.rows[0]?.length || 0) <= 1}
          >
            <Minus className="h-3 w-3" /> Column
          </Button>
        </div>
      )}
    </div>
  );
});
