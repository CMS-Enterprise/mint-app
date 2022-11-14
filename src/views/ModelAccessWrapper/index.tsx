/**
 * Model Plan Collaborator Access Wrapper
 * Contol access to editor routes is user is not a collaborator on a model plan
 * Reroutes to readonly routes if not collaborator
 * MINT_ASSESSMENT_NONPROD role is granted edit access to everything
 */

import React, { useEffect } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import GetIsCollaborator from 'queries/Collaborators/GetIsCollaborator';
import {
  GetIsCollaborator as GetIsCollaboratorType,
  GetIsCollaboratorVariables
} from 'queries/Collaborators/types/GetIsCollaborator';
import { isUUID } from 'utils/modelPlan';
import { isAssessment } from 'utils/user';

type ModelAccessWrapperProps = {
  children: React.ReactNode;
};

const ModelAccessWrapper = ({ children }: ModelAccessWrapperProps) => {
  const { pathname } = useLocation();
  const history = useHistory();

  const modelID: string | undefined = pathname.split('/')[2];
  const validModelID: boolean = isUUID(modelID);

  // Get groups to check is user has MINT_ASSESSMENT_NONPROD role
  // If so, has full access to both task-list and read-only
  const { groups } = useSelector((state: RootStateOrAny) => state.auth);

  // Checking if user's location is readonly
  // Everything with a modelID and not under the parent 'read-only' route is considered editable
  const readOnly: boolean = pathname.split('/')[3] === 'read-only';

  const { data, loading } = useQuery<
    GetIsCollaboratorType,
    GetIsCollaboratorVariables
  >(GetIsCollaborator, {
    variables: {
      id: modelID
    }
  });

  const isCollaborator: boolean = data?.modelPlan?.isCollaborator || false;

  // If not a collaborator/assessment team and attempting to access edit routes, reroute to readonly
  useEffect(() => {
    if (
      !isCollaborator &&
      !loading &&
      modelID &&
      validModelID &&
      !readOnly &&
      !isAssessment(groups)
    ) {
      history.replace(`/models/${modelID}/read-only/model-basics`);
    }
  }, [
    pathname,
    history,
    isCollaborator,
    loading,
    modelID,
    validModelID,
    readOnly,
    groups
  ]);

  return <>{children}</>;
};

export default ModelAccessWrapper;
