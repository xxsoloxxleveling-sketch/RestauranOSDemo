import { useEffect } from 'react';

export interface HotkeyRule {
  key: string; // e.g. "1", "n", "Enter", "F1", "Escape"
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  action: (e: KeyboardEvent) => void;
  allowInInputs?: boolean;
  desc?: string;
}

export function useHotkeys(rules: HotkeyRule[], deps: any[] = []) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Check if target is an editable input
      const target = event.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      for (const rule of rules) {
        // Compare key case-insensitively for letters, or exact for special keys
        const keyMatch =
          event.key.toLowerCase() === rule.key.toLowerCase() ||
          event.code.toLowerCase() === rule.key.toLowerCase();

        const altMatch = !!rule.altKey === event.altKey;
        const ctrlMatch = !!rule.ctrlKey === (event.ctrlKey || event.metaKey);
        const shiftMatch = !!rule.shiftKey === event.shiftKey;

        if (keyMatch && altMatch && ctrlMatch && shiftMatch) {
          // If in input, only trigger if rule explicitly allows OR if Alt/Ctrl modifier is held
          if (isInput && !rule.allowInInputs && !event.altKey && !event.ctrlKey && !event.metaKey) {
            continue;
          }

          event.preventDefault();
          rule.action(event);
          break; // Stop checking after first match
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [rules, ...deps]);
}
