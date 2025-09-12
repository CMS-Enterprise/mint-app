import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import { MTOModalContext } from 'contexts/MTOModalContext';
import useMessage from 'hooks/useMessage';

import CustomCategoryForm from '../AddCustomCategoryForm';
import CustomMilestoneForm from '../AddCustomMilestoneForm';
import CustomSolutionForm from '../AddCustomSolutionForm';
import AddTemplateModal from '../AddTemplateModal';
import EditCategoryTitleForm from '../EditCategoryTitleForm';
import MoveSubCategoryForm from '../MoveSubCategoryForm';
import RemoveCategoryForm from '../RemoveCategoryForm';
import SelectSolutionForm from '../SelectSolutionForm';

export type MTOModalType =
  | 'category'
  | 'milestone'
  | 'solution'
  | 'editMilestone'
  | 'moveSubCategory'
  | 'editCategoryTitle'
  | 'removeCategory'
  | 'removeSubcategory'
  | 'addTemplate'
  | 'selectSolution'
  | 'template';

const nonRequiredForms: Partial<MTOModalType[]> = [
  'removeCategory',
  'removeSubcategory',
  'addTemplate'
];

const shouldNotCloseModals: string[] = ['selectSolution'];

const MTOModal = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { errorMessageInModal, clearMessage } = useMessage();

  const {
    resetMTOModalState,
    setMTOModalOpen,
    isMTOModalOpen,
    mtoModalState: { modalType }
  } = useContext(MTOModalContext);

  return (
    <Modal
      isOpen={isMTOModalOpen}
      closeModal={() => {
        clearMessage();
        resetMTOModalState();
        setMTOModalOpen(false);
      }}
      fixed
      shouldCloseOnOverlayClick={!shouldNotCloseModals.includes(modalType)}
      className="tablet:width-mobile-lg mint-body-normal"
    >
      <div className="margin-bottom-2">
        <PageHeading headingLevel="h3" className="margin-y-0">
          {t(`modal.${modalType}.title`)}
        </PageHeading>

        {!nonRequiredForms.includes(modalType) && (
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

      {modalType === 'category' && <CustomCategoryForm />}
      {modalType === 'milestone' && <CustomMilestoneForm />}
      {modalType === 'solution' && <CustomSolutionForm />}
      {modalType === 'moveSubCategory' && <MoveSubCategoryForm />}
      {modalType === 'editCategoryTitle' && <EditCategoryTitleForm />}
      {(modalType === 'removeCategory' ||
        modalType === 'removeSubcategory') && <RemoveCategoryForm />}
      {modalType === 'addTemplate' && <AddTemplateModal />}
      {modalType === 'selectSolution' && <SelectSolutionForm />}
    </Modal>
  );
};

export default MTOModal;
