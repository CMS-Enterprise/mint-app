import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import GetAllPayments from 'queries/ReadOnly/GetAllPayments';
import {
  GetAllPayments as GetModelPlanPaymentType,
  GetAllPayments_modelPlan_payments as PaymentTypes
} from 'queries/ReadOnly/types/GetAllPayments';
import { ClaimsBasedPayType, PayType } from 'types/graphql-global-types';
import { formatDate } from 'utils/date';
import {
  translateAnticipatedPaymentFrequencyType,
  translateBoolean,
  translateClaimsBasedPayType,
  translateComplexityLevel,
  translateNonClaimsBasedPayType,
  translatePayRecipient,
  translatePayType,
  translateSourceOptions
} from 'utils/modelPlan';
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

      {payType.includes(PayType.CLAIMS_BASED_PAYMENTS) && (
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
            copy={
              shouldAnyProvidersExcludedFFSSystems
                ? translateBoolean(shouldAnyProvidersExcludedFFSSystems)
                : t('na')
            }
            notes={shouldAnyProviderExcludedFFSSystemsNote}
          />

          <ReadOnlySection
            heading={t('chageMedicareFeeSchedule')}
            copy={
              changesMedicarePhysicianFeeSchedule
                ? translateBoolean(changesMedicarePhysicianFeeSchedule)
                : t('na')
            }
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
                copy={
                  affectsMedicareSecondaryPayerClaims
                    ? translateBoolean(affectsMedicareSecondaryPayerClaims)
                    : t('na')
                }
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
            copy={
              creatingDependenciesBetweenServices
                ? translateBoolean(creatingDependenciesBetweenServices)
                : t('na')
            }
            notes={creatingDependenciesBetweenServicesNote}
          />

          <ReadOnlySection
            heading={t('needsClaimsDataCollection')}
            copy={
              needsClaimsDataCollection
                ? translateBoolean(needsClaimsDataCollection)
                : t('na')
            }
            notes={needsClaimsDataCollectionNote}
          />

          <ReadOnlySection
            heading={t('thirdParty')}
            copy={
              providingThirdPartyFile
                ? translateBoolean(providingThirdPartyFile)
                : t('na')
            }
          />

          <ReadOnlySection
            heading={t('isContractorAwareTestDataRequirements')}
            copy={
              isContractorAwareTestDataRequirements
                ? translateBoolean(isContractorAwareTestDataRequirements)
                : t('na')
            }
          />
        </div>
      )}

      {payType.includes(PayType.CLAIMS_BASED_PAYMENTS) &&
        payClaims.includes(
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
                  copy={
                    waiveBeneficiaryCostSharingForAnyServices
                      ? translateBoolean(
                          waiveBeneficiaryCostSharingForAnyServices
                        )
                      : t('na')
                  }
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
                copy={
                  waiverOnlyAppliesPartOfPayment
                    ? translateBoolean(waiverOnlyAppliesPartOfPayment)
                    : t('na')
                }
                notes={waiveBeneficiaryCostSharingNote}
              />
            )}
          </div>
        )}

      {payType.includes(PayType.NON_CLAIMS_BASED_PAYMENTS) && (
        <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
          <h3>{t('whatWillYouPayOptions.nonClaims')}</h3>

          <ReadOnlySection
            heading={t('nonClaimsPayments')}
            list
            listItems={nonClaimsPayments?.map(translateNonClaimsBasedPayType)}
            listOtherItem={nonClaimsPaymentOther}
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
            copy={
              sharedSystemsInvolvedAdditionalClaimPayment
                ? translateBoolean(sharedSystemsInvolvedAdditionalClaimPayment)
                : t('na')
            }
            notes={sharedSystemsInvolvedAdditionalClaimPaymentNote}
          />

          <ReadOnlySection
            heading={t('planningToUseInnovationPaymentContractor')}
            copy={
              planningToUseInnovationPaymentContractor
                ? translateBoolean(planningToUseInnovationPaymentContractor)
                : t('na')
            }
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
            expectedCalculationComplexityLevel
              ? translateComplexityLevel(expectedCalculationComplexityLevel)
              : t('na')
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
              copy={
                canParticipantsSelectBetweenPaymentMechanisms
                  ? translateBoolean(
                      canParticipantsSelectBetweenPaymentMechanisms
                    )
                  : t('na')
              }
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
          listItems={anticipatedPaymentFrequency.map(
            translateAnticipatedPaymentFrequencyType
          )}
          listOtherItem={anticipatedPaymentFrequencyOther}
          notes={anticipatedPaymentFrequencyNote}
        />
      </div>

      <div className="margin-bottom-4 padding-bottom-2">
        <ReadOnlySection
          heading={t('willRecoverPayments')}
          copy={
            willRecoverPayments
              ? translateBoolean(willRecoverPayments)
              : t('na')
          }
          notes={willRecoverPaymentsNote}
        />

        <ReadOnlySection
          heading={t('anticipateReconcilingPaymentsRetrospectively')}
          copy={
            anticipateReconcilingPaymentsRetrospectively
              ? translateBoolean(anticipateReconcilingPaymentsRetrospectively)
              : t('na')
          }
          notes={anticipateReconcilingPaymentsRetrospectivelyNote}
        />

        <ReadOnlySection
          heading={t('paymentStartDateQuestion')}
          copy={
            paymentStartDate
              ? formatDate(paymentStartDate, 'MM/dd/yyyy')
              : t('na')
          }
          notes={paymentStartDateNote}
        />
      </div>
    </div>
  );
};

export default ReadOnlyPayments;
