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
  GetModelToOperationsMatrixDocument,
  useCreateMtoCategoryMutation
} from 'gql/generated/graphql';

import toastSuccess from 'components/ToastSuccess';
import { useErrorMessage } from 'contexts/ErrorContext';
import { MTOModalContext } from 'contexts/MTOModalContext';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import useFormatMTOCategories from 'hooks/useFormatMTOCategories';
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

const CustomCategoryForm = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const {
    mtoModalState: { categoryID },
    setMTOModalOpen
  } = useContext(MTOModalContext);

  const { modelID = '' } = useParams<{ modelID: string }>();

  const { setErrorMeta } = useErrorMessage();

  const isMobile = useCheckResponsiveScreen('mobile', 'smaller');

  // Variables for the form
  const methods = useForm<FormValues>({
    defaultValues: {
      primaryCategory: categoryID ?? 'default',
      name: ''
    },
    mode: 'onChange'
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isValid }
  } = methods;

  const { selectOptionsAndMappedCategories, loading } = useFormatMTOCategories({
    modelID,
    primaryCategory: watch('primaryCategory'),
    customCategory: true
  });

  const [create] = useCreateMtoCategoryMutation({
    refetchQueries: [
      {
        query: GetModelToOperationsMatrixDocument,
        variables: {
          id: modelID
        }
      }
    ]
  });

  const onSubmit: SubmitHandler<FormValues> = formData => {
    setErrorMeta({
      overrideMessage: t('modal.category.alert.error')
    });

    create({
      variables: {
        id: modelID,
        name: formData.name,
        parentID:
          formData.primaryCategory === 'none' ? null : formData.primaryCategory
      }
    }).then(response => {
      if (!response?.errors) {
        if (formData.primaryCategory === 'none') {
          // Parent Category Success Message
          toastSuccess(
            <Trans
              i18nKey={t('modal.category.alert.success.parent')}
              components={{
                b: <span className="text-bold" />
              }}
              values={{ category: formData.name }}
            />
          );
        } else {
          // Subcategory Success Message
          toastSuccess(
            <Trans
              i18nKey={t('modal.category.alert.success.subcategory')}
              components={{
                b: <span className="text-bold" />
              }}
              values={{ category: formData.name }}
            />
          );
        }
        setMTOModalOpen(false);
      }
    });
  };

  return (
    <FormProvider {...methods}>
      <Form
        className="maxw-none"
        data-testid="custom-category-form"
        id="custom-category-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Fieldset
          disabled={loading}
          className="margin-bottom-8 padding-bottom-4"
        >
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
        <div className="mint-modal__footer">
          <Button
            type="submit"
            disabled={!isValid}
            className="margin-right-3 margin-top-0"
          >
            {t('modal.addButton', { type: 'category' })}
          </Button>
          <Button
            type="button"
            className={`usa-button margin-top-0 ${isMobile ? 'usa-button--outline' : 'usa-button--unstyled'}`}
            onClick={() => {
              reset();
              setMTOModalOpen(false);
            }}
          >
            {t('modal.cancel')}
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
};

export default CustomCategoryForm;
