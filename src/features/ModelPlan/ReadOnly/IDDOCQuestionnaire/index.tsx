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

  const testData = { ...allIddocQuestionnaireData, needed: false };

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
          allIddocQuestionnaireData.modifiedDts
          // || allIddocQuestionnaireData.createdDts
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
            data={testData}
            config={iddocQuestionnaireConfig}
            filteredView={filteredView}
          />

          {/* IDDOC operations section */}
          {/* {!isIddocNeeded && !filteredView && (
            <div className="margin-top-4 padding-top-4 border-top-1px border-base-light">
              <h3 className="margin-top-0">
                {iddocQuestionnaireMiscT('iddocOperations')}
              </h3>

              <RelatedUnneededQuestions
                id="iddoc-operations-questions"
                config={iddocQuestionnaireConfig.technicalContactsIdentified}
                value={allIddocQuestionnaireData.technicalContactsIdentified}
                values={allIddocQuestionnaireData}
                childrenToCheck={undefined}
                hideAlert={false}
              />
            </div>
          )} */}

          {/* ICD section */}
          {/* {!isIddocNeeded && !filteredView && (
            <div className="margin-top-4 padding-top-4 border-top-1px border-base-light">
              <h3 className="margin-top-0">{iddocQuestionnaireMiscT('icd')}</h3>

              <RelatedUnneededQuestions
                id="iddoc-icd-questions"
                config={iddocQuestionnaireConfig.icdOwner}
                value={allIddocQuestionnaireData.icdOwner}
                values={allIddocQuestionnaireData}
                childrenToCheck={undefined}
                hideAlert={false}
              />
            </div>
          )} */}

          {/* Testing section */}
          {/* {!isIddocNeeded && !filteredView && (
            <div className="margin-top-4 padding-top-4 border-top-1px border-base-light">
              <h3 className="margin-top-0">
                {iddocQuestionnaireMiscT('testingQuestions')}
              </h3>

              <RelatedUnneededQuestions
                id="iddoc-testing-questions"
                config={iddocQuestionnaireConfig.uatNeeds}
                value={allIddocQuestionnaireData.uatNeeds}
                values={allIddocQuestionnaireData}
                childrenToCheck={undefined}
                hideAlert={false}
              />
            </div>
          )} */}

          {/* Data Monitoring section */}
          {/* {!isIddocNeeded && !filteredView && (
            <div className="margin-top-4 padding-top-4 border-top-1px border-base-light">
              <h3 className="margin-top-0">
                {iddocQuestionnaireMiscT('dataMonitoring')}
              </h3>

              <RelatedUnneededQuestions
                id="iddoc-data-monitoring-questions"
                config={iddocQuestionnaireConfig.dataMonitoringFileTypes}
                value={allIddocQuestionnaireData.dataMonitoringFileTypes}
                values={allIddocQuestionnaireData}
                childrenToCheck={undefined}
                hideAlert={false}
              />
            </div>
          )} */}
        </>
      )}
    </div>
  );
};

export default ReadOnlyIddocQuestionnaire;
