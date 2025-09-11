import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateMTOTemplate($modelPlanID: UUID!, $id: UUID!) {
    applyTemplateToMto(modelPlanID: $modelPlanID, id: $id) {
      templateID
    }
  }
`);
