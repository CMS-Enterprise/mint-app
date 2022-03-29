// Custom Tag component - alternative to Truss wrapper Tag
// More closely aligns with MINT design

import React from 'react';
import classnames from 'classnames';

import './index.scss';

interface TagProps {
  children: React.ReactNode;
}

export const Tag = ({
  children,
  className,
  ...spanProps
}: TagProps & JSX.IntrinsicElements['span']): React.ReactElement => {
  const style: React.CSSProperties = {};

  const tagClasses = classnames('mint-tag', className);

  return (
    <span
      data-testid="tag"
      className={tagClasses}
      style={{ ...style }}
      {...spanProps}
    >
      {children}
    </span>
  );
};

export default Tag;
