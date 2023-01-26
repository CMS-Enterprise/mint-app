import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';

import AskAQuestion from 'components/AskAQuestion';

import { OperationalNeedModalContext } from '../OperationalNeedModalContext';

const ITSolutionsSidebar = ({
  modelID,
  renderTextFor,
  isUpdating = false
}: {
  modelID: string;
  renderTextFor: 'need' | 'solution' | 'status';
  isUpdating?: boolean;
}) => {
  const { t } = useTranslation('itSolutions');
  const { setIsModalOpen } = useContext(OperationalNeedModalContext);

  return (
    <>
      <div className="border-top-05 border-primary-lighter padding-top-2 margin-top-4">
        <AskAQuestion modelID={modelID} renderTextFor={renderTextFor} />
      </div>
      {/* to receive remove operational need */}
      {isUpdating && (
        <div className="margin-top-4">
          <Button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="usa-button usa-button--unstyled line-height-body-5"
          >
            <p>{t('removeNeed')}</p>
          </Button>
        </div>
      )}
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

export default ITSolutionsSidebar;
