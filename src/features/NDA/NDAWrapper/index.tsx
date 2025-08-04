import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

type NDAWrapperProps = {
  children: React.ReactNode;
};

const NDAWrapper = ({ children }: NDAWrapperProps) => {
  const { pathname, search } = useLocation();

  const navigate = useNavigate();

  const user = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (user?.acceptedNDA && user?.acceptedNDA?.agreed === false) {
      navigate('/pre-decisional-notice', {
        state: {
          nextState:
            pathname !== '/pre-decisional-notice' && pathname + (search || '')
        }
      });
    }
  }, [navigate, pathname, search, user?.acceptedNDA]);

  return <>{children}</>;
};

export default NDAWrapper;
