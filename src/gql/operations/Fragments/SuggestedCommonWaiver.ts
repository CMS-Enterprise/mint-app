import { gql } from '@apollo/client';

const SuggestedCommonWaiverFragment = gql(/* GraphQL */ `
  fragment SuggestedCommonWaiverFragment on CommonWaiver {
    id
    name
    waiverType
  }
`);

export default SuggestedCommonWaiverFragment;
