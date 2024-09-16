import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { Icon, Link } from '@trussworks/react-uswds';
import DevLogin from 'wrappers/AuthenticationWrapper/DevLogin';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import OktaSignInWidget from 'components/OktaSignInWidget';
import { localAuthStorageKey } from 'constants/localAuth';
import { isLocalAuthEnabled } from 'utils/auth';

import './index.scss';

const Login = () => {
  const { t: getAccessT } = useTranslation('getAccess');

  const [error, setError] = useState(false);

  let defaultAuth = false;
  const { oktaAuth, authState } = useOktaAuth();
  const history = useHistory();

  if (isLocalAuthEnabled() && window.localStorage[localAuthStorageKey]) {
    defaultAuth = JSON.parse(
      window.localStorage[localAuthStorageKey]
    ).favorLocalAuth;
  }
  const [isLocalAuth, setIsLocalAuth] = useState(defaultAuth);

  const handleUseLocalAuth = () => {
    setIsLocalAuth(true);
  };

  const onSuccess = (tokens: any) => {
    const referringUri = oktaAuth.getOriginalUri();
    oktaAuth.handleLoginRedirect(tokens).then(() => {
      history.push(referringUri || '/pre-decisional-notice');
    });
  };

  useEffect(() => {
    if (authState?.isAuthenticated) {
      history.replace('/pre-decisional-notice');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState?.isAuthenticated]);

  if (isLocalAuthEnabled() && isLocalAuth) {
    return (
      <MainContent className="grid-container margin-top-4">
        <DevLogin />
      </MainContent>
    );
  }

  return (
    <MainContent className="grid-container">
      {isLocalAuthEnabled() && (
        <div>
          <button
            type="button"
            onClick={handleUseLocalAuth}
            data-testid="LocalAuth-Visit"
          >
            Use Local Auth
          </button>
        </div>
      )}

      {error && (
        <Alert type="error">
          <Trans i18nKey="general:oktaErrorMessage.noPermission">
            indexZero
            <Link href="mailto:MINTTeam@cms.hhs.gov">email</Link>
            indexTwo
          </Trans>
        </Alert>
      )}

      <OktaSignInWidget
        onSuccess={onSuccess}
        onError={() => {}}
        setError={setError}
      />

      <Alert type="info" className="access-alert">
        <div className="margin-bottom-0 margin-top-neg-05 text-bold">
          {getAccessT('accessInfo')}
        </div>
        <UswdsReactLink to="/how-to-get-access">
          {getAccessT('learnHow')}
          <Icon.ArrowForward className="margin-left-1 text-tbottom" />
        </UswdsReactLink>
      </Alert>
    </MainContent>
  );
};

export default Login;
