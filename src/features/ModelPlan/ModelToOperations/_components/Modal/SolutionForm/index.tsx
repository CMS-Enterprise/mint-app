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
  MtoSolutionType,
  useCreateMtoSolutionCustomMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import useMessage from 'hooks/useMessage';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

// import { selectOptions, SelectProps } from '../CategoryForm';

type FormValues = {
  solutionType: MtoSolutionType | 'default';
  solutionTitle: string;
  pocName: string;
  pocEmail: string;
};

const SolutionForm = ({ closeModal }: { closeModal: () => void }) => {
  const { t } = useTranslation('modelToOperationsMisc');
  const { modelID } = useParams<{ modelID: string }>();
  const {
    message,
    // showMessage,
    clearMessage
  } = useMessage();

  // Variables for the form
  const methods = useForm<FormValues>({
    defaultValues: {
      solutionType: 'default',
      solutionTitle: '',
      pocName: '',
      pocEmail: ''
    }
  });

  const {
    control,
    handleSubmit,
    reset,
    // watch,
    formState: { isValid }
  } = methods;

  const [create] = useCreateMtoSolutionCustomMutation();

  const onSubmit: SubmitHandler<FormValues> = formData => {
    // eslint-disable-next-line no-console
    console.log(formData);
    create({
      variables: {
        modelPlanID: modelID,
        solutionType: formData.solutionType as MtoSolutionType,
        name: formData.solutionTitle,
        pocName: formData.pocName,
        pocEmail: formData.pocEmail
      }
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
        <Fieldset
        // disabled={loading}
        >
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
                >
                  <Trans
                    i18nKey={t('modal.solution.label.solutionType')}
                    components={{
                      s: <span className="text-secondary-dark" />
                    }}
                  />
                </Label>

                <Select
                  {...field}
                  id={convertCamelCaseToKebabCase(field.name)}
                  value={field.value || ''}
                  defaultValue="default"
                >
                  <option value="default">- Select - </option>
                  {/* {selectOptionsAndMappedCategories.map(option => {
                    return (
                      <option
                        key={`sort-${convertCamelCaseToKebabCase(option.label)}`}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    );
                  })} */}
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
                >
                  <Trans
                    i18nKey={t('modal.solution.label.solutionTitle')}
                    components={{
                      s: <span className="text-secondary-dark" />
                    }}
                  />
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
                >
                  <Trans
                    i18nKey={t('modal.solution.label.pocName')}
                    components={{
                      s: <span className="text-secondary-dark" />
                    }}
                  />
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
              required: true
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0 margin-bottom-2">
                <Label
                  htmlFor={convertCamelCaseToKebabCase(field.name)}
                  className="mint-body-normal maxw-none margin-bottom-1"
                >
                  <Trans
                    i18nKey={t('modal.solution.label.pocEmail')}
                    components={{
                      s: <span className="text-secondary-dark" />
                    }}
                  />
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

export default SolutionForm;
