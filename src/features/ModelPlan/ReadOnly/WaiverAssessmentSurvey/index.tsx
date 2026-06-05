import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import { convertToLowercaseAndDashes } from 'features/HelpAndKnowledge/Articles/TwoPagerMeeting';
import { NotFoundPartial } from 'features/NotFound';
import { useGetAllWaiverAssessmentSurveyQuery } from 'gql/generated/graphql';

import { Alert } from 'components/Alert';
import PageLoading from 'components/PageLoading';
import usePlanTranslation from 'hooks/usePlanTranslation';

import SelectedWaiversTable from '../_components/SelectedWaiversTable';
import SimpleReadOnlySection from '../_components/SimpleReadOnlySection';
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
    resemblesExistingModelWhich:
      generalCharacteristicsConfig.resemblesExistingModelWhich,
    participationInModelPrecondition:
      generalCharacteristicsConfig.participationInModelPrecondition,
    participationInModelPreconditionWhich:
      generalCharacteristicsConfig.participationInModelPreconditionWhich,
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

  const {
    resemblesExistingModelWhich,
    resemblesExistingModelOtherSelected,
    participationInModelPreconditionWhich,
    participationInModelPreconditionOtherSelected
  } = data?.modelPlan?.generalCharacteristics || {};

  // Add 'Other' to the resemblesExistingModelWhich list if resemblesExistingModelOtherSelected is true
  const linkedResemblePlans = useMemo(() => {
    const resemblesExistingModelWhichCopy = { ...resemblesExistingModelWhich }
      .names;
    const selectedPlans = [...(resemblesExistingModelWhichCopy || [])];
    if (resemblesExistingModelOtherSelected) {
      selectedPlans?.push('Other');
    }
    return selectedPlans;
  }, [resemblesExistingModelWhich, resemblesExistingModelOtherSelected]);

  // Add 'Other' to the participationInModelPrecondition list if participationInModelPreconditionOtherSelected is true
  const participationPreconditionPlans = useMemo(() => {
    const participationInModelPreconditionWhichCopy = {
      ...participationInModelPreconditionWhich
    }.names;
    const selectedPlans = [
      ...(participationInModelPreconditionWhichCopy || [])
    ];
    if (participationInModelPreconditionOtherSelected) {
      selectedPlans?.push('Other');
    }
    return selectedPlans;
  }, [
    participationInModelPreconditionWhich,
    participationInModelPreconditionOtherSelected
  ]);

  const surveyQuestionsConfig = {
    modePlanQuestions: {
      heading: waiverAssessmentSurveyMiscT('modelPlanQuestions.heading'),
      config: modelPlanQuestionsConfig
    },
    medicarePaymentWaivers: {
      heading: waiverAssessmentSurveyMiscT('medicarePaymentWaivers.heading'),
      config: medicareQuestionsConfig
    },
    programWaivers: {
      heading: waiverAssessmentSurveyMiscT('programWaivers.readOnlyHeading'),
      config: programWaiversConfig
    },
    medicaidPaymentWaivers: {
      heading: waiverAssessmentSurveyMiscT('medicaidPaymentWaivers.heading'),
      config: medicaidQuestionsConfig
    }
  };

  if (loading) {
    return <PageLoading />;
  }

  if (error || !data?.modelPlan?.questionnaires?.waiverAssessmentSurvey) {
    return <NotFoundPartial componentNotFound />;
  }

  const modelQuestionsData = {
    ...data.modelPlan.basics,
    ...data.modelPlan.generalCharacteristics,
    resemblesExistingModelWhich: linkedResemblePlans,
    participationInModelPreconditionWhich: participationPreconditionPlans
  };

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

      {allWaiverAssessmentSurveyData.waivers.length === 0 ? (
        <Alert type="info" slim className="margin-bottom-6">
          {waiverAssessmentSurveyMiscT('modelHasNotSelectedWaiver')}
        </Alert>
      ) : (
        <SelectedWaiversTable
          selectedWaivers={allWaiverAssessmentSurveyData.waivers}
        />
      )}

      {Object.keys(surveyQuestionsConfig).map((waiverSurvey, index) => {
        const waiverConfig =
          surveyQuestionsConfig[
            waiverSurvey as keyof typeof surveyQuestionsConfig
          ];

        return (
          <div
            id={`${convertToLowercaseAndDashes(waiverSurvey)}-read-view`}
            className={classNames(
              index !== Object.keys(surveyQuestionsConfig).length - 1 &&
                'border-bottom-1px border-base-light margin-bottom-4'
            )}
          >
            <h3 className="margin-top-0">{waiverConfig.heading}</h3>

            {Object.keys(waiverConfig.config).map(questionConfig => (
              <SimpleReadOnlySection
                field={questionConfig}
                translations={waiverConfig.config}
                values={
                  waiverSurvey === 'modePlanQuestions'
                    ? modelQuestionsData
                    : allWaiverAssessmentSurveyData
                }
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default ReadOnlyWaiverAssessmentSurvey;
