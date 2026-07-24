import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { Icon, Link } from '@trussworks/react-uswds';
import DevLogin from 'wrappers/AuthenticationWrapper/DevLogin';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
// TODO(MINT-3761): remove OktaSignInWidget import/usage once redirect login is permanent.
import OktaSignInWidget from 'components/OktaSignInWidget';
import Spinner from 'components/Spinner';
import { localAuthStorageKey } from 'constants/localAuth';
// TODO(MINT-3761): remove isOktaRedirectLoginEnabled gating once redirect login is permanent
// (always redirect; drop the widget fallback branch below).
import { isLocalAuthEnabled, isOktaRedirectLoginEnabled } from 'utils/auth';

import './index.scss';

const Login = () => {
  const { t: getAccessT } = useTranslation('getAccess');

  const [error, setError] = useState(false);

  let defaultAuth = false;
  const { oktaAuth, authState } = useOktaAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const redirectLoginEnabled = isOktaRedirectLoginEnabled();
  const preferLocalAuth =
    isLocalAuthEnabled() &&
    new URLSearchParams(location.search).get('local') === 'true';

  if (isLocalAuthEnabled() && window.localStorage[localAuthStorageKey]) {
    defaultAuth = JSON.parse(
      window.localStorage[localAuthStorageKey]
    ).favorLocalAuth;
  }
  const [isLocalAuth, setIsLocalAuth] = useState(
    defaultAuth || preferLocalAuth
  );

  const handleUseLocalAuth = () => {
    setIsLocalAuth(true);
  };

  const onSuccess = (tokens: any) => {
    const referringUri = oktaAuth.getOriginalUri();

    oktaAuth.handleLoginRedirect(tokens).then(() => {
      // Only navigate if we're not already on the pre-decisional-notice page
      if (location.pathname !== '/pre-decisional-notice') {
        navigate('/pre-decisional-notice', {
          state: {
            nextState: referringUri || '/'
          }
        });
      }
    });
  };

  useEffect(() => {
    if (authState?.isAuthenticated) {
      // Only redirect if we're not already on the pre-decisional-notice page
      if (location.pathname !== '/pre-decisional-notice') {
        navigate('/pre-decisional-notice', { replace: true });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState?.isAuthenticated]);

  // Redirect-login path: bounce unauthenticated Okta users to the hosted login page.
  // Skip when the developer opted into local auth via ?local=true.
  useEffect(() => {
    if (!redirectLoginEnabled || isLocalAuth) {
      return;
    }
    if (!authState || authState.isPending || authState.isAuthenticated) {
      return;
    }

    oktaAuth.signInWithRedirect();
  }, [authState, isLocalAuth, oktaAuth, redirectLoginEnabled]);

  if (isLocalAuthEnabled() && isLocalAuth) {
    return (
      <MainContent className="grid-container margin-top-4">
        <DevLogin />
      </MainContent>
    );
  }

  // Redirect path: brief spinner while the browser leaves for Okta/ELP.
  // Local-auth entry (when redirect is enabled): /signin?local=true
  if (redirectLoginEnabled) {
    return (
      <MainContent className="grid-container">
        <div className="margin-y-8 text-center">
          <Spinner size="large" center />
        </div>
      </MainContent>
    );
  }

  // TODO(MINT-3761): remove this entire widget fallback return once redirect login is permanent.
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
          <Icon.ArrowForward
            className="margin-left-1 text-tbottom"
            aria-label="forward"
          />
        </UswdsReactLink>
      </Alert>
    </MainContent>
  );
};

export default Login;
