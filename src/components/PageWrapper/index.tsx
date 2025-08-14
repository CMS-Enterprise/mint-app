import React from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';

import './index.scss';

type PageWrapperProps = {
  className?: string;
  children: React.ReactNode;
} & JSX.IntrinsicElements['div'];

const PageWrapper = ({ className, children, ...props }: PageWrapperProps) => {
  const { pathname } = useLocation();

  return (
    <div
      className={classNames('mint-page-wrapper', className, {
        'display-none': pathname === '/implicit/callback' // Hide the app/page wrapper on the implicit callback route
      })}
      {...props}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
