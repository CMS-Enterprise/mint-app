import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation SendModelFollowerUpdate($modelPlanID: UUID!, $content: String!) {
    sendModelFollowerUpdate(modelPlanID: $modelPlanID, content: $content) {
      id
      modelPlanID
      content
    }
  }
`);
