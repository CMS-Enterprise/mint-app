import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
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
      readyForClearanceByUserAccount {
        id
        commonName
      }
      readyForClearanceDts
      status
    }
    updatePlanGeneralCharacteristics(
      id: $characteristicsID
      changes: $characteristicsChanges
    ) {
      readyForClearanceByUserAccount {
        id
        commonName
      }
      readyForClearanceDts
      status
    }
    updatePlanParticipantsAndProviders(
      id: $participantsAndProvidersID
      changes: $participantsAndProvidersChanges
    ) {
      readyForClearanceByUserAccount {
        id
        commonName
      }
      readyForClearanceDts
      status
    }
    updatePlanBeneficiaries(
      id: $beneficiariesID
      changes: $benficiariesChanges
    ) {
      readyForClearanceByUserAccount {
        id
        commonName
      }
      readyForClearanceDts
      status
    }
    updatePlanOpsEvalAndLearning(
      id: $opsEvalAndLearningID
      changes: $opsEvalAndLearningChanges
    ) {
      readyForClearanceByUserAccount {
        id
        commonName
      }
      readyForClearanceDts
      status
    }
    updatePlanPayments(id: $paymentsID, changes: $paymentsChanges) {
      readyForClearanceByUserAccount {
        id
        commonName
      }
      readyForClearanceDts
      status
    }
  }
`);
