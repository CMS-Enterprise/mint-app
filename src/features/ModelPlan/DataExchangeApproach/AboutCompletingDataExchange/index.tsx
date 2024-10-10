import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Icon, Link } from '@trussworks/react-uswds';

import CollapsableLink from 'components/CollapsableLink';
import { tArray } from 'utils/translation';

const AboutCompletingDataExchange = () => {
  const { t } = useTranslation('dataExchangeApproachMisc');

  const expandItems = tArray(
    'dataExchangeApproachMisc:aboutCompletingDataExchange.whyDoINeedThisFormItems'
  );

  return (
    <>
      <h2 className="margin-bottom-2">
        {t('aboutCompletingDataExchange.heading')}
      </h2>

      <p>{t('aboutCompletingDataExchange.description')}</p>

      <CollapsableLink
        id="complete-data-form-why"
        horizontalCaret
        className="margin-top-3"
        childClassName="padding-top-0"
        label={t('aboutCompletingDataExchange.whyDoINeedThisForm')}
      >
        <ul className="margin-0">
          {expandItems.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CollapsableLink>

      <h3 className="margin-top-4 margin-bottom-0">
        {t('aboutCompletingDataExchange.whosInvolved')}
      </h3>

      <p>{t('aboutCompletingDataExchange.whosInvolvedDescription')}</p>

      <Link
        aria-label={t('aboutCompletingDataExchange.email')}
        className="line-height-body-5"
        href="mailto:MINTTeam@cms.hhs.gov"
        target="_blank"
      >
        {t('aboutCompletingDataExchange.email')}
        <Icon.MailOutline className="margin-left-1 text-tbottom" />
      </Link>

      <Grid row gap>
        <Grid desktop={{ col: 6 }} tablet={{ col: 6 }}>
          <h4 className="margin-bottom-1">
            {t('aboutCompletingDataExchange.modelTeam')}
          </h4>

          <p className="margin-top-0">
            {t('aboutCompletingDataExchange.modelTeamDescription')}
          </p>
        </Grid>

        <Grid desktop={{ col: 6 }} tablet={{ col: 6 }}>
          <h4 className="margin-bottom-1">
            {t('aboutCompletingDataExchange.itLead')}
          </h4>

          <p className="margin-top-0">
            {t('aboutCompletingDataExchange.modelTeamDescription')}
          </p>
        </Grid>
      </Grid>
    </>
  );
};

export default AboutCompletingDataExchange;
