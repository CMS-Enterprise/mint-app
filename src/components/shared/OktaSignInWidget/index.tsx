// src/OktaSignInWidget.js
// okta-signin-widget has no typescript support yet.  If becomes available, install and remove disable
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import OktaSignIn from '@okta/okta-signin-widget';

import './index.scss';

type OktaSignInWidgetProps = {
  onSuccess: (auth: any) => any;
  onError: () => void;
  setError: (value: boolean) => void;
};

const OktaSignInWidget = ({
  onSuccess,
  onError,
  setError
}: OktaSignInWidgetProps) => {
  const { t } = useTranslation('general');
  const widgetRef = useRef(null);

  useEffect(() => {
    let signIn: any;
    if (widgetRef.current) {
      signIn = new OktaSignIn({
        el: widgetRef.current,
        i18n: {
          en: {
            'primaryauth.title': t('oktaWidget')
          }
        },
        baseUrl: import.meta.env.VITE_OKTA_DOMAIN,
        clientId: import.meta.env.VITE_OKTA_CLIENT_ID,
        authParams: {
          pkce: true,
          issuer: import.meta.env.VITE_OKTA_ISSUER,
          responseMode: 'query'
        }
      });

      signIn.on('afterError', (error: any) => {
        if (error.name === 'OAUTH_ERROR') {
          setError(true);
        }
      });

      signIn
        .showSignInToGetTokens({
          authorizationServerId: import.meta.env.VITE_OKTA_SERVER_ID,
          clientId: import.meta.env.VITE_OKTA_CLIENT_ID,
          redirectUri: import.meta.env.VITE_OKTA_REDIRECT_URI,
          scopes: ['openid', 'profile', 'email']
        })
        .then(onSuccess)
        .catch(onError);
    }

    return () => signIn.remove();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div id="mint-okta-sign-in" ref={widgetRef} />;
};

export default OktaSignInWidget;
