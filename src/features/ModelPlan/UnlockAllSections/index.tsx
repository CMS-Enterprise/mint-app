import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { Button, GridContainer } from '@trussworks/react-uswds';
import { useUnlockAllSectionsMutation } from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import Alert from 'components/Alert';
import MainContent from 'components/MainContent';
import useMessage from 'hooks/useMessage';
import { isAssessment } from 'utils/user';

const UnlockAllSections = () => {
  const { t } = useTranslation('general');
  const flags = useFlags();
  const navigate = useNavigate();
  const { showMessageOnNextPage } = useMessage();

  const { modelID = '' } = useParams<{ modelID: string }>();

  const [showAlert, setShowAlert] = useState<boolean | null>(null);

  // Check if user is assessment
  const { authState } = useOktaAuth();
  const hasEditAccess: boolean = isAssessment(
    // @ts-ignore
    authState?.groups || authState?.accessToken?.claims['mint-groups'] || [],
    flags
  );

  const [unlockAllSections] = useUnlockAllSectionsMutation();

  const unlockAllSectionsHandler = () => {
    unlockAllSections({ variables: { modelPlanID: modelID } })
      .then(res => {
        if (!res.errors) {
          navigate(`/models/${modelID}/collaboration-area`);
          showMessageOnNextPage(t('successfullyUnlock'));
        } else {
          setShowAlert(true);
        }
      })
      .catch(error => {
        setShowAlert(true);
      });
  };

  useEffect(() => {
    if (!hasEditAccess) {
      navigate(`/models/${modelID}/collaboration-area`);
    }
  }, [hasEditAccess, navigate, modelID]);

  return (
    <MainContent>
      <GridContainer className="padding-top-4">
        {showAlert && <Alert type="warning">{t('unlockFailed')}</Alert>}

        <Button type="button" onClick={() => unlockAllSectionsHandler()}>
          {t('unlockAllSections')}
        </Button>
      </GridContainer>
    </MainContent>
  );
};

export default UnlockAllSections;
