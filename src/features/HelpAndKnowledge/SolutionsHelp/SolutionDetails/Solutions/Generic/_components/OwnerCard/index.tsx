import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardBody } from '@trussworks/react-uswds';
import { SolutionSystemOwnerType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

const OwnerCard = ({ owner }: { owner: SolutionSystemOwnerType }) => {
  const { t } = useTranslation('helpAndKnowledge');

  return (
    <div className="margin-bottom-3">
      <Card
        key={owner.id}
        className="margin-bottom-0"
        containerProps={{
          className: 'radius-md padding-2 margin-bottom-1 margin-x-0'
        }}
      >
        <CardBody className="padding-0 margin-bottom-0">
          <h3 className="margin-bottom-0 line-height-sans-2">
            {owner.cmsComponent}
          </h3>

          <p className="margin-top-1 line-height-sans-5">{owner.ownerType}</p>
        </CardBody>
      </Card>

      <div>
        <Button
          type="button"
          className="margin-right-2"
          unstyled
          onClick={() => {}}
        >
          {t('edit')}
        </Button>
        <Button
          type="button"
          className="text-error"
          unstyled
          onClick={() => {}}
        >
          {t('removeOwner')}
        </Button>
      </div>
    </div>
  );
};

export default OwnerCard;
