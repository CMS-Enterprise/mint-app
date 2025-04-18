/*
Context wrapper for getting basic model plan info from anywhere in the application
Alleviates prop drilling and over querying
*/

import React, { createContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  GetModelPlanBaseQuery,
  ModelStatus,
  MtoStatus,
  useGetModelPlanBaseQuery
} from 'gql/generated/graphql';

import { isUUID } from 'utils/modelPlan';

type ModelInfoWrapperProps = {
  children: React.ReactNode;
};

type GetModelPlanBaseModelPlan = Omit<
  GetModelPlanBaseQuery['modelPlan'],
  'mtoMatrix'
> & {
  isMTOStarted: boolean;
};

// Create the model Info context - can be used anywhere in a model plan
export const ModelInfoContext = createContext<GetModelPlanBaseModelPlan>({
  __typename: 'ModelPlan',
  id: '',
  modelName: '',
  modifiedDts: '',
  createdDts: '2024-01-01T00:00:00Z',
  status: ModelStatus.PLAN_DRAFT,
  isMTOStarted: false
});

const ModelInfoWrapper = ({ children }: ModelInfoWrapperProps) => {
  // Gets the model plan id from any location within the application
  const { pathname } = useLocation();
  const modelID: string | undefined = pathname.split('/')[2];
  const validModelID: boolean = isUUID(modelID);

  // Fetches model plan info on change of valid modelID
  const { data } = useGetModelPlanBaseQuery({
    variables: {
      id: modelID
    },
    skip: !validModelID
  });

  // // The value that will be given to the context
  const modelContextData = useRef<GetModelPlanBaseModelPlan>({
    __typename: 'ModelPlan',
    id: '',
    modelName: '',
    modifiedDts: '',
    createdDts: '2024-01-01T00:00:00Z',
    status: ModelStatus.PLAN_DRAFT,
    isMTOStarted: false
  });

  if (data) {
    // If data is fetched, check if the MTO is started
    const isMTOStarted = data.modelPlan.mtoMatrix?.status !== MtoStatus.READY;

    const { mtoMatrix, ...modelData } = data.modelPlan;

    const modelWithMTOStarted = { ...modelData, isMTOStarted };

    // Sets the model plan ref info once fetched
    modelContextData.current = modelWithMTOStarted;
  } else {
    // If no data is fetched, set the model plan ref info to default
    modelContextData.current = {
      __typename: 'ModelPlan',
      id: '',
      modelName: '',
      modifiedDts: '',
      createdDts: '2024-01-01T00:00:00Z',
      status: ModelStatus.PLAN_DRAFT,
      isMTOStarted: false
    };
  }

  return (
    // The Provider gives access to the context to its children
    <ModelInfoContext.Provider value={modelContextData.current}>
      {children}
    </ModelInfoContext.Provider>
  );
};

export default ModelInfoWrapper;
