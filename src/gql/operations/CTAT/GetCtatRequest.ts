import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCtatRequest($id: UUID!) {
    ctatRequest(id: $id) {
      id
      humanReadableID
      createdDts
      status
      assignedAdminUserAccount {
        username
        givenName
        familyName
        commonName
        email
      }
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
        fileType
        url
        downloadUrl
        virusScanned
        virusClean
      }
    }
  }
`);
