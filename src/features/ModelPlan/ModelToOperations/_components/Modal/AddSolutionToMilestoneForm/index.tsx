import React from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Form,
  FormGroup,
  Label
} from '@trussworks/react-uswds';
import {
  GetModelToOperationsMatrixDocument,
  MtoCommonMilestoneKey,
  MtoCommonSolutionKey,
  useCreateMtoMilestoneMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import HelpText from 'components/HelpText';
import MultiSelect from 'components/MultiSelect';
import useMessage from 'hooks/useMessage';
import usePlanTranslation from 'hooks/usePlanTranslation';
import {
  composeMultiSelectOptions,
  convertCamelCaseToKebabCase
} from 'utils/modelPlan';

type FormValues = {
  commonSolutions: MtoCommonSolutionKey[] | undefined;
};

const AddSolutionToMilestoneForm = ({
  closeModal
}: {
  closeModal: () => void;
}) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { commonSolutions: commonSolutionsConfig } =
    usePlanTranslation('mtoMilestone');

  const history = useHistory();

  const params = new URLSearchParams(history.location.search);
  const milestoneKey = params.get('milestone') as MtoCommonMilestoneKey;

  const { modelID } = useParams<{ modelID: string }>();

  const { message, showMessage, clearMessage } = useMessage();

  // Variables for the form
  const methods = useForm<FormValues>({
    defaultValues: {
      commonSolutions: []
    },
    mode: 'onBlur'
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isValid }
  } = methods;

  const [create] = useCreateMtoMilestoneMutation({
    refetchQueries: [
      {
        query: GetModelToOperationsMatrixDocument,
        variables: { id: modelID }
      }
    ]
  });

  const onSubmit: SubmitHandler<FormValues> = formData => {
    if (!milestoneKey) return;

    create({
      variables: {
        modelPlanID: modelID,
        commonMilestoneKey: milestoneKey,
        commonSolutions: formData.commonSolutions
      }
    })
      .then(response => {
        if (!response?.errors) {
          showMessage(
            <>
              <Alert
                type="success"
                slim
                data-testid="mandatory-fields-alert"
                className="margin-y-4"
              >
                <span className="mandatory-fields-alert__text">
                  <Trans
                    i18nKey={t('modal.milestone.alert.success')}
                    components={{
                      b: <span className="text-bold" />
                    }}
                    values={{
                      milestone: response.data?.createMTOMilestoneCommon.name
                    }}
                  />
                </span>
              </Alert>
            </>
          );
          closeModal();
        }
      })
      .catch(() => {
        showMessage(
          <Alert
            type="error"
            slim
            data-testid="error-alert"
            className="margin-y-4"
          >
            {t('modal.solution.alert.error')}
          </Alert>
        );
      });
  };

  return (
    <>
      <p className="mint-body-normal">
        {t('modal.solutionToMilestone.description')}
      </p>

      <FormProvider {...methods}>
        {message}
        <Form
          className="maxw-none"
          id="milestone-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Fieldset>
            <Controller
              name="commonSolutions"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-0">
                  <Label
                    htmlFor={convertCamelCaseToKebabCase('commonSolutions')}
                  >
                    {commonSolutionsConfig.label}
                  </Label>

                  <HelpText className="margin-top-1">
                    {commonSolutionsConfig.sublabel}
                  </HelpText>

                  <MultiSelect
                    {...field}
                    id={convertCamelCaseToKebabCase('multiSourceDataToCollect')}
                    inputId={convertCamelCaseToKebabCase('commonSolutions')}
                    ariaLabel={convertCamelCaseToKebabCase('commonSolutions')}
                    ariaLabelText={commonSolutionsConfig.label}
                    options={[]}
                    groupedOptions={[
                      {
                        label: 'Solutions',
                        options: composeMultiSelectOptions(
                          commonSolutionsConfig.options,
                          commonSolutionsConfig.readonlyOptions
                        )
                      }
                    ]}
                    selectedLabel={commonSolutionsConfig.multiSelectLabel || ''}
                    initialValues={watch('commonSolutions')}
                  />
                </FormGroup>
              )}
            />
          </Fieldset>

          <Button type="submit" disabled={!isValid} className="margin-right-3">
            {t('modal.addButton', { type: 'solution' })}
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
        </Form>
      </FormProvider>
    </>
  );
};

export default AddSolutionToMilestoneForm;
