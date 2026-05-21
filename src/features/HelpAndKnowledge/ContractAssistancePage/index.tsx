import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridContainer, Icon } from '@trussworks/react-uswds';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';

const ContractAssistancePage = () => {
  const { t: hkcT } = useTranslation('helpAndKnowledge');

  return (
    <MainContent>
      <GridContainer>
        <Breadcrumbs
          items={[BreadcrumbItemOptions.HELP_CENTER]}
          customItem={hkcT('contractAssistance.hkcHeading')}
        />
        <h1 className="margin-bottom-2 margin-top-5 line-height-large">
          {hkcT('contractAssistance.hkcHeading')}
        </h1>
        <p className="mint-body-large margin-bottom-2 margin-top-05">
          {hkcT('contractAssistance.description')}
        </p>
        <div className="margin-bottom-6">
          <UswdsReactLink to="/help-and-knowledge" data-testid="return-to-hkc">
            <span>
              <Icon.ArrowBack
                className="top-3px margin-right-1"
                aria-label="back"
              />
              {hkcT('milestoneLibrary.returnToHkc')}
            </span>
          </UswdsReactLink>
        </div>
      </GridContainer>
    </MainContent>
  );
};

export default ContractAssistancePage;
