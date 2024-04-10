/* eslint no-param-reassign: "error" */
import { useEffect } from 'react';
import i18next from 'i18next';

const confirmationMessage = i18next.t('general:onPageLeaveMessage');

/**
 * _useConfirmPageLeave_
 *
 * Custom hook used to trigger browser prompt on app leave
 *
 *
 * @param {boolean} isUnsafeTabClose
 */
const useConfirmPageLeave = (isUnsafeTabClose: boolean) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isUnsafeTabClose) {
        event.returnValue = confirmationMessage;
        return confirmationMessage;
      }
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isUnsafeTabClose]);
};

export default useConfirmPageLeave;
