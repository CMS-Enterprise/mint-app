import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';

const CommonMilestoneAdminActions = () => {
  const { t } = useTranslation('helpAndKnowledge');

  return (
    <SummaryBox className="bg-info-lighter border-1px border-info-light radius-md padding-3 margin-bottom-5">
      <SummaryBoxHeading headingLevel="h2" className="margin-bottom-2">
        {t('milestoneLibrary.adminActions.title')}
      </SummaryBoxHeading>

      <SummaryBoxContent>
        <h4 className="margin-0 margin-bottom-1 line-height-sans-2">
          {t('milestoneLibrary.adminActions.manageCommonMilestones.header')}
        </h4>
        <p className="margin-0 margin-bottom-2 line-height-sans-5">
          {t(
            'milestoneLibrary.adminActions.manageCommonMilestones.description'
          )}
        </p>

        <UswdsReactLink
          className="usa-button usa-button--outline"
          variant="unstyled"
          to="/"
        >
          {t('milestoneLibrary.adminActions.manageCommonMilestones.cta')}
        </UswdsReactLink>
      </SummaryBoxContent>
    </SummaryBox>
  );
};

export default CommonMilestoneAdminActions;
