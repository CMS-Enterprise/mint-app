import { gql } from '@apollo/client';

const CommonWaiverFragment = gql(/* GraphQL */ `
  fragment CommonWaiver on CommonWaiver {
    id
    name
    waiverType
  }
`);

export default CommonWaiverFragment;
