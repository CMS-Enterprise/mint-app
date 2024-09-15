import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreatReportAProblem($input: ReportAProblemInput!) {
    reportAProblem(input: $input)
  }
`);
