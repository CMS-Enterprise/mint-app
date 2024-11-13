import React from 'react';
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

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

type MTOModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

const MTOModal = ({ isOpen, closeModal }: MTOModalProps) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const methods = useForm();

  const { control, handleSubmit } = methods;

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
          id="custom-category-form"
          onSubmit={handleSubmit(data => {
            // TODO: remove this console log
            // eslint-disable-next-line no-console
            console.log(data);
          })}
        >
          <Fieldset disabled={false}>
            <Controller
              name="categoryTitle"
              control={control}
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
          <Button type="submit" disabled={false}>
            {/* //TODO: disabled if form is not touched */}
            {t('modal.addButton', { type: 'category' })}
          </Button>
          <Button
            type="button"
            className="usa-button usa-button--unstyled"
            onClick={() => closeModal()}
          >
            {t('modal.cancel')}
          </Button>
        </Form>
      </FormProvider>
    </Modal>
  );
};

export default MTOModal;
