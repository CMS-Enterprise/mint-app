import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { SideNav } from '@trussworks/react-uswds';

import './index.scss';

type sideNavItemProps = {
  groupEnd?: boolean; // Value used to designate end of sidenav subgrouping / border-bottom
  component?: React.ReactNode;
  route: string;
  componentId?: string;
};

interface sideNavProps {
  [key: string]: sideNavItemProps;
}
interface ReadOnlySideNavProps {
  modelID: string;
}

const ReadOnlySideNav = ({ modelID }: ReadOnlySideNavProps) => {
  const { t } = useTranslation('modelSummary');

  const sideNavItems: sideNavProps = {
    modelBasics: {
      route: `/models/${modelID}/read-only/`
    },
    generalCharacteristics: {
      route: `/models/${modelID}/read-only/general-characteristics`
    },
    participantsAndProviders: {
      route: `/models/${modelID}/read-only/participants-and-providers`
    },
    beneficiaries: {
      route: `/models/${modelID}/read-only/beneficiaries`
    },
    operationsEvaluationAndLearning: {
      route: `/models/${modelID}/read-only/operations-evaluation-and-learning`
    },
    payment: {
      route: `/models/${modelID}/read-only/payment`
    },
    itTools: {
      groupEnd: true,
      route: `/models/${modelID}/read-only/it-tools`
    },
    team: {
      route: `/models/${modelID}/read-only/team`
    },
    discussions: {
      route: `/models/${modelID}/read-only/discussions`
    },
    documents: {
      route: `/models/${modelID}/read-only/documents`
    },
    crsAndTdls: {
      route: `/models/${modelID}/read-only/crs-and-tdl`
    }
  };

  // Mapping of all sub navigation links
  const subNavigationLinks: React.ReactNode[] = Object.keys(sideNavItems).map(
    (key: string) => (
      <NavLink
        to={sideNavItems[key].route}
        key={key}
        activeClassName="usa-current"
        className={sideNavItems[key].groupEnd ? 'nav-group-border' : ''}
      >
        {t(`navigation.${key}`)}
      </NavLink>
    )
  );

  return (
    <div className="read-only-side-nav__wrapper">
      <SideNav items={subNavigationLinks} />
    </div>
  );
};

export default ReadOnlySideNav;
