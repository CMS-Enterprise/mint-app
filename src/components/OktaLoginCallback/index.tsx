import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { LoginCallback } from '@okta/okta-react';
import { Link } from '@trussworks/react-uswds';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import Spinner from 'components/Spinner';

type OktaCallbackErrorProps = {
  error: Error;
};

/**
 * User-facing error for failed Okta redirect callbacks.
 * Without this, LoginCallback's default error is hidden by PageWrapper on /implicit/callback.
 */
export const OktaCallbackError = ({ error }: OktaCallbackErrorProps) => {
  const { t } = useTranslation('auth');

  return (
    <MainContent className="grid-container margin-y-6">
      <Alert type="error" heading={t('callbackError.heading')}>
        <Trans i18nKey="general:oktaErrorMessage.noPermission">
          indexZero
          <Link href="mailto:MINTTeam@cms.hhs.gov">email</Link>
          indexTwo
        </Trans>
      </Alert>
      <p className="margin-top-2">
        <UswdsReactLink to="/">{t('callbackError.returnHome')}</UswdsReactLink>
        {' · '}
        <UswdsReactLink to="/signin">
          {t('callbackError.tryAgain')}
        </UswdsReactLink>
      </p>
      {import.meta.env.DEV && (
        <pre className="margin-top-2 font-mono-xs text-base-dark">
          {error.name}: {error.message}
        </pre>
      )}
    </MainContent>
  );
};

const OktaLoginCallback = () => (
  <LoginCallback
    loadingElement={
      <div className="margin-y-8 text-center">
        <Spinner size="large" center />
      </div>
    }
    errorComponent={OktaCallbackError}
  />
);

export default OktaLoginCallback;
