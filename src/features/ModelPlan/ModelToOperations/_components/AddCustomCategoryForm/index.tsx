import React, { useContext } from 'react';
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
import i18n from 'config/i18n';
import {
  useCreateMtoCategoryMutation,
  useGetMtoCategoriesQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import { MTOModalContext } from 'contexts/MTOModalContext';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import useMessage from 'hooks/useMessage';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

type FormValues = {
  primaryCategory: string;
  name: string;
};

export type SelectProps = {
  value: string;
  label: string;
};

export const selectOptions: SelectProps[] = [
  {
    value: 'default',
    label: i18n.t('modelToOperationsMisc:modal.category.selectOptions.default')
  },
  {
    value: 'none',
    label: i18n.t('modelToOperationsMisc:modal.category.selectOptions.none')
  }
];

const CategoryForm = ({ closeModal }: { closeModal: () => void }) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { categoryID, resetCategoryAndSubCategoryID } =
    useContext(MTOModalContext);
  const { modelID } = useParams<{ modelID: string }>();
  const { message, showMessage, clearMessage } = useMessage();
  const isMobile = useCheckResponsiveScreen('mobile', 'smaller');

  const { data, loading } = useGetMtoCategoriesQuery({
    variables: { id: modelID }
  });

  // Get categories from the data
  const categories = data?.modelPlan?.mtoMatrix?.categories || [];
  const noUncategorized = categories.filter(
    category => category.name !== 'Uncategorized'
  );

  // Map categories to sort options
  const mappedCategories: SelectProps[] = noUncategorized.map(category => ({
    value: category.id,
    label: category.name
  }));

  // Combine sort options and mapped categories
  const selectOptionsAndMappedCategories: SelectProps[] = [
    ...selectOptions,
    ...mappedCategories
  ];

  // Variables for the form
  const methods = useForm<FormValues>({
    defaultValues: {
      primaryCategory: categoryID ?? 'default',
      name: ''
    }
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid }
  } = methods;

  const [create] = useCreateMtoCategoryMutation();

  const onSubmit: SubmitHandler<FormValues> = formData => {
    create({
      variables: {
        id: modelID,
        name: formData.name,
        parentID:
          formData.primaryCategory === 'none' ? null : formData.primaryCategory
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (formData.primaryCategory === 'none') {
            // Parent Category Success Message
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
                      i18nKey={t('modal.category.alert.success.parent')}
                      components={{
                        b: <span className="text-bold" />
                      }}
                      values={{ category: formData.name }}
                    />
                  </span>
                </Alert>
              </>
            );
          } else {
            // Subcategory Success Message
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
                      i18nKey={t('modal.category.alert.success.subcategory')}
                      components={{
                        b: <span className="text-bold" />
                      }}
                      values={{ category: formData.name }}
                    />
                  </span>
                </Alert>
              </>
            );
          }
          closeModal();
          resetCategoryAndSubCategoryID(); // Reset category and subcategory ID
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
            {t('modal.category.alert.error')}
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
                  {t('modal.category.selectPrimaryCategory.label')}
                </Label>
                <span className="usa-hint">
                  {t('modal.category.selectPrimaryCategory.sublabel')}
                </span>

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
            name="name"
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-y-0">
                <Label
                  htmlFor={convertCamelCaseToKebabCase(field.name)}
                  className="mint-body-normal maxw-none"
                  requiredMarker
                >
                  {t('modal.category.categoryTitle.label')}
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
        <Button type="submit" disabled={!isValid} className="margin-right-3">
          {t('modal.addButton', { type: 'category' })}
        </Button>
        <Button
          type="button"
          className={`usa-button ${isMobile ? 'usa-button--outline' : 'usa-button--unstyled'}`}
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

export default CategoryForm;
