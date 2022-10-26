import { gql } from '@apollo/client';

export default gql`
  mutation UpdatePrepareForClearance(
    $basicsID: UUID!
    $basicsChanges: PlanBasicsChanges!
    $characteristicsID: UUID!
    $characteristicsChanges: PlanGeneralCharacteristicsChanges!
    $participantsAndProvidersID: UUID!
    $participantsAndProvidersChanges: PlanParticipantsAndProvidersChanges!
    $beneficiariesID: UUID!
    $benficiariesChanges: PlanBeneficiariesChanges!
    $opsEvalAndLearningID: UUID!
    $opsEvalAndLearningChanges: PlanOpsEvalAndLearningChanges!
    $paymentsID: UUID!
    $paymentsChanges: PlanPaymentsChanges!
  ) {
    updatePlanBasics(id: $basicsID, changes: $basicsChanges) {
      readyForClearanceBy
      readyForClearanceDts
      status
    }
    updatePlanGeneralCharacteristics(
      id: $characteristicsID
      changes: $characteristicsChanges
    ) {
      readyForClearanceBy
      readyForClearanceDts
      status
    }
    updatePlanParticipantsAndProviders(
      id: $participantsAndProvidersID
      changes: $participantsAndProvidersChanges
    ) {
      readyForClearanceBy
      readyForClearanceDts
      status
    }
    updatePlanBeneficiaries(
      id: $beneficiariesID
      changes: $benficiariesChanges
    ) {
      readyForClearanceBy
      readyForClearanceDts
      status
    }
    updatePlanOpsEvalAndLearning(
      id: $opsEvalAndLearningID
      changes: $opsEvalAndLearningChanges
    ) {
      readyForClearanceBy
      readyForClearanceDts
      status
    }
    updatePlanPayments(id: $paymentsID, changes: $paymentsChanges) {
      readyForClearanceBy
      readyForClearanceDts
      status
    }
  }
`;
