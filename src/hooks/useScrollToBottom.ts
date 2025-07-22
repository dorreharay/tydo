import { useEffect, useRef } from 'react';

export const useScrollToBottom = <T extends unknown[]>(
  dependencies: T,
  delay = 100
) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    };

    const timeoutId = setTimeout(scrollToBottom, delay);

    return () => clearTimeout(timeoutId);
  }, dependencies);

  return containerRef;
};