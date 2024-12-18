import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const MessageContext = createContext<
  | {
      message: string | React.ReactNode | undefined;
      errorMessageInModal: string | React.ReactNode | undefined;
      showMessage: (message: string | React.ReactNode) => void;
      showMessageOnNextPage: (message: string | React.ReactNode) => void;
      showErrorMessageInModal: (message: string | React.ReactNode) => void;
      clearMessage: () => void;
    }
  | undefined
>(undefined);

// MessageProvider manages the state necessary for child components to
// use the useMessage hook.
const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [queuedMessage, setQueuedMessage] = useState<
    string | React.ReactNode
  >();
  const [message, setMessage] = useState<string | React.ReactNode>();
  const [errorMessageInModal, setErrorMessageInModal] = useState<
    string | React.ReactNode
  >();
  const location = useLocation();

  const [lastPathname, setLastPathname] = useState(location.pathname);

  const clearMessage = () => setMessage(undefined);

  useEffect(() => {
    if (lastPathname !== location.pathname) {
      setMessage(queuedMessage);
      setQueuedMessage('');
      setLastPathname(location.pathname);
    }
  }, [message, queuedMessage, lastPathname, location.pathname]);

  return (
    <MessageContext.Provider
      value={{
        message,
        showMessage: setMessage,
        showMessageOnNextPage: setQueuedMessage,
        clearMessage,
        errorMessageInModal,
        showErrorMessageInModal: setErrorMessageInModal
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;
