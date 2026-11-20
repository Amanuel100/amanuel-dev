import { useEffect, useRef, useState } from 'react';
export function useInView<T extends HTMLElement = HTMLDivElement>(once = false) {
  const ref = useRef<T>(null); const [inView, setInView] = useState(false);
  useEffect(() => {
    const element = ref.current; if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting); if (entry.isIntersecting && once) observer.disconnect();
    }, { rootMargin: '200px' });
    observer.observe(element); return () => observer.disconnect();
  }, [once]);
  return { ref, inView };
}
