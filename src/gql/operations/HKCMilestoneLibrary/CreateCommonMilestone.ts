import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation createMTOCommonMilestone(
    $name: String!
    $description: String!
    $categoryName: String!
    $subCategoryName: String
    $facilitatedByRole: [MTOFacilitator!]!
    $facilitatedByOther: String
    $mtoCommonSolutionKeys: [MTOCommonSolutionKey!]!
  ) {
    createMTOCommonMilestone(
      name: $name
      description: $description
      categoryName: $categoryName
      subCategoryName: $subCategoryName
      facilitatedByRole: $facilitatedByRole
      facilitatedByOther: $facilitatedByOther
      mtoCommonSolutionKeys: $mtoCommonSolutionKeys
    ) {
      id
      name
      description
      categoryName
      subCategoryName
      facilitatedByRole
      facilitatedByOther
      commonSolutions {
        key
      }
    }
  }
`);
