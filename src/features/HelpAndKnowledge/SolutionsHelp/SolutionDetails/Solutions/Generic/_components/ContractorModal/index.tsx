import React from 'react';
import { Trans } from 'react-i18next';
import { SolutionContractorType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import { mtoCommonSolutionContractorMisc } from 'i18n/en-US/modelPlan/mtoCommonSolutionContractor';

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
  return (
    <Modal
      isOpen={isModalOpen}
      closeModal={closeModal}
      fixed
      className="tablet:width-mobile-lg mint-body-normal overflow-auto"
    >
      <div className="margin-bottom-2">
        <PageHeading headingLevel="h3" className="margin-y-0">
          {mtoCommonSolutionContractorMisc[mode].title}
        </PageHeading>
        <p className="text-base margin-y-1">
          <Trans
            i18nKey={mtoCommonSolutionContractorMisc.allFieldsRequired}
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
