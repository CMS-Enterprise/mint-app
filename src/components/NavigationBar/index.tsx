import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { PrimaryNav } from '@trussworks/react-uswds';

import './index.scss';

export type NavigationProps = {
  mobile?: boolean;
  signout: () => void;
  toggle: (active: boolean) => void;
  userName?: string;
};

export const navLinks = () => [
  {
    link: '/',
    label: 'home'
  },
  {
    link: '/models',
    label: 'models'
  },
  {
    link: '/help',
    label: 'help'
  }
];

const NavigationBar = ({
  mobile,
  signout,
  toggle,
  userName
}: NavigationProps) => {
  const { t } = useTranslation();

  const primaryLinks = navLinks().map(route => (
    <div className="easi-nav" key={route.label}>
      <NavLink
        to={route.link}
        activeClassName="usa-current"
        className="easi-nav__link"
        onClick={() => toggle(false)}
        exact={route.link === '/'}
      >
        <em
          className="usa-logo__text easi-nav__label"
          aria-label={t(`header:${route.label}`)}
        >
          {t(`header:${route.label}`)}
        </em>
      </NavLink>
    </div>
  ));

  const userLinks = (
    <div className="easi-nav__signout-container">
      <div className="easi-nav__user margin-bottom-1">{userName}</div>
      <NavLink
        to="/"
        onClick={e => {
          e.preventDefault();
          signout();
        }}
        className="signout-link"
      >
        <em
          className="usa-logo__text text-underline"
          aria-label={t('header:signOut')}
        >
          {t('header:signOut')}
        </em>
      </NavLink>
    </div>
  );

  const navItems = mobile ? primaryLinks.concat(userLinks) : primaryLinks;

  return (
    <nav
      aria-label={t('header:navigation')}
      data-testid="navigation-bar"
      className="border-top-light"
    >
      <div className="grid-container">
        <PrimaryNav
          onClick={() => toggle(false)}
          mobileExpanded={mobile}
          aria-label="Primary navigation"
          items={navItems}
        />
      </div>
    </nav>
  );
};

export default NavigationBar;
