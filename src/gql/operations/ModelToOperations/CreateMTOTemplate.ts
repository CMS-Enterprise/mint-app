import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateMTOTemplate($modelPlanID: UUID!, $templateID: UUID!) {
    createTemplateToMTO(modelPlanID: $modelPlanID, templateID: $templateID) {
      id
    }
  }
`);
