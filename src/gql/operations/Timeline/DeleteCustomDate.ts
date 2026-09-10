import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation DeleteCustomDate($id: UUID!) {
    deleteCustomTimelineDate(id: $id) {
      id
      title
      description
      dateType
      startDate
      endDate
    }
  }
`);
