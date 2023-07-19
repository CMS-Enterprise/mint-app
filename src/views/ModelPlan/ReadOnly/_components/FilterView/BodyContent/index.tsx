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

  const components: Record<string, React.ElementType> = {
    basics: ReadOnlyModelBasics,
    'general-characteristics': ReadOnlyGeneralCharacteristics,
    'participants-and-providers': ReadOnlyParticipantsAndProviders,
    beneficiaries: ReadOnlyBeneficiaries,
    'ops-eval-and-learning': ReadOnlyOpsEvalAndLearning,
    payments: ReadOnlyPayments
  };

  return (
    <Grid>
      <FitleredViewSection sectionName="model-team">
        <h2 className="margin-top-0 margin-bottom-4">{t('modelTeam')}</h2>
        <ReadOnlyTeamInfo
          modelID={modelID}
          isViewingFilteredView
          filteredView={filteredView}
        />
      </FitleredViewSection>

      {Object.keys(individualFilterView).map(task => {
        const FitleredViewSectionContent = components[task];

        return (
          <FitleredViewSection
            sectionName={task}
            key={task}
            lastSection={task === Object.keys(individualFilterView).pop()}
          >
            <FitleredViewSectionContent
              modelID={modelID}
              filteredView={filteredView}
              isViewingFilteredView
              filteredQuestions={
                individualFilterView[task as keyof typeof individualFilterView]
              }
            />
          </FitleredViewSection>
        );
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
