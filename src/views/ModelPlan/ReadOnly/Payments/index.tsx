import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import {
  ClaimsBasedPayType,
  GetAllPaymentsQuery,
  PayType,
  useGetAllPaymentsQuery
} from 'gql/gen/graphql';

import usePlanTranslation from 'hooks/usePlanTranslation';
import { formatDateUtc } from 'utils/date';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import { NotFoundPartial } from 'views/NotFound';

import { checkGroupMap } from '../_components/FilterView/util';
import ReadOnlySection, {
  formatListItems,
  formatListOtherItems
} from '../_components/ReadOnlySection';
import SideBySideReadOnlySection from '../_components/SideBySideReadOnlySection';
import TitleAndStatus from '../_components/TitleAndStatus';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyPayments = ({
  modelID,
  clearance,
  isViewingFilteredView,
  filteredQuestions
}: ReadOnlyProps) => {
  const { t: paymentsT } = useTranslation('payments');
  const { t: paymentsMiscT } = useTranslation('paymentsMisc');
  const { t: prepareForClearanceT } = useTranslation('prepareForClearance');

  const { modelName } = useContext(ModelInfoContext);

  const {
    anticipatedPaymentFrequency: anticipatedPaymentFrequencyConfig,
    paymentReconciliationFrequency: paymentReconciliationFrequencyConfig,
    paymentDemandRecoupmentFrequency: paymentDemandRecoupmentFrequencyConfig,
    fundingSource: fundingSourceConfig,
    fundingSourceR: fundingSourceRConfig
  } = usePlanTranslation('payments');

  const { data, loading, error } = useGetAllPaymentsQuery({
    variables: {
      id: modelID
    }
  });

  if ((!loading && error) || (!loading && !data)) {
    return <NotFoundPartial />;
  }

  const allPaymentData = (data?.modelPlan.payments ||
    {}) as GetAllPaymentsQuery['modelPlan']['payments'];

  const {
    fundingSource,
    fundingSourceNote,
    fundingSourceR,
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
    expectedCalculationComplexityLevel,
    expectedCalculationComplexityLevelNote,
    claimsProcessingPrecedence,
    claimsProcessingPrecedenceOther,
    claimsProcessingPrecedenceNote,
    canParticipantsSelectBetweenPaymentMechanisms,
    canParticipantsSelectBetweenPaymentMechanismsHow,
    canParticipantsSelectBetweenPaymentMechanismsNote,
    anticipatedPaymentFrequency,
    anticipatedPaymentFrequencyNote,
    willRecoverPayments,
    willRecoverPaymentsNote,
    anticipateReconcilingPaymentsRetrospectively,
    anticipateReconcilingPaymentsRetrospectivelyNote,
    paymentReconciliationFrequency,
    paymentReconciliationFrequencyNote,
    paymentDemandRecoupmentFrequency,
    paymentDemandRecoupmentFrequencyNote,
    paymentStartDate,
    paymentStartDateNote,
    status
  } = allPaymentData;

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

  return (
    <div
      className="read-only-model-plan--payments"
      data-testid="read-only-model-plan--payments"
    >
      <TitleAndStatus
        clearance={clearance}
        clearanceTitle={paymentsMiscT('clearanceHeading')}
        heading={paymentsMiscT('heading')}
        isViewingFilteredView={isViewingFilteredView}
        status={status}
      />

      {clearance && (
        <p className="font-body-lg margin-top-neg-2 margin-bottom-6">
          {prepareForClearanceT('forModelPlan', {
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
          <ReadOnlySection
            heading={paymentsT('fundingSource.readonlyLabel')}
            list
            listItems={formatListItems(fundingSourceConfig, fundingSource)}
            listOtherItems={formatListOtherItems(
              fundingSourceConfig,
              fundingSource,
              allPaymentData
            )}
            tooltips={fundingSource?.map((type): string =>
              paymentsT(`fundingSource.optionsLabels.${type}`)
            )}
          />
        )}

        {fundingSourceNote &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'fundingSource',
            <ReadOnlySection
              heading={paymentsT('fundingSourceNote.label')}
              copy={fundingSourceNote}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'fundingSourceR',
          <ReadOnlySection
            heading={paymentsT('fundingSourceR.readonlyLabel')}
            list
            listItems={formatListItems(fundingSourceRConfig, fundingSourceR)}
            listOtherItems={formatListOtherItems(
              fundingSourceRConfig,
              fundingSourceR,
              allPaymentData
            )}
            tooltips={fundingSourceR?.map((type): string =>
              paymentsT(`fundingSourceR.optionsLabels.${type}`)
            )}
          />
        )}

        {fundingSourceRNote &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'fundingSourceR',
            <ReadOnlySection
              heading={paymentsT('fundingSourceRNote.label')}
              copy={fundingSourceRNote}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'payRecipients',
          <ReadOnlySection
            heading={paymentsT('payRecipients.readonlyLabel')}
            list
            listItems={payRecipients?.map((type): string =>
              paymentsT(`payRecipients.options.${type}`)
            )}
            listOtherItem={payRecipientsOtherSpecification}
            notes={payRecipientsNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'payType',
          <ReadOnlySection
            heading={paymentsT('payType.label')}
            list
            listItems={payType?.map((type): string =>
              paymentsT(`payType.options.${type}`)
            )}
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
        {isClaims && !isViewingFilteredView && (
          <h3>{paymentsMiscT('claims')}</h3>
        )}

        {isClaims &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'payClaims',
            <ReadOnlySection
              heading={paymentsT('payClaims.label')}
              list
              listItems={payClaims?.map((type): string =>
                paymentsT(`payClaims.options.${type}`)
              )}
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
              heading={paymentsT('shouldAnyProvidersExcludedFFSSystems.label')}
              copy={paymentsT(
                `shouldAnyProvidersExcludedFFSSystems.options.${shouldAnyProvidersExcludedFFSSystems}`,
                ''
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
              heading={paymentsT('changesMedicarePhysicianFeeSchedule.label')}
              copy={paymentsT(
                `changesMedicarePhysicianFeeSchedule.options.${changesMedicarePhysicianFeeSchedule}`,
                ''
              )}
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
                heading: paymentsT('affectsMedicareSecondaryPayerClaims.label'),
                copy: paymentsT(
                  `affectsMedicareSecondaryPayerClaims.options.${affectsMedicareSecondaryPayerClaims}`,
                  ''
                )
              }}
              secondSection={
                affectsMedicareSecondaryPayerClaims === true && {
                  heading: paymentsT(
                    'affectsMedicareSecondaryPayerClaimsHow.label'
                  ),
                  copy: affectsMedicareSecondaryPayerClaimsHow
                }
              }
            />
          )}

        {isClaims &&
          affectsMedicareSecondaryPayerClaimsNote &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'affectsMedicareSecondaryPayerClaims',
            <ReadOnlySection
              heading={paymentsT(
                'affectsMedicareSecondaryPayerClaimsNote.label'
              )}
              copy={affectsMedicareSecondaryPayerClaimsNote}
            />
          )}

        {isClaims &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'payModelDifferentiation',
            <ReadOnlySection
              heading={paymentsT('payModelDifferentiation.label')}
              copy={payModelDifferentiation}
            />
          )}

        {isClaims &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'creatingDependenciesBetweenServices',
            <ReadOnlySection
              heading={paymentsT('creatingDependenciesBetweenServices.label')}
              copy={paymentsT(
                `creatingDependenciesBetweenServices.options.${creatingDependenciesBetweenServices}`,
                ''
              )}
              notes={creatingDependenciesBetweenServicesNote}
            />
          )}

        {isClaims &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'needsClaimsDataCollection',
            <ReadOnlySection
              heading={paymentsT('needsClaimsDataCollection.label')}
              copy={paymentsT(
                `needsClaimsDataCollection.options.${needsClaimsDataCollection}`,
                ''
              )}
              notes={needsClaimsDataCollectionNote}
            />
          )}

        {isClaims &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'providingThirdPartyFile',
            <ReadOnlySection
              heading={paymentsT('providingThirdPartyFile.label')}
              copy={paymentsT(
                `providingThirdPartyFile.options.${providingThirdPartyFile}`,
                ''
              )}
            />
          )}

        {isClaims &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'isContractorAwareTestDataRequirements',
            <ReadOnlySection
              heading={paymentsT('isContractorAwareTestDataRequirements.label')}
              copy={paymentsT(
                `isContractorAwareTestDataRequirements.options.${isContractorAwareTestDataRequirements}`,
                ''
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
        {isCostSharing && !isViewingFilteredView && (
          <h3>{paymentsMiscT('beneficaryCostSharingQuestions')}</h3>
        )}

        {isCostSharing &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'beneficiaryCostSharingLevelAndHandling',
            <ReadOnlySection
              heading={paymentsT(
                'beneficiaryCostSharingLevelAndHandling.label'
              )}
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
                heading: paymentsT(
                  'waiveBeneficiaryCostSharingForAnyServices.label'
                ),
                copy: paymentsT(
                  `waiveBeneficiaryCostSharingForAnyServices.options.${waiveBeneficiaryCostSharingForAnyServices}`,
                  ''
                )
              }}
              secondSection={
                waiveBeneficiaryCostSharingForAnyServices === true && {
                  heading: paymentsT(
                    'waiveBeneficiaryCostSharingServiceSpecification.label'
                  ),
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
              heading={paymentsT('waiverOnlyAppliesPartOfPayment.label')}
              copy={paymentsT(
                `waiverOnlyAppliesPartOfPayment.options.${waiverOnlyAppliesPartOfPayment}`,
                ''
              )}
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
        {isNonClaims && !isViewingFilteredView && (
          <h3>{paymentsMiscT('nonClaims')}</h3>
        )}

        {isNonClaims &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'nonClaimsPayments',
            <ReadOnlySection
              heading={paymentsT('nonClaimsPayments.label')}
              list
              listItems={nonClaimsPayments?.map((type): string =>
                paymentsT(`nonClaimsPayments.options.${type}`)
              )}
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
              heading={paymentsT('paymentCalculationOwner.label')}
              copy={paymentCalculationOwner}
            />
          )}

        {isNonClaims &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'numberPaymentsPerPayCycle',
            <ReadOnlySection
              heading={paymentsT('numberPaymentsPerPayCycle.label')}
              copy={numberPaymentsPerPayCycle}
              notes={numberPaymentsPerPayCycleNote}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'sharedSystemsInvolvedAdditionalClaimPayment',
          <ReadOnlySection
            heading={paymentsT(
              'sharedSystemsInvolvedAdditionalClaimPayment.label'
            )}
            copy={paymentsT(
              `sharedSystemsInvolvedAdditionalClaimPayment.options.${sharedSystemsInvolvedAdditionalClaimPayment}`,
              ''
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
              heading={paymentsT(
                'planningToUseInnovationPaymentContractor.label'
              )}
              copy={paymentsT(
                `planningToUseInnovationPaymentContractor.options.${planningToUseInnovationPaymentContractor}`,
                ''
              )}
              notes={planningToUseInnovationPaymentContractorNote}
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
            heading={paymentsT('expectedCalculationComplexityLevel.label')}
            copy={
              expectedCalculationComplexityLevel &&
              paymentsT(
                `expectedCalculationComplexityLevel.options.${expectedCalculationComplexityLevel}`,
                ''
              )
            }
            notes={expectedCalculationComplexityLevelNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'claimsProcessingPrecedence',
          <SideBySideReadOnlySection
            firstSection={{
              heading: paymentsT('claimsProcessingPrecedence.label'),
              copy: paymentsT(
                `claimsProcessingPrecedence.options.${claimsProcessingPrecedence}`,
                ''
              ),
              notes: claimsProcessingPrecedenceNote
            }}
            secondSection={
              claimsProcessingPrecedence === true && {
                heading: paymentsT('claimsProcessingPrecedenceOther.label'),
                copy: claimsProcessingPrecedenceOther
              }
            }
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'canParticipantsSelectBetweenPaymentMechanisms',
          <SideBySideReadOnlySection
            firstSection={{
              heading: paymentsT(
                'canParticipantsSelectBetweenPaymentMechanisms.label'
              ),
              copy: paymentsT(
                `canParticipantsSelectBetweenPaymentMechanisms.options.${canParticipantsSelectBetweenPaymentMechanisms}`,
                ''
              )
            }}
            secondSection={
              canParticipantsSelectBetweenPaymentMechanisms === true && {
                heading: paymentsT(
                  'canParticipantsSelectBetweenPaymentMechanismsHow.label'
                ),
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
              heading={paymentsT(
                'canParticipantsSelectBetweenPaymentMechanismsNote.label'
              )}
              copy={canParticipantsSelectBetweenPaymentMechanismsNote}
            />
          )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'anticipatedPaymentFrequency',
          <ReadOnlySection
            heading={paymentsT('anticipatedPaymentFrequency.label')}
            list
            listItems={formatListItems(
              anticipatedPaymentFrequencyConfig,
              anticipatedPaymentFrequency
            )}
            listOtherItems={formatListOtherItems(
              anticipatedPaymentFrequencyConfig,
              anticipatedPaymentFrequency,
              allPaymentData
            )}
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
            heading={paymentsT('willRecoverPayments.label')}
            copy={paymentsT(
              `willRecoverPayments.options.${willRecoverPayments}`,
              ''
            )}
            notes={willRecoverPaymentsNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'anticipateReconcilingPaymentsRetrospectively',
          <ReadOnlySection
            heading={paymentsT(
              'anticipateReconcilingPaymentsRetrospectively.label'
            )}
            copy={paymentsT(
              `anticipateReconcilingPaymentsRetrospectively.options.${anticipateReconcilingPaymentsRetrospectively}`,
              ''
            )}
            notes={anticipateReconcilingPaymentsRetrospectivelyNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'paymentReconciliationFrequency',
          <ReadOnlySection
            heading={paymentsT('paymentReconciliationFrequency.label')}
            list
            listItems={formatListItems(
              paymentReconciliationFrequencyConfig,
              paymentReconciliationFrequency
            )}
            listOtherItems={formatListOtherItems(
              paymentReconciliationFrequencyConfig,
              paymentReconciliationFrequency,
              allPaymentData
            )}
            notes={paymentReconciliationFrequencyNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'paymentDemandRecoupmentFrequency',
          <ReadOnlySection
            heading={paymentsT('paymentDemandRecoupmentFrequency.label')}
            list
            listItems={formatListItems(
              paymentDemandRecoupmentFrequencyConfig,
              paymentDemandRecoupmentFrequency
            )}
            listOtherItems={formatListOtherItems(
              paymentDemandRecoupmentFrequencyConfig,
              paymentDemandRecoupmentFrequency,
              allPaymentData
            )}
            notes={paymentDemandRecoupmentFrequencyNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'paymentStartDate',
          <ReadOnlySection
            heading={paymentsT('paymentStartDate.readonlyLabel')}
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
