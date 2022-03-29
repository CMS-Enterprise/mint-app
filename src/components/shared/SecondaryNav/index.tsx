import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classnames from 'classnames';

import './index.scss';

type SecondaryNavProps = {
  children: ReactNode;
};

const SecondaryNav = ({ children }: SecondaryNavProps) => {
  return (
    <nav aria-label="Secondary Navigation" className="mint-secondary-nav">
      <div className="grid-container">{children}</div>
    </nav>
  );
};

type NavLinkProps = {
  to: string;
  children: ReactNode;
};

const NavLink = ({ to, children }: NavLinkProps) => {
  const { pathname } = useLocation();

  const classNames = classnames('mint-secondary-nav__nav-link', {
    'mint-secondary-nav__nav-link--active': pathname === to
  });

  return (
    <Link to={to} className={classNames} aria-current={pathname === to}>
      {children}
    </Link>
  );
};

export { SecondaryNav, NavLink };
