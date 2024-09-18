/*
Context wrapper for getting basic model plan info from anywhere in the application
Alleviates prop drilling and over querying
*/

import React, { createContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  GetModelPlanBaseQuery,
  ModelStatus,
  useGetModelPlanBaseQuery
} from 'gql/generated/graphql';

import { isUUID } from 'utils/modelPlan';

type ModelInfoWrapperProps = {
  children: React.ReactNode;
};

type GetModelPlanBaseModelPlan = GetModelPlanBaseQuery['modelPlan'];

// Create the model Info context - can be used anywhere in a model plan
export const ModelInfoContext = createContext<GetModelPlanBaseModelPlan>({
  __typename: 'ModelPlan',
  id: '',
  modelName: '',
  modifiedDts: '',
  createdDts: '2024-01-01T00:00:00Z',
  status: ModelStatus.PLAN_DRAFT
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
    status: ModelStatus.PLAN_DRAFT
  });

  if (data) {
    // Sets the model plan ref info once fetched
    modelContextData.current = { ...data.modelPlan };
  }

  return (
    // The Provider gives access to the context to its children
    <ModelInfoContext.Provider value={modelContextData.current}>
      {children}
    </ModelInfoContext.Provider>
  );
};

export default ModelInfoWrapper;
