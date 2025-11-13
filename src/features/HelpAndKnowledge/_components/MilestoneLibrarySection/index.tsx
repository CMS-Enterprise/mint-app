import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridContainer } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import { convertToLowercaseAndDashes } from 'utils/modelPlan';

const MilestoneLibrarySection = () => {
  const { t } = useTranslation('helpAndKnowledge');

  return (
    <div
      id={convertToLowercaseAndDashes(t('milestoneLibrary.hkcJumpToLabel'))}
      className="padding-y-4 padding-bottom-6 bg-base-lightest"
      style={{ scrollMarginTop: '3.5rem' }}
    >
      <GridContainer>
        <h2 className="margin-0">{t('milestoneLibrary.hkcHeading')}</h2>

        <p className="margin-top-1 margin-bottom-3 font-body-md line-height-sans-4">
          {t('milestoneLibrary.hkcDescription')}
        </p>

        <UswdsReactLink
          to="/help-and-knowledge/milestone-library?page=1"
          variant="unstyled"
          className="usa-button text-white"
        >
          {t('milestoneLibrary.hkcViewCta')}
        </UswdsReactLink>
      </GridContainer>
    </div>
  );
};

export default MilestoneLibrarySection;
