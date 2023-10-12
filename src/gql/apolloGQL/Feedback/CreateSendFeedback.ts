import { graphql } from '../../gen/gql';

export default graphql(/* GraphQL */ `
  mutation CreatSendFeedback($input: SendFeedbackEmailInput!) {
    sendFeedbackEmail(input: $input)
  }
`);
