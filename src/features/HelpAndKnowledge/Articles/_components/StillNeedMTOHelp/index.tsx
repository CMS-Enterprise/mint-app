import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from '@trussworks/react-uswds';

import ExternalLink from 'components/ExternalLink';

const StillNeedMTOHelp = () => {
  const { t } = useTranslation('creatingMtoMatrix');

  return (
    <>
      <h2 className="margin-top-5 margin-bottom-1 line-height-large">
        {t('stillNeedHelp')}
      </h2>

      <p className="margin-bottom-6 margin-top-1">
        <Trans
          i18nKey="creatingMtoMatrix:stillNeedHelpDescription"
          components={{
            email: <Link href="mailto:MINTTeam@cms.hhs.gov"> </Link>,
            slack: (
              <ExternalLink href="https://cmsgov.slack.com/archives/C04B10ZN6A2">
                {' '}
              </ExternalLink>
            )
          }}
        />
      </p>
    </>
  );
};
export default StillNeedMTOHelp;
