import React from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  Fieldset,
  Form,
  Label,
  TextInput
} from '@trussworks/react-uswds';

import FieldGroup from 'components/FieldGroup';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';

type MTOModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

const MTOModal = ({ isOpen, closeModal }: MTOModalProps) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { register, handleSubmit } = useForm();

  console.log('component loaded');

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      shouldCloseOnOverlayClick
      className="mint-body-normal"
    >
      <div className="margin-bottom-2">
        <PageHeading
          headingLevel="h3"
          className="margin-bottom-0 margin-top-neg-3"
        >
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
      <Form
        id="custom-category-form"
        onSubmit={handleSubmit(data => {
          console.log(data);
        })}
      >
        <Fieldset disabled={false}>
          <FieldGroup>
            <Label htmlFor="categoryTitle" className="mint-body-normal">
              <Trans
                i18nKey={t('modal.category.categoryTitle.label')}
                components={{
                  s: <span className="text-secondary-dark" />
                }}
              />
            </Label>
            <TextInput
              {...register('categoryTitle', { required: true })}
              id="categoryTitle"
              type="text"
            />
          </FieldGroup>
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
    </Modal>
  );
};

export default MTOModal;
