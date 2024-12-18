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
  Label,
  Select,
  TextInput
} from '@trussworks/react-uswds';
import {
  MtoSolutionType,
  useCreateMtoSolutionCustomMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import useMessage from 'hooks/useMessage';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

type FormValues = {
  solutionType: MtoSolutionType | 'default';
  solutionTitle: string;
  pocName: string;
  pocEmail: string;
};

const SolutionForm = ({ closeModal }: { closeModal: () => void }) => {
  const { t } = useTranslation('modelToOperationsMisc');
  const { solutionType: solutionTypeConfig } =
    usePlanTranslation('mtoSolution');

  const history = useHistory();
  const { modelID } = useParams<{ modelID: string }>();
  const {
    errorMessageInModal,
    showMessage,
    showErrorMessageInModal,
    clearMessage
  } = useMessage();

  // Variables for the form
  const methods = useForm<FormValues>({
    defaultValues: {
      solutionType: 'default',
      solutionTitle: '',
      pocName: '',
      pocEmail: ''
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
    if (formData.solutionType === 'default') return;

    create({
      variables: {
        modelPlanID: modelID,
        solutionType: formData.solutionType,
        name: formData.solutionTitle,
        pocName: formData.pocName,
        pocEmail: formData.pocEmail
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
        showErrorMessageInModal(
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
      {errorMessageInModal}
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
              s: (
                <Button
                  type="button"
                  className="usa-button usa-button--unstyled margin-top-0"
                  onClick={() => {
                    history.push(
                      `/models/${modelID}/collaboration-area/model-to-operations/solution-library`
                    );
                  }}
                >
                  {' '}
                </Button>
              )
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

export default SolutionForm;
