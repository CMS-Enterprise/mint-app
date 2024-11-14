import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  Fieldset,
  Form,
  FormGroup,
  Label,
  Select,
  TextInput
} from '@trussworks/react-uswds';
import i18next from 'i18next';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

type MTOModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

const sortOptions = [
  {
    value: 'DEFAULT',
    label: i18next.t('modelToOperationsMisc:modal.category.sortOptions.default')
  },
  {
    value: '',
    label: i18next.t('modelToOperationsMisc:modal.category.sortOptions.none')
  }
];

const MTOModal = ({ isOpen, closeModal }: MTOModalProps) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const methods = useForm({
    defaultValues: {
      primaryCategory: 'DEFAULT',
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
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      shouldCloseOnOverlayClick
      className="width-mobile-lg mint-body-normal"
    >
      <div className="margin-bottom-2">
        <PageHeading headingLevel="h3" className="margin-y-0">
          {t('modal.title', { type: 'category' })}
        </PageHeading>
        <p className="margin-y-0 text-base">
          <Trans
            i18nKey={t('modal.allFieldsRequired')}
            components={{
              s: <span className="text-secondary-dark" />
            }}
          />
        </p>
      </div>
      <FormProvider {...methods}>
        <Form
          className="maxw-none"
          id="custom-category-form"
          onSubmit={handleSubmit(data => {
            // TODO: remove this console log
            // eslint-disable-next-line no-console
            console.log(data);
          })}
        >
          <Fieldset disabled={false}>
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
                    defaultValue="DEFAULT"
                  >
                    {sortOptions.map(option => {
                      return (
                        <option
                          key={`sort-${option.value}`}
                          value={option.value}
                          hidden={option.value === 'DEFAULT'}
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
            {/* //TODO: disabled if form is not touched */}
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
    </Modal>
  );
};

export default MTOModal;
