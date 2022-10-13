import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { ModelPlanOverviewContent } from 'views/HelpAndKnowledge/Articles/ModelPlanOverview';

import './index.scss';

const StepsOverview = () => {
  const { t } = useTranslation('modelPlanOverview');

  return (
    <MainContent>
      <div className="grid-container">
        <div className="tablet:grid-col-12">
          <BreadcrumbBar variant="wrap">
            <Breadcrumb>
              <BreadcrumbLink asCustom={Link} to="/">
                <span>Home</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>{t('heading')}</Breadcrumb>
          </BreadcrumbBar>
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
