import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOTemplates($keys: [MTOTemplateKey!]) {
    mtoTemplates(keys: $keys) {
      id
      name
      key
      isAdded
      description
      categoryCount
      milestoneCount
      solutionCount
      primaryCategoryCount
      categories {
        id
        templateID
        name
        order
        subCategories {
          id
          templateID
          name
          order
          milestones {
            id
            templateID
            name
            solutions {
              id
              templateID
              name
            }
          }
        }
      }
    }
  }
`);
