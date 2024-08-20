import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import { GridContainer, Icon, PrimaryNav } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { useGetPollNotificationsQuery } from 'gql/gen/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import './index.scss';

export type NavigationProps = {
  isMobile?: boolean;
  signout: () => void;
  expandMobileSideNav: (active: boolean) => void;
  userName: string;
  className?: string;
};

export const navLinks = [
  {
    link: '/',
    label: 'home'
  },
  {
    link: '/models',
    label: 'models'
  },
  {
    link: '/help-and-knowledge',
    label: 'help'
  }
];

export const getActiveTab = (route: string, pathname: string) => {
  const homeRoutes: string[] = [
    'collaboration-area',
    'task-list',
    'homepage-settings'
  ];

  // baseRoute is the first part of the route associated with the tab
  const baseRoute = route.split('/')[1];
  // currentBaseRoute is the first part of the current pathname
  const currentBaseRoute = pathname.split('/')[1];

  // If the route is the home route, check if the pathname is the home route
  if (route === '/') {
    if (pathname === '/') {
      return true;
    }
    // If the route is the home route, check if the pathname includes the home route - ex: /collaboration-area/123, task-list/123, notifications
    if (homeRoutes.some(homeRoute => pathname.includes(homeRoute))) {
      return true;
    }
    return false;
  }

  // If the route is not the home route, check if the currentBaseRoute is the same as the baseRoute and the pathname does not include any of the home routes
  if (
    currentBaseRoute === baseRoute &&
    !homeRoutes.some(homeRoute => pathname.includes(homeRoute))
  ) {
    return true;
  }

  return false;
};

const NavigationBar = ({
  isMobile,
  signout,
  expandMobileSideNav,
  userName,
  className
}: NavigationProps) => {
  const { t } = useTranslation();

  const flags = useFlags();

  const { pathname } = useLocation();

  const { data } = useGetPollNotificationsQuery({
    pollInterval: 5000
  });

  const hasNotifications = !!data?.currentUser.notifications
    .numUnreadNotifications;

  const primaryLinks = navLinks.map(route => (
    <div className="mint-nav" key={route.label}>
      <NavLink
        to={route.link}
        className={classNames('mint-nav__link', {
          'usa-current': getActiveTab(route.link, pathname)
        })}
        onClick={() => expandMobileSideNav(false)}
        exact={route.link === '/'}
      >
        <em
          className="usa-logo__text mint-nav__label"
          aria-label={t(`header:${route.label}`)}
        >
          {t(`header:${route.label}`)}
        </em>
      </NavLink>
    </div>
  ));

  const notificationLink = (
    <div className="mint-nav">
      <NavLink
        to="/notifications"
        activeClassName="usa-current"
        className={classNames(
          { 'align-right': !isMobile },
          'mint-nav__link  display-flex flex-align-center'
        )}
        onClick={() => expandMobileSideNav(false)}
        data-testid="navmenu__notification"
      >
        <div
          className="display-relative width-4"
          data-testid={
            hasNotifications
              ? 'navmenu__notifications--yesNotification'
              : 'navmenu__notifications--noNotification'
          }
        >
          <div className="position-absolute notification-container">
            {hasNotifications ? (
              <div data-testid="has-notifications">
                <div className="notification-active bg-error position-absolute" />
                <Icon.Notifications
                  className="margin-right-0 text-base-darkest"
                  size={3}
                />
              </div>
            ) : (
              <Icon.NotificationsNone className="margin-right-0" size={3} />
            )}
          </div>
        </div>

        <em
          className="usa-logo__text mint-nav__label"
          aria-label={t(`header:notifications`)}
        >
          {t(`header:notifications`)}
        </em>
      </NavLink>
    </div>
  );

  const navItemsWithNotification = flags.notificationsEnabled
    ? primaryLinks.concat(notificationLink)
    : primaryLinks;

  const userLinks = (
    <div className="mint-nav__signout-container">
      <div className="mint-nav__user margin-bottom-1 padding-x-0">
        {userName}
      </div>
      <NavLink
        to="/"
        className="signout-link padding-0"
        onClick={e => {
          e.preventDefault();
          signout();
        }}
      >
        <em
          className="usa-logo__text text-underline"
          aria-label={t('header:signOut')}
        >
          {t('header:signOut')}
        </em>
      </NavLink>
    </div>
  );

  const navItems = isMobile
    ? navItemsWithNotification.concat(userLinks)
    : navItemsWithNotification;

  return (
    <nav
      aria-label={t('header:navigation')}
      data-testid="navigation-bar"
      className={classNames(className, 'z-400')}
    >
      <GridContainer>
        <PrimaryNav
          onClick={() => expandMobileSideNav(false)}
          mobileExpanded={isMobile}
          aria-label="Primary navigation"
          className={classNames({
            'navigation-link': flags.notificationsEnabled,
            'width-full': !isMobile
          })}
          items={navItems}
        />
      </GridContainer>
    </nav>
  );
};

export default NavigationBar;
