import { gql } from '@apollo/client';

export default gql`
  query GetOperationalNeedAnswer(
    $id: UUID!
    $managePartCDEnrollment: Boolean
    $collectPlanBids: Boolean
    $planContactUpdated: Boolean
    $recruitmentMethod: Boolean
    $selectionMethod: Boolean
    $communicationMethod: Boolean
    $helpdeskUse: Boolean
    $iddocSupport: Boolean
    $benchmarkForPerformance: Boolean
    $appealPerformance: Boolean
    $appealFeedback: Boolean
    $appealPayments: Boolean
    $appealOther: Boolean
    $evaluationApproaches: Boolean
    $dataNeededForMonitoring: Boolean
    $dataToSendParticicipants: Boolean
    $modelLearningSystems: Boolean
    $payType: Boolean
    $colleshouldAnyProvidersExcludedFFSSystemsctPlanBids: Boolean
    $nonClaimsPayments: Boolean
    $willRecoverPayments: Boolean
  ) {
    modelPlan(id: $id) {
      id
      modelName
      generalCharacteristics {
        managePartCDEnrollment @include(if: $managePartCDEnrollment)
        collectPlanBids @include(if: $collectPlanBids)
        planContactUpdated @include(if: $planContactUpdated)
      }
      participantsAndProviders {
        recruitmentMethod @include(if: $recruitmentMethod)
        selectionMethod @include(if: $selectionMethod)
        communicationMethod @include(if: $communicationMethod)
      }
      opsEvalAndLearning {
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
      }
      payments {
        payType @include(if: $payType)
        shouldAnyProvidersExcludedFFSSystems
          @include(if: $colleshouldAnyProvidersExcludedFFSSystemsctPlanBids)
        nonClaimsPayments @include(if: $nonClaimsPayments)
        willRecoverPayments @include(if: $willRecoverPayments)
      }
    }
  }
`;
