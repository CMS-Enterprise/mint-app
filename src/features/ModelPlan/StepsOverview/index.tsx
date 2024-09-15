import React from 'react';
import { useTranslation } from 'react-i18next';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { ModelPlanOverviewContent } from 'features/HelpAndKnowledge/Articles/ModelPlanOverview';

import './index.scss';

const StepsOverview = () => {
  const { t } = useTranslation('modelPlanOverview');

  return (
    <MainContent>
      <div className="grid-container">
        <div className="tablet:grid-col-12">
          <Breadcrumbs
            items={[BreadcrumbItemOptions.HOME]}
            customItem={t('heading')}
          />

          <PageHeading>{t('heading')}</PageHeading>
          <ModelPlanOverviewContent />
          <UswdsReactLink
            className="usa-button margin-bottom-10"
            variant="unstyled"
            to="/models/new-plan"
            data-testid="continue-link"
          >
            {t('getStartedButton')}
          </UswdsReactLink>
        </div>
      </div>
    </MainContent>
  );
};

export default StepsOverview;
