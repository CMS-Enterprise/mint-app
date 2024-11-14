import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation NewMTOCategory {
    createMTOCategory(modelPlanID: "{{modelPlanID}}", name: "{{name}}") {
      id
      name
      isUncategorized
    }
  }
`);
