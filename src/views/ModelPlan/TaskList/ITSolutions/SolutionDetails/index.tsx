/*
View for displaying solution details, subtasks and linked solution documents
Links to views for updating solutions, adding subtasks, and documents
*/

import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
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
import Alert from 'components/shared/Alert';
import Expire from 'components/shared/Expire';
import useMessage from 'hooks/useMessage';
import DeleteDocumentSolutionLinks from 'queries/ITSolutions/DeleteDocumentSolutionLink';
import GetOperationalSolution from 'queries/ITSolutions/GetOperationalSolution';
import { DeleteDocumentSolutionLinkVariables } from 'queries/ITSolutions/types/DeleteDocumentSolutionLink';
import {
  GetOperationalSolution as GetOperationalSolutionType,
  GetOperationalSolution_operationalSolution as GetOperationalSolutionOperationalSolutionType,
  GetOperationalSolutionVariables
} from 'queries/ITSolutions/types/GetOperationalSolution';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import { Table } from 'views/ModelPlan/Documents/table';
import { DocumentStatusType } from 'views/ModelPlan/ReadOnly/Documents';
import NotFound from 'views/NotFound';

import SolutionDetailCard from '../_components/SolutionDetailCard';
import SubtasksTable, { SubtaskLinks } from '../_components/SubtasksTable';

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

  const { data, loading, error, refetch } = useQuery<
    GetOperationalSolutionType,
    GetOperationalSolutionVariables
  >(GetOperationalSolution, {
    variables: {
      id: operationalSolutionID
    },
    fetchPolicy: 'network-only'
  });

  const solution =
    data?.operationalSolution ||
    ({} as GetOperationalSolutionOperationalSolutionType);

  const subtasks = data?.operationalSolution.operationalSolutionSubtasks;

  // // TODO: remove temp subtasks
  // const tempSubtasks = [
  //   {
  //     name: 'Review requirements document',
  //     status: SubtaskStatus.TO_DO
  //   },
  //   {
  //     name: 'Review onboarding materials',
  //     status: SubtaskStatus.TO_DO
  //   },
  //   {
  //     name: 'Write onboarding request',
  //     status: SubtaskStatus.IN_PROGRESS
  //   },
  //   {
  //     name: 'Gather recipient data',
  //     status: SubtaskStatus.DONE
  //   }
  // ];

  const [deleteSolutionLink] = useMutation<DeleteDocumentSolutionLinkVariables>(
    DeleteDocumentSolutionLinks
  );

  const handleDocumentUnlink = (linkToRemove: string) => {
    deleteSolutionLink({
      variables: {
        solutionID: operationalSolutionID,
        documentIDs: [linkToRemove]
      }
    })
      .then(response => {
        if (response && !response.errors) {
          setDocumentMessage(t('documentUnLinkSuccess'));
          setDocumentStatus('success');
          refetch();
        } else if (response.errors) {
          setDocumentMessage(t('documentUnLinkError'));
          setDocumentStatus('error');
        }
      })
      .catch(() => {
        setDocumentMessage(t('documentUnLinkError'));
        setDocumentStatus('error');
      });
  };

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
        <Grid tablet={{ col: 3 }} className="padding-x-1">
          <div className="border-top-05 border-primary-lighter padding-top-2 margin-top-4">
            <AskAQuestion modelID={modelID} renderTextFor="need" />
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
              operationalSolutionID={operationalSolutionID}
              modelID={modelID}
            />

            <SubtasksTable subtasks={subtasks} className="margin-top-6" />

            <SubtaskLinks className="margin-top-3" subtasks={subtasks} />

            {/* Documents table and link */}
            <div className="margin-top-6">
              <h3 className="margin-bottom-0">{t('documents')}</h3>

              <Table
                data={solution.documents}
                refetch={refetch}
                setDocumentMessage={setDocumentMessage}
                setDocumentStatus={setDocumentStatus}
                hasEditAccess
                handleDocumentUnlink={handleDocumentUnlink}
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
                    history.push({
                      pathname: `/models/${modelID}/documents/add-document`,
                      state: {
                        solutionID: operationalSolutionID,
                        solutionDetailsLink: `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/solution-details`
                      }
                    });
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
