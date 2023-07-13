import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import classNames from 'classnames';

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

import {
  beneficiaryCostSharingQuestions,
  checkGroupMap,
  claimsQuestions,
  nonClaimsQuestions
} from '../_components/FilterView/util';
import ReadOnlySection from '../_components/ReadOnlySection';
import SideBySideReadOnlySection from '../_components/SideBySideReadOnlySection';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyPayments = ({
  modelID,
  clearance,
  isViewingFilteredView,
  filteredQuestions
}: ReadOnlyProps) => {
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

  const isClaims: boolean =
    payType?.includes(PayType.CLAIMS_BASED_PAYMENTS) || false;

  const isCostSharing: boolean =
    (payType?.includes(PayType.CLAIMS_BASED_PAYMENTS) &&
      payClaims?.includes(
        ClaimsBasedPayType.REDUCTIONS_TO_BENEFICIARY_COST_SHARING
      )) ||
    false;

  const isNonClaims: boolean =
    payType?.includes(PayType.NON_CLAIMS_BASED_PAYMENTS) || false;

  const hasClaimsQuestions = () => {
    if (
      filteredQuestions?.filter(question => claimsQuestions.includes(question))
        .length === 0
    ) {
      return false;
    }
    return true;
  };
  const hasBeneficiaryCostSharingQuestions = () => {
    if (
      filteredQuestions?.filter(question =>
        beneficiaryCostSharingQuestions.includes(question)
      ).length === 0
    ) {
      return false;
    }
    return true;
  };
  const hasNonClaimsQuestions = () => {
    if (
      filteredQuestions?.filter(question =>
        nonClaimsQuestions.includes(question)
      ).length === 0
    ) {
      return false;
    }
    return true;
  };

  return (
    <div
      className="read-only-model-plan--payments"
      data-testid="read-only-model-plan--payments"
    >
      <div className="display-flex flex-justify flex-align-start">
        <h2 className="margin-top-0 margin-bottom-4">
          {clearance ? t('clearanceHeading') : t('heading')}
        </h2>
        {!isViewingFilteredView && status && (
          <TaskListStatusTag status={status} />
        )}
      </div>

      {clearance && (
        <p className="font-body-lg margin-top-neg-2 margin-bottom-6">
          {p('forModelPlan', {
            modelName
          })}
        </p>
      )}

      <div
        className={`${
          isViewingFilteredView
            ? ''
            : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
        }`}
      >
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'fundingSource',
          <SideBySideReadOnlySection
            firstSection={{
              heading: t('fundingSourceQuestion'),
              list: true,
              listItems: fundingSource?.map(translateSourceOptions),
              listOtherItem: fundingSourceOther
            }}
            secondSection={
              !!fundingSourceTrustFund && {
                heading: t('whichFundingType'),
                copy: fundingSourceTrustFund
              }
            }
          />
        )}
        {fundingSourceNote &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'fundingSourceTrustFund',
            <ReadOnlySection
              heading={t('basics:notes')}
              copy={fundingSourceNote}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'fundingSourceR',
          <SideBySideReadOnlySection
            firstSection={{
              heading: t('reconciliationQuestion'),
              list: true,
              listItems: fundingSourceR?.map(translateSourceOptions),
              listOtherItem: fundingSourceROther
            }}
            secondSection={
              !!fundingSourceRTrustFund && {
                heading: t('whichFundingType'),
                copy: fundingSourceRTrustFund
              }
            }
          />
        )}
        {fundingSourceRNote &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'fundingSourceRTrustFund',
            <ReadOnlySection
              heading={t('basics:notes')}
              copy={fundingSourceRNote}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'payRecipients',
          <ReadOnlySection
            heading={t('whoWillYouPayQuestion')}
            list
            listItems={payRecipients?.map(translatePayRecipient)}
            listOtherItem={payRecipientsOtherSpecification}
            notes={payRecipientsNote}
          />
        )}
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'payType',
          <ReadOnlySection
            heading={t('whatWillYouPay')}
            list
            listItems={payType?.map(translatePayType)}
            notes={payTypeNote}
          />
        )}
      </div>

      <div
        className={classNames({
          'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light':
            isClaims && !isViewingFilteredView
        })}
      >
        {isClaims && hasClaimsQuestions() && (
          <h3>{t('whatWillYouPayOptions.claims')}</h3>
        )}

        {isClaims &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'payClaims',
            <ReadOnlySection
              heading={t('selectClaims')}
              list
              listItems={payClaims?.map(translateClaimsBasedPayType)}
              listOtherItem={payClaimsOther}
              notes={payClaimsNote}
            />
          )}

        {isClaims &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'shouldAnyProvidersExcludedFFSSystems',
            <ReadOnlySection
              heading={t('excludedFromPayment')}
              copy={translateBooleanOrNull(
                shouldAnyProvidersExcludedFFSSystems
              )}
              notes={shouldAnyProviderExcludedFFSSystemsNote}
            />
          )}

        {isClaims &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'changesMedicarePhysicianFeeSchedule',
            <ReadOnlySection
              heading={t('chageMedicareFeeSchedule')}
              copy={translateBooleanOrNull(changesMedicarePhysicianFeeSchedule)}
              notes={changesMedicarePhysicianFeeScheduleNote}
            />
          )}

        {isClaims &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'affectsMedicareSecondaryPayerClaims',
            <SideBySideReadOnlySection
              firstSection={{
                heading: t('modelAffect'),
                copy: translateBooleanOrNull(
                  affectsMedicareSecondaryPayerClaims
                )
              }}
              secondSection={
                affectsMedicareSecondaryPayerClaims === true && {
                  heading: h('pleaseDescribe'),
                  copy: affectsMedicareSecondaryPayerClaimsHow
                }
              }
            />
          )}
        {(isClaims && affectsMedicareSecondaryPayerClaimsNote) ||
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'affectsMedicareSecondaryPayerClaims',
            <ReadOnlySection
              heading={t('basics:notes')}
              copy={affectsMedicareSecondaryPayerClaimsNote}
            />
          )}

        {isClaims &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'payModelDifferentiation',
            <ReadOnlySection
              heading={t('affectCurrentPolicy')}
              copy={payModelDifferentiation}
            />
          )}

        {isClaims &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'creatingDependenciesBetweenServices',
            <ReadOnlySection
              heading={t('ancitipateCreatingDependencies')}
              copy={translateBooleanOrNull(creatingDependenciesBetweenServices)}
              notes={creatingDependenciesBetweenServicesNote}
            />
          )}

        {isClaims &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'needsClaimsDataCollection',
            <ReadOnlySection
              heading={t('needsClaimsDataCollection')}
              copy={translateBooleanOrNull(needsClaimsDataCollection)}
              notes={needsClaimsDataCollectionNote}
            />
          )}

        {isClaims &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'providingThirdPartyFile',
            <ReadOnlySection
              heading={t('thirdParty')}
              copy={translateBooleanOrNull(providingThirdPartyFile)}
            />
          )}

        {isClaims &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'isContractorAwareTestDataRequirements',
            <ReadOnlySection
              heading={t('isContractorAwareTestDataRequirements')}
              copy={translateBooleanOrNull(
                isContractorAwareTestDataRequirements
              )}
            />
          )}
      </div>

      <div
        className={classNames({
          'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light':
            isCostSharing && !isViewingFilteredView
        })}
      >
        {isCostSharing && hasBeneficiaryCostSharingQuestions() && (
          <h3>{t('beneficaryCostSharingQuestions')}</h3>
        )}

        {isCostSharing &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'beneficiaryCostSharingLevelAndHandling',
            <ReadOnlySection
              heading={t('beneficiaryCostSharingLevelAndHandling')}
              copy={beneficiaryCostSharingLevelAndHandling}
            />
          )}

        {isCostSharing &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'waiveBeneficiaryCostSharingForAnyServices',
            <SideBySideReadOnlySection
              firstSection={{
                heading: t('waiveBeneficiaryCostSharingForAnyServices'),
                copy: translateBooleanOrNull(
                  waiveBeneficiaryCostSharingForAnyServices
                )
              }}
              secondSection={
                waiveBeneficiaryCostSharingForAnyServices === true && {
                  heading: t('waiveBeneficiaryCostSharingServiceSpecification'),
                  copy: waiveBeneficiaryCostSharingServiceSpecification
                }
              }
            />
          )}
        {isCostSharing &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'waiverOnlyAppliesPartOfPayment',
            <ReadOnlySection
              heading={t('waiverOnlyAppliesPartOfPayment')}
              copy={translateBooleanOrNull(waiverOnlyAppliesPartOfPayment)}
              notes={waiveBeneficiaryCostSharingNote}
            />
          )}
      </div>

      <div
        className={classNames({
          'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light':
            isNonClaims && !isViewingFilteredView
        })}
      >
        {isNonClaims && hasNonClaimsQuestions() && (
          <h3>{t('whatWillYouPayOptions.nonClaims')}</h3>
        )}

        {isNonClaims &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'nonClaimsPayments',
            <ReadOnlySection
              heading={t('nonClaimsPayments')}
              list
              listItems={nonClaimsPayments?.map(translateNonClaimsBasedPayType)}
              listOtherItem={nonClaimsPaymentOther}
              notes={nonClaimsPaymentsNote}
            />
          )}

        {isNonClaims &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'paymentCalculationOwner',
            <ReadOnlySection
              heading={t('paymentCalculationOwner')}
              copy={paymentCalculationOwner}
            />
          )}

        {isNonClaims &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'numberPaymentsPerPayCycle',
            <ReadOnlySection
              heading={t('numberPaymentsPerPayCycle')}
              copy={numberPaymentsPerPayCycle}
              notes={numberPaymentsPerPayCycleNote}
            />
          )}

        {isNonClaims &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'sharedSystemsInvolvedAdditionalClaimPayment',
            <ReadOnlySection
              heading={t('sharedSystemsInvolvedAdditionalClaimPayment')}
              copy={translateBooleanOrNull(
                sharedSystemsInvolvedAdditionalClaimPayment
              )}
              notes={sharedSystemsInvolvedAdditionalClaimPaymentNote}
            />
          )}

        {isNonClaims &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'planningToUseInnovationPaymentContractor',
            <ReadOnlySection
              heading={t('planningToUseInnovationPaymentContractor')}
              copy={translateBooleanOrNull(
                planningToUseInnovationPaymentContractor
              )}
              notes={planningToUseInnovationPaymentContractorNote}
            />
          )}

        {isNonClaims &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'fundingStructure',
            <ReadOnlySection
              heading={t('fundingStructure')}
              copy={fundingStructure}
            />
          )}
      </div>

      <div
        className={`${
          isViewingFilteredView
            ? ''
            : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
        }`}
      >
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'expectedCalculationComplexityLevel',
          <ReadOnlySection
            heading={t('expectedCalculationComplexityLevel')}
            copy={
              expectedCalculationComplexityLevel &&
              translateComplexityLevel(expectedCalculationComplexityLevel)
            }
            notes={expectedCalculationComplexityLevelNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'canParticipantsSelectBetweenPaymentMechanisms',
          <SideBySideReadOnlySection
            firstSection={{
              heading: t('canParticipantsSelectBetweenPaymentMechanisms'),
              copy: translateBooleanOrNull(
                canParticipantsSelectBetweenPaymentMechanisms
              )
            }}
            secondSection={
              canParticipantsSelectBetweenPaymentMechanisms === true && {
                heading: h('pleaseDescribe'),
                copy: canParticipantsSelectBetweenPaymentMechanismsHow
              }
            }
          />
        )}
        {canParticipantsSelectBetweenPaymentMechanismsNote &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'canParticipantsSelectBetweenPaymentMechanisms',
            <ReadOnlySection
              heading={t('basics:notes')}
              copy={canParticipantsSelectBetweenPaymentMechanismsNote}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'anticipatedPaymentFrequency',
          <ReadOnlySection
            heading={t('anticipatedPaymentFrequency')}
            list
            listItems={anticipatedPaymentFrequency?.map(
              translateAnticipatedPaymentFrequencyType
            )}
            listOtherItem={anticipatedPaymentFrequencyOther}
            notes={anticipatedPaymentFrequencyNote}
          />
        )}
      </div>

      <div>
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'willRecoverPayments',
          <ReadOnlySection
            heading={t('willRecoverPayments')}
            copy={translateBooleanOrNull(willRecoverPayments)}
            notes={willRecoverPaymentsNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'anticipateReconcilingPaymentsRetrospectively',
          <ReadOnlySection
            heading={t('anticipateReconcilingPaymentsRetrospectively')}
            copy={translateBooleanOrNull(
              anticipateReconcilingPaymentsRetrospectively
            )}
            notes={anticipateReconcilingPaymentsRetrospectivelyNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'paymentStartDate',
          <ReadOnlySection
            heading={t('paymentStartDateQuestion')}
            copy={
              paymentStartDate && formatDateUtc(paymentStartDate, 'MM/dd/yyyy')
            }
            notes={paymentStartDateNote}
          />
        )}
      </div>
    </div>
  );
};

export default ReadOnlyPayments;
