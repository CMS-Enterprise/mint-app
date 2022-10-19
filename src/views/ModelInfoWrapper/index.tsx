/*
Context wrapper for getting basic model plan info from anywhere in the application
Alleviates prop drilling and over querying
*/

import React, { createContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import GetModelPlanBase from 'queries/GetModelPlanBase';
import { GetModelPlanBase_modelPlan as GetModelPlanBaseModelPlan } from 'queries/types/GetModelPlanBase';
import { ModelStatus } from 'types/graphql-global-types';
import { isUUID } from 'utils/modelPlan';

type ModelInfoWrapperProps = {
  children: React.ReactNode;
};

// Create the model Info context - can be used anywhere in a model plan
export const ModelInfoContext = createContext<GetModelPlanBaseModelPlan>({
  __typename: 'ModelPlan',
  id: '',
  modelName: '',
  modifiedDts: '',
  status: ModelStatus.PLAN_DRAFT
});

const ModelInfoWrapper = ({ children }: ModelInfoWrapperProps) => {
  // Gets the model plan id from any location within the application
  const { pathname } = useLocation();
  const modelID: string | undefined = pathname.split('/')[2];
  const validModelID: boolean = isUUID(modelID);

  const { data } = useQuery(GetModelPlanBase, {
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
    status: ModelStatus.PLAN_DRAFT
  });

  if (data) {
    // Sets the initial lock statuses once useLazyQuery data is fetched
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
