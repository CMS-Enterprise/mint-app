import React from 'react';
import { useTranslation } from 'react-i18next';
import { useOktaAuth } from '@okta/okta-react';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';

const WelcomeText = () => {
  const { t } = useTranslation('home');
  const { authState } = useOktaAuth();

  return (
    <div className="tablet:grid-col-9">
      <PageHeading>{t('home:title')}</PageHeading>
      {authState?.isAuthenticated ? (
        <></>
      ) : (
        <UswdsReactLink className="usa-button" variant="unstyled" to="/signin">
          {t('signIn')}
        </UswdsReactLink>
      )}
    </div>
  );
};

export default WelcomeText;
