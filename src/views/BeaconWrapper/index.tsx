import React, { ReactNode, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { useFlags } from 'launchdarkly-react-client-sdk';

const BEACON_ID = import.meta.env.VITE_BEACON_ID;

// BeaconWrapper manages the state necessary for child components to
// use the useBeacon hook.
const BeaconWrapper = ({ children }: { children: ReactNode }) => {
  const [beaconInitialized, setBeaconInitialized] = React.useState(false);
  const { authState } = useOktaAuth();
  const flags = useFlags();

  // Initialize / destroy the beacon based on authentication state
  useEffect(() => {
    const shouldShowBeacon =
      authState?.isAuthenticated && flags?.helpScoutEnabled;
    if (shouldShowBeacon && !beaconInitialized) {
      window.Beacon('init', BEACON_ID);
      setBeaconInitialized(true);

      // Only identify if we have the information to do so
      const name = authState?.idToken?.claims?.name;
      const email = authState?.idToken?.claims?.email;
      if (name && email) {
        window.Beacon('identify', {
          name,
          email
        });
      }
    } else if (!shouldShowBeacon && beaconInitialized) {
      window.Beacon('destroy');
      setBeaconInitialized(false);
    }
  }, [
    authState?.isAuthenticated,
    authState?.idToken?.claims?.name,
    authState?.idToken?.claims?.email,
    flags?.helpScoutEnabled,
    beaconInitialized
  ]);

  return <>{children}</>;
};

export default BeaconWrapper;
