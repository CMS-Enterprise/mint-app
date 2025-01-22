import React from 'react';
import {
  // Controller,
  FormProvider,
  // SubmitHandler,
  useForm
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  MtoCommonSolutionKey,
  useGetModelToOperationsMatrixQuery
} from 'gql/generated/graphql';

// import useMessage from 'hooks/useMessage';

type FormValues = {
  linkedSolutions: MtoCommonSolutionKey[] | string[] | undefined;
};

const AddToExistingMilestoneForm = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  // const { message, showMessage, clearMessage } = useMessage();

  const { data } = useGetModelToOperationsMatrixQuery({
    variables: {
      id: modelID
    }
  });

  const milestones = data?.modelPlan?.mtoMatrix?.milestones;
  // .sort((a, b) => a.name.localeCompare(b.name));

  // console.log(milestones);

  const methods = useForm<FormValues>({
    defaultValues: {
      linkedSolutions: []
    },
    mode: 'onBlur'
  });

  return (
    <>
      <p className="mint-body-normal">
        {t('modal.addToExistingMilestone.description')}
      </p>
      <FormProvider {...methods}>
        <p>temp</p>
        {milestones}
      </FormProvider>
    </>
  );
};

export default AddToExistingMilestoneForm;
