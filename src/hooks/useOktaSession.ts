import { useEffect, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';

const useOktaSession = () => {
  const { oktaAuth } = useOktaAuth();

  const [hasSession, setHasSession] = useState<boolean | undefined>();

  // Check if user has an existing okta session, if so, sign them in autmatically when clicking 'Sign in'
  useEffect(() => {
    const checkSession = async () => {
      const sessionExists = await oktaAuth.session.exists();

      setHasSession(sessionExists);
    };

    checkSession();
  }, [oktaAuth]);

  return { hasSession, oktaAuth };
};

export default useOktaSession;
