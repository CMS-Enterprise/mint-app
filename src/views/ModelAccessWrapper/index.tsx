/**
 * Model Plan Collaborator Access Wrapper
 * Contol access to editor routes is user is not a collaborator on a model plan
 * Reroutes to readonly routes if not collaborator
 * MINT_ASSESSMENT_NONPROD and MINT_ASSESSMENT role is granted edit access to everything
 */

import React, { useEffect } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useGetIsCollaboratorQuery } from 'gql/gen/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { isUUID } from 'utils/modelPlan';
import { isAssessment, isMAC } from 'utils/user';

type ModelAccessWrapperProps = {
  children: React.ReactNode;
};

const ModelAccessWrapper = ({ children }: ModelAccessWrapperProps) => {
  const { pathname } = useLocation();
  const history = useHistory();
  const flags = useFlags();

  const modelID: string | undefined = pathname.split('/')[2];
  const validModelID: boolean = isUUID(modelID);

  // Get groups to check is user has MINT_ASSESSMENT_NONPROD or MINT_ASSESSMENT role
  // If so, has full access to both task-list and read-only
  const { groups } = useSelector((state: RootStateOrAny) => state.auth);

  // Checking if user's location is task-list or collaborators
  // Everything with a modelID and under the parent 'task-list' or 'collaborators' route is considered editable
  const editable: boolean =
    pathname.split('/')[3] === 'collaboration-area' ||
    pathname.split('/')[4] === 'documents' ||
    pathname.split('/')[4] === 'collaborators';

  const helpArticle: boolean = pathname.split('/')[1] === 'help-and-knowledge';

  const { data, loading } = useGetIsCollaboratorQuery({
    variables: {
      id: modelID
    },
    skip: !editable || isMAC(groups) || helpArticle
  });

  const isCollaborator: boolean = data?.modelPlan?.isCollaborator || false;

  // If not a collaborator/assessment team and attempting to access edit routes, reroute to readonly
  useEffect(() => {
    if (
      !isCollaborator &&
      !loading &&
      modelID &&
      validModelID &&
      editable &&
      !isAssessment(groups, flags)
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
    editable,
    groups,
    flags
  ]);

  return <>{children}</>;
};

export default ModelAccessWrapper;
