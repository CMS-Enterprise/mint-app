import { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';

import useConfirmPageLeave from 'hooks/useConfirmPageLeave';

const ConfirmLeave = () => {
  const [isDirty, setIsDirty] = useState<boolean>(false);
  // Grab values and submitForm from context
  const { dirty } = useFormikContext();
  useEffect(() => {
    setIsDirty(dirty);
  }, [dirty]);

  useConfirmPageLeave(isDirty);
  return null;
};

export default ConfirmLeave;
