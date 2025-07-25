import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardBody } from '@trussworks/react-uswds';
import { SolutionSystemOwnerType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import usePlanTranslation from 'hooks/usePlanTranslation';

import OwnerModal from '../OwnerModal';
import RemoveContactModal from '../RemoveContactModal';

const OwnerCard = ({ owner }: { owner: SolutionSystemOwnerType }) => {
  const { t } = useTranslation('helpAndKnowledge');
  const { cmsComponent: cmsComponentConfig, ownerType: ownerTypeConfig } =
    usePlanTranslation('mtoCommonSolutionSystemOwner');
  const [isEditOwnerModalOpen, setIsEditOwnerModalOpen] = useState(false);
  const [isRemoveOwnerModalOpen, setIsRemoveOwnerModalOpen] = useState(false);

  return (
    <div className="margin-bottom-3">
      <OwnerModal
        isModalOpen={isEditOwnerModalOpen}
        mode="editSystemOwner"
        owner={owner}
        closeModal={() => setIsEditOwnerModalOpen(false)}
      />
      <RemoveContactModal
        isModalOpen={isRemoveOwnerModalOpen}
        closeModal={() => setIsRemoveOwnerModalOpen(false)}
        pointOfContact={owner}
        contactType="owner"
      />
      <Card
        key={owner.id}
        className="margin-bottom-0"
        containerProps={{
          className: 'radius-md padding-2 margin-bottom-1 margin-x-0'
        }}
      >
        <CardBody className="padding-0 margin-bottom-0">
          <h3 className="margin-bottom-0 line-height-sans-2">
            {cmsComponentConfig.options[owner.cmsComponent]}
          </h3>

          <p className="margin-top-1 line-height-sans-5">
            {ownerTypeConfig.options[owner.ownerType]}
          </p>
        </CardBody>
      </Card>

      <div>
        <Button
          type="button"
          className="margin-right-2"
          unstyled
          onClick={() => setIsEditOwnerModalOpen(true)}
        >
          {t('edit')}
        </Button>
        <Button
          type="button"
          className="text-error"
          unstyled
          onClick={() => setIsRemoveOwnerModalOpen(true)}
        >
          {t('removeOwner')}
        </Button>
      </div>
    </div>
  );
};

export default OwnerCard;
