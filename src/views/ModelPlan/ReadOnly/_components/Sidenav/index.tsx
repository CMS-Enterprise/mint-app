import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { SideNav as TrussSideNav } from '@trussworks/react-uswds';

import { subComponentsProps } from '../..';

import './index.scss';

interface SideNavProps {
  subComponents: subComponentsProps;
  isHelpArticle: boolean | undefined;
  solutionNavigation?: boolean;
  paramActive?: boolean;
}

const SideNav = ({
  subComponents,
  isHelpArticle,
  solutionNavigation,
  paramActive
}: SideNavProps) => {
  const { t } = useTranslation('modelSummary');
  const { t: h } = useTranslation('helpAndKnowledge');

  const translationKey = solutionNavigation ? h : t;

  // Mapping of all sub navigation links
  const subNavigationLinks: React.ReactNode[] = Object.keys(subComponents).map(
    (key: string) => (
      <NavLink
        to={
          !isHelpArticle
            ? subComponents[key].route
            : subComponents[key].helpRoute
        }
        key={key}
        isActive={(_, location) => {
          const params = new URLSearchParams(location.search);
          const section = params.get('section');
          return paramActive
            ? section === key
            : location.pathname.split('/')[4] === key;
        }}
        activeClassName="usa-current"
        className={key === 'it-solutions' ? 'nav-group-border' : ''}
      >
        {translationKey(`navigation.${key}`)}
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
