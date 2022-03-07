import React from 'react';
import { useTranslation } from 'react-i18next';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import PDFExport from 'components/PDFExport';
import { AnythingWrongSurvey } from 'components/Survey';
import SystemIntakeReview from 'components/SystemIntakeReview';
import { GetSystemIntake_systemIntake as SystemIntake } from 'queries/types/GetSystemIntake';

type IntakeReviewProps = {
  systemIntake: SystemIntake;
};

const IntakeReview = ({ systemIntake }: IntakeReviewProps) => {
  const { t } = useTranslation('governanceReviewTeam');
  const filename = `System intake for ${systemIntake.requestName}.pdf`;

  return (
    <div data-testid="intake-review">
      <PageHeading className="margin-top-0">{t('general:intake')}</PageHeading>
      <PDFExport
        title="System Intake"
        filename={filename}
        label="Download System Intake as PDF"
      >
        <SystemIntakeReview systemIntake={systemIntake} />
      </PDFExport>
      <UswdsReactLink
        className="usa-button margin-top-5"
        variant="unstyled"
        to={`/governance-review-team/${systemIntake.id}/actions`}
      >
        Take an action
      </UswdsReactLink>
      <AnythingWrongSurvey />
    </div>
  );
};

export default IntakeReview;
