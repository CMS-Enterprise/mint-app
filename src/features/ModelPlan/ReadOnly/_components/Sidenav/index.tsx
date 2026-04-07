import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import { SideNav as TrussSideNav } from '@trussworks/react-uswds';
import classNames from 'classnames';

import { subComponentsProps } from '../..';

import './index.scss';

interface SideNavProps {
  subComponents: subComponentsProps;
  isHelpArticle: boolean | undefined;
  solutionNavigation?: boolean;
  paramActive?: boolean;
  isMobile?: boolean;
}

const SideNav = ({
  subComponents,
  isHelpArticle,
  solutionNavigation,
  paramActive,
  isMobile
}: SideNavProps) => {
  const { t: modelSumamryT } = useTranslation('modelSummary');
  const { t: helpAndKnowledgeT } = useTranslation('helpAndKnowledge');
  const location = useLocation();
  const translationKey = solutionNavigation ? helpAndKnowledgeT : modelSumamryT;

  const scrollToAboveReadOnlyBodyContent = () => {
    setTimeout(() => {
      // `scroll-element` is the SectionWrapper component, everything below the ModelWarning
      const scrollElement = document.querySelector('#scroll-element');
      const filterBanner = document.querySelector(
        '[data-testid="group-filter-banner"]'
      );
      const navBar = document.querySelector('[data-testid="navigation-bar"]');

      if (!scrollElement || !navBar) {
        return;
      }

      // Extra space below stacked sticky chrome so headings aren’t flush against the banner.
      const gapBelowStickyChromePx = 8;

      // The filter banner uses `position: sticky` with `top: 96px` / `112px` (see
      // FilterView/Banner/index.scss), so nav height + banner `clientHeight` understates
      // how much viewport is covered. Using the live bottom edge of the banner (or nav
      // when the banner is hidden) matches the true stack.
      const stickyChromeBottomViewport = filterBanner
        ? filterBanner.getBoundingClientRect().bottom
        : navBar.getBoundingClientRect().bottom;

      const marginOfScrollElement = parseFloat(
        window.getComputedStyle(scrollElement).marginTop
      );

      const scrollElementDocTop =
        Math.round(scrollElement.getBoundingClientRect().top) + window.scrollY;

      const distanceFromTopOfPage =
        scrollElementDocTop -
        Math.round(stickyChromeBottomViewport) -
        marginOfScrollElement -
        gapBelowStickyChromePx;

      // Only scroll to the top of the body content if user scrolled past the header section
      if (window.scrollY >= distanceFromTopOfPage) {
        window.scroll(0, distanceFromTopOfPage);
      }
    }, 0);
  };

  const isLinkActive = (key: any, linkLocation: any) => {
    const params = new URLSearchParams(linkLocation.search);
    const section = params.get('section');
    return paramActive
      ? section === key
      : location.pathname.split('/')[4] === key;
  };

  // Model plan links
  const modelPlanLinks: React.ReactNode[] = Object.keys(subComponents)
    .filter(section => subComponents[section].group === 'model-plan')
    .map((key: string) => (
      <NavLink
        to={
          !isHelpArticle
            ? subComponents[key].route
            : subComponents[key].helpRoute
        }
        key={key}
        className={({ isActive }) =>
          classNames({
            'usa-current': !isMobile && isActive,
            'subNav--current': isMobile && isActive
          })
        }
        onClick={scrollToAboveReadOnlyBodyContent}
      >
        {translationKey(`navigation.${key}`)}
      </NavLink>
    ));

  // Model design links
  const modelDesignLinks: React.ReactNode[] = Object.keys(subComponents)
    .filter(
      section => subComponents[section].group === 'model-design-activities'
    )
    .map((key: string) => (
      <NavLink
        to={
          !isHelpArticle
            ? subComponents[key].route
            : subComponents[key].helpRoute
        }
        key={key}
        className={({ isActive }) =>
          classNames({
            'usa-current': !isMobile && isActive,
            'subNav--current': isMobile && isActive
          })
        }
        onClick={scrollToAboveReadOnlyBodyContent}
      >
        {translationKey(`navigation.${key}`)}
      </NavLink>
    ));

  // MTO links
  const mtoLinks: React.ReactNode[] = Object.keys(subComponents)
    .filter(section => subComponents[section].group === 'model-to-operations')
    .map((key: string) => (
      <NavLink
        to={
          !isHelpArticle
            ? subComponents[key].route
            : subComponents[key].helpRoute
        }
        key={key}
        className={({ isActive }) =>
          classNames({
            'usa-current': !isMobile && isActive,
            'subNav--current': isMobile && isActive
          })
        }
        onClick={scrollToAboveReadOnlyBodyContent}
      >
        {translationKey(`navigation.${key}`)}
      </NavLink>
    ));

  // Other model plan links
  const otherModelPlanLinks: React.ReactNode[] = Object.keys(subComponents)
    .filter(section => subComponents[section].group === 'other-model-info')
    .map((key: string) => (
      <NavLink
        to={
          !isHelpArticle
            ? subComponents[key].route
            : subComponents[key].helpRoute
        }
        key={key}
        className={({ isActive }) =>
          classNames({
            'usa-current': !isMobile && isActive,
            'subNav--current': isMobile && isActive
          })
        }
        onClick={scrollToAboveReadOnlyBodyContent}
      >
        {translationKey(`navigation.${key}`)}
      </NavLink>
    ));

  // Mapping of all sub navigation links
  const helpNavigationLinks: React.ReactNode[] = Object.keys(subComponents).map(
    (key: string) => (
      <NavLink
        to={subComponents[key].helpRoute}
        key={key}
        className={() => {
          return classNames({
            'usa-current': isLinkActive(key, location),
            'subNav--current': isMobile && isLinkActive(key, location)
          });
        }}
        onClick={scrollToAboveReadOnlyBodyContent}
      >
        {translationKey(`navigation.${key}`)}
      </NavLink>
    )
  );

  const classGroup = classNames(
    'text-bold border-top margin-0 margin-y-1 padding-top-3',
    {
      'text-white border-top-mint-blue': isMobile,
      'text-base-darkest border-base-lighter': !isMobile
    }
  );

  const SideNavLinks = (
    <>
      <div className="margin-bottom-3">
        <p
          className={classNames('text-bold margin-y-1', {
            'text-white': isMobile,
            'text-base-darkest': !isMobile
          })}
        >
          {modelSumamryT('navigationGroups.model-plan')}
        </p>
        <TrussSideNav items={modelPlanLinks} />
      </div>

      <div className="margin-bottom-3">
        <p className={classGroup}>
          {modelSumamryT('navigationGroups.model-design-activities')}
        </p>
        <TrussSideNav items={modelDesignLinks} />
      </div>

      <div className="margin-bottom-3">
        <p className={classGroup}>
          {modelSumamryT('navigationGroups.model-to-operations')}
        </p>
        <TrussSideNav items={mtoLinks} />
      </div>

      <div className="margin-bottom-3">
        <p className={classGroup}>
          {modelSumamryT('navigationGroups.other-model-info')}
        </p>
        <TrussSideNav items={otherModelPlanLinks} />
      </div>
    </>
  );

  return (
    <div
      id="read-only-side-nav__wrapper"
      data-testid="read-only-side-nav__wrapper"
    >
      {solutionNavigation ? (
        <TrussSideNav items={helpNavigationLinks} />
      ) : (
        SideNavLinks
      )}
    </div>
  );
};

export default SideNav;
