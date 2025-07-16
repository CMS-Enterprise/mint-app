import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';
import { SolutionContractorType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import Alert from 'components/Alert';

import ContractorCard from '../ContractorCard';
import ContractorModal from '../ContractorModal';

const Contractors = ({
  contractors
}: {
  contractors: SolutionContractorType[];
}) => {
  const { t } = useTranslation('helpAndKnowledge');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasContractors = contractors && contractors?.length > 0;
  const sortedContractors = [...(contractors || [])].sort((a, b) =>
    a.contractorName.localeCompare(b.contractorName)
  );

  return (
    <div>
      <ContractorModal
        isModalOpen={isModalOpen}
        mode="addContractor"
        closeModal={() => setIsModalOpen(false)}
      />

      <h2 className="margin-bottom-2">{t('contractors')}</h2>
      <Button
        type="button"
        className="margin-bottom-3"
        unstyled
        onClick={() => setIsModalOpen(true)}
      >
        <Icon.Add aria-hidden />
        {t('addContractor')}
      </Button>
      {hasContractors ? (
        <div data-testid="contractor-cards">
          {sortedContractors.map(contractor => (
            <ContractorCard contractor={contractor} key={contractor.id} />
          ))}
        </div>
      ) : (
        <Alert type="info" slim>
          {t('noContractors')}
        </Alert>
      )}
    </div>
  );
};
export default Contractors;
