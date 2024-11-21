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
import { useGetMtoCategoriesQuery } from 'gql/generated/graphql';

import Alert from 'components/Alert';
import useMessage from 'hooks/useMessage';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

import { selectOptions, SelectProps } from '../CategoryForm';

type FormValues = {
  primaryCategory: string;
  subcategory: string;
  name: string;
};

const ModelMilestoneForm = ({ closeModal }: { closeModal: () => void }) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();
  const { message, clearMessage } = useMessage();

  const { data, loading } = useGetMtoCategoriesQuery({
    variables: { id: modelID }
  });
  // Get categories from the data
  const categories = data?.modelPlan?.mtoMatrix?.categories || [];

  // Map categories to sort options
  const mappedCategories: SelectProps[] = categories.map(category => ({
    value: category.id,
    label: category.name
  }));

  // Combine sort options and mapped categories
  const selectOptionsAndMappedCategories: SelectProps[] = [
    // only get the default option of selectOptions
    selectOptions[0],
    ...mappedCategories
  ];

  // Variables for the form
  const methods = useForm<FormValues>({
    defaultValues: {
      primaryCategory: 'default',
      subcategory: 'default',
      name: ''
    }
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isValid }
  } = methods;

  const onSubmit: SubmitHandler<FormValues> = formData => {
    // eslint-disable-next-line no-console
    console.log(formData);
    // TODO: TEMPORARY
  };

  //   create({
  //     variables: {
  //       id: modelID,
  //       name: formData.name,
  //       mtoCategoryID:
  //         formData.subcategory !== null
  //       then just return subcategory

  //       else
  //       formData.primaryCategory === 'none' ? null : formData.primaryCategory
  //     }
  //   });
  // };

  return (
    <FormProvider {...methods}>
      {message}
      <Form
        className="maxw-none"
        data-testid="custom-category-form"
        id="custom-category-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Fieldset disabled={loading}>
          <Controller
            name="primaryCategory"
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
                    i18nKey={t('modal.milestone.selectPrimaryCategory.label')}
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
                  {selectOptionsAndMappedCategories.map(option => {
                    return (
                      <option
                        key={`sort-${convertCamelCaseToKebabCase(option.label)}`}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    );
                  })}
                </Select>
              </FormGroup>
            )}
          />

          <Controller
            name="subcategory"
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
                    i18nKey={t('modal.milestone.selectSubcategory.label')}
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
                  disabled={watch('primaryCategory') === 'default'}
                >
                  {selectOptionsAndMappedCategories.map(option => {
                    return (
                      <option
                        key={`sort-${convertCamelCaseToKebabCase(option.label)}`}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    );
                  })}
                </Select>
              </FormGroup>
            )}
          />

          <Controller
            name="name"
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
                    i18nKey={t('modal.milestone.milestoneTitle')}
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
            i18nKey={t('modal.milestone.alert.info')}
            components={{
              s: <span className="text-underline text-primary-light" />
            }}
          />
        </Alert>
        <Button type="submit" disabled={!isValid} className="margin-right-3">
          {t('modal.addButton', { type: 'category' })}
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

export default ModelMilestoneForm;
