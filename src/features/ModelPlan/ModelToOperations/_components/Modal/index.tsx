import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import useMessage from 'hooks/useMessage';

import CategoryForm from './CategoryForm';
import MilestoneForm from './MilestoneForm';

type MTOModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  modalType: 'category' | 'milestone' | 'solution';
};

const MTOModal = ({ isOpen, closeModal, modalType }: MTOModalProps) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { clearMessage } = useMessage();

  const modalTitle = (() => {
    switch (modalType) {
      case 'category':
        return t('modal.title.category');
      case 'milestone':
        return t('modal.title.milestone');
      case 'solution':
        return t('modal.title.solution');
      default:
        return '';
    }
  })();

  return (
    <Modal
      isOpen={isOpen}
      closeModal={() => {
        clearMessage();
        closeModal();
      }}
      shouldCloseOnOverlayClick
      className="tablet:width-mobile-lg mint-body-normal"
    >
      <div className="margin-bottom-2">
        <PageHeading headingLevel="h3" className="margin-y-0">
          {modalTitle}
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
      {modalType === 'category' && <CategoryForm closeModal={closeModal} />}
      {modalType === 'milestone' && <MilestoneForm closeModal={closeModal} />}
    </Modal>
  );
};

export default MTOModal;