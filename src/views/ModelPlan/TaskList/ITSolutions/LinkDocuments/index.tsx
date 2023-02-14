/*
View for selecting/toggled 'needed' bool on possible solutions and custom solutions
Displays relevant operational need question and answers
*/

import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Grid, IconArrowBack } from '@trussworks/react-uswds';

import Breadcrumbs from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import useMessage from 'hooks/useMessage';
import GetOperationalNeed from 'queries/ITSolutions/GetOperationalNeed';
import GetOperationalSolution from 'queries/ITSolutions/GetOperationalSolution';
import {
  GetOperationalNeed as GetOperationalNeedType,
  GetOperationalNeed_operationalNeed as GetOperationalNeedOperationalNeedType,
  GetOperationalNeedVariables
} from 'queries/ITSolutions/types/GetOperationalNeed';
import {
  GetOperationalSolution as GetOperationalSolutionType,
  GetOperationalSolution_operationalSolution as GetOperationalSolutionOperationalSolutionType,
  GetOperationalSolutionVariables
} from 'queries/ITSolutions/types/GetOperationalSolution';
import { UpdateCustomOperationalSolutionVariables } from 'queries/ITSolutions/types/UpdateCustomOperationalSolution';
import { UpdateOperationalNeedSolutionVariables } from 'queries/ITSolutions/types/UpdateOperationalNeedSolution';
import UpdateCustomOperationalSolution from 'queries/ITSolutions/UpdateCustomOperationalSolution';
import UpdateOperationalNeedSolution from 'queries/ITSolutions/UpdateOperationalNeedSolution';
import { OperationalNeedKey } from 'types/graphql-global-types';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import PlanDocumentsTable from 'views/ModelPlan/Documents/table';
import { DocumentStatusType } from 'views/ModelPlan/ReadOnly/Documents';
import NotFound from 'views/NotFound';

import ITSolutionsSidebar from '../_components/ITSolutionSidebar';
import NeedQuestionAndAnswer from '../_components/NeedQuestionAndAnswer';

// Passing in operationalNeed to Formik instead of array of solutions
// Fomik does not take an array structure
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

const LinkDocuments = ({
  isUpdatingStatus = false
}: {
  isUpdatingStatus?: boolean;
}) => {
  const { modelID, operationalNeedID, operationalSolutionID } = useParams<{
    modelID: string;
    operationalNeedID: string;
    operationalSolutionID: string;
  }>();

  const history = useHistory();

  const { t } = useTranslation('documents');
  const { t: h } = useTranslation('draftModelPlan');

  const { showMessageOnNextPage, message } = useMessage();

  const [documentMessage, setDocumentMessage] = useState('');
  const [documentStatus, setDocumentStatus] = useState<DocumentStatusType>(
    'error'
  );

  // State management for linking/unlinking docs
  const [linkedDocs, setLinkedDocs] = useState<string[]>([]);

  // State management for mutation errors
  const [mutationError, setMutationError] = useState<boolean>(false);

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useQuery<
    GetOperationalSolutionType,
    GetOperationalSolutionVariables
  >(GetOperationalSolution, {
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

  useEffect(() => {
    setLinkedDocs(solution?.documents?.map(solutionDoc => solutionDoc.id));
  }, [solution]);

  console.log(linkedDocs);

  const [updateSolution] = useMutation<UpdateOperationalNeedSolutionVariables>(
    UpdateOperationalNeedSolution
  );

  const [
    updateCustomSolution
  ] = useMutation<UpdateCustomOperationalSolutionVariables>(
    UpdateCustomOperationalSolution
  );

  // Cycles and updates all solutions on a need
  const handleFormSubmit = async (
    formikValues: GetOperationalNeedOperationalNeedType,
    redirect?: 'back' | null,
    dontAdd?: boolean // False if user selects 'Don’t add solutions and return to tracker'
  ) => {
    const { solutions } = formikValues;

    await Promise.all(
      solutions.map(solution => {
        const solutionNeeded = dontAdd ? false : solution.needed || false;

        // Update possibleSolution needed bool and status
        if (solution.key) {
          return updateSolution({
            variables: {
              operationalNeedID,
              solutionType: solution.key,
              changes: {
                needed: solutionNeeded,
                mustStartDts: solution.mustStartDts,
                mustFinishDts: solution.mustFinishDts,
                status: solution.status
              }
            }
          });
        }
        // Update custom solution needed bool - status should already be set
        return updateCustomSolution({
          variables: {
            operationalNeedID,
            customSolutionType: solution.nameOther,
            changes: {
              needed: solutionNeeded,
              mustStartDts: solution.mustStartDts,
              mustFinishDts: solution.mustFinishDts,
              status: solution.status
            }
          }
        });
      })
    )
      .then(response => {
        const errors = response?.find(result => result?.errors);

        if (response && !errors) {
          history.push(`/models/${modelID}/task-list/it-solutions`);
        } else if (errors) {
          setMutationError(true);
        }
      })
      .catch(() => {
        setMutationError(true);
      });
  };

  if (error || !solution) {
    return <NotFound />;
  }

  const breadcrumbs = [
    { text: h('home'), url: '/' },
    { text: h('tasklistBreadcrumb'), url: `/models/${modelID}/task-list/` },
    { text: t('itTracker'), url: `/models/${modelID}/task-list/it-solutions` },
    {
      text: t('solutionDetails'),
      url: `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/solution-details`
    },
    { text: t('linkDocumentsHeader') }
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      {mutationError && (
        <Alert type="error" slim>
          {t('addError')}
        </Alert>
      )}

      <Grid row gap>
        <Grid tablet={{ col: 9 }}>
          <Grid tablet={{ col: 11 }}>
            <PageHeading className="margin-top-4 margin-bottom-1">
              {t('linkDocumentsHeader')}
            </PageHeading>

            <p
              className="margin-top-0 margin-bottom-1 font-body-lg"
              data-testid="model-plan-name"
            >
              {h('for')} {modelName}
            </p>

            <p className="line-height-body-4 margin-bottom-4 margin-top-1">
              {t('linkDocumentsInfo')}
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
        <Grid tablet={{ col: 3 }} className="padding-x-1">
          <ITSolutionsSidebar
            modelID={modelID}
            renderTextFor="need"
            helpfulLinks={false}
          />
        </Grid>
      </Grid>

      <h3 className="margin-top-8 margin-bottom-neg-1">
        {t('modelDocuments')}
      </h3>

      <PlanDocumentsTable
        modelID={modelID}
        setDocumentMessage={setDocumentMessage}
        setDocumentStatus={setDocumentStatus}
        linkedDocs={linkedDocs}
        setLinkedDocs={setLinkedDocs}
      />

      <Grid tablet={{ col: 6 }}>
        <Button
          type="button"
          onClick={() => history.goBack()}
          className="display-inline-flex flex-align-center margin-y-3"
        >
          {t('linkDocumentsButton')}
        </Button>

        <UswdsReactLink
          className="display-flex"
          to={`/models/${modelID}/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/solution-details`}
        >
          <IconArrowBack className="margin-right-1" aria-hidden />
          {t('dontLink')}
        </UswdsReactLink>
      </Grid>
    </>
  );
};

export default LinkDocuments;
