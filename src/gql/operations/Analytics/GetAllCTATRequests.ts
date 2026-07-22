import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetAllCTATRequests {
    ctatRequests {
      ctatRequests {
        createdDts
        status
        assignedAdminUserAccount {
          username
          givenName
          familyName
          commonName
          email
        }
        adminAssignedDts
        notes
        resolution
        requesterUserAccount {
          givenName
          familyName
          commonName
          email
        }
        cmmiGroup
        cmmiGroupOther
        cmmiDivision
        cmmiDivisionOther
        relatedMINTModels {
          id
          modelName
        }
        contractActivityType
        contractActivityTypeOther
        contractName
        contractNumber
        contractType
        contractTypeOther
        typeOfHelpNeeded
        typeOfHelpNeededOther
        describeHelpNeeded
        requestUrgency
        dateAssistanceNeededBy
        supportingDocuments {
          id
          fileName
        }
        completedDts
        daysFromSubmittedToCompleted
      }
    }
  }
`);
