import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreatSendFeedback($input: SendFeedbackEmailInput!) {
    sendFeedbackEmail(input: $input)
  }
`);
