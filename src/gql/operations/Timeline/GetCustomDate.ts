import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCustomDate($id: UUID!) {
    customTimelineDate(id: $id) {
      id
      title
      description
      dateType
      startDate
      endDate
    }
  }
`);
