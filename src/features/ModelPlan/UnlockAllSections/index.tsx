import React, { useEffect } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useUnlockAllSectionsMutation } from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import Alert from 'components/Alert';
import { isAssessment } from 'utils/user';

const UnlockAllSections = () => {
  const flags = useFlags();
  const history = useHistory();
  const { groups } = useSelector((state: RootStateOrAny) => state.auth);
  const hasEditAccess: boolean = isAssessment(groups, flags);

  const { modelID } = useParams<{ modelID: string }>();

  const [unlockAllSections] = useUnlockAllSectionsMutation();

  const [showAlert, setShowAlert] = React.useState<boolean>(false);

  useEffect(() => {
    if (!hasEditAccess) {
      history.push(`/models/${modelID}/collaboration-area`);
    } else {
      unlockAllSections({ variables: { modelPlanID: modelID } })
        .then(() => {
          history.push(`/models/${modelID}/collaboration-area`);
        })
        .catch(error => {
          setShowAlert(true);
        });
    }
  }, [hasEditAccess, history, modelID, unlockAllSections, setShowAlert]);

  return <>{showAlert && <Alert type="warning">Unlock failed</Alert>}</>;
};

export default UnlockAllSections;
