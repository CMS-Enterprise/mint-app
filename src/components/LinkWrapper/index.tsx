import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link as UswdsLink } from '@trussworks/react-uswds';
import classnames from 'classnames';

interface ToStateProps {
  [key: string]: string | number | null | boolean;
}

export interface LocationProps {
  pathname: string;
  state: ToStateProps;
  scrollElement?: string;
}

type UswdsReactLinkProps = {
  variant?: 'external' | 'unstyled' | 'nav';
  className?: string;
  to: string | LocationProps;
  target?: '_blank';
  rel?: 'noopener noreferrer';
  'data-testid'?: string;
  'aria-label'?: string;
  children?: React.ReactNode | string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
};

const UswdsReactLink = ({
  variant,
  className,
  to,
  target,
  rel,
  'data-testid': datatestid,
  'aria-label': ariaLabel,
  children,
  onClick
}: UswdsReactLinkProps) => {
  return (
    <UswdsLink
      to={to}
      data-testid={datatestid}
      target={target}
      rel={rel}
      variant={variant}
      asCustom={RouterLink}
      className={classnames(className)}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </UswdsLink>
  );
};

export default UswdsReactLink;
