import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppState } from 'stores/reducers/rootReducer';

type NDAWrapperProps = {
  children: React.ReactNode;
};

const NDAWrapper = ({ children }: NDAWrapperProps) => {
  const { pathname, search } = useLocation();

  const navigate = useNavigate();

  const user = useSelector((state: AppState) => state.auth);

  console.log('user', user);

  useEffect(() => {
    if (!user?.acceptedNDA?.agreed && user.isUserSet) {
      // Only redirect if we're not already on the pre-decisional-notice page
      if (pathname !== '/pre-decisional-notice') {
        navigate('/pre-decisional-notice', {
          state: {
            nextState: pathname + (search || '')
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, search, user?.acceptedNDA]);

  return <>{children}</>;
};

export default NDAWrapper;
