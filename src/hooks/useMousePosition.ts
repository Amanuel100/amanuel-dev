import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
export function useMousePosition() {
  useEffect(() => {
    const move = (event: PointerEvent) => useAppStore.getState().setMouse({ x: event.clientX / window.innerWidth * 2 - 1, y: -(event.clientY / window.innerHeight * 2 - 1) });
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
}
