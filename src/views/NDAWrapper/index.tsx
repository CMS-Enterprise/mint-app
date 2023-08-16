import React, { useEffect } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

type NDAWrapperProps = {
  children: React.ReactNode;
};

const NDAWrapper = ({ children }: NDAWrapperProps) => {
  const { pathname, search } = useLocation();

  const history = useHistory();

  const user = useSelector((state: RootStateOrAny) => state.auth);

  useEffect(() => {
    if (user?.acceptedNDA && user?.acceptedNDA?.agreed === false) {
      history.push({
        pathname: '/pre-decisional-notice',
        state: {
          nextState:
            pathname !== '/pre-decisional-notice' && pathname + (search || '')
        }
      });
    }
  }, [history, pathname, search, user?.acceptedNDA]);

  return <>{children}</>;
};

export default NDAWrapper;
