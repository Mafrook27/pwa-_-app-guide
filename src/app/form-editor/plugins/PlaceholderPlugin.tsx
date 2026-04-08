import React, { useState, useEffect, useCallback } from 'react';
import { availablePlaceholders } from '@/data/mockData';

interface PlaceholderDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (placeholder: string) => void;
  position: { top: number; left: number };
  searchTerm: string;
}

export function PlaceholderDropdown({ 
  isOpen, 
  onClose, 
  onSelect, 
  position,
  searchTerm 
}: PlaceholderDropdownProps) {
  const [filteredPlaceholders, setFilteredPlaceholders] = useState(availablePlaceholders);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  useEffect(() => {
    const term = searchTerm.toLowerCase().replace('@', '');
    if (term) {
      const filtered = availablePlaceholders.filter(p => 
        p.label.toLowerCase().includes(term) || 
        p.value.toLowerCase().includes(term)
      );
      setFilteredPlaceholders(filtered);
      setSelectedIndex(0);
    } else {
      setFilteredPlaceholders(availablePlaceholders);
      setSelectedIndex(0);
    }
  }, [searchTerm]);
  
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredPlaceholders.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredPlaceholders[selectedIndex]) {
          onSelect(filteredPlaceholders[selectedIndex].value);
          onClose();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredPlaceholders, selectedIndex, onSelect, onClose]);
  
  // Group by category
  const groupedPlaceholders = filteredPlaceholders.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {} as Record<string, typeof availablePlaceholders>);
  
  if (!isOpen) return null;
  
  let currentGlobalIndex = 0;
  
  return (
    <div 
      className="fixed z-50 bg-popover rounded-md border shadow-lg w-64 max-h-72 overflow-auto"
      style={{ top: position.top, left: position.left }}
    >
      {Object.keys(groupedPlaceholders).length === 0 ? (
        <div className="py-4 text-center text-sm text-muted-foreground">
          No placeholders found.
        </div>
      ) : (
        Object.entries(groupedPlaceholders).map(([category, items]) => (
          <div key={category} className="p-1">
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              {category}
            </div>
            {items.map((placeholder) => {
              const itemIndex = currentGlobalIndex++;
              return (
                <div
                  key={placeholder.value}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-sm cursor-pointer ${
                    itemIndex === selectedIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
                  }`}
                  onClick={() => {
                    onSelect(placeholder.value);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(itemIndex)}
                >
                  <span className="font-mono text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                    {placeholder.value}
                  </span>
                  <span className="text-sm text-muted-foreground truncate">
                    {placeholder.label}
                  </span>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}

interface UsePlaceholderTriggerOptions {
  onInsert: (placeholder: string, cursorPosition: number) => void;
}

export function usePlaceholderTrigger(options: UsePlaceholderTriggerOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [triggerStart, setTriggerStart] = useState(-1);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent, inputElement: HTMLInputElement | HTMLTextAreaElement | HTMLElement) => {
    const cursorPos = 'selectionStart' in inputElement ? inputElement.selectionStart || 0 : 0;
    
    if (e.key === '@') {
      // Open dropdown
      const rect = inputElement.getBoundingClientRect();
      setPosition({ 
        top: rect.bottom + 4, 
        left: rect.left 
      });
      setIsOpen(true);
      setSearchTerm('@');
      setTriggerStart(cursorPos);
    } else if (isOpen) {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
      } else if (e.key === 'Backspace') {
        if (searchTerm.length <= 1) {
          setIsOpen(false);
          setSearchTerm('');
        } else {
          setSearchTerm(prev => prev.slice(0, -1));
        }
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Enter') {
        setSearchTerm(prev => prev + e.key);
      }
    }
  }, [isOpen, searchTerm]);
  
  const handleSelect = useCallback((placeholder: string) => {
    options.onInsert(placeholder, triggerStart);
    setIsOpen(false);
    setSearchTerm('');
    setTriggerStart(-1);
  }, [options, triggerStart]);
  
  const close = useCallback(() => {
    setIsOpen(false);
    setSearchTerm('');
    setTriggerStart(-1);
  }, []);
  
  return {
    isOpen,
    position,
    searchTerm,
    handleKeyDown,
    handleSelect,
    close,
  };
}

// Helper to insert placeholder into text
export function insertPlaceholderIntoText(
  text: string, 
  placeholder: string, 
  position: number
): string {
  // Find the @ symbol position to replace it along with any typed characters
  let atPosition = position;
  for (let i = position; i >= 0; i--) {
    if (text[i] === '@') {
      atPosition = i;
      break;
    }
  }
  
  const before = text.substring(0, atPosition);
  const after = text.substring(position);
  
  return before + placeholder + after;
}
