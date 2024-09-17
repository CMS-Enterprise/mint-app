import { gql } from '@apollo/client';

const ReadyForReviewUserFragment = gql(/* GraphQL */ `
  fragment ReadyForReviewUserFragment on UserAccount {
    id
    commonName
  }
`);

export default ReadyForReviewUserFragment;
