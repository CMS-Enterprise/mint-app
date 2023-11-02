import { graphql } from '../../gen/gql';

const ReadyForReviewUserFragment = graphql(/* GraphQL */ `
  fragment ReadyForReviewUserFragment on UserAccount {
    id
    commonName
  }
`);

export default ReadyForReviewUserFragment;
