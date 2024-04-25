import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import { GetOperationalNeedQuery } from 'gql/gen/graphql';

import AskAQuestion from 'components/AskAQuestion';

import OperationalNeedRemovalModal from '../OperationalNeedRemovalModal';

type GetOperationalNeedType = GetOperationalNeedQuery['operationalNeed'];

type ITSolutionsSidebarTypes = {
  modelID: string;
  renderTextFor: 'need' | 'solution' | 'status';
  operationalNeed?: GetOperationalNeedType;
  helpfulLinks?: boolean;
};

const ITSolutionsSidebar = ({
  modelID,
  renderTextFor,
  operationalNeed,
  helpfulLinks = true
}: ITSolutionsSidebarTypes) => {
  const { t } = useTranslation('opSolutionsMisc');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {!!operationalNeed && (
        <OperationalNeedRemovalModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          modelID={modelID}
          id={operationalNeed.id}
          nameOther={operationalNeed.nameOther ?? ''}
        />
      )}
      <div className="border-top-05 border-primary-lighter padding-top-2 margin-top-4">
        <AskAQuestion modelID={modelID} renderTextFor={renderTextFor} />
      </div>
      {/* to receive remove operational need */}
      {!!operationalNeed && (
        <div className="margin-top-4">
          <Button
            type="button"
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="usa-button usa-button--unstyled line-height-body-5"
          >
            {t('removeNeed')}
          </Button>
        </div>
      )}
      {helpfulLinks && (
        <div className="margin-top-4">
          <p className="text-bold margin-bottom-2">{t('helpfulLinks')}</p>
          <Button
            type="button"
            onClick={() =>
              window.open('/help-and-knowledge/operational-solutions', '_blank')
            }
            className="usa-button usa-button--unstyled line-height-body-5"
          >
            {t('availableSolutions')}
          </Button>
        </div>
      )}
    </>
  );
};

export default ITSolutionsSidebar;
