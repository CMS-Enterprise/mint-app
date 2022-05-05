import { ModelCategory } from 'types/graphql-global-types';

type modelCategoryType = {
  [MODEL_LEAD: string]: string;
};

const modelCategoryNum: modelCategoryType = ModelCategory;

export default modelCategoryNum;
