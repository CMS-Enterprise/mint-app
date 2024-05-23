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
    label: 'Solution ID',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    tableReference: 'operational_solution'
  },
  documentID: {
    gqlField: 'documentID',
    goField: 'documentID',
    dbField: 'document_id',
    label: 'Document ID',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    tableReference: 'plan_document'
  }
};

export default documentSolutionLink;
