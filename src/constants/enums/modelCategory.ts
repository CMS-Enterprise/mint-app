import { ModelCategory } from 'types/graphql-global-types';

type modelCategoryType = {
  [MODEL_LEAD: string]: string;
};

const modelCategory: modelCategoryType = ModelCategory;

export default modelCategory;
