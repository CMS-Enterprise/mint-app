import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import Alert from 'components/Alert';
import EChimpCardsTable from 'components/EChimpCards/EChimpCardsTable';
import ExternalLink from 'components/ExternalLink';
import { ECHIMP_URL_SSO } from 'constants/echimp';

const ReadOnlyCRTDLs = () => {
  const { t } = useTranslation('crtdlsMisc');

  return (
    <div
      className="read-only-model-plan--cr-and-tdls"
      data-testid="read-only-model-plan--cr-and-tdls"
    >
      <h2 className="margin-top-0 margin-bottom-4">{t('heading')}</h2>

      <p className="font-body-md line-height-body-4 mint-no-print">
        <Trans
          t={t}
          i18nKey="readOnlyDescription"
          components={{
            el: (
              <ExternalLink
                className="margin-right-0"
                href={ECHIMP_URL_SSO}
                toEchimp
              >
                {' '}
              </ExternalLink>
            )
          }}
        />
      </p>

      {/* TODO Clean up / remove in https://jiraent.cms.gov/browse/MINT-3134 */}
      <Alert type="info" slim className="margin-bottom-5">
        {t('echimp')}
      </Alert>

      <EChimpCardsTable isInReadView />
    </div>
  );
};

export default ReadOnlyCRTDLs;
