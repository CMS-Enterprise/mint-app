import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { Alert, Link } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import OktaSignInWidget from 'components/shared/OktaSignInWidget';
import { localAuthStorageKey } from 'constants/localAuth';
import { isLocalAuthEnabled } from 'utils/auth';
import DevLogin from 'views/AuthenticationWrapper/DevLogin';

const Login = () => {
  const [error, setError] = useState(false);

  let defaultAuth = false;
  const { oktaAuth, authState } = useOktaAuth();
  const history = useHistory();

  if (isLocalAuthEnabled() && window.localStorage[localAuthStorageKey]) {
    defaultAuth = JSON.parse(window.localStorage[localAuthStorageKey])
      .favorLocalAuth;
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
    </MainContent>
  );
};

export default Login;
