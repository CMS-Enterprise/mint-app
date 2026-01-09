import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router-dom';

import AskAQuestion from 'components/AskAQuestion';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import MainContent from 'components/MainContent';
import ProtectedRoute from 'components/ProtectedRoute';
import { ModelInfoContext } from 'contexts/ModelInfoContext';

import IDDOCOperations from './IDDOCOperations';

const IddocQuestionnaire = () => {
  const { t } = useTranslation('dataExchangeApproachMisc');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const { modelName } = useContext(ModelInfoContext);

  return (
    <MainContent
      className="grid-container mint-body-normal"
      data-testid="model-payment"
    >
      <Breadcrumbs
        items={[
          BreadcrumbItemOptions.HOME,
          BreadcrumbItemOptions.COLLABORATION_AREA,
          BreadcrumbItemOptions.DATA_EXCHANGE_APPROACH
        ]}
      />

      <h1 className="margin-bottom-0 margin-top-5 line-height-large">
        {t('heading')}
      </h1>

      <p className="mint-body-large margin-bottom-0 margin-top-05">
        {t('forModel', {
          modelName
        })}
      </p>

      <p className="mint-body-medium">{t('description')}</p>

      <AskAQuestion
        modelID={modelID}
        className="margin-top-2 margin-bottom-7"
        renderTextFor="dataExchangeApproach"
      />

      <Outlet />
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
    }
  ]
};

export default IddocQuestionnaire;
