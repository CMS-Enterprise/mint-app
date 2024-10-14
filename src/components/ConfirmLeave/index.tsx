import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useFormikContext } from 'formik';

import useConfirmPageLeave from 'hooks/useConfirmPageLeave';

type ConfirmLeaveProps = {
  type?: 'formik' | 'react-hook-form';
};

/**
 * _ConfirmLeave_
 *
 * Util to be used in conjunction with Formik to trigger prompt on dirty form
 */
const ConfirmLeave = ({ type = 'formik' }: ConfirmLeaveProps) => {
  const [isDirty, setIsDirty] = useState<boolean>(false);
  // Grab dirty value from Formik context

  const formikContext = useFormikContext();
  const firmikDirty = formikContext?.dirty;

  const rhfContext = useFormContext();
  const formState = rhfContext?.formState;
  const rhfDirty = formState?.isDirty;

  useEffect(() => {
    setIsDirty(firmikDirty);
  }, [firmikDirty]);

  useEffect(() => {
    setIsDirty(rhfDirty);
  }, [rhfDirty]);

  useConfirmPageLeave(isDirty);
  return null;
};

export default ConfirmLeave;
