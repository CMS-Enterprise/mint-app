import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';

import CommonMilestoneSidePanel from '../CommonMilestoneSidePanel';

const CommonMilestoneAdminActions = () => {
  const { t } = useTranslation('helpAndKnowledge');

  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <div>
      <CommonMilestoneSidePanel
        isPanelOpen={isPanelOpen}
        mode="addCommonMilestone"
        closeModal={() => setIsPanelOpen(false)}
      />

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

          <Button
            type="button"
            className="usa-button usa-button--outline"
            onClick={() => setIsPanelOpen(true)}
          >
            {t('milestoneLibrary.adminActions.manageCommonMilestones.cta')}
          </Button>
        </SummaryBoxContent>
      </SummaryBox>
    </div>
  );
};

export default CommonMilestoneAdminActions;
