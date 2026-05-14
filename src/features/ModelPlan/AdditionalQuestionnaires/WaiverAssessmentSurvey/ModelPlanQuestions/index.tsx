import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useGetModelPlanQuestionsQuery } from 'gql/generated/graphql';

import { Alert } from 'components/Alert';
import FormHeader from 'components/FormHeader';
import Spinner from 'components/Spinner';

import ModelPlanQuestionsForm from '../_components/ModelPlanQuestionsForm';

const ModelPlanQuestions = () => {
  const { t: waiverAssessmentSurveyT } = useTranslation(
    'waiverAssessmentSurvey'
  );

  const { modelID = '' } = useParams<{ modelID: string }>();

  const { data: modelPlanQuestionsData, loading: modelPlanQuestionsLoading } =
    useGetModelPlanQuestionsQuery({
      variables: { id: modelID }
    });

  const flattenedData = useMemo(() => {
    if (!modelPlanQuestionsData?.modelPlan) {
      return null;
    }

    const { basics, generalCharacteristics } = modelPlanQuestionsData.modelPlan;

    const { id: basicsId, __typename: basicsTypename, ...restBasics } = basics;

    const {
      id: generalCharacteristicsId,
      __typename: generalCharacteristicsTypename,
      ...restGeneralCharacteristics
    } = generalCharacteristics;

    return {
      ...restBasics,
      ...restGeneralCharacteristics,
      basicsId,
      generalCharacteristicsId
    };
  }, [modelPlanQuestionsData]);

  if (modelPlanQuestionsLoading) {
    return (
      <div className="display-flex flex-justify-center margin-top-4">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mint-body-normal grid-row flex-column">
      <div>
        <FormHeader
          header={waiverAssessmentSurveyT('modelPlanQuestions.heading')}
          currentPage={2}
          totalPages={7}
        />
        <p className="margin-top-neg-1 margin-bottom-4">
          {waiverAssessmentSurveyT('modelPlanQuestions.description')}
        </p>
      </div>

      <div className="tablet:grid-col-6">
        <Alert type="info" slim className="margin-bottom-4">
          {waiverAssessmentSurveyT('modelPlanQuestions.infoAlert')}
        </Alert>

        {flattenedData && (
          <ModelPlanQuestionsForm modelPlanQuestionsData={flattenedData} />
        )}
      </div>
    </div>
  );
};

export default ModelPlanQuestions;
