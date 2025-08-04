import React from 'react';
import { toast } from 'react-toastify';

import Alert from 'components/Alert';

/**
 * SuccessAlert
 *
 * A toast notification that displays a success message.
 */
const successAlert = ({
  message,
  timeout = 5000
}: {
  message: string | React.ReactNode;
  timeout?: number;
}) => {
  return toast.success(
    <Alert type="success" isClosable={false}>
      {message}
    </Alert>,
    {
      autoClose: timeout || 5000,
      hideProgressBar: true
    }
  );
};

export default successAlert;
