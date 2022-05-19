import { ModelStatus } from 'types/graphql-global-types';

type modelStatusType = {
  [MODEL_LEAD: string]: string;
};

const modelStatus: modelStatusType = ModelStatus;

export default modelStatus;
