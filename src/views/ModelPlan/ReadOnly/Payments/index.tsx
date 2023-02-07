import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import GetAllPayments from 'queries/ReadOnly/GetAllPayments';
import { GetAllPayments as GetModelPlanPaymentType } from 'queries/ReadOnly/types/GetAllPayments';
import { ClaimsBasedPayType, PayType } from 'types/graphql-global-types';
import { formatDateUtc } from 'utils/date';
import {
  translateAnticipatedPaymentFrequencyType,
  translateBooleanOrNull,
  translateClaimsBasedPayType,
  translateComplexityLevel,
  translateNonClaimsBasedPayType,
  translatePayRecipient,
  translatePayType,
  translateSourceOptions
} from 'utils/modelPlan';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import { TaskListStatusTag } from 'views/ModelPlan/TaskList/_components/TaskListItem';
import { NotFoundPartial } from 'views/NotFound';

import ReadOnlySection from '../_components/ReadOnlySection';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyPayments = ({ modelID, clearance }: ReadOnlyProps) => {
  const { t } = useTranslation('payments');
  const { t: h } = useTranslation('draftModelPlan');
  const { t: p } = useTranslation('prepareForClearance');

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useQuery<GetModelPlanPaymentType>(
    GetAllPayments,
    {
      variables: {
        id: modelID
      }
    }
  );

  if ((!loading && error) || (!loading && !data)) {
    return <NotFoundPartial />;
  }

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
    nonClaimsPaymentsNote,
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
  } = data?.modelPlan.payments || {};

  return (
    <div
      className="read-only-model-plan--participants-and-providers"
      data-testid="read-only-model-plan--participants-and-providers"
    >
      <div className="display-flex flex-justify flex-align-start">
        <h2 className="margin-top-0 margin-bottom-4">
          {clearance ? t('clearanceHeading') : t('heading')}
        </h2>
        {status && <TaskListStatusTag status={status} />}
      </div>

      {clearance && (
        <p className="font-body-lg margin-top-neg-2 margin-bottom-6">
          {p('forModelPlan', {
            modelName
          })}
        </p>
      )}

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

        <ReadOnlySection
          heading={t('whoWillYouPayQuestion')}
          list
          listItems={payRecipients?.map(translatePayRecipient)}
          listOtherItem={payRecipientsOtherSpecification}
          notes={payRecipientsNote}
        />

        <ReadOnlySection
          heading={t('whatWillYouPay')}
          list
          listItems={payType?.map(translatePayType)}
          notes={payTypeNote}
        />
      </div>

      {payType?.includes(PayType.CLAIMS_BASED_PAYMENTS) && (
        <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
          <h3>{t('whatWillYouPayOptions.claims')}</h3>

          <ReadOnlySection
            heading={t('selectClaims')}
            list
            listItems={payClaims?.map(translateClaimsBasedPayType)}
            listOtherItem={payClaimsOther}
            notes={payClaimsNote}
          />

          <ReadOnlySection
            heading={t('excludedFromPayment')}
            copy={translateBooleanOrNull(shouldAnyProvidersExcludedFFSSystems)}
            notes={shouldAnyProviderExcludedFFSSystemsNote}
          />

          <ReadOnlySection
            heading={t('chageMedicareFeeSchedule')}
            copy={translateBooleanOrNull(changesMedicarePhysicianFeeSchedule)}
            notes={changesMedicarePhysicianFeeScheduleNote}
          />

          <div className="desktop:display-flex flex-justify">
            <div
              className={
                affectsMedicareSecondaryPayerClaims
                  ? 'desktop:width-card-lg'
                  : ''
              }
            >
              <ReadOnlySection
                heading={t('modelAffect')}
                copy={translateBooleanOrNull(
                  affectsMedicareSecondaryPayerClaims
                )}
              />
            </div>
            {affectsMedicareSecondaryPayerClaims && (
              <div className="desktop:width-card-lg">
                <ReadOnlySection
                  heading={h('howSo')}
                  copy={affectsMedicareSecondaryPayerClaimsHow}
                />
              </div>
            )}
          </div>
          {affectsMedicareSecondaryPayerClaimsNote && (
            <ReadOnlySection
              heading={t('basics:notes')}
              copy={affectsMedicareSecondaryPayerClaimsNote}
            />
          )}

          <ReadOnlySection
            heading={t('affectCurrentPolicy')}
            copy={payModelDifferentiation}
          />

          <ReadOnlySection
            heading={t('ancitipateCreatingDependencies')}
            copy={translateBooleanOrNull(creatingDependenciesBetweenServices)}
            notes={creatingDependenciesBetweenServicesNote}
          />

          <ReadOnlySection
            heading={t('needsClaimsDataCollection')}
            copy={translateBooleanOrNull(needsClaimsDataCollection)}
            notes={needsClaimsDataCollectionNote}
          />

          <ReadOnlySection
            heading={t('thirdParty')}
            copy={translateBooleanOrNull(providingThirdPartyFile)}
          />

          <ReadOnlySection
            heading={t('isContractorAwareTestDataRequirements')}
            copy={translateBooleanOrNull(isContractorAwareTestDataRequirements)}
          />
        </div>
      )}

      {payType?.includes(PayType.CLAIMS_BASED_PAYMENTS) &&
        payClaims?.includes(
          ClaimsBasedPayType.REDUCTIONS_TO_BENEFICIARY_COST_SHARING
        ) && (
          <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
            <h3>{t('beneficaryCostSharingQuestions')}</h3>

            <ReadOnlySection
              heading={t('beneficiaryCostSharingLevelAndHandling')}
              copy={beneficiaryCostSharingLevelAndHandling}
            />

            <div className="desktop:display-flex flex-justify">
              <div
                className={
                  waiveBeneficiaryCostSharingForAnyServices
                    ? 'desktop:width-card-lg'
                    : ''
                }
              >
                <ReadOnlySection
                  heading={t('waiveBeneficiaryCostSharingForAnyServices')}
                  copy={translateBooleanOrNull(
                    waiveBeneficiaryCostSharingForAnyServices
                  )}
                />
              </div>
              {waiveBeneficiaryCostSharingForAnyServices && (
                <div className="desktop:width-card-lg">
                  <ReadOnlySection
                    heading={t(
                      'waiveBeneficiaryCostSharingServiceSpecification'
                    )}
                    copy={waiveBeneficiaryCostSharingServiceSpecification}
                  />
                </div>
              )}
            </div>
            {waiveBeneficiaryCostSharingForAnyServices && (
              <ReadOnlySection
                heading={t('waiverOnlyAppliesPartOfPayment')}
                copy={translateBooleanOrNull(waiverOnlyAppliesPartOfPayment)}
                notes={waiveBeneficiaryCostSharingNote}
              />
            )}
          </div>
        )}

      {payType?.includes(PayType.NON_CLAIMS_BASED_PAYMENTS) && (
        <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
          <h3>{t('whatWillYouPayOptions.nonClaims')}</h3>
          <ReadOnlySection
            heading={t('nonClaimsPayments')}
            list
            listItems={nonClaimsPayments?.map(translateNonClaimsBasedPayType)}
            listOtherItem={nonClaimsPaymentOther}
            notes={nonClaimsPaymentsNote}
          />

          <ReadOnlySection
            heading={t('paymentCalculationOwner')}
            copy={paymentCalculationOwner}
          />

          <ReadOnlySection
            heading={t('numberPaymentsPerPayCycle')}
            copy={numberPaymentsPerPayCycle}
            notes={numberPaymentsPerPayCycleNote}
          />

          <ReadOnlySection
            heading={t('sharedSystemsInvolvedAdditionalClaimPayment')}
            copy={translateBooleanOrNull(
              sharedSystemsInvolvedAdditionalClaimPayment
            )}
            notes={sharedSystemsInvolvedAdditionalClaimPaymentNote}
          />

          <ReadOnlySection
            heading={t('planningToUseInnovationPaymentContractor')}
            copy={translateBooleanOrNull(
              planningToUseInnovationPaymentContractor
            )}
            notes={planningToUseInnovationPaymentContractorNote}
          />

          <ReadOnlySection
            heading={t('fundingStructure')}
            copy={fundingStructure}
          />
        </div>
      )}

      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <ReadOnlySection
          heading={t('expectedCalculationComplexityLevel')}
          copy={
            expectedCalculationComplexityLevel &&
            translateComplexityLevel(expectedCalculationComplexityLevel)
          }
          notes={expectedCalculationComplexityLevelNote}
        />

        <div className="desktop:display-flex flex-justify">
          <div
            className={
              affectsMedicareSecondaryPayerClaims ? 'desktop:width-card-lg' : ''
            }
          >
            <ReadOnlySection
              heading={t('canParticipantsSelectBetweenPaymentMechanisms')}
              copy={translateBooleanOrNull(
                canParticipantsSelectBetweenPaymentMechanisms
              )}
              notes={canParticipantsSelectBetweenPaymentMechanismsNote}
            />
          </div>
          {canParticipantsSelectBetweenPaymentMechanisms && (
            <div className="desktop:width-card-lg">
              <ReadOnlySection
                heading={h('howSo')}
                copy={canParticipantsSelectBetweenPaymentMechanismsHow}
              />
            </div>
          )}
        </div>
        {canParticipantsSelectBetweenPaymentMechanismsNote && (
          <ReadOnlySection
            heading={t('basics:notes')}
            copy={canParticipantsSelectBetweenPaymentMechanismsNote}
          />
        )}

        <ReadOnlySection
          heading={t('anticipatedPaymentFrequency')}
          list
          listItems={anticipatedPaymentFrequency?.map(
            translateAnticipatedPaymentFrequencyType
          )}
          listOtherItem={anticipatedPaymentFrequencyOther}
          notes={anticipatedPaymentFrequencyNote}
        />
      </div>

      <div className="margin-bottom-4 padding-bottom-2">
        <ReadOnlySection
          heading={t('willRecoverPayments')}
          copy={translateBooleanOrNull(willRecoverPayments)}
          notes={willRecoverPaymentsNote}
        />

        <ReadOnlySection
          heading={t('anticipateReconcilingPaymentsRetrospectively')}
          copy={translateBooleanOrNull(
            anticipateReconcilingPaymentsRetrospectively
          )}
          notes={anticipateReconcilingPaymentsRetrospectivelyNote}
        />

        <ReadOnlySection
          heading={t('paymentStartDateQuestion')}
          copy={
            paymentStartDate && formatDateUtc(paymentStartDate, 'MM/dd/yyyy')
          }
          notes={paymentStartDateNote}
        />
      </div>
    </div>
  );
};

export default ReadOnlyPayments;
