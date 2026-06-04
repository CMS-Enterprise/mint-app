import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { NotFoundPartial } from 'features/NotFound';
import { useGetAllWaiverAssessmentSurveyQuery } from 'gql/generated/graphql';

import { Alert } from 'components/Alert';
import PageLoading from 'components/PageLoading';
import usePlanTranslation from 'hooks/usePlanTranslation';

// import ReadOnlyBody from '../_components/Body';
import ReadOnlySection from '../_components/ReadOnlySection';
import TitleAndStatus from '../_components/TitleAndStatus';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyWaiverAssessmentSurvey = ({
  modelID,
  clearance,
  filteredView
}: ReadOnlyProps) => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );

  const modelBasicsConfig = usePlanTranslation('basics');

  const generalCharacteristicsConfig = usePlanTranslation(
    'generalCharacteristics'
  );

  const modelPlanQuestionsConfig = {
    // --- Plan Basics ---
    modelCategory: modelBasicsConfig.modelCategory,
    additionalModelCategories: modelBasicsConfig.additionalModelCategories,
    cmsCenters: modelBasicsConfig.cmsCenters,
    cmmiGroups: modelBasicsConfig.cmmiGroups,

    // --- General Characteristics ---
    isNewModel: generalCharacteristicsConfig.isNewModel,
    existingModel: generalCharacteristicsConfig.existingModel,
    resemblesExistingModel: generalCharacteristicsConfig.resemblesExistingModel,
    participationInModelPrecondition:
      generalCharacteristicsConfig.participationInModelPrecondition,
    keyCharacteristics: generalCharacteristicsConfig.keyCharacteristics,
    keyCharacteristicsOther:
      generalCharacteristicsConfig.keyCharacteristicsOther,
    collectPlanBids: generalCharacteristicsConfig.collectPlanBids,
    managePartCDEnrollment: generalCharacteristicsConfig.managePartCDEnrollment,
    planContractUpdated: generalCharacteristicsConfig.planContractUpdated,
    geographiesTargeted: generalCharacteristicsConfig.geographiesTargeted,
    geographiesTargetedTypes:
      generalCharacteristicsConfig.geographiesTargetedTypes,
    geographiesStatesAndTerritories:
      generalCharacteristicsConfig.geographiesStatesAndTerritories,
    geographiesRegionTypes: generalCharacteristicsConfig.geographiesRegionTypes,
    geographiesTargetedTypesOther:
      generalCharacteristicsConfig.geographiesTargetedTypesOther,
    geographiesTargetedAppliedTo:
      generalCharacteristicsConfig.geographiesTargetedAppliedTo,
    geographiesTargetedAppliedToOther:
      generalCharacteristicsConfig.geographiesTargetedAppliedToOther,
    waiversRequired: generalCharacteristicsConfig.waiversRequired,
    waiversRequiredTypes: generalCharacteristicsConfig.waiversRequiredTypes
  };

  const waiverAssessmentSurveyConfig = usePlanTranslation(
    'waiverAssessmentSurvey'
  );

  const medicareQuestionsConfig = {
    modifiesMedicareSavingsPrograms:
      waiverAssessmentSurveyConfig.modifiesMedicareSavingsPrograms,
    bundlesPayments: waiverAssessmentSurveyConfig.bundlesPayments,
    offersRiskSharingArrangements:
      waiverAssessmentSurveyConfig.offersRiskSharingArrangements
  };

  const programWaiversConfig = {
    impactsSiteOfCarePayments:
      waiverAssessmentSurveyConfig.impactsSiteOfCarePayments,
    modifiesCareTeamScopeOfPractice:
      waiverAssessmentSurveyConfig.modifiesCareTeamScopeOfPractice,
    modifiesCareDeliveryWithClaimsBasedPayments:
      waiverAssessmentSurveyConfig.modifiesCareDeliveryWithClaimsBasedPayments,
    modifiesQualityMeasurementsOrPaymentsViaWaivers:
      waiverAssessmentSurveyConfig.modifiesQualityMeasurementsOrPaymentsViaWaivers
  };

  const medicaidQuestionsConfig = {
    impactsMedicaidOnlyBeneficiaries:
      waiverAssessmentSurveyConfig.impactsMedicaidOnlyBeneficiaries,
    impactsHomeCommunityBasedServicePayments:
      waiverAssessmentSurveyConfig.impactsHomeCommunityBasedServicePayments,
    impactsManagedCareWaivers:
      waiverAssessmentSurveyConfig.impactsManagedCareWaivers
  };

  const { modelID: modelIDFromParams } = useParams();

  const { data, loading, error } = useGetAllWaiverAssessmentSurveyQuery({
    variables: {
      id: modelID || modelIDFromParams || ''
    }
  });

  if (loading) {
    return <PageLoading />;
  }

  if (error || !data?.modelPlan?.questionnaires?.waiverAssessmentSurvey) {
    return <NotFoundPartial componentNotFound />;
  }

  const allWaiverAssessmentSurveyData =
    data.modelPlan.questionnaires.waiverAssessmentSurvey;

  return (
    <div
      className="read-only-waiver-assessment-survey"
      data-testid="read-only-waiver-assessment-survey"
    >
      <TitleAndStatus
        clearance={clearance}
        clearanceTitle={waiverAssessmentSurveyMiscT('heading')}
        heading={waiverAssessmentSurveyMiscT('heading')}
        isViewingFilteredView={!!filteredView}
        status={allWaiverAssessmentSurveyData.status}
        modelID={modelID || modelIDFromParams || ''}
        modifiedOrCreatedDts={
          allWaiverAssessmentSurveyData.modifiedDts ||
          allWaiverAssessmentSurveyData.createdDts
        }
      />
      <h3 className="margin-bottom-2">
        {waiverAssessmentSurveyMiscT('selectedWaivers.heading')}
      </h3>

      {allWaiverAssessmentSurveyData.waivers.length === 0 && (
        <Alert type="info" slim className="margin-bottom-6">
          {waiverAssessmentSurveyMiscT('modelHasNotSelectedWaiver')}
        </Alert>
      )}

      <div
        id="model-plan-questions-read-view"
        className="border-bottom-1px border-base-light margin-bottom-4"
      >
        <h3 className="margin-top-0">
          {waiverAssessmentSurveyMiscT('modelPlanQuestions.heading')}
        </h3>

        {/* <ReadOnlyBody
        data={allWaiverAssessmentSurveyData}
        config={modelPlanQuestionsConfig}
        filteredView={filteredView}
      /> */}

        {Object.keys(modelPlanQuestionsConfig).map(questionConfig => (
          <ReadOnlySection
            field={questionConfig}
            translations={modelPlanQuestionsConfig}
            values={allWaiverAssessmentSurveyData}
          />
        ))}
      </div>

      <div
        id="medicare-payment-waivers-read-view"
        className="border-bottom-1px border-base-light margin-bottom-4"
      >
        <h3 className="margin-top-0">
          {waiverAssessmentSurveyMiscT('medicarePaymentWaivers.heading')}
        </h3>

        {Object.keys(medicareQuestionsConfig).map(questionConfig => (
          <ReadOnlySection
            field={questionConfig}
            translations={medicareQuestionsConfig}
            values={allWaiverAssessmentSurveyData}
          />
        ))}
      </div>

      <div
        id="program-waivers-read-view"
        className="border-bottom-1px border-base-light margin-bottom-4"
      >
        <h3 className="margin-top-0">
          {waiverAssessmentSurveyMiscT('programWaivers.readOnlyHeading')}
        </h3>

        {Object.keys(programWaiversConfig).map(questionConfig => (
          <ReadOnlySection
            field={questionConfig}
            translations={programWaiversConfig}
            values={allWaiverAssessmentSurveyData}
          />
        ))}
      </div>

      <div id="medicaid-payment-waivers-read-view" className="">
        <h3 className="margin-top-0">
          {waiverAssessmentSurveyMiscT('medicaidPaymentWaivers.heading')}
        </h3>

        {Object.keys(medicaidQuestionsConfig).map(questionConfig => (
          <ReadOnlySection
            field={questionConfig}
            translations={medicaidQuestionsConfig}
            values={allWaiverAssessmentSurveyData}
          />
        ))}
      </div>
    </div>
  );
};

export default ReadOnlyWaiverAssessmentSurvey;
