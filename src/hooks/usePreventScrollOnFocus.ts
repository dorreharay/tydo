import { useEffect, RefObject } from 'react';

export const usePreventScrollOnFocus = (
  inputRef: RefObject<HTMLElement>,
  containerRef: RefObject<HTMLElement>
) => {
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      if (e.target === inputRef.current) {
        e.preventDefault();
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;

        if (containerRef.current) {
          containerRef.current.scrollTop = 0;
        }
      }
    };

    const input = inputRef.current;
    if (input) {
      input.addEventListener('focus', handleFocus, { passive: false });
      input.addEventListener('click', handleFocus, { passive: false });
    }

    return () => {
      if (input) {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('click', handleFocus);
      }
    };
  }, [inputRef, containerRef]);
};