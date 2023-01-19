import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';

import AskAQuestion from 'components/AskAQuestion';

const OperationalSolutionsSidebar = ({ modelID }: { modelID: string }) => {
  const { t } = useTranslation('itSolutions');

  return (
    <>
      <div className="border-top-05 border-primary-lighter padding-top-2 margin-top-4">
        <AskAQuestion modelID={modelID} opNeeds />
      </div>
      <div className="margin-top-4">
        <p className="text-bold margin-bottom-0">{t('helpfulLinks')}</p>
        <Button
          type="button"
          onClick={() =>
            window.open('/help-and-knowledge/model-plan-overview', '_blank')
          }
          className="usa-button usa-button--unstyled line-height-body-5"
        >
          <p>{t('availableSolutions')}</p>
        </Button>
      </div>
    </>
  );
};

export default OperationalSolutionsSidebar;
