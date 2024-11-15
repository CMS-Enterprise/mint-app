import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
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
import { useGetMtoCategoriesQuery } from 'gql/generated/graphql';

import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

type SortProps = {
  value: string;
  label: string;
};

const sortOptions: SortProps[] = [
  {
    value: 'default',
    label: i18n.t('modelToOperationsMisc:modal.category.sortOptions.default')
  },
  {
    value: 'none',
    label: i18n.t('modelToOperationsMisc:modal.category.sortOptions.none')
  }
];

const CategoryForm = ({ closeModal }: { closeModal: () => void }) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  const { data, loading } = useGetMtoCategoriesQuery({
    variables: { id: modelID }
  });

  const categories = data?.modelPlan?.mtoMatrix?.categories || [];
  const noUncategorized = categories.filter(
    category => category.name !== 'Uncategorized'
  );

  const mappedCategories: SortProps[] = noUncategorized.map(category => ({
    value: category.id,
    label: category.name
  }));

  const garyTest: SortProps[] = [...sortOptions, ...mappedCategories];

  const methods = useForm({
    defaultValues: {
      primaryCategory: 'default',
      categoryTitle: ''
    }
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid }
  } = methods;

  return (
    <FormProvider {...methods}>
      <Form
        className="maxw-none"
        id="custom-category-form"
        onSubmit={handleSubmit(formData => {
          // TODO: remove this console log
          // eslint-disable-next-line no-console
          console.log(formData);
        })}
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
                    i18nKey={t('modal.category.selectPrimaryCategory.label')}
                    components={{
                      s: <span className="text-secondary-dark" />
                    }}
                  />
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
                  {garyTest.map(option => {
                    // debugger;
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
            name="categoryTitle"
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-y-0">
                <Label
                  htmlFor={convertCamelCaseToKebabCase(field.name)}
                  className="mint-body-normal maxw-none"
                >
                  <Trans
                    i18nKey={t('modal.category.categoryTitle.label')}
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
        <Button type="submit" disabled={!isValid} className="margin-right-3">
          {t('modal.addButton', { type: 'category' })}
        </Button>
        <Button
          type="button"
          className="usa-button usa-button--unstyled"
          onClick={() => {
            reset();
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
