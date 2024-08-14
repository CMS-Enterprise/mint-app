/*
View for linking and unlinking existing model plan documents for operational need solutions
*/

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Grid, Icon } from '@trussworks/react-uswds';
import {
  GetOperationalNeedQuery,
  GetOperationalSolutionQuery,
  OperationalNeedKey,
  useCreateDocumentSolutionLinksMutation,
  useDeleteDocumentSolutionLinkMutation,
  useGetOperationalSolutionQuery
} from 'gql/gen/graphql';
import { isEqual } from 'lodash';

import Breadcrumbs from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import useMessage from 'hooks/useMessage';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import PlanDocumentsTable from 'views/ModelPlan/Documents/table';
import NotFound from 'views/NotFound';

import ITSolutionsSidebar from '../_components/ITSolutionSidebar';
import NeedQuestionAndAnswer from '../_components/NeedQuestionAndAnswer';

type GetOperationalNeedOperationalNeedType = GetOperationalNeedQuery['operationalNeed'];
type GetOperationalSolutionOperationalSolutionType = GetOperationalSolutionQuery['operationalSolution'];

export const initialValues: GetOperationalNeedOperationalNeedType = {
  __typename: 'OperationalNeed',
  id: '',
  modelPlanID: '',
  name: '',
  key: OperationalNeedKey.ACQUIRE_AN_EVAL_CONT,
  nameOther: '',
  needed: false,
  solutions: []
};

const LinkDocuments = () => {
  const { modelID, operationalNeedID, operationalSolutionID } = useParams<{
    modelID: string;
    operationalNeedID: string;
    operationalSolutionID: string;
  }>();

  const history = useHistory();
  const { showMessageOnNextPage } = useMessage();

  const { t } = useTranslation('documentsMisc');
  const { t: h } = useTranslation('draftModelPlan');

  const isDesktop = useCheckResponsiveScreen('tablet', 'larger');

  const { modelName } = useContext(ModelInfoContext);

  const solutionDetailsURL = `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/solution-details`;

  // State management for linking/unlinking docs
  const [linkedDocs, setLinkedDocs] = useState<string[]>([]);

  // Original state of linked/unlinked docs
  const [linkedDocsInit, setLinkedDocsInit] = useState<string[]>([]);

  // State management for mutation errors
  const [mutationError, setMutationError] = useState<boolean>(false);

  const { data, loading, error } = useGetOperationalSolutionQuery({
    variables: {
      id: operationalSolutionID
    }
  });

  const solution = useMemo(() => {
    return (
      data?.operationalSolution ||
      ({} as GetOperationalSolutionOperationalSolutionType)
    );
  }, [data?.operationalSolution]);

  // Sets state of linked docs after fetched from query
  useEffect(() => {
    const linkedDocsFiltered = solution?.documents?.map(
      solutionDoc => solutionDoc.id
    );
    setLinkedDocs(linkedDocsFiltered);
    setLinkedDocsInit(linkedDocsFiltered);
  }, [solution]);

  const [createSolutionLinks] = useCreateDocumentSolutionLinksMutation();

  const [deleteSolutionLink] = useDeleteDocumentSolutionLinkMutation();

  // Checks which documents need to be linked/unlinked and calls/handles mutations
  const handleDocumentLink = async () => {
    const documentsToUpdate = docsToUpdate(linkedDocs, linkedDocsInit);

    // If no docs to link/unlink - return
    if (
      documentsToUpdate.links.length === 0 &&
      documentsToUpdate.unlinks.length === 0
    ) {
      history.push(solutionDetailsURL);
      return;
    }

    Object.keys(documentsToUpdate).forEach(linkType => {
      const mutationType =
        linkType === 'links' ? createSolutionLinks : deleteSolutionLink;

      const linksToUpdate =
        documentsToUpdate[linkType as keyof typeof documentsToUpdate];

      mutationType({
        variables: {
          solutionID: solution.id,
          documentIDs: linksToUpdate
        }
      })
        .then(response => {
          if (response && !response.errors) {
            showMessageOnNextPage(
              <Alert type="success" slim className="margin-y-4">
                <span className="mandatory-fields-alert__text">
                  {linkType === 'links'
                    ? t('documentUnLinkSuccess')
                    : t('documentLinkSuccess')}
                </span>
              </Alert>
            );
            history.push(solutionDetailsURL);
          } else if (response.errors) {
            setMutationError(true);
          }
        })
        .catch(() => {
          setMutationError(true);
        });
    });
  };

  if (!data && loading) {
    return <PageLoading />;
  }

  if (error || !solution) {
    return <NotFound />;
  }

  const breadcrumbs = [
    { text: h('home'), url: '/' },
    { text: h('tasklistBreadcrumb'), url: `/models/${modelID}/collaboration-area/task-list/` },
    { text: t('itTracker'), url: `/models/${modelID}/collaboration-area/task-list/it-solutions` },
    {
      text: t('solutionDetails'),
      url: solutionDetailsURL
    },
    { text: t('connectDocumentsHeader') }
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      {mutationError && (
        <Alert type="error" slim>
          {t('documentLinkError')}
        </Alert>
      )}

      <Grid row gap>
        <Grid desktop={{ col: 9 }}>
          <Grid tablet={{ col: 11 }}>
            <PageHeading className="margin-top-4 margin-bottom-1">
              {t('connectDocumentsHeader')}
            </PageHeading>

            <p
              className="margin-top-0 margin-bottom-1 font-body-lg"
              data-testid="model-plan-name"
            >
              {h('for')} {modelName}
            </p>

            <p className="line-height-body-4 margin-bottom-4 margin-top-1">
              {t('connectDocumentsInfo')}
            </p>

            <Grid tablet={{ col: 8 }}>
              <NeedQuestionAndAnswer
                operationalNeedID={operationalNeedID}
                modelID={modelID}
                solution={solution}
              />
            </Grid>
          </Grid>
        </Grid>

        {isDesktop && (
          <Grid desktop={{ col: 3 }} className="padding-x-1">
            <ITSolutionsSidebar
              modelID={modelID}
              renderTextFor="need"
              helpfulLinks={false}
            />
          </Grid>
        )}
      </Grid>

      <h3 className="margin-top-8 margin-bottom-neg-1">{t('heading')}</h3>

      <PlanDocumentsTable
        modelID={modelID}
        setDocumentMessage={() => null}
        setDocumentStatus={() => null}
        linkedDocs={linkedDocs}
        setLinkedDocs={setLinkedDocs}
      />

      <Grid tablet={{ col: 6 }}>
        <Button
          type="button"
          onClick={() => handleDocumentLink()}
          data-testid="link-documents-button"
          disabled={isEqual(linkedDocs?.sort(), linkedDocsInit?.sort())}
          className="display-inline-flex flex-align-center margin-y-3"
        >
          {t('connectDocumentsButton')}
        </Button>

        <UswdsReactLink className="display-flex" to={solutionDetailsURL}>
          <Icon.ArrowBack className="margin-right-1" aria-hidden />
          {t('dontConnect')}
        </UswdsReactLink>
      </Grid>

      {!isDesktop && (
        <Grid desktop={{ col: 12 }} className="padding-x-1">
          <ITSolutionsSidebar
            modelID={modelID}
            renderTextFor="need"
            helpfulLinks={false}
          />
        </Grid>
      )}
    </>
  );
};

const docsToUpdate = (linkedDocs: string[], originalDocs: string[]) => {
  const unlinks = originalDocs.filter(doc => !linkedDocs.includes(doc));
  const links = linkedDocs.filter(doc => !originalDocs.includes(doc));
  return { unlinks, links };
};

export default LinkDocuments;
