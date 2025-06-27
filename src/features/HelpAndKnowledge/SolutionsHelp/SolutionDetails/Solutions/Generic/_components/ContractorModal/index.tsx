import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { SolutionContractorType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';

import AddContractorForm from '../AddContractorForm';
import EditContractorForm from '../EditContractorForm';

// Matching keys in mtoCommonSolutionContractorMisc
export type ModeType = 'addContractor' | 'editContractor';

const ContractorModal = ({
  isModalOpen,
  closeModal,
  mode,
  contractor
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  mode: ModeType;
  contractor?: SolutionContractorType;
}) => {
  const { t } = useTranslation('mtoCommonSolutionContractorMisc');

  return (
    <Modal
      isOpen={isModalOpen}
      closeModal={closeModal}
      fixed
      className="tablet:width-mobile-lg mint-body-normal overflow-auto"
    >
      <div className="margin-bottom-2">
        <PageHeading headingLevel="h3" className="margin-y-0">
          {t(`${mode}.title`)}
        </PageHeading>
        <p className="text-base margin-y-1">
          <Trans
            i18nKey={t('allFieldsRequired')}
            components={{
              s: <span className="text-error" />
            }}
          />
        </p>
      </div>

      {mode === 'addContractor' && (
        <AddContractorForm closeModal={closeModal} />
      )}
      {mode === 'editContractor' && contractor && (
        <EditContractorForm closeModal={closeModal} contractor={contractor} />
      )}
    </Modal>
  );
};

export default ContractorModal;
