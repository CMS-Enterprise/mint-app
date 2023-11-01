import { graphql } from '../../gen/gql';

export default graphql(/* GraphQL */ `
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
        cmsOther
        cmmiGroups
      }
    }
  }
`);
