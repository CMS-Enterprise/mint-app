import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardBody } from '@trussworks/react-uswds';
import { SolutionContractorType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import RemoveContactModal from '../RemoveContactModal';

const ContractorCard = ({
  contractor
}: {
  contractor: SolutionContractorType;
}) => {
  const { t } = useTranslation('helpAndKnowledge');
  const [isRemoveContarctorModalOpen, setIsRemoveContarctorModalOpen] =
    useState(false);

  return (
    <div className="margin-bottom-3">
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
          className: 'radius-md padding-2 margin-bottom-2 margin-x-0'
        }}
      >
        <CardBody className="padding-0 margin-bottom-1">
          <h3 className="margin-bottom-1 line-height-sans-2">
            {t('contractor')}: {contractor.contractorName}
          </h3>
          {contractor?.contractorTitle && (
            <p className="margin-top-0 line-height-sans-5">
              {t('contractTitle')}: {contractor.contractorTitle}
            </p>
          )}
        </CardBody>
      </Card>

      <div>
        <Button type="button" className="margin-right-2" unstyled>
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
