import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router-dom';
import { GridContainer } from '@trussworks/react-uswds';

import AskAQuestion from 'components/AskAQuestion';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import MainContent from 'components/MainContent';
import ProtectedRoute from 'components/ProtectedRoute';
import StickyModelNameWrapper from 'components/StickyModelNameWrapper';
import useStickyHeader from 'hooks/useStickyHeader';

import IDDOCBanner from './_components/IddocBanner';
import IDDOCMonitoring from './IDDOCMonitoring';
import IDDOCOperations from './IDDOCOperations';
import IDDOCTesting from './IDDOCTesting';

const IddocQuestionnaire = () => {
  const { t: iddocQuestionnaireMiscT } = useTranslation(
    'iddocQuestionnaireMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const { headerRef, modelName, abbreviation } = useStickyHeader();

  return (
    <MainContent data-testid="iddoc-questionnaire">
      <GridContainer>
        <IDDOCBanner />
        <Breadcrumbs
          items={[
            BreadcrumbItemOptions.HOME,
            BreadcrumbItemOptions.COLLABORATION_AREA,
            BreadcrumbItemOptions.ADDITIONAL_QUESTIONNAIRES,
            BreadcrumbItemOptions.IDDOC_QUESTIONNAIRE
          ]}
        />
      </GridContainer>

      <StickyModelNameWrapper
        triggerRef={headerRef}
        sectionHeading={iddocQuestionnaireMiscT('heading')}
        modelName={modelName}
        abbreviation={abbreviation || undefined}
      />

      <GridContainer>
        <h1
          className="margin-bottom-0 margin-top-4 line-height-large"
          ref={headerRef}
        >
          {iddocQuestionnaireMiscT('heading')}
        </h1>

        <p
          className="mint-body-large margin-bottom-0 margin-top-1"
          data-testid="model-plan-name"
        >
          {miscellaneousT('for')} {modelName}
        </p>

        <AskAQuestion
          modelID={modelID}
          className="margin-y-3"
          renderTextFor="iddocQuestionnaire"
        />

        <Outlet />
      </GridContainer>
    </MainContent>
  );
};

export const iddocQuestionnaireRoutes = {
  path: '/models/:modelID/collaboration-area/additional-questionnaires/iddoc-questionnaire',
  element: (
    <ProtectedRoute>
      <IddocQuestionnaire />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '/models/:modelID/collaboration-area/additional-questionnaires/iddoc-questionnaire/operations',
      element: <IDDOCOperations />
    },
    {
      path: '/models/:modelID/collaboration-area/additional-questionnaires/iddoc-questionnaire/testing',
      element: <IDDOCTesting />
    },
    {
      path: '/models/:modelID/collaboration-area/additional-questionnaires/iddoc-questionnaire/monitoring',
      element: <IDDOCMonitoring />
    }
  ]
};

export default IddocQuestionnaire;
