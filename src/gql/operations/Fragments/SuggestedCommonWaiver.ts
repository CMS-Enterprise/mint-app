import { gql } from '@apollo/client';

const SuggestedCommonWaiverFragment = gql(/* GraphQL */ `
  fragment SuggestedCommonWaiver on CommonWaiver {
    id
    name
    waiverType
  }
`);

export default SuggestedCommonWaiverFragment;
