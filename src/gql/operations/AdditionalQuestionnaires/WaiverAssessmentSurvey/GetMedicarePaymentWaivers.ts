import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMedicarePaymentWaivers($id: UUID!) {
    modelPlan(id: $id) {
      id
      questionnaires {
        waiverAssessmentSurvey {
          id
          suggestedWaivers {
            id
            commonWaiverID
            commonWaiver {
              id
              name
              waiverType
            }
          }
          # Page 3 - Medicare payment waivers
          modifiesMedicareSavingsPrograms
          modifiesMedicareSavingsProgramsExample
          modifiesMedicareSavingsProgramsWhyNot
          bundlesPayments
          bundlesPaymentsExample
          bundlesPaymentsWhyNot
          offersRiskSharingArrangements
          offersRiskSharingArrangementsExample
          offersRiskSharingArrangementsWhyNot
        }
      }
    }
  }
`);
