import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

const LockedTaskListSection = () => {
  const { t } = useTranslation('modelPlanTaskList');
  const { modelID } = useParams<{ modelID: string }>();

  return (
    <MainContent className="mint-not-found grid-container">
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
