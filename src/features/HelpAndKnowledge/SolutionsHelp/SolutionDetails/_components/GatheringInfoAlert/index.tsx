import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { HelpSolutionType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { timelineTranslationUtil } from 'features/HelpAndKnowledge/SolutionsHelp/util';

import Alert from 'components/Alert';
import ExternalLink from 'components/ExternalLink';

const GatheringInfoAlert = ({ solution }: { solution: HelpSolutionType }) => {
  const { t } = useTranslation('helpAndKnowledge');

  const timelineConfig = timelineTranslationUtil(solution.key);

  const primaryContact = solution.alertPrimaryContact
    ? solution.pointsOfContact?.find(contact => contact.isPrimary)
    : undefined;

  const contactName = primaryContact?.name || 'the MINT Team';

  const contactEmail = primaryContact?.email || 'MINTTeam@cms.hhs.gov';

  return (
    <Alert
      type="info"
      heading={`${t('gatheringInfoAlert.header')} ${
        solution.acronym || solution.name
      }`}
      className="line-height-body-5"
    >
      <Trans
        i18nKey={`helpAndKnowledge:gatheringInfoAlert.${
          primaryContact?.isTeam ? 'descriptionTeam' : 'description'
        }`}
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
