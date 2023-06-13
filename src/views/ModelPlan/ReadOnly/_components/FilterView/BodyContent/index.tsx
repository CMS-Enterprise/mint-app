import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Alert, Grid, Link } from '@trussworks/react-uswds';

import ReadOnlyBeneficiaries from 'views/ModelPlan/ReadOnly/Beneficiaries';
import ReadOnlyGeneralCharacteristics from 'views/ModelPlan/ReadOnly/GeneralCharacteristics';
import ReadOnlyModelBasics from 'views/ModelPlan/ReadOnly/ModelBasics';
import ReadOnlyOpsEvalAndLearning from 'views/ModelPlan/ReadOnly/OpsEvalAndLearning';
import ReadOnlyParticipantsAndProviders from 'views/ModelPlan/ReadOnly/ParticipantsAndProviders';
import ReadOnlyPayments from 'views/ModelPlan/ReadOnly/Payments';
import ReadOnlyTeamInfo from 'views/ModelPlan/ReadOnly/Team';

import allPossibleFilterViews from './_filterGroupMapping';

const FitleredViewSection = ({
  children,
  lastSection,
  sectionName
}: {
  children: React.ReactNode;
  lastSection?: boolean;
  sectionName: string;
}) => {
  return (
    <div
      className={`filtered-view-section filtered-view-section--${sectionName} margin-bottom-6 ${
        !lastSection
          ? 'border-bottom border-base-light padding-bottom-4'
          : 'padding-bottom-0'
      }`}
    >
      {children}
    </div>
  );
};

const BodyContent = ({
  modelID,
  filteredView
}: {
  modelID: string;
  filteredView: string;
}) => {
  const { t } = useTranslation('filterView');

  const individualFilterView =
    allPossibleFilterViews[filteredView as keyof typeof allPossibleFilterViews];

  return (
    <Grid>
      <FitleredViewSection sectionName="model-team">
        <h2 className="margin-top-0 margin-bottom-4">Model Team</h2>
        <ReadOnlyTeamInfo modelID={modelID} isViewingFilteredView />
      </FitleredViewSection>

      {Object.keys(individualFilterView).map(task => {
        if (task === 'basics') {
          return (
            <FitleredViewSection
              sectionName="model-basics"
              key={task}
              lastSection={task === Object.keys(individualFilterView).pop()}
            >
              <ReadOnlyModelBasics modelID={modelID} isViewingFilteredView />
            </FitleredViewSection>
          );
        }

        if (task === 'general-characteristics') {
          return (
            <FitleredViewSection
              sectionName={task}
              key={task}
              lastSection={task === Object.keys(individualFilterView).pop()}
            >
              <ReadOnlyGeneralCharacteristics
                modelID={modelID}
                isViewingFilteredView
              />
            </FitleredViewSection>
          );
        }

        if (task === 'participants-and-providers') {
          return (
            <FitleredViewSection
              sectionName={task}
              key={task}
              lastSection={task === Object.keys(individualFilterView).pop()}
            >
              <ReadOnlyParticipantsAndProviders
                modelID={modelID}
                isViewingFilteredView
              />
            </FitleredViewSection>
          );
        }

        if (task === 'beneficiaries') {
          return (
            <FitleredViewSection
              sectionName={task}
              key={task}
              lastSection={task === Object.keys(individualFilterView).pop()}
            >
              <ReadOnlyBeneficiaries modelID={modelID} isViewingFilteredView />
            </FitleredViewSection>
          );
        }

        if (task === 'ops-eval-and-learning') {
          return (
            <FitleredViewSection
              sectionName={task}
              key={task}
              lastSection={task === Object.keys(individualFilterView).pop()}
            >
              <ReadOnlyOpsEvalAndLearning
                modelID={modelID}
                isViewingFilteredView
              />
            </FitleredViewSection>
          );
        }

        if (task === 'payments') {
          return (
            <FitleredViewSection
              sectionName={task}
              key={task}
              lastSection={task === Object.keys(individualFilterView).pop()}
            >
              <ReadOnlyPayments modelID={modelID} isViewingFilteredView />
            </FitleredViewSection>
          );
        }
        return <></>;
      })}

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
