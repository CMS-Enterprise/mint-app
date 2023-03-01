import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from '@trussworks/react-uswds';

import Alert from 'components/shared/Alert';
import { HelpSolutionType } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

const GatheringInfoAlert = ({ solution }: { solution: HelpSolutionType }) => {
  const { t } = useTranslation('helpAndKnowledge');

  return (
    <Alert
      type="info"
      heading={`${t('gatheringInfoAlert.header')} ${
        solution.acronym || solution.name
      }`}
      className="line-height-body-5"
    >
      <Trans i18nKey="gatheringInfoAlert.description">
        In the meantime, contact the MINT Team at{' '}
        <Link
          aria-label="Open in a new tab"
          href="mailto:MINTTeam@cms.hhs.gov"
          target="_blank"
          rel="noopener noreferrer"
        >
          MINTTeam@cms.hhs.gov
        </Link>{' '}
        if you have any questions.
      </Trans>
    </Alert>
  );
};

export default GatheringInfoAlert;
