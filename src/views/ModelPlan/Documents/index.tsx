import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Grid,
  GridContainer,
  Icon
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import Expire from 'components/shared/Expire';
import useMessage from 'hooks/useMessage';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import NotFound from 'views/NotFound';

import AddDocument from './AddDocument';
import PlanDocumentsTable from './table';

type DocumentStatusType = 'success' | 'error';

export const DocumentsContent = () => {
  const { t: h } = useTranslation('draftModelPlan');
  const { t } = useTranslation('documentsMisc');
  const { modelID } = useParams<{ modelID: string }>();
  const { message } = useMessage();
  const [documentMessage, setDocumentMessage] = useState('');
  const [documentStatus, setDocumentStatus] = useState<DocumentStatusType>(
    'error'
  );

  const { modelName } = useContext(ModelInfoContext);

  return (
    <MainContent data-testid="model-documents">
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <BreadcrumbBar variant="wrap">
            <Breadcrumb>
              <BreadcrumbLink asCustom={Link} to="/">
                <span>{h('home')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb>
              <BreadcrumbLink
                asCustom={Link}
                to={`/models/${modelID}/task-list`}
              >
                <span>{t('breadcrumb')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>{t('heading')}</Breadcrumb>
          </BreadcrumbBar>

          {message && <Expire delay={45000}>{message}</Expire>}

          {documentMessage && (
            <Expire delay={45000}>
              <Alert
                type={documentStatus}
                slim
                data-testid="mandatory-fields-alert"
                className="margin-y-4"
              >
                <span className="mandatory-fields-alert__text">
                  {documentMessage}
                </span>
              </Alert>
            </Expire>
          )}

          <PageHeading className="margin-top-4 margin-bottom-0">
            {t('heading')}
          </PageHeading>

          <p
            className="margin-top-0 margin-bottom-2 font-body-lg"
            data-testid="model-plan-name"
          >
            {h('for')} {modelName}
          </p>

          <p className="margin-bottom-2 font-body-md line-height-body-4">
            {t('description')}
          </p>

          <UswdsReactLink
            to={`/models/${modelID}/task-list`}
            className="display-inline-flex flex-align-center margin-y-3"
          >
            <Icon.ArrowBack className="margin-right-1" aria-hidden />
            {h('returnToTaskList')}
          </UswdsReactLink>

          <h4 className="margin-top-2 margin-bottom-1">{t('heading')}</h4>

          <UswdsReactLink
            className="usa-button"
            variant="unstyled"
            to={`/models/${modelID}/documents/add-document`}
          >
            {t('addADocument')}
          </UswdsReactLink>

          <PlanDocumentsTable
            modelID={modelID}
            setDocumentMessage={setDocumentMessage}
            setDocumentStatus={setDocumentStatus}
          />
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

const Documents = () => {
  return (
    <Switch>
      {/* Model Plan Documents Pages */}
      <Route
        path="/models/:modelID/documents"
        exact
        render={() => <DocumentsContent />}
      />
      <Route
        path="/models/:modelID/documents/add-document"
        exact
        render={() => <AddDocument />}
      />

      {/* 404 */}
      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default Documents;
