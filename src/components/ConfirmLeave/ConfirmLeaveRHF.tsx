import { useFormContext } from 'react-hook-form';

import useConfirmPageLeave from 'hooks/useConfirmPageLeave';

/**
 * ConfirmLeaveRHF
 *
 * Util to be used in conjunction with RHF to trigger prompt on dirty form
 */
const ConfirmLeaveRHF = () => {
  // Grab dirty value from RHF context
  const rhfContext = useFormContext();
  const formState = rhfContext?.formState;
  const isDirty = formState?.isDirty;

  useConfirmPageLeave(isDirty);
  return null;
};

export default ConfirmLeaveRHF;
