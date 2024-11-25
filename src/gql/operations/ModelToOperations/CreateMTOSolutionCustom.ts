import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation NewMTOSolution(
    $modelPlanID: UUID!
    $solutionType: MTOSolutionType!
    $facilitatedBy: MTOFacilitator!
    $name: String!
    $pocName: String!
    $pocEmail: String!
  ) {
    createMTOSolutionCustom(
      modelPlanID: $modelPlanID
      solutionType: $solutionType
      facilitatedBy: $facilitatedBy
      name: $name
      pocName: $pocName
      pocEmail: $pocEmail
    ) {
      id
      name
      facilitatedBy
      status
      riskIndicator
      key
      type
      pocName
      pocEmail

      #Meta Data
      createdBy
      createdByUserAccount {
        id
        email
      }
      createdDts
      modifiedBy
      modifiedByUserAccount {
        id
        email
      }
      modifiedDts

      # Custom Resolvers
      #relatedMilestones {
      #  id
      #}
      addedFromSolutionLibrary
      commonSolution {
        name
      }
    }
  }
`);
