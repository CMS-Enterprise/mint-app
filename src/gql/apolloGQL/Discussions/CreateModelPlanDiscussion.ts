import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateModelPlanDiscussion($input: PlanDiscussionCreateInput!) {
    createPlanDiscussion(input: $input) {
      id
      content {
        rawContent
      }
      createdBy
      createdDts
    }
  }
`);
