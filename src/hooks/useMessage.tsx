import { useContext } from 'react';

import MessageProvider, { MessageContext } from 'contexts/MessageContext';

// useMessage is a hook that provides the ability to show notifications to the
// user. Components will use the hook to get access to two methods:
//
// showMessage: display a message to the user immediately. This is useful
// when an interaction won't cause an immediate redirect to a new page.
//
// showMessageOnNextPage: schedule a message to be shown on the next
// visited by the user. Pages are identified using their URL and therefore
// messages won't appear until the URL changes.
//
// Currently there is only support for showing a single message.
const useMessage = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessage must be used within a MessageProvider');
  }

  return context;
};

export default useMessage;
export { useMessage, MessageProvider };
