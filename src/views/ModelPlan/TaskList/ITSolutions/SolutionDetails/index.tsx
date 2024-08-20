/*
View for displaying solution details, subtasks and linked solution documents
Links to views for updating solutions, adding subtasks, and documents
*/

import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Grid } from '@trussworks/react-uswds';
import {
  GetOperationalSolutionQuery,
  useDeleteDocumentSolutionLinkMutation,
  useGetOperationalSolutionQuery
} from 'gql/gen/graphql';

import AskAQuestion from 'components/AskAQuestion';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import Expire from 'components/shared/Expire';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import useMessage from 'hooks/useMessage';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import { Table } from 'views/ModelPlan/Documents/table';
import { DocumentStatusType } from 'views/ModelPlan/ReadOnly/Documents';
import NotFound from 'views/NotFound';

import SolutionDetailCard from '../_components/SolutionDetailCard';
import SubtasksTable from '../_components/SubtasksTable';

type GetOperationalSolutionOperationalSolutionType = GetOperationalSolutionQuery['operationalSolution'];

const SolutionDetails = () => {
  const { modelID, operationalNeedID, operationalSolutionID } = useParams<{
    modelID: string;
    operationalNeedID: string;
    operationalSolutionID: string;
  }>();

  const { t } = useTranslation('opSolutionsMisc');
  const { t: h } = useTranslation('draftModelPlan');
  const { t: documentsT } = useTranslation('documentsMisc');

  const isDesktop = useCheckResponsiveScreen('tablet', 'larger');

  const history = useHistory();

  const { message } = useMessage();

  const [documentMessage, setDocumentMessage] = useState('');
  const [documentStatus, setDocumentStatus] = useState<DocumentStatusType>(
    'error'
  );

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error, refetch } = useGetOperationalSolutionQuery({
    variables: {
      id: operationalSolutionID
    },
    fetchPolicy: 'network-only'
  });

  const solution =
    data?.operationalSolution ||
    ({} as GetOperationalSolutionOperationalSolutionType);

  const subtasks = data?.operationalSolution.operationalSolutionSubtasks || [];

  const [deleteSolutionLink] = useDeleteDocumentSolutionLinkMutation();

  const handleDocumentUnlink = (linkToRemove: string, documentName: string) => {
    deleteSolutionLink({
      variables: {
        solutionID: operationalSolutionID,
        documentIDs: [linkToRemove]
      }
    })
      .then(response => {
        if (response && !response.errors) {
          setDocumentMessage(
            documentsT('documentDisconnect.success', {
              documentName
            })
          );
          setDocumentStatus('success');
          refetch();
        } else if (response.errors) {
          setDocumentMessage(
            documentsT('documentDisconnect.error', { documentName })
          );
          setDocumentStatus('error');
        }
      })
      .catch(() => {
        setDocumentMessage(
          documentsT('documentDisconnect.error', { documentName })
        );
        setDocumentStatus('error');
      });
  };

  if (error) {
    return <NotFound />;
  }

  return (
    <>
      <Breadcrumbs
        items={[
          BreadcrumbItemOptions.HOME,
          BreadcrumbItemOptions.COLLABORATION_AREA,
          BreadcrumbItemOptions.TASK_LIST,
          BreadcrumbItemOptions.IT_TRACKER,
          BreadcrumbItemOptions.SOLUTION_DETAILS
        ]}
        customItem={t('breadcrumb')}
      />

      {message}

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
        {isDesktop && (
          <Grid desktop={{ col: 3 }} className="padding-x-1">
            <div className="border-top-05 border-primary-lighter padding-top-2 margin-top-4">
              <AskAQuestion modelID={modelID} renderTextFor="need" />
            </div>
          </Grid>
        )}
      </Grid>

      <Grid tablet={{ col: 12 }}>
        {loading ? (
          <PageLoading />
        ) : (
          <>
            <SolutionDetailCard
              solution={solution}
              operationalNeedID={operationalNeedID}
              operationalSolutionID={operationalSolutionID}
              modelID={modelID}
            />

            <SubtasksTable subtasks={subtasks} className="margin-top-6" />

            {/* Documents table and link */}
            <div className="margin-top-6">
              <h3 className="margin-bottom-0">{t('documents')}</h3>

              <div className="display-flex margin-top-2 margin-bottom-3">
                {/* Link existing documents */}
                <Button
                  type="button"
                  id="link-documents"
                  className="usa-button usa-button--outline"
                  onClick={() => {
                    history.push(
                      `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/link-documents`
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
                    history.push({
                      pathname: `/models/${modelID}/collaboration-area/documents/add-document`,
                      state: {
                        solutionID: operationalSolutionID,
                        solutionDetailsLink: `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/solution-details`
                      }
                    });
                  }}
                >
                  {t(`links.uploadDocuments`)}
                </Button>
              </div>

              <Table
                data={solution.documents}
                refetch={refetch}
                setDocumentMessage={setDocumentMessage}
                setDocumentStatus={setDocumentStatus}
                hasEditAccess
                handleDocumentUnlink={handleDocumentUnlink}
              />
            </div>
          </>
        )}
      </Grid>
      {!isDesktop && (
        <Grid desktop={{ col: 12 }} className="padding-x-1">
          <div className="border-top-05 border-primary-lighter padding-top-2 margin-top-4">
            <AskAQuestion modelID={modelID} renderTextFor="need" />
          </div>
        </Grid>
      )}
    </>
  );
};

export default SolutionDetails;
