import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardBody } from '@trussworks/react-uswds';
import { SolutionContractorType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

const ContractorCard = ({ contact }: { contact: SolutionContractorType }) => {
  const { t } = useTranslation('helpAndKnowledge');

  return (
    <>
      <Card
        key={contact.contractorName}
        className="margin-bottom-0"
        containerProps={{
          className: 'radius-md padding-2 margin-bottom-2 margin-x-0'
        }}
      >
        <CardBody className="padding-0 margin-bottom-1">
          <h3 className="margin-bottom-1 line-height-sans-2">
            {t('contractor')}: {contact.contractorName}
          </h3>
          {contact.contractorTitle && (
            <p className="margin-top-0 line-height-sans-5">
              {t('contractTitle')}: {contact.contractorTitle}
            </p>
          )}
        </CardBody>
      </Card>

      <Button type="button" className="margin-right-2" unstyled>
        {t('edit')}
      </Button>
      <Button type="button" className="text-error" unstyled>
        {t('removeContractor')}
      </Button>
    </>
  );
};

export default ContractorCard;
