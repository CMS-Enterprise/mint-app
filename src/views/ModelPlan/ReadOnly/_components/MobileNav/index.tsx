import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import {
  IconArrowBack,
  IconExpandLess,
  IconExpandMore
} from '@trussworks/react-uswds';

import useCheckResponsiveScreen from 'hooks/useCheckMobile';

import { subComponentsProps, SubpageKey } from '../..';

import './index.scss';

interface MobileNavProps {
  subComponents: subComponentsProps;
  subinfo: SubpageKey;
}

const MobileNav = ({ subComponents, subinfo }: MobileNavProps) => {
  const { t } = useTranslation('modelSummary');
  const { t: h } = useTranslation('generalReadOnly');
  const isMobile = useCheckResponsiveScreen('tablet');
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);

  useEffect(() => {
    // Fixes edge case: subnavigation remains open when user (when in small screen size) expands window to large size really fast (using window manager)
    if (!isMobile) {
      setIsAccordionOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="read-only-model-plan__subNav-accordion">
      <button
        type="button"
        className={`usa-menu-btn mint-header__basic width-full ${
          !isAccordionOpen ? 'bg-primary-dark' : 'bg-primary'
        }`}
        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
        aria-expanded={isAccordionOpen}
        aria-controls="read-only-model-plan__subNav"
      >
        <h3 className="padding-left-1">{t(`navigation.${subinfo}`)}</h3>
        {!isAccordionOpen ? (
          <IconExpandMore size={3} />
        ) : (
          <IconExpandLess size={3} />
        )}
      </button>
      {isAccordionOpen && (
        <div
          id="read-only-model-plan__subNav"
          className="read-only-model-plan__subNav__list-container bg-primary-dark"
        >
          <ul className="read-only-model-plan__subNav__list subNav">
            {Object.keys(subComponents).map((key: string) => (
              <li
                key={key}
                className={
                  key === 'it-tools' ? 'subNav__item--group-border' : ''
                }
              >
                <NavLink
                  to={subComponents[key].route}
                  key={key}
                  className={key === subinfo ? 'subNav--current' : ''}
                  onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                >
                  {t(`navigation.${key}`)}
                </NavLink>
              </li>
            ))}
            <li className="subNav__item--back-to-all-models">
              <NavLink to="/models" className="display-flex flex-align-center">
                <IconArrowBack className="margin-right-1" />
                {h('back')}
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
