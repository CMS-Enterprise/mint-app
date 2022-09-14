import React, { useEffect } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

type NDAWrapperProps = {
  children: React.ReactNode;
};

const NDAWrapper = ({ children }: NDAWrapperProps) => {
  const { pathname } = useLocation();
  const history = useHistory();

  const user = useSelector((state: RootStateOrAny) => state.auth);

  useEffect(() => {
    if (user?.acceptedNDA && user?.acceptedNDA?.agreed === false) {
      history.push('/pre-decisional-notice');
    }
  }, [pathname, history, user?.acceptedNDA]);

  return <>{children}</>;
};

export default NDAWrapper;
