import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { SideNav as TrussSideNav } from '@trussworks/react-uswds';

import { subComponentsProps } from '../..';

import './index.scss';

interface SideNavProps {
  subComponents: subComponentsProps;
  isHelpArticle: boolean | undefined;
}

const SideNav = ({ subComponents, isHelpArticle }: SideNavProps) => {
  const { t } = useTranslation('modelSummary');

  const subComponentsList = isHelpArticle
    ? Object.keys(subComponents).filter(key => key !== 'discussions')
    : Object.keys(subComponents);

  // Mapping of all sub navigation links
  const subNavigationLinks: React.ReactNode[] = subComponentsList.map(
    (key: string) => (
      <NavLink
        to={
          !isHelpArticle
            ? subComponents[key].route
            : subComponents[key].helpRoute
        }
        key={key}
        activeClassName="usa-current"
        className={key === 'it-tools' ? 'nav-group-border' : ''}
      >
        {t(`navigation.${key}`)}
      </NavLink>
    )
  );

  return (
    <div
      id="read-only-side-nav__wrapper"
      data-testid="read-only-side-nav__wrapper"
    >
      <TrussSideNav items={subNavigationLinks} />
    </div>
  );
};

export default SideNav;
