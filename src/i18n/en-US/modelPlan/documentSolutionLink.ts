import { TranslationDocumentSolutionLink } from 'types/translation';

import {
  TableName,
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
    tableReference: TableName.OPERATIONAL_SOLUTION
  },
  documentID: {
    gqlField: 'documentID',
    goField: 'documentID',
    dbField: 'document_id',
    label: 'Document',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.02,
    tableReference: TableName.PLAN_DOCUMENT
  }
};

export default documentSolutionLink;
