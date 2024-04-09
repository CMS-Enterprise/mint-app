import { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';

import useConfirmPageLeave from 'hooks/useConfirmPageLeave';

/**
 * _ConfirmLeave_
 *
 * Util to be used in conjunction with Formik to trigger prompt on dirty form
 */
const ConfirmLeave = () => {
  const [isDirty, setIsDirty] = useState<boolean>(false);
  // Grab dirty value from Formik context
  const { dirty } = useFormikContext();
  useEffect(() => {
    setIsDirty(dirty);
  }, [dirty]);

  useConfirmPageLeave(isDirty);
  return null;
};

export default ConfirmLeave;
