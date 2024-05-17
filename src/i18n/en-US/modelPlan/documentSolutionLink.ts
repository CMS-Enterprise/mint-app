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
    formType: TranslationFormType.TEXT
  }
};

export default documentSolutionLink;
