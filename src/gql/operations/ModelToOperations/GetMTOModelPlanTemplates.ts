import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOModelPlanTemplates($id: UUID!) {
    modelPlan(id: $id) {
      id
      mtoMatrix {
        # Used to cache the mto matrix - always include
        info {
          id
        }
        templates {
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
    }
  }
`);
