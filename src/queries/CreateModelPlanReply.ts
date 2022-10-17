import { gql } from '@apollo/client';

export default gql`
  mutation CreateModelPlanReply($input: DiscussionReplyCreateInput!) {
    createDiscussionReply(input: $input) {
      id
      discussionID
      content
      resolution
      createdBy
      createdDts
    }
  }
`;
