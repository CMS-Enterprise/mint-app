import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { SideNav as TrussSideNav } from '@trussworks/react-uswds';

import { subComponentsProps } from '../..';

import './index.scss';

interface SideNavProps {
  subComponents: subComponentsProps;
}

const SideNav = ({ subComponents }: SideNavProps) => {
  const { t } = useTranslation('modelSummary');

  // Mapping of all sub navigation links
  const subNavigationLinks: React.ReactNode[] = Object.keys(subComponents).map(
    (key: string) => (
      <NavLink
        to={subComponents[key].route}
        key={key}
        activeClassName="usa-current"
        className={key === 'itTools' ? 'nav-group-border' : ''}
      >
        {t(`navigation.${key}`)}
      </NavLink>
    )
  );

  return (
    <div id="read-only-side-nav__wrapper">
      <TrussSideNav items={subNavigationLinks} />
    </div>
  );
};

export default SideNav;
