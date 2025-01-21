import React from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import useMessage from 'hooks/useMessage';

type FormValues = {
  commonSolutions: MtoCommonSolutionKey[] | undefined;
};

const AddToExistingMilestoneForm = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  const { message, showMessage, clearMessage } = useMessage();

  // Variables for the form
  const methods = useForm<FormValues>({
    defaultValues: {
      commonSolutions: []
    },
    mode: 'onBlur'
  });

  return (
    <>
      <p className="mint-body-normal">
        {t('modal.addToExistingMilestone.description')}
      </p>
    </>
  );
};

export default AddToExistingMilestoneForm;
