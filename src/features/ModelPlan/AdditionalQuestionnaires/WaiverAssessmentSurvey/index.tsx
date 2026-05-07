import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router-dom';
import { GridContainer } from '@trussworks/react-uswds';
import NotFound from 'features/NotFound';
import { useFlags } from 'launchdarkly-react-client-sdk';

import AskAQuestion from 'components/AskAQuestion';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import MainContent from 'components/MainContent';
import ProtectedRoute from 'components/ProtectedRoute';
import StickyModelNameWrapper from 'components/StickyModelNameWrapper';
import useStickyHeader from 'hooks/useStickyHeader';

import QuestionnaireBanner from '../_components/Banner';

import AboutWaiverAssessmentSurvey from './AboutWaiverAssessmentSurvey';

const WaiverAssessmentSurvey = () => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const flags = useFlags();

  const { modelID = '' } = useParams<{ modelID: string }>();

  const { headerRef, modelName, abbreviation } = useStickyHeader();

  if (!flags.waiverAssessmentSurveyEnabled) {
    return <NotFound />;
  }

  return (
    <MainContent data-testid="waiver-assessment-survey">
      <QuestionnaireBanner
        bannerText={waiverAssessmentSurveyMiscT('bannerText')}
      />

      <GridContainer>
        <Breadcrumbs
          items={[
            BreadcrumbItemOptions.HOME,
            BreadcrumbItemOptions.COLLABORATION_AREA,
            BreadcrumbItemOptions.ADDITIONAL_QUESTIONNAIRES,
            BreadcrumbItemOptions.WAIVER_ASSESSMENT_SURVEY
          ]}
        />
      </GridContainer>

      <StickyModelNameWrapper
        triggerRef={headerRef}
        sectionHeading={waiverAssessmentSurveyMiscT('heading')}
        modelName={modelName}
        abbreviation={abbreviation || undefined}
      />

      <GridContainer>
        <h1
          className="margin-bottom-0 margin-top-4 line-height-large"
          ref={headerRef}
        >
          {waiverAssessmentSurveyMiscT('heading')}
        </h1>

        <p
          className="mint-body-large margin-bottom-0 margin-top-1"
          data-testid="model-plan-name"
        >
          {miscellaneousT('for')} {modelName}
        </p>

        <p className="mint-body-medium">
          {waiverAssessmentSurveyMiscT('description')}
        </p>

        <AskAQuestion
          modelID={modelID}
          className="margin-top-3 margin-bottom-6"
          renderTextFor="waiverAssessmentSurvey"
        />

        <Outlet />
      </GridContainer>
    </MainContent>
  );
};

export const waiverAssessmentSurveyRoutes = {
  path: '/models/:modelID/collaboration-area/additional-questionnaires/waiver-assessment-survey',
  element: (
    <ProtectedRoute>
      <WaiverAssessmentSurvey />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '/models/:modelID/collaboration-area/additional-questionnaires/waiver-assessment-survey/about',
      element: <AboutWaiverAssessmentSurvey />
    },
    {
      path: '/models/:modelID/collaboration-area/additional-questionnaires/waiver-assessment-survey/model-plan-questions'
      //       element: <WaiverAssessmentSurveyModelPlanQuestions />
    }
  ]
};

export default WaiverAssessmentSurvey;
