import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import { MTOModalContext } from 'contexts/MTOModalContext';
import useMessage from 'hooks/useMessage';

import { MilestoneCardType } from '../../MilestoneLibrary';
import AddSolutionToMilestoneForm from '../AddCommonMilestoneForm';
import CategoryForm from '../AddCustomCategoryForm';
import MilestoneForm from '../AddCustomMilestoneForm';
import SolutionForm from '../AddCustomSolutionForm';

type MTOModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  modalType: 'category' | 'milestone' | 'solution' | 'solutionToMilestone';
  isRequired?: boolean;
  milestone?: MilestoneCardType;
};

const MTOModal = ({
  isOpen,
  closeModal,
  modalType,
  isRequired = true,
  milestone
}: MTOModalProps) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { clearMessage } = useMessage();
  const { resetCategoryAndSubCategoryID } = useContext(MTOModalContext);

  const modalTitle = (() => {
    switch (modalType) {
      case 'category':
        return t('modal.title.category');
      case 'milestone':
        return t('modal.title.milestone');
      case 'solution':
        return t('modal.title.solution');
      case 'solutionToMilestone':
        return t('modal.title.solutionToMilestone');
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
      fireAfterOpening={() => {
        clearMessage();
        resetCategoryAndSubCategoryID();
      }}
      shouldCloseOnOverlayClick
      className="tablet:width-mobile-lg mint-body-normal"
    >
      <div className="margin-bottom-2">
        <PageHeading headingLevel="h3" className="margin-y-0">
          {modalTitle}
        </PageHeading>

        {isRequired && (
          <p className="margin-y-0 text-base">
            <Trans
              i18nKey={t('modal.allFieldsRequired')}
              components={{
                s: <span className="text-secondary-dark" />
              }}
            />
          </p>
        )}
      </div>

      {/* if type is category, then render CategoryForm */}
      {modalType === 'category' && <CategoryForm closeModal={closeModal} />}
      {modalType === 'milestone' && <MilestoneForm closeModal={closeModal} />}
      {modalType === 'solution' && <SolutionForm closeModal={closeModal} />}
      {modalType === 'solutionToMilestone' && milestone && (
        <AddSolutionToMilestoneForm
          closeModal={closeModal}
          milestone={milestone}
        />
      )}
    </Modal>
  );
};

export default MTOModal;