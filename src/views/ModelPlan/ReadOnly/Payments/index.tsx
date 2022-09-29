import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import GetAllPayments from 'queries/ReadOnly/GetAllPayments';
import {
  GetAllPayments as GetModelPlanPaymentType,
  GetAllPayments_modelPlan_payments as PaymentTypes
} from 'queries/ReadOnly/types/GetAllPayments';
import { translateSourceOptions } from 'utils/modelPlan';
import { TaskListStatusTag } from 'views/ModelPlan/TaskList/_components/TaskListItem';
import { NotFoundPartial } from 'views/NotFound';

import ReadOnlySection from '../_components/ReadOnlySection';

const ReadOnlyPayments = ({ modelID }: { modelID: string }) => {
  const { t } = useTranslation('payments');
  const { t: h } = useTranslation('draftModelPlan');

  const { data, loading, error } = useQuery<GetModelPlanPaymentType>(
    GetAllPayments,
    {
      variables: {
        id: modelID
      }
    }
  );

  if ((!loading && error) || (!loading && !data) || data === undefined) {
    return <NotFoundPartial />;
  }
  // debugger;

  const {
    fundingSource,
    fundingSourceTrustFund,
    fundingSourceOther,
    fundingSourceNote,
    fundingSourceR,
    fundingSourceRTrustFund,
    fundingSourceROther,
    fundingSourceRNote,
    payRecipients,
    payRecipientsOtherSpecification,
    payRecipientsNote,
    payType,
    payTypeNote,
    payClaims,
    payClaimsOther,
    payClaimsNote,
    shouldAnyProvidersExcludedFFSSystems,
    shouldAnyProviderExcludedFFSSystemsNote,
    changesMedicarePhysicianFeeSchedule,
    changesMedicarePhysicianFeeScheduleNote,
    affectsMedicareSecondaryPayerClaims,
    affectsMedicareSecondaryPayerClaimsHow,
    affectsMedicareSecondaryPayerClaimsNote,
    payModelDifferentiation,
    creatingDependenciesBetweenServices,
    creatingDependenciesBetweenServicesNote,
    needsClaimsDataCollection,
    needsClaimsDataCollectionNote,
    providingThirdPartyFile,
    isContractorAwareTestDataRequirements,
    beneficiaryCostSharingLevelAndHandling,
    waiveBeneficiaryCostSharingForAnyServices,
    waiveBeneficiaryCostSharingServiceSpecification,
    waiverOnlyAppliesPartOfPayment,
    waiveBeneficiaryCostSharingNote,
    nonClaimsPayments,
    nonClaimsPaymentOther,
    paymentCalculationOwner,
    numberPaymentsPerPayCycle,
    numberPaymentsPerPayCycleNote,
    sharedSystemsInvolvedAdditionalClaimPayment,
    sharedSystemsInvolvedAdditionalClaimPaymentNote,
    planningToUseInnovationPaymentContractor,
    planningToUseInnovationPaymentContractorNote,
    fundingStructure,
    expectedCalculationComplexityLevel,
    expectedCalculationComplexityLevelNote,
    canParticipantsSelectBetweenPaymentMechanisms,
    canParticipantsSelectBetweenPaymentMechanismsHow,
    canParticipantsSelectBetweenPaymentMechanismsNote,
    anticipatedPaymentFrequency,
    anticipatedPaymentFrequencyOther,
    anticipatedPaymentFrequencyNote,
    willRecoverPayments,
    willRecoverPaymentsNote,
    anticipateReconcilingPaymentsRetrospectively,
    anticipateReconcilingPaymentsRetrospectivelyNote,
    paymentStartDate,
    paymentStartDateNote,
    status
  }: PaymentTypes = data.modelPlan.payments;

  return (
    <div
      className="read-only-model-plan--participants-and-providers"
      data-testid="read-only-model-plan--participants-and-providers"
    >
      <div className="display-flex flex-justify flex-align-start">
        <h2 className="margin-top-0 margin-bottom-4">{t('heading')}</h2>
        <TaskListStatusTag status={status} />
      </div>

      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <ReadOnlySection
          heading={t('fundingSourceQuestion')}
          list
          listItems={fundingSource?.map(translateSourceOptions)}
          listOtherItem={fundingSourceOther}
        />

        {fundingSourceTrustFund && (
          <ReadOnlySection
            heading={t('whichFundingType')}
            copy={fundingSourceTrustFund}
          />
        )}

        {fundingSourceNote && (
          <ReadOnlySection
            heading={t('basics:notes')}
            copy={fundingSourceNote}
          />
        )}

        <ReadOnlySection
          heading={t('reconciliationQuestion')}
          list
          listItems={fundingSourceR?.map(translateSourceOptions)}
          listOtherItem={fundingSourceROther}
        />

        {fundingSourceRTrustFund && (
          <ReadOnlySection
            heading={t('whichFundingType')}
            copy={fundingSourceRTrustFund}
          />
        )}

        {fundingSourceRNote && (
          <ReadOnlySection
            heading={t('basics:notes')}
            copy={fundingSourceRNote}
          />
        )}
      </div>
    </div>
  );
};

export default ReadOnlyPayments;
