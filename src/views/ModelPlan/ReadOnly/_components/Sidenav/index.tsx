import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { SideNav as TrussSideNav } from '@trussworks/react-uswds';

import './index.scss';

interface SideNavProps {
  modelID: string;
}

interface sideNavItemsProps {
  [key: string]: string;
}

const SideNav = ({ modelID }: SideNavProps) => {
  const { t } = useTranslation('modelSummary');

  const sideNavItems: sideNavItemsProps = {
    modelBasics: `/models/${modelID}/read-only/`,
    generalCharacteristics: `/models/${modelID}/read-only/general-characteristics`,
    participantsAndProviders: `/models/${modelID}/read-only/participants-and-providers`,
    beneficiaries: `/models/${modelID}/read-only/beneficiaries`,
    operationsEvaluationAndLearning: `/models/${modelID}/read-only/operations-evaluation-and-learning`,
    payment: `/models/${modelID}/read-only/payment`,
    itTools: `/models/${modelID}/read-only/it-tools`,
    team: `/models/${modelID}/read-only/team`,
    discussions: `/models/${modelID}/read-only/discussions`,
    documents: `/models/${modelID}/read-only/documents`,
    crsAndTdls: `/models/${modelID}/read-only/crs-and-tdl`
  };

  // Mapping of all sub navigation links
  const subNavigationLinks: React.ReactNode[] = Object.keys(sideNavItems).map(
    (key: string) => (
      <NavLink
        to={sideNavItems[key]}
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
