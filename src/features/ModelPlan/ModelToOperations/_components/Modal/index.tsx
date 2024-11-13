import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';

type MTOModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

const MTOModal = ({ isOpen, closeModal }: MTOModalProps) => {
  const { t } = useTranslation('modelToOperationsMisc');

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} shouldCloseOnOverlayClick>
      <PageHeading
        headingLevel="h3"
        className="margin-top-neg-3 margin-bottom-2"
      >
        {t('modal.title', { type: 'category' })}
      </PageHeading>
      <Trans
        i18nKey={t('modal.allFieldsRequired')}
        components={{
          s: <span className="text-secondary-dark" />
        }}
      />
    </Modal>
  );
};

export default MTOModal;
