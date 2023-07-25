import { graphql } from 'gql';

export default graphql(/* GraphQL */ `
  mutation GetWeekFromNow($date: Date!) {
    oneWeekFromNow(date: $date)
  }
`);
