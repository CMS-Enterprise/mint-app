import { useFormikContext } from 'formik';

import useConfirmPageLeave from 'hooks/useConfirmPageLeave';

/**
 * _ConfirmLeave_
 *
 * Util to be used in conjunction with Formik to trigger prompt on dirty form
 */
const ConfirmLeave = () => {
  // Grab dirty value from Formik context

  const formikContext = useFormikContext();
  const isDirty = formikContext?.dirty;

  useConfirmPageLeave(isDirty);
  return null;
};

export default ConfirmLeave;
