import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetBasics($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      abbreviation
      nameHistory(sort: DESC)
      basics {
        id
        demoCode
        amsModelID
        modelCategory
        additionalModelCategories
        cmsCenters
        cmmiGroups
      }
    }
  }
`);
