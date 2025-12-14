import { useEffect, useRef } from 'react';

const DEFAULT_TITLE = 'FactuPanda';

export function useDocumentTitle(title: string, keepOnUnmount = false) {
  const previousTitle = useRef(document.title);

  useEffect(() => {
    document.title = `${title} - ${DEFAULT_TITLE}`;
  }, [title]);

  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        document.title = previousTitle.current || DEFAULT_TITLE;
      }
    };
  }, [keepOnUnmount]);
}
