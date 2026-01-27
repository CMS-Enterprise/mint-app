import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { NotFoundPartial } from 'features/NotFound';
import {
  GetAllIddocQuestionnaireQuery,
  useGetAllIddocQuestionnaireQuery
} from 'gql/generated/graphql';

import { Alert } from 'components/Alert';
import PageLoading from 'components/PageLoading';
import usePlanTranslation from 'hooks/usePlanTranslation';

import ReadOnlyBody from '../_components/Body';
import TitleAndStatus from '../_components/TitleAndStatus';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyIddocQuestionnaire = ({
  modelID,
  clearance,
  filteredView
}: ReadOnlyProps) => {
  const { t: iddocQuestionnaireMiscT } = useTranslation(
    'iddocQuestionnaireMisc'
  );

  const { modelID: modelIDFromParams } = useParams();

  const iddocQuestionnaireConfig = usePlanTranslation('iddocQuestionnaire');

  const { data, loading, error } = useGetAllIddocQuestionnaireQuery({
    variables: {
      id: modelID || modelIDFromParams || ''
    }
  });

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial componentNotFound />;
  }

  const allIddocQuestionnaireData = (data?.modelPlan.questionnaires
    .iddocQuestionnaire ||
    {}) as GetAllIddocQuestionnaireQuery['modelPlan']['questionnaires']['iddocQuestionnaire'];

  // TODO: Temporarily overriding needed to true
  // const testData = { ...allIddocQuestionnaireData, needed: true};

  const isIddocNeeded = allIddocQuestionnaireData.needed;

  return (
    <div
      className="read-only-iddoc-questionnaire"
      data-testid="read-only-iddoc-questionnaire"
    >
      <TitleAndStatus
        clearance={clearance}
        clearanceTitle={iddocQuestionnaireMiscT('heading')}
        heading={iddocQuestionnaireMiscT('heading')}
        isViewingFilteredView={!!filteredView}
        status={allIddocQuestionnaireData.status}
        modelID={modelID || modelIDFromParams || ''}
        modifiedOrCreatedDts={
          allIddocQuestionnaireData.modifiedDts ||
          allIddocQuestionnaireData.createdDts
        }
      />

      {loading && !data ? (
        <div className="height-viewport">
          <PageLoading />
        </div>
      ) : (
        <>
          {!filteredView && (
            <Alert
              type={isIddocNeeded ? 'info' : 'warning'}
              slim
              className="margin-bottom-3"
            >
              {iddocQuestionnaireMiscT(
                `${isIddocNeeded ? 'iddocQuestionnaireIsRequired' : 'iddocQuestionnaireIsNotNeeded'}`
              )}
            </Alert>
          )}

          <ReadOnlyBody
            data={allIddocQuestionnaireData} // TODO use {testData} here for needed state
            config={iddocQuestionnaireConfig}
            filteredView={filteredView}
          />
        </>
      )}
    </div>
  );
};

export default ReadOnlyIddocQuestionnaire;
