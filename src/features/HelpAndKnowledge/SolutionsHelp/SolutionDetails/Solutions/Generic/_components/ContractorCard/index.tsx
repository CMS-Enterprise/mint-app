import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardBody } from '@trussworks/react-uswds';
import { SolutionContractorType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import ContractorModal from '../ContractorModal';
import RemoveContactModal from '../RemoveContactModal';

const ContractorCard = ({
  contractor
}: {
  contractor: SolutionContractorType;
}) => {
  const { t } = useTranslation('helpAndKnowledge');
  const [isEditContarctorModalOpen, setIsEditContarctorModalOpen] =
    useState(false);
  const [isRemoveContarctorModalOpen, setIsRemoveContarctorModalOpen] =
    useState(false);

  return (
    <div className="margin-bottom-3">
      <ContractorModal
        isModalOpen={isEditContarctorModalOpen}
        mode="editContractor"
        contractor={contractor}
        closeModal={() => setIsEditContarctorModalOpen(false)}
      />
      <RemoveContactModal
        isModalOpen={isRemoveContarctorModalOpen}
        closeModal={() => setIsRemoveContarctorModalOpen(false)}
        pointOfContact={contractor}
        contactType="contractor"
      />
      <Card
        key={contractor.contractorName}
        className="margin-bottom-0"
        containerProps={{
          className: 'radius-md padding-2 margin-bottom-1 margin-x-0'
        }}
      >
        <CardBody className="padding-0 margin-bottom-0">
          <h3 className="margin-bottom-0 line-height-sans-2">
            {t('contractor')}: {contractor.contractorName}
          </h3>
          {contractor?.contractTitle && (
            <p className="margin-top-1 line-height-sans-5">
              {t('contractTitle')}: {contractor.contractTitle}
            </p>
          )}
        </CardBody>
      </Card>

      <div>
        <Button
          type="button"
          className="margin-right-2"
          unstyled
          onClick={() => setIsEditContarctorModalOpen(true)}
        >
          {t('edit')}
        </Button>
        <Button
          type="button"
          className="text-error"
          unstyled
          onClick={() => setIsRemoveContarctorModalOpen(true)}
        >
          {t('removeContractor')}
        </Button>
      </div>
    </div>
  );
};

export default ContractorCard;
