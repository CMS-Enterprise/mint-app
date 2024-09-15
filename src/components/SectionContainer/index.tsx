import React, { ReactNode } from 'react';
import classnames from 'classnames';

import './index.scss';

type SectionWrapperProps = {
  className?: string;
  children?: ReactNode;
  border?: boolean;
  borderBottom?: boolean;
  borderTop?: boolean;
  id?: string;
};

const SectionWrapper = ({
  className,
  children,
  border,
  borderBottom,
  borderTop,
  id
}: SectionWrapperProps) => {
  const classNames = classnames(
    'mint-section',
    {
      'mint-section__border': border,
      'mint-section__border-bottom': borderBottom,
      'mint-section__border-top': borderTop
    },
    className
  );
  return (
    <div data-testid="section-wrapper" className={classNames} id={id}>
      {children}
    </div>
  );
};

export default SectionWrapper;
