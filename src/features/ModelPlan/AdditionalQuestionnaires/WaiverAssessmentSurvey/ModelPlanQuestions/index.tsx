import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useGetModelPlanQuestionsQuery } from 'gql/generated/graphql';

import { Alert } from 'components/Alert';
import FormHeader from 'components/FormHeader';
import PageNumber from 'components/PageNumber';
import Spinner from 'components/Spinner';

import ModelPlanQuestionsForm from '../_components/ModelPlanQuestionsForm';
import WaiverInfoPanel from '../_components/WaiverInfoPanel';

const ModelPlanQuestions = () => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
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

  const mintPlansData = useMemo(() => {
    return modelPlanQuestionsData?.modelPlanCollection || [];
  }, [modelPlanQuestionsData?.modelPlanCollection]);

  const existingPlansData = useMemo(() => {
    return modelPlanQuestionsData?.existingModelCollection || [];
  }, [modelPlanQuestionsData?.existingModelCollection]);

  // Combined MINT models with existing models from DB.  Sorts them alphabetically and returns options for Select/MultiSelect
  const modelPlanOptions = useMemo(() => {
    if (
      !modelPlanQuestionsData?.modelPlanCollection ||
      !modelPlanQuestionsData?.existingModelCollection
    ) {
      return [];
    }

    const combinedModels = [
      ...modelPlanQuestionsData.modelPlanCollection,
      ...modelPlanQuestionsData.existingModelCollection
    ].sort((a, b) => (a.modelName || '').localeCompare(b.modelName || ''));

    return combinedModels.map(model => ({
      label: model.modelName || '',
      value: String(model.id) ?? ''
    }));
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
      <WaiverInfoPanel
        isOpen
        closeModal={() => {}}
        waiverInfo={{
          willUseWaiver: null,
          notUsingReason: ''
        }}
      />
      <div>
        <FormHeader
          header={waiverAssessmentSurveyMiscT('modelPlanQuestions.heading')}
          currentPage={2}
          totalPages={7}
        />
        <p className="margin-top-neg-1 margin-bottom-4 text-base-dark">
          {waiverAssessmentSurveyMiscT('modelPlanQuestions.description')}
        </p>
      </div>

      <div className="tablet:grid-col-6">
        <Alert type="info" slim className="margin-bottom-4">
          {waiverAssessmentSurveyMiscT('modelPlanQuestions.infoAlert')}
        </Alert>

        {flattenedData &&
          mintPlansData.length > 0 &&
          existingPlansData.length > 0 && (
            <ModelPlanQuestionsForm
              modelPlanQuestionsData={flattenedData}
              modelPlanOptions={modelPlanOptions}
              mintModelPlanCollection={mintPlansData}
              existingModelCollection={existingPlansData}
            />
          )}
      </div>

      <PageNumber currentPage={2} totalPages={7} className="margin-y-6" />
    </div>
  );
};

export default ModelPlanQuestions;
