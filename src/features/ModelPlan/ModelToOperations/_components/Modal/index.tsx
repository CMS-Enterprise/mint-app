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
      <div className="margin-bottom-2">
        <p>asdfasdf</p>
      </div>
    </Modal>
  );
};

export default MTOModal;
