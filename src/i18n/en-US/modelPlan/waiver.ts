import { TranslationWaiver } from 'types/translation';

import {
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

// Change History purposes only. These fields are stored on the waiver table,
// while the rest of the questionnaire fields are stored on waiver_assessment_survey.
const waiver: TranslationWaiver = {
  willUseWaiver: {
    gqlField: 'willUseWaiver',
    goField: 'WillUseWaiver',
    dbField: 'will_use_waiver',
    label: 'Do you plan to use this waiver with your model?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 1,
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  usingReason: {
    gqlField: 'usingReason',
    goField: 'UsingReason',
    dbField: 'using_reason',
    label: 'Please explain why your model intends to use this waiver',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.1
  },
  notUsingReason: {
    gqlField: 'notUsingReason',
    goField: 'NotUsingReason',
    dbField: 'not_using_reason',
    label: 'Please explain why your model is not using this waiver.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.2
  }
};

export default waiver;
