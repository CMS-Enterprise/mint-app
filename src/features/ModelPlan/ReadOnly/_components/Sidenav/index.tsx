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

  const isActive = (key: any, location: any) => {
    const params = new URLSearchParams(location.search);
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
        isActive={(_, location) => isActive(key, location)}
        activeClassName="usa-current"
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
        isActive={(_, location) => isActive(key, location)}
        activeClassName="usa-current"
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
        isActive={(_, location) => isActive(key, location)}
        activeClassName="usa-current"
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
        isActive={(_, location) => isActive(key, location)}
        activeClassName="usa-current"
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
        isActive={(_, location) => isActive(key, location)}
        activeClassName="usa-current"
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
      {solutionNavigation ? (
        <TrussSideNav items={helpNavigationLinks} />
      ) : (
        <>
          <div className="margin-bottom-3">
            <p className="text-base-darkest text-bold margin-y-1">
              {modelSumamryT('navigationGroups.model-plan')}
            </p>
            <TrussSideNav items={modelPlanLinks} />
          </div>

          <div className="margin-bottom-3">
            <p className="text-base-darkest text-bold border-top border-base-lighter margin-0 margin-y-1 padding-top-3">
              {modelSumamryT('navigationGroups.model-design-activities')}
            </p>
            <TrussSideNav items={modelDesignLinks} />
          </div>

          <div className="margin-bottom-3">
            <p className="text-base-darkest text-bold border-top border-base-lighter margin-0 margin-y-1 padding-top-3">
              {modelSumamryT('navigationGroups.model-to-operations')}
            </p>
            <TrussSideNav items={mtoLinks} />
          </div>

          <div className="margin-bottom-3">
            <p className="text-base-darkest text-bold border-top border-base-lighter margin-0 margin-y-1 padding-top-3">
              {modelSumamryT('navigationGroups.other-model-info')}
            </p>
            <TrussSideNav items={otherModelPlanLinks} />
          </div>
        </>
      )}
    </div>
  );
};

export default SideNav;
