import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { Button, SideNav as TrussSideNav } from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { subComponentsProps } from '../..';

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
  const { t: g } = useTranslation('generalReadOnly');

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

  const flags = useFlags();

  return (
    <div
      id="read-only-side-nav__wrapper"
      data-testid="read-only-side-nav__wrapper"
    >
      {!flags.hideGroupView && (
        <div className="bg-base-lightest padding-2 margin-bottom-4">
          <p className="margin-top-0 text-bold line-height-sans-5">
            {g('filterView.question')}
          </p>
          <Button type="button" onClick={openFilterModal}>
            {g('filterView.text')}
          </Button>
        </div>
      )}
      <TrussSideNav items={subNavigationLinks} />
    </div>
  );
};

export default SideNav;
