import {
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

const modelFollowerUpdate = {
  content: {
    gqlField: 'content',
    goField: 'Content',
    dbField: 'content',
    label: 'Model update message',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.0
  }
};

export default modelFollowerUpdate;
