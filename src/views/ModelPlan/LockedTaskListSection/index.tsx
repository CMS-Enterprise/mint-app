import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

interface LocationState {
  state: {
    route: string;
  };
  route: string;
}

const LockedTaskListSection = () => {
  const { t } = useTranslation('modelPlanTaskList');
  const location = useLocation<LocationState>();
  const route = location?.state?.route;
  const { modelID } = useParams<{ modelID: string }>();

  return (
    <MainContent className="mint-not-found grid-container">
      {route && (
        <BreadcrumbBar variant="wrap">
          <Breadcrumb>
            <BreadcrumbLink asCustom={UswdsReactLink} to="/">
              <span>{t('navigation.home')}</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb>
            <BreadcrumbLink
              asCustom={UswdsReactLink}
              to={`/models/${modelID}/task-list/`}
            >
              <span>{t('navigation.modelPlanTaskList')}</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb current>{t(`breadCrumbState.${route}`)}</Breadcrumb>
        </BreadcrumbBar>
      )}

      <div className="margin-y-7">
        <PageHeading className="margin-bottom-2">
          {t('lockedHeading')}
        </PageHeading>
        <p>{t('lockedSubheading')}</p>

        <UswdsReactLink
          className="usa-button margin-top-6"
          variant="unstyled"
          to={`/models/${modelID}/task-list`}
        >
          {t('returnToTaskList')}
        </UswdsReactLink>
      </div>
    </MainContent>
  );
};

export default LockedTaskListSection;
