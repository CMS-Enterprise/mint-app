import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query getMedicarePaymentWaivers($id: UUID!) {
    modelPlan(id: $id) {
      id
      questionnaires {
        waiverAssessmentSurvey {
          id
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
