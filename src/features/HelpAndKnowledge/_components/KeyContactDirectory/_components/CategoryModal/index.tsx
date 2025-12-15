import React, { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  Fieldset,
  Form,
  FormGroup,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import {
  GetAllKeyContactCategoriesQuery,
  useCreateKeyContactCategoryMutation,
  useUpdateKeyContactCategoryMutation
} from 'gql/generated/graphql';
import GetAllKeyContactCategories from 'gql/operations/KeyContactDirectory/GetAllKeyContactCategories';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';

export type CategoryModeType = 'add' | 'edit';

export type KeyContactCategoryType =
  GetAllKeyContactCategoriesQuery['keyContactCategory'][number];

const CategoryModal = ({
  isOpen,
  closeModal,
  mode,
  category
}: {
  isOpen: boolean;
  closeModal: () => void;
  mode: CategoryModeType;
  category?: KeyContactCategoryType;
}) => {
  const { t: keyContactCategoryT } = useTranslation('keyContactCategory');
  const { t: keyContactCategoryMiscT } = useTranslation(
    'keyContactCategoryMisc'
  );

  const [create] = useCreateKeyContactCategoryMutation({
    refetchQueries: [
      {
        query: GetAllKeyContactCategories
      }
    ]
  });

  const [update] = useUpdateKeyContactCategoryMutation({
    refetchQueries: [
      {
        query: GetAllKeyContactCategories
      }
    ]
  });

  const [disabledSubmitBtn, setDisableSubmitBtn] = useState(true);

  const methods = useForm<{ category: string }>({
    defaultValues: {
      category: category?.category || ''
    },
    mode: 'onChange'
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty }
  } = methods;

  useEffect(() => {
    setDisableSubmitBtn(!isDirty || isSubmitting);
  }, [isDirty, isSubmitting]);

  const onSubmit = (formData: { category: string }) => {
    const promise =
      mode === 'add'
        ? create({
            variables: {
              category: formData.category
            }
          })
        : update({
            variables: {
              id: category?.id || '',
              changes: {
                category: formData.category
              }
            }
          });

    promise.then(response => {
      if (!response?.errors) {
        closeModal();
      }
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      fixed
      className="tablet:width-mobile-lg mint-body-normal"
    >
      <div className="">
        <PageHeading headingLevel="h3" className="margin-y-0">
          {keyContactCategoryMiscT(
            mode === 'edit' ? 'edit.heading' : 'add.heading'
          )}
        </PageHeading>
        <p className="text-base margin-y-1">
          <Trans
            i18nKey={keyContactCategoryMiscT('allFieldsRequired')}
            components={{
              s: <span className="text-error" />
            }}
          />
        </p>
        {mode === 'add' && (
          <p className="">{keyContactCategoryMiscT('add.description')}</p>
        )}

        {mode === 'edit' && (
          <p className="margin-y-1">
            <Trans
              i18nKey={keyContactCategoryMiscT('currentCategory')}
              components={{
                bold: <span className="text-bold" />
              }}
              values={{ category: category?.category || '' }}
            />
          </p>
        )}
      </div>

      <FormProvider {...methods}>
        <Form
          className="maxw-none padding-bottom-8"
          data-testid="category-form"
          id="category-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Fieldset style={{ minWidth: '100%' }}>
            <Controller
              name="category"
              control={control}
              rules={{
                required: true,
                validate: value => value !== ''
              }}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-0 margin-bottom-2">
                  <Label
                    htmlFor="category-title"
                    className="mint-body-normal maxw-none"
                    requiredMarker
                  >
                    {keyContactCategoryT('category.label')}
                  </Label>

                  <TextInput
                    type="text"
                    {...field}
                    id="category-title"
                    data-testid="category-title"
                    value={field.value || ''}
                  />
                </FormGroup>
              )}
            />
          </Fieldset>
        </Form>
      </FormProvider>

      <div className="margin-top-2 display-flex mint-modal__footer">
        <Button
          form="category-form"
          type="submit"
          disabled={disabledSubmitBtn}
          className="margin-right-3 margin-top-0"
        >
          {keyContactCategoryMiscT(`${mode === 'edit' ? 'edit' : 'add'}.cta`)}
        </Button>

        <Button
          type="button"
          className="margin-top-0 deep-underline"
          unstyled
          onClick={closeModal}
        >
          {keyContactCategoryMiscT('cancel')}
        </Button>
      </div>
    </Modal>
  );
};

export default CategoryModal;
