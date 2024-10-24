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
  const { t: modelSumamryT } = useTranslation('modelSummary');
  const { t: helpAndKnowledgeT } = useTranslation('helpAndKnowledge');

  const translationKey = solutionNavigation ? helpAndKnowledgeT : modelSumamryT;

  const scrollToAboveReadOnlyBodyContent = () => {
    setTimeout(() => {
      // the height of the filter banner
      const filterBannerHeight = document.querySelector(
        '[data-testid="group-filter-banner"]'
      )?.clientHeight;

      // the height of navigation bar
      const navBarHeight = document.querySelector(
        '[data-testid="navigation-bar"]'
      )?.clientHeight;

      // `scroll-element` is the SectionWrapper component, everything below the ModelWarning
      const scrollElement = document.querySelector('#scroll-element');

      // if the element, filterBannerHeight, or navBarHeight is undefined or null, abort!
      if (!scrollElement || !filterBannerHeight || !navBarHeight) {
        return;
      }

      // Find the margin-top value of the scroll element
      const marginOfScrollElement = parseFloat(
        window.getComputedStyle(scrollElement).marginTop
      );

      // Find the top of the scroll element
      const { top } = scrollElement.getBoundingClientRect();

      // Calculate all the things
      const distanceFromTopOfPage =
        Math.round(top) +
        window.scrollY -
        filterBannerHeight -
        navBarHeight -
        marginOfScrollElement;

      // Only scroll to the top of the body content if user scrolled past the header section
      if (window.scrollY >= distanceFromTopOfPage) {
        window.scroll(0, distanceFromTopOfPage);
      }
    }, 0);
  };

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
        className={
          key === 'it-solutions' || key === 'data-exchange-approach'
            ? 'nav-group-border'
            : ''
        }
        onClick={scrollToAboveReadOnlyBodyContent}
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
