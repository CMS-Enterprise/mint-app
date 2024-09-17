import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, GridContainer } from '@trussworks/react-uswds';
import HelpBreadcrumb from 'features/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

const FeedbackReceived = () => {
  const { t } = useTranslation(['feedback']);

  return (
    <MainContent>
      <GridContainer>
        <HelpBreadcrumb newTabOnly />

        <PageHeading className="margin-bottom-2 margin-top-4">
          {t('thanksforFeedback')}
        </PageHeading>

        <p className="margin-bottom-2 font-body-lg">{t('feedbackReceived')}</p>

        <Button
          type="button"
          className="usa-button margin-y-2"
          onClick={() => {
            window.close();
          }}
        >
          {t('closeAndReturn')}
        </Button>

        <p className="text-bold">{t('sendAnother')}</p>

        <UswdsReactLink
          to="/report-a-problem"
          className="display-flex margin-y-1"
        >
          {t('reportWithMint')}
        </UswdsReactLink>

        <UswdsReactLink to="/send-feedback" className="display-flex">
          {t('sendFeedbackWithMint')}
        </UswdsReactLink>
      </GridContainer>
    </MainContent>
  );
};

export default FeedbackReceived;
