import { graphql } from '../../gen/gql';

export default graphql(/* GraphQL */ `
  mutation CreatReportAProblem($input: ReportAProblemInput!) {
    reportAProblem(input: $input)
  }
`);
