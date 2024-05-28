import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import Alert from 'components/shared/Alert';
import ExternalLink from 'components/shared/ExternalLink';
import { HelpSolutionType } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import { TimelineConfigType } from '../../Solutions/Generic/timeline';

const GatheringInfoAlert = ({ solution }: { solution: HelpSolutionType }) => {
  const { t } = useTranslation('helpAndKnowledge');

  const timelineConfig: TimelineConfigType = t(
    `solutions.${solution.key}.timeline`,
    {
      returnObjects: true
    }
  );

  const contactName = solution.alertPrimaryContact
    ? solution.pointsOfContact?.find(contact => contact.isPrimary)?.name
    : 'the MINT Team';

  const contactEmail = solution.alertPrimaryContact
    ? solution.pointsOfContact?.find(contact => contact.isPrimary)?.email
    : 'MINTTeam@cms.hhs.gov';

  return (
    <Alert
      type="info"
      heading={`${t('gatheringInfoAlert.header')} ${
        solution.acronym || solution.name
      }`}
      className="line-height-body-5"
    >
      <Trans
        i18nKey="helpAndKnowledge:gatheringInfoAlert.description"
        values={{
          user: contactName,
          email: contactEmail
        }}
        components={{
          emailLink: (
            <ExternalLink href={`mailto:${contactEmail}`}>
              {contactEmail}
            </ExternalLink>
          )
        }}
      >
        {timelineConfig?.description
          ? timelineConfig.description
          : t('gatheringInfoAlert.description2')}
      </Trans>
    </Alert>
  );
};

export default GatheringInfoAlert;
