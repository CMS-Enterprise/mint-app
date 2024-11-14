import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';

import CategoryForm from './CategoryForm';

type MTOModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

const MTOModal = ({ isOpen, closeModal }: MTOModalProps) => {
  const { t } = useTranslation('modelToOperationsMisc');

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

      {/* if type is category, then render CategoryForm */}
      <CategoryForm closeModal={closeModal} />
    </Modal>
  );
};

export default MTOModal;
