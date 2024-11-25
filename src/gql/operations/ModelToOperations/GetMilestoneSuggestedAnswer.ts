import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMilestoneSuggestedAnswer(
    $id: UUID!
    $generalCharacteristics: Boolean!
    $participantsAndProviders: Boolean!
    $beneficiaries: Boolean!
    $opsEvalAndLearning: Boolean!
    $payments: Boolean!
    $managePartCDEnrollment: Boolean!
    $collectPlanBids: Boolean!
    $planContractUpdated: Boolean!
    $agreementTypes: Boolean!
    $recruitmentMethod: Boolean!
    $selectionMethod: Boolean!
    $communicationMethod: Boolean!
    $providerOverlap: Boolean!
    $participantsIds: Boolean!
    $beneficiaryOverlap: Boolean!
    $helpdeskUse: Boolean!
    $iddocSupport: Boolean!
    $benchmarkForPerformance: Boolean!
    $appealPerformance: Boolean!
    $appealFeedback: Boolean!
    $appealPayments: Boolean!
    $appealOther: Boolean!
    $evaluationApproaches: Boolean!
    $dataNeededForMonitoring: Boolean!
    $dataToSendParticicipants: Boolean!
    $modelLearningSystems: Boolean!
    $developNewQualityMeasures: Boolean!
    $payType: Boolean!
    $shouldAnyProvidersExcludedFFSSystems: Boolean!
    $nonClaimsPayments: Boolean!
    $willRecoverPayments: Boolean!
  ) {
    modelPlan(id: $id) {
      id
      modelName
      generalCharacteristics @include(if: $generalCharacteristics) {
        managePartCDEnrollment @include(if: $managePartCDEnrollment)
        collectPlanBids @include(if: $collectPlanBids)
        planContractUpdated @include(if: $planContractUpdated)
        agreementTypes @include(if: $agreementTypes)
      }
      participantsAndProviders @include(if: $participantsAndProviders) {
        recruitmentMethod @include(if: $recruitmentMethod)
        selectionMethod @include(if: $selectionMethod)
        communicationMethod @include(if: $communicationMethod)
        providerOverlap @include(if: $providerOverlap)
        participantsIds @include(if: $participantsIds)
      }
      beneficiaries @include(if: $beneficiaries) {
        beneficiaryOverlap @include(if: $beneficiaryOverlap)
      }
      opsEvalAndLearning @include(if: $opsEvalAndLearning) {
        helpdeskUse @include(if: $helpdeskUse)
        iddocSupport @include(if: $iddocSupport)
        benchmarkForPerformance @include(if: $benchmarkForPerformance)
        appealPerformance @include(if: $appealPerformance)
        appealFeedback @include(if: $appealFeedback)
        appealPayments @include(if: $appealPayments)
        appealOther @include(if: $appealOther)
        evaluationApproaches @include(if: $evaluationApproaches)
        dataNeededForMonitoring @include(if: $dataNeededForMonitoring)
        dataToSendParticicipants @include(if: $dataToSendParticicipants)
        modelLearningSystems @include(if: $modelLearningSystems)
        developNewQualityMeasures @include(if: $developNewQualityMeasures)
      }
      payments @include(if: $payments) {
        payType @include(if: $payType)
        shouldAnyProvidersExcludedFFSSystems
          @include(if: $shouldAnyProvidersExcludedFFSSystems)
        nonClaimsPayments @include(if: $nonClaimsPayments)
        willRecoverPayments @include(if: $willRecoverPayments)
      }
    }
  }
`);
