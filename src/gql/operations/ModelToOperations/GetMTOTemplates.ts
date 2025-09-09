import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOTemplates($keys: [MTO_TEMPLATE_KEY!]) {
    mtoTemplates(keys: $keys) {
      id
      name
      key
      description
      categoryCount
      milestoneCount
      solutionCount
      categories {
        id
        templateID
        name
        parentID
        order
      }
    }
  }
`);
