import { graphql } from 'gql/gen/gql';

graphql(/* GraphQL */ `
  fragment BasicsModelPlanInfoFields on ModelPlan {
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
`);

export default graphql(/* GraphQL */ `
  query GetModelPlanInfo($id: UUID!) {
    modelPlan(id: $id) {
      ...BasicsModelPlanInfoFields
    }
  }
`);
