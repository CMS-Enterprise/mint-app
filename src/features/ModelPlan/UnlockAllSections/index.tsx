import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { useUnlockAllSectionsMutation } from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import Alert from 'components/Alert';
import { isAssessment } from 'utils/user';

const UnlockAllSections = () => {
  const flags = useFlags();
  const history = useHistory();
  const { authState } = useOktaAuth();
  const hasEditAccess: boolean = isAssessment(
    // @ts-ignore
    authState?.accessToken?.claims['mint-groups'] || [],
    flags
  );

  const { modelID } = useParams<{ modelID: string }>();

  const [unlockAllSections] = useUnlockAllSectionsMutation();

  const [showAlert, setShowAlert] = React.useState<boolean | null>(null);

  useEffect(() => {
    if (!hasEditAccess) {
      history.push(`/models/${modelID}/collaboration-area`);
    } else {
      unlockAllSections({ variables: { modelPlanID: modelID } })
        .then(res => {
          if (!res.errors) {
            history.push(`/models/${modelID}/collaboration-area`);
          } else {
            console.log('Error unlocking sections:', res.errors);
          }
        })
        .catch(error => {
          console.log(error);
          setShowAlert(true);
        });
    }
  }, [hasEditAccess, history, modelID, unlockAllSections, setShowAlert]);

  return <>{showAlert && <Alert type="warning">Unlock failed</Alert>}</>;
};

export default UnlockAllSections;
