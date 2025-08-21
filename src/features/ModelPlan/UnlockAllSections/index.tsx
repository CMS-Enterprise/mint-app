import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { Button, GridContainer } from '@trussworks/react-uswds';
import { useUnlockAllSectionsMutation } from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import MainContent from 'components/MainContent';
import toastSuccess from 'components/ToastSuccess';
import { useErrorMessage } from 'contexts/ErrorContext';
import { isAssessment } from 'utils/user';

const UnlockAllSections = () => {
  const { t } = useTranslation('general');
  const flags = useFlags();
  const navigate = useNavigate();

  const { modelID = '' } = useParams<{ modelID: string }>();

  const { setErrorMeta } = useErrorMessage();

  // Check if user is assessment
  const { authState } = useOktaAuth();
  const hasEditAccess: boolean = isAssessment(
    // @ts-ignore
    authState?.groups || authState?.accessToken?.claims['mint-groups'] || [],
    flags
  );

  const [unlockAllSections] = useUnlockAllSectionsMutation();

  const unlockAllSectionsHandler = () => {
    setErrorMeta({
      overrideMessage: t('unlockFailed')
    });

    unlockAllSections({ variables: { modelPlanID: modelID } }).then(res => {
      if (!res.errors) {
        navigate(`/models/${modelID}/collaboration-area`);
        toastSuccess(t('successfullyUnlock'));
      }
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
        <Button type="button" onClick={() => unlockAllSectionsHandler()}>
          {t('unlockAllSections')}
        </Button>
      </GridContainer>
    </MainContent>
  );
};

export default UnlockAllSections;
