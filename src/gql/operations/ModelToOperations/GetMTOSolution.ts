import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOSolution($id: UUID!) {
    mtoSolution(id: $id) {
      id
      name
      key
      facilitatedBy
      facilitatedByOther
      neededBy
      status
      riskIndicator
      addedFromSolutionLibrary
      pocName
      pocEmail
      type
      milestones {
        id
        mtoCommonMilestoneID
        name
        status
        riskIndicator
        commonMilestone {
          id
          name
          isAdded
        }
      }
    }
  }
`);
