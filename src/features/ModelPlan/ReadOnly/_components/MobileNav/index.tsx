import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { Icon } from '@trussworks/react-uswds';

import { ModelSubSectionRouteKey } from 'components/ShareExport/util';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';

import { subComponentsProps } from '../..';
import SideNav from '../Sidenav';

import './index.scss';

interface MobileNavProps {
  subComponents: subComponentsProps;
  subinfo: ModelSubSectionRouteKey;
  isHelpArticle: boolean | undefined;
  solutionDetailRoute?: string;
  isFilteredView?: boolean;
}

const MobileNav = ({
  subComponents,
  subinfo,
  isHelpArticle,
  solutionDetailRoute,
  isFilteredView
}: MobileNavProps) => {
  const { t } = useTranslation('modelSummary');
  const { t: h } = useTranslation('generalReadOnly');
  const { t: hk } = useTranslation('helpAndKnowledge');

  const isMobile = useCheckResponsiveScreen('tablet');

  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);

  useEffect(() => {
    // Fixes edge case: subnavigation remains open when user (when in small screen size) expands window to large size really fast (using window manager)
    if (!isMobile) {
      setIsAccordionOpen(false);
    }
  }, [isMobile]);

  const translationKey = solutionDetailRoute ? hk : t;

  return (
    <div className="read-only-model-plan__subNav-accordion">
      <button
        type="button"
        className={`usa-menu-btn mint-header__basic width-full display-flex flex-justify flex-align-center desktop:display-none ${
          !isAccordionOpen ? 'bg-primary-dark' : 'bg-primary'
        }`}
        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
        aria-expanded={isAccordionOpen}
        aria-controls="read-only-model-plan__subNav"
      >
        <h3 className="padding-left-1">
          {isFilteredView
            ? translationKey(`navigation.model-basics`)
            : translationKey(`navigation.${subinfo}`)}
        </h3>
        {!isAccordionOpen ? (
          <Icon.ExpandMore size={3} />
        ) : (
          <Icon.ExpandLess size={3} />
        )}
      </button>
      {isAccordionOpen && (
        <div
          id="read-only-model-plan__subNav"
          className="read-only-model-plan__subNav__list-container bg-primary-dark"
        >
          <ul className="read-only-model-plan__subNav__list subNav">
            <SideNav
              subComponents={subComponents}
              isHelpArticle={isHelpArticle}
              isMobile
            />
            <li>
              <NavLink
                to={solutionDetailRoute || '/models'}
                className="display-flex flex-align-center"
              >
                <Icon.ArrowBack className="margin-right-1" />
                {solutionDetailRoute ? hk('backToSolutions') : h('back')}
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
