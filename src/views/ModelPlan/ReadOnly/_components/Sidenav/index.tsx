import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { SideNav as TrussSideNav } from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { subComponentsProps } from '../..';
import FilterButton from '../FilterView/FilterButton';

import './index.scss';

interface SideNavProps {
  subComponents: subComponentsProps;
  isHelpArticle: boolean | undefined;
  solutionNavigation?: boolean;
  paramActive?: boolean;
  openFilterModal?: () => void;
}

const SideNav = ({
  subComponents,
  isHelpArticle,
  solutionNavigation,
  paramActive,
  openFilterModal
}: SideNavProps) => {
  const { t } = useTranslation('modelSummary');
  const { t: h } = useTranslation('helpAndKnowledge');

  const flags = useFlags();
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
      {!flags.hideGroupView && openFilterModal && (
        <div className="margin-bottom-4">
          <FilterButton openFilterModal={openFilterModal} />
        </div>
      )}
      <TrussSideNav items={subNavigationLinks} />
    </div>
  );
};

export default SideNav;
