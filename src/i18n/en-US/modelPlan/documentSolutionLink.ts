import { TranslationDocumentSolutionLink } from 'types/translation';

import {
  TranslationDataType,
  TranslationFormType
} from '../../../gql/gen/graphql';

export const documentSolutionLink: TranslationDocumentSolutionLink = {
  solutionID: {
    gqlField: 'solutionID',
    goField: 'SolutionID',
    dbField: 'solution_id',
    label: 'Solution',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.01,
    tableReference: 'operational_solution'
  },
  documentID: {
    gqlField: 'documentID',
    goField: 'documentID',
    dbField: 'document_id',
    label: 'Document',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.02,
    tableReference: 'plan_document'
  }
};

export default documentSolutionLink;
