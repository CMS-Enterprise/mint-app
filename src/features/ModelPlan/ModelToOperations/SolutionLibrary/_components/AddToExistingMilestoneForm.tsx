import React from 'react';
import {
  Controller,
  Form,
  FormProvider,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Fieldset, FormGroup, Label } from '@trussworks/react-uswds';
import {
  MtoCommonSolutionKey,
  useGetModelToOperationsMatrixQuery
} from 'gql/generated/graphql';

import HelpText from 'components/HelpText';
import MultiSelect from 'components/MultiSelect';
import Spinner from 'components/Spinner';
import useMessage from 'hooks/useMessage';
import {
  composeMultiSelectOptions,
  convertCamelCaseToKebabCase
} from 'utils/modelPlan';

type FormValues = {
  linkedSolutions: MtoCommonSolutionKey[] | string[] | undefined;
};

const AddToExistingMilestoneForm = ({
  closeModal
}: {
  closeModal: () => void;
}) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const solutionKey = params.get('add-solution') as MtoCommonSolutionKey;

  const { message, showMessage, clearMessage } = useMessage();

  const { data, loading } = useGetModelToOperationsMatrixQuery({
    variables: {
      id: modelID
    }
  });

  const milestones = data?.modelPlan?.mtoMatrix?.milestones.map(milestone => ({
    value: milestone.id,
    label: milestone.name
  }));

  const methods = useForm<FormValues>({
    defaultValues: {
      linkedSolutions: []
    },
    mode: 'onBlur'
  });
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty }
  } = methods;

  const onSubmit: SubmitHandler<FormValues> = ({ linkedSolutions }) => {
    // TODO: Update
    console.log(linkedSolutions);
    // if (!milestoneKey) return;
    // create({
    //   variables: {
    //     modelPlanID: modelID,
    //     commonMilestoneKey: milestoneKey,
    //     commonSolutions: formData.commonSolutions
    //   }
    // })
    //   .then(response => {
    //     if (!response?.errors) {
    //       closeModal();
    //     }
    //   })
    //   .catch(() => {
    //     showMessage(
    //       <Alert
    //         type="error"
    //         slim
    //         data-testid="error-alert"
    //         className="margin-y-4"
    //       >
    //         {t('modal.solution.alert.error')}
    //       </Alert>
    //     );
    //   });
  };

  if (loading || !milestones || !solutionKey) {
    return (
      <div className="padding-left-4 padding-top-3">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <p className="mint-body-normal">
        {t('modal.addToExistingMilestone.description')}
      </p>
      <FormProvider {...methods}>
        {message}
        <Form
          className="maxw-none"
          id="add-to-existing-milestone-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Fieldset>
            <Controller
              name="linkedSolutions"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-0">
                  <Label
                    htmlFor={convertCamelCaseToKebabCase('linkedSolutions')}
                  >
                    {t('modal.addToExistingMilestone.label')}
                  </Label>

                  <HelpText className="margin-top-1">
                    {t('modal.addToExistingMilestone.helpText')}
                  </HelpText>

                  <MultiSelect
                    {...field}
                    id={convertCamelCaseToKebabCase('multiSourceDataToCollect')}
                    ariaLabel={convertCamelCaseToKebabCase('linkedSolutions')}
                    ariaLabelText={t('modal.addToExistingMilestone.label')}
                    options={composeMultiSelectOptions(
                      milestones.reduce(
                        (acc, milestone) => {
                          acc[milestone.value] = milestone.label;
                          return acc;
                        },
                        {} as Record<string, string>
                      )
                    )}
                    selectedLabel={t(
                      'modal.addToExistingMilestone.selectedLabel'
                    )}
                    initialValues={watch('linkedSolutions')}
                  />
                </FormGroup>
              )}
            />
          </Fieldset>

          <div className="margin-top-3">
            <Button
              type="submit"
              disabled={!isDirty}
              className="margin-right-3"
            >
              {t('modal.addToExistingMilestone.cta.add', {
                count: watch('linkedSolutions')?.length || 0
              })}
            </Button>

            <Button
              type="button"
              className="usa-button usa-button--unstyled"
              onClick={() => {
                reset();
                clearMessage();
                closeModal();
              }}
            >
              {t('modal.cancel')}
            </Button>
          </div>
        </Form>
      </FormProvider>
    </>
  );
};

export default AddToExistingMilestoneForm;
