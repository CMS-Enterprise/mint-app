import { useEffect } from 'react';

// Reset the form state when the modal is closed
// The truss modal does not expose a close event or hook
// Use a mutation observer instead to check the modal for the `is-hidden` class

const useDetectModalClose = (modalElementId: string, callback: any) => {
  useEffect(() => {
    const modalEl = document.getElementById(modalElementId);
    let observer: MutationObserver;
    if (modalEl) {
      observer = new MutationObserver(mutationList => {
        mutationList.forEach(mutation => {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'class' &&
            (mutation.target as HTMLElement).classList.contains('is-hidden')
          ) {
            callback();
          }
        });
      });

      observer.observe(modalEl, { attributes: true });
    }

    return () => {
      observer?.disconnect();
    };

    // Run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useDetectModalClose;
