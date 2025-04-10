import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOSolution($id: UUID!) {
    mtoSolution(id: $id) {
      id
      name
      key
      facilitatedBy
      neededBy
      status
      riskIndicator
      addedFromSolutionLibrary
      pocName
      pocEmail
      type
      milestones {
        id
        name
        key
        status
        riskIndicator
        commonMilestone {
          name
          key
          isAdded
        }
      }
    }
  }
`);
