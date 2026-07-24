import React from 'react';
import classNames from 'classnames';

import './index.scss';

type PageWrapperProps = {
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const PageWrapper = ({ className, children, ...props }: PageWrapperProps) => {
  return (
    <div className={classNames('mint-page-wrapper', className)} {...props}>
      {children}
    </div>
  );
};

export default PageWrapper;
