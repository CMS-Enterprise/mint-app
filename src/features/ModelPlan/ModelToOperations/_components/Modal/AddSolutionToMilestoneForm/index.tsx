import React from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Form,
  FormGroup,
  Label,
  Select,
  TextInput
} from '@trussworks/react-uswds';
import {
  MtoCommonMilestoneKey,
  MtoCommonSolutionKey,
  MtoSolutionType,
  useCreateMtoSolutionCustomMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import useMessage from 'hooks/useMessage';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

type FormValues = {
  commonMilestoneKey: MtoCommonMilestoneKey | null;
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

  const { modelID } = useParams<{ modelID: string }>();

  const { message, showMessage, clearMessage } = useMessage();

  // Variables for the form
  const methods = useForm<FormValues>({
    defaultValues: {
      commonMilestoneKey: null,
      commonSolutions: []
    },
    mode: 'onBlur'
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, errors }
  } = methods;

  const [create] = useCreateMtoSolutionCustomMutation();

  const onSubmit: SubmitHandler<FormValues> = formData => {
    // if (formData.solutionType === 'default') return;

    create({
      variables: {
        modelPlanID: modelID,
        commonMilestoneKey: formData.commonMilestoneKey,
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
                    i18nKey={t('modal.solution.alert.success')}
                    components={{
                      b: <span className="text-bold" />
                    }}
                    values={{ solution: formData.solutionTitle }}
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
    <FormProvider {...methods}>
      {message}
      <Form
        className="maxw-none"
        data-testid="custom-solution-form"
        id="custom-solution-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Fieldset>
          <Controller
            name="solutionType"
            control={control}
            rules={{
              required: true,
              validate: value => value !== 'default'
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0 margin-bottom-2">
                <Label
                  htmlFor={convertCamelCaseToKebabCase(field.name)}
                  className="mint-body-normal maxw-none margin-bottom-1"
                  requiredMarker
                >
                  {t('modal.solution.label.solutionType')}
                </Label>

                <Select
                  {...field}
                  id={convertCamelCaseToKebabCase(field.name)}
                  value={field.value || ''}
                  defaultValue="default"
                >
                  <option value="default">- Select - </option>
                  {getKeys(solutionTypeConfig.options).map(option => {
                    return (
                      <option
                        key={`select-${convertCamelCaseToKebabCase(option)}`}
                        value={option}
                      >
                        {solutionTypeConfig.options[option]}
                      </option>
                    );
                  })}
                </Select>
              </FormGroup>
            )}
          />

          <Controller
            name="solutionTitle"
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0 margin-bottom-2">
                <Label
                  htmlFor={convertCamelCaseToKebabCase(field.name)}
                  className="mint-body-normal maxw-none margin-bottom-1"
                  requiredMarker
                >
                  {t('modal.solution.label.solutionTitle')}
                </Label>

                <TextInput
                  type="text"
                  {...field}
                  id={convertCamelCaseToKebabCase(field.name)}
                  value={field.value || ''}
                />
              </FormGroup>
            )}
          />

          <div className="margin-top-0 padding-top-1 margin-bottom-2">
            <p className="text-bold margin-y-0">
              {t('modal.solution.pocHeading')}
            </p>
            <p className="text-base margin-y-0">
              {t('modal.solution.pocSubheading')}
            </p>
          </div>

          <Controller
            name="pocName"
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0 margin-bottom-2">
                <Label
                  htmlFor={convertCamelCaseToKebabCase(field.name)}
                  className="mint-body-normal maxw-none margin-bottom-1"
                  requiredMarker
                >
                  {t('modal.solution.label.pocName')}
                </Label>

                <TextInput
                  type="text"
                  {...field}
                  id={convertCamelCaseToKebabCase(field.name)}
                  value={field.value || ''}
                />
              </FormGroup>
            )}
          />

          <Controller
            name="pocEmail"
            control={control}
            rules={{
              required: true,
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: `${t('modal.solution.label.emailError')}`
              }
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0 margin-bottom-2">
                <Label
                  htmlFor={convertCamelCaseToKebabCase(field.name)}
                  className="mint-body-normal maxw-none margin-bottom-1"
                  requiredMarker
                >
                  {t('modal.solution.label.pocEmail')}
                </Label>
                {errors.pocEmail && (
                  <span className="usa-error-message" role="alert">
                    {errors.pocEmail.message}
                  </span>
                )}

                <TextInput
                  type="text"
                  {...field}
                  id={convertCamelCaseToKebabCase(field.name)}
                  value={field.value || ''}
                />
              </FormGroup>
            )}
          />
        </Fieldset>
        <Alert type="info" slim className="margin-bottom-2">
          <Trans
            i18nKey={t('modal.solution.alert.info')}
            components={{
              s: <span className="text-underline text-primary-light" />
              // TODO: Add a link to the documentation
            }}
          />
        </Alert>
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
  );
};

export default AddSolutionToMilestoneForm;
