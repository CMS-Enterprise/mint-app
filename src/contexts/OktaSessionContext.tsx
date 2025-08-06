import React, { createContext, useContext, useEffect, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';

interface OktaSessionContextType {
  hasSession: boolean | undefined;
  isLoading: boolean;
}

const OktaSessionContext = createContext<OktaSessionContextType>({
  hasSession: undefined,
  isLoading: true
});

export const useOktaSession = () => {
  const context = useContext(OktaSessionContext);
  if (!context) {
    throw new Error('useOktaSession must be used within a OktaSessionProvider');
  }
  return context;
};

interface OktaSessionProviderProps {
  children: React.ReactNode;
}

export const OktaSessionProvider = ({ children }: OktaSessionProviderProps) => {
  const oktaAuthContext = useOktaAuth();
  const [hasSession, setHasSession] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      // Wait for oktaAuth to be available
      if (!oktaAuthContext?.oktaAuth) {
        return;
      }

      // Only check if we haven't already checked
      if (hasSession !== undefined) {
        return;
      }

      try {
        const sessionExists = await oktaAuthContext.oktaAuth.session?.exists();
        setHasSession(sessionExists);
      } catch (error) {
        setHasSession(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [oktaAuthContext?.oktaAuth, hasSession]);

  // If Okta context is not available, provide default values
  if (!oktaAuthContext) {
    return (
      <OktaSessionContext.Provider
        value={{ hasSession: false, isLoading: false }}
      >
        {children}
      </OktaSessionContext.Provider>
    );
  }

  return (
    <OktaSessionContext.Provider value={{ hasSession, isLoading }}>
      {children}
    </OktaSessionContext.Provider>
  );
};
