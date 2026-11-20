import { useMemo } from 'react';
export function useSplitText(text: string, mode: 'chars' | 'words' = 'chars') { return useMemo(() => mode === 'chars' ? Array.from(text) : text.split(/\s+/), [text, mode]); }
