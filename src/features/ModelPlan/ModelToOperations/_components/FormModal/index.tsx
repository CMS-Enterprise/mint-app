import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import { MTOModalContext } from 'contexts/MTOModalContext';
import useMessage from 'hooks/useMessage';

import CategoryForm from '../AddCustomCategoryForm';
import MilestoneForm from '../AddCustomMilestoneForm';
import SolutionForm from '../AddCustomSolutionForm';
import EditCategoryTitleForm from '../EditCategoryTitleForm';
import MoveSubCategoryForm from '../MoveSubCategoryForm';
import RemoveCategoryForm from '../RemoveCategoryForm';

export type MTOModalType =
  | 'category'
  | 'milestone'
  | 'solution'
  | 'editMilestone'
  | 'moveSubCategory'
  | 'editCategoryTitle'
  | 'removeCategory'
  | 'removeSubcategory';

type MTOModalProps = {
  isOpen: boolean;
  modalType: MTOModalType;
};

const MTOModal = ({ isOpen, modalType }: MTOModalProps) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { errorMessageInModal, clearMessage } = useMessage();

  const { resetMTOModalState, setMTOModalOpen } = useContext(MTOModalContext);

  const modalTitle = (() => {
    switch (modalType) {
      case 'category':
        return t('modal.title.category');
      case 'milestone':
        return t('modal.title.milestone');
      case 'solution':
        return t('modal.title.solution');
      case 'moveSubCategory':
        return t('modal.title.moveSubCategory');
      case 'editCategoryTitle':
        return t('modal.title.editCategoryTitle');
      case 'removeCategory':
        return t('modal.title.removeCategory');
      case 'removeSubcategory':
        return t('modal.title.removeSubcategory');
      default:
        return '';
    }
  })();

  return (
    <Modal
      isOpen={isOpen}
      closeModal={() => {
        clearMessage();
        resetMTOModalState();
        setMTOModalOpen(false);
      }}
      shouldCloseOnOverlayClick
      className="tablet:width-mobile-lg mint-body-normal"
    >
      <div className="margin-bottom-2">
        <PageHeading headingLevel="h3" className="margin-y-0">
          {modalTitle}
        </PageHeading>

        {modalType !== 'removeCategory' &&
          modalType !== 'removeSubcategory' && (
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

      {errorMessageInModal}

      {/* if type is category, then render CategoryForm */}
      {modalType === 'category' && <CategoryForm />}
      {modalType === 'milestone' && <MilestoneForm />}
      {modalType === 'solution' && <SolutionForm />}
      {modalType === 'moveSubCategory' && <MoveSubCategoryForm />}
      {modalType === 'editCategoryTitle' && <EditCategoryTitleForm />}
      {(modalType === 'removeCategory' ||
        modalType === 'removeSubcategory') && <RemoveCategoryForm />}
    </Modal>
  );
};

export default MTOModal;
