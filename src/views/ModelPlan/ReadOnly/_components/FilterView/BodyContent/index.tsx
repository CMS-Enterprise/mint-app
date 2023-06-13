import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Alert, Grid, Link } from '@trussworks/react-uswds';

import ReadOnlyGeneralCharacteristics from 'views/ModelPlan/ReadOnly/GeneralCharacteristics';
import ReadOnlyModelBasics from 'views/ModelPlan/ReadOnly/ModelBasics';
import ReadOnlyTeamInfo from 'views/ModelPlan/ReadOnly/Team';

const FitleredViewSection = ({
  sectionName,
  children
}: {
  sectionName: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`filtered-view-section filtered-view-section--${sectionName} border-bottom border-base-light padding-bottom-6 margin-bottom-6`}
    >
      {children}
    </div>
  );
};

const BodyContent = ({ modelID }: { modelID: string }) => {
  const { t } = useTranslation('filterView');

  return (
    <Grid>
      <FitleredViewSection sectionName="model-team">
        <h2 className="margin-top-0 margin-bottom-4">Model Team</h2>
        <ReadOnlyTeamInfo modelID={modelID} isViewingFilteredView />
      </FitleredViewSection>
      <FitleredViewSection sectionName="model-basics">
        <ReadOnlyModelBasics modelID={modelID} isViewingFilteredView />
      </FitleredViewSection>
      <FitleredViewSection sectionName="general-characteristics">
        <ReadOnlyGeneralCharacteristics
          modelID={modelID}
          isViewingFilteredView
        />
      </FitleredViewSection>

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
