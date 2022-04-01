import React from 'react';
import { useTranslation } from 'react-i18next';
import { useOktaAuth } from '@okta/okta-react';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';

const WelcomeText = () => {
  const { t } = useTranslation('home');
  const { authState } = useOktaAuth();

  const mintTasks: string[] = t('mintTasks', {
    returnObjects: true
  });

  return (
    <div className="tablet:grid-col-9">
      <PageHeading>{t('home:title')}</PageHeading>
      <p>{t('mintPurpose')}</p>
      <ul className="line-height-body-5 margin-bottom-4">
        {mintTasks.map(task => (
          <li key={task}>{task}</li>
        ))}
      </ul>
      {authState?.isAuthenticated ? (
        <UswdsReactLink
          className="usa-button"
          variant="unstyled"
          to="/models/new-plan"
        >
          {t('startNow')}
        </UswdsReactLink>
      ) : (
        <UswdsReactLink
          className="usa-button width-auto"
          variant="unstyled"
          to="/signin"
        >
          {t('signIn')}
        </UswdsReactLink>
      )}
    </div>
  );
};

export default WelcomeText;
