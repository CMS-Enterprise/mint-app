import { TranslationMTOMilestoneSolutionLinkCustom } from 'types/translation';

import {
  TableName,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

export const mtoMilestoneSolutionLink: TranslationMTOMilestoneSolutionLinkCustom =
  {
    milestoneID: {
      gqlField: 'milestoneID',
      goField: 'MilestoneID',
      dbField: 'milestone_id',
      label: 'Milestone',
      dataType: TranslationDataType.UUID,
      formType: TranslationFormType.TEXT,
      order: 1.0,
      tableReference: TableName.MTO_MILESTONE
    },
    solutionID: {
      gqlField: 'solutionID',
      goField: 'SolutionID',
      dbField: 'solution_id',
      label: 'Solution',
      dataType: TranslationDataType.UUID,
      formType: TranslationFormType.TEXT,
      order: 1.01,
      tableReference: TableName.MTO_SOLUTION
    }
  };

export default mtoMilestoneSolutionLink;
