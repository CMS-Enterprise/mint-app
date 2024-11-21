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
  useCreateMtoMilestoneCustomMutation,
  useGetMtoCategoriesQuery
} from 'gql/generated/graphql';

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
  const { message, showMessage, clearMessage } = useMessage();

  const { data, loading } = useGetMtoCategoriesQuery({
    variables: { id: modelID }
  });
  // Get categories from the data
  const categories = data?.modelPlan?.mtoMatrix?.categories || [];

  // Map categories to select options
  const mappedCategories: SelectProps[] = categories.map(category => ({
    value: category.id,
    label: category.name
  }));

  // Combine select options and mapped categories
  const selectOptionsAndMappedCategories: SelectProps[] = [
    // only get the default option of selectOptions
    selectOptions[0],
    ...mappedCategories
  ];

  const getSubcategoryByPrimaryCategoryName = (id: string) => {
    const result = categories.find(item => item.id === id);
    return result ? result.subCategories : [];
  };

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

  const mappedSubcategories: SelectProps[] =
    getSubcategoryByPrimaryCategoryName(watch('primaryCategory')).map(
      subcategory => ({
        value: subcategory.id,
        label: subcategory.name
      })
    );

  const [create] = useCreateMtoMilestoneCustomMutation();

  const onSubmit: SubmitHandler<FormValues> = formData => {
    let mtoCategoryID;
    const uncategorizedCategoryID = '00000000-0000-0000-0000-000000000000';
    if (formData.subcategory !== uncategorizedCategoryID) {
      mtoCategoryID = formData.subcategory;
    } else if (formData.primaryCategory === uncategorizedCategoryID) {
      mtoCategoryID = null;
    } else {
      mtoCategoryID = formData.primaryCategory;
    }

    create({
      variables: {
        id: modelID,
        name: formData.name,
        mtoCategoryID
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
                    values={{ milestone: formData.name }}
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
            {t('modal.milestone.alert.error')}
          </Alert>
        );
      });
  };

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
                  {[selectOptions[0], ...mappedSubcategories].map(option => {
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
              // TODO: Add a link to the documentation
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
