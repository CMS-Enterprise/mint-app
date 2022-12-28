/*
View for displaying solution details, subtasks and linked solution documents
Links to views for updating solutions, adding subtasks, and documents
*/

import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Alert,
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Grid
} from '@trussworks/react-uswds';

import AskAQuestion from 'components/AskAQuestion';
import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Expire from 'components/shared/Expire';
import useMessage from 'hooks/useMessage';
import GetOperationalSolution from 'queries/ITSolutions/GetOperationalSolution';
import {
  GetOperationalSolution as GetOperationalSolutionType,
  GetOperationalSolution_operationalSolution as GetOperationalSolutionOperationalSolutionType,
  GetOperationalSolutionVariables
} from 'queries/ITSolutions/types/GetOperationalSolution';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import PlanDocumentsTable from 'views/ModelPlan/Documents/table';
import { DocumentStatusType } from 'views/ModelPlan/ReadOnly/Documents';
import NotFound from 'views/NotFound';

import SolutionDetailCard from '../_components/SolutionDetailCard';
// TODO: remove manual SubtaskStatus enum once generated from BE
import Subtasks, { SubtaskLinks, SubtaskStatus } from '../_components/Subtasks';

const SolutionDetails = () => {
  const { modelID, operationalNeedID, operationalSolutionID } = useParams<{
    modelID: string;
    operationalNeedID: string;
    operationalSolutionID: string;
  }>();

  const { t } = useTranslation('itSolutions');
  const { t: h } = useTranslation('draftModelPlan');

  const history = useHistory();

  const { message } = useMessage();

  const [documentMessage, setDocumentMessage] = useState('');
  const [documentStatus, setDocumentStatus] = useState<DocumentStatusType>(
    'error'
  );

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useQuery<
    GetOperationalSolutionType,
    GetOperationalSolutionVariables
  >(GetOperationalSolution, {
    variables: {
      id: operationalSolutionID
    }
  });

  const solution =
    data?.operationalSolution ||
    ({} as GetOperationalSolutionOperationalSolutionType);

  // TODO: remove temp subtasks
  const tempSubtasks = [
    {
      name: 'Review requirements document',
      status: SubtaskStatus.TO_DO
    },
    {
      name: 'Review onboarding materials',
      status: SubtaskStatus.TO_DO
    },
    {
      name: 'Write onboarding request',
      status: SubtaskStatus.IN_PROGRESS
    },
    {
      name: 'Gather recipient data',
      status: SubtaskStatus.DONE
    }
  ];

  if (error) {
    return <NotFound />;
  }

  return (
    <>
      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={UswdsReactLink} to="/">
            <span>{h('home')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbLink
            asCustom={UswdsReactLink}
            to={`/models/${modelID}/task-list/`}
          >
            <span>{h('tasklistBreadcrumb')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbLink
            asCustom={UswdsReactLink}
            to={`/models/${modelID}/task-list/it-solutions`}
          >
            <span>{t('breadcrumb')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>{t('solutionDetails')}</Breadcrumb>
      </BreadcrumbBar>

      {message}

      {documentMessage && (
        <Expire delay={4000}>
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

      <Grid row gap className="margin-bottom-4">
        <Grid tablet={{ col: 9 }}>
          <PageHeading className="margin-top-4 margin-bottom-2">
            {t('solutionDetails')}
          </PageHeading>

          <p
            className="margin-top-0 margin-bottom-1 font-body-lg"
            data-testid="model-plan-name"
          >
            {h('for')} {modelName}
          </p>

          <p className="line-height-body-4">{t('solutionDetailsInfo')}</p>
        </Grid>
        <Grid tablet={{ col: 3 }} className="padding-x-1">
          <div className="border-top-05 border-primary-lighter padding-top-2 margin-top-4">
            <AskAQuestion modelID={modelID} opNeeds />
          </div>
        </Grid>
      </Grid>

      <Grid tablet={{ col: 12 }}>
        {loading ? (
          <PageLoading />
        ) : (
          <>
            <SolutionDetailCard
              solution={solution}
              operationalNeedID={operationalNeedID}
              modelID={modelID}
            />

            {/* TODO: remove temp subtask data */}
            <Subtasks subtasks={tempSubtasks} className="margin-top-6" />

            {/* TODO: remove temp subtask data */}
            <SubtaskLinks className="margin-top-3" subtasks={tempSubtasks} />

            {/* Documents table and link */}
            <div className="margin-top-6">
              <h3 className="margin-bottom-0">{t('documents')}</h3>
              <PlanDocumentsTable
                className="margin-top-neg-2"
                modelID={modelID}
                setDocumentMessage={setDocumentMessage}
                setDocumentStatus={setDocumentStatus}
              />

              <div className="display-flex margin-y-4">
                {/* Link existing documents */}
                <Button
                  type="button"
                  id="link-documents"
                  className="usa-button usa-button--outline"
                  onClick={() => {
                    history.push(
                      `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/link-documents`
                    );
                  }}
                >
                  {t(`links.linkDocuments`)}
                </Button>

                {/* Upload document */}
                <Button
                  type="button"
                  id="upload-document"
                  className="usa-button usa-button--outline"
                  onClick={() => {
                    history.push(`/models/${modelID}/documents/add-document`);
                  }}
                >
                  {t(`links.uploadDocuments`)}
                </Button>
              </div>
            </div>
          </>
        )}
      </Grid>
    </>
  );
};

export default SolutionDetails;
