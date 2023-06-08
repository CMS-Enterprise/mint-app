import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Alert, Grid, Link } from '@trussworks/react-uswds';

import ReadOnlyTeamInfo from 'views/ModelPlan/ReadOnly/Team';

const BodyContent = ({ modelID }: { modelID: string }) => {
  const { t } = useTranslation('filterView');

  return (
    <Grid>
      <div className="filtered-view-section filtered-view-section--model-team border-bottom border-base-light padding-bottom-6 margin-bottom-6">
        <h2 className="margin-top-0 margin-bottom-4">Model Team</h2>
        <ReadOnlyTeamInfo modelID={modelID} isViewingFilteredView />
      </div>

      <Alert type="info" noIcon>
        <span className="margin-y-0 font-body-sm text-bold display-block">
          {t('alert.bodyContentHeading')}
        </span>
        <Trans i18nKey="filterView:alert.content">
          indexOne
          <Link href="mailto:MINTTeam@cms.hhs.gov">helpTextEmail</Link>
          indexTwo
        </Trans>
      </Alert>
    </Grid>
  );
};

export default BodyContent;
