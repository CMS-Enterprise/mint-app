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
      readyForClearanceByUserAccount {
        commonName
      }
      readyForClearanceDts
      status
    }
    updatePlanGeneralCharacteristics(
      id: $characteristicsID
      changes: $characteristicsChanges
    ) {
      readyForClearanceBy
      readyForClearanceByUserAccount {
        commonName
      }
      readyForClearanceDts
      status
    }
    updatePlanParticipantsAndProviders(
      id: $participantsAndProvidersID
      changes: $participantsAndProvidersChanges
    ) {
      readyForClearanceBy
      readyForClearanceByUserAccount {
        commonName
      }
      readyForClearanceDts
      status
    }
    updatePlanBeneficiaries(
      id: $beneficiariesID
      changes: $benficiariesChanges
    ) {
      readyForClearanceBy
      readyForClearanceByUserAccount {
        commonName
      }
      readyForClearanceDts
      status
    }
    updatePlanOpsEvalAndLearning(
      id: $opsEvalAndLearningID
      changes: $opsEvalAndLearningChanges
    ) {
      readyForClearanceBy
      readyForClearanceByUserAccount {
        commonName
      }
      readyForClearanceDts
      status
    }
    updatePlanPayments(id: $paymentsID, changes: $paymentsChanges) {
      readyForClearanceBy
      readyForClearanceByUserAccount {
        commonName
      }
      readyForClearanceDts
      status
    }
  }
`;
