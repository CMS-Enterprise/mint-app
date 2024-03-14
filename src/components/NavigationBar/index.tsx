import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { Icon, PrimaryNav } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { useGetPollNotificationsQuery } from 'gql/gen/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import './index.scss';

export type NavigationProps = {
  mobile?: boolean;
  signout: () => void;
  toggle: (active: boolean) => void;
  userName?: string;
};

export const navLinks = () => [
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

const NavigationBar = ({
  mobile,
  signout,
  toggle,
  userName
}: NavigationProps) => {
  const { t } = useTranslation();

  const flags = useFlags();

  const { data } = useGetPollNotificationsQuery({
    pollInterval: 5000
  });

  const hasNotifications = !!data?.currentUser.notifications
    .numUnreadNotifications;

  const primaryLinks = navLinks().map(route => (
    <div className="mint-nav" key={route.label}>
      <NavLink
        to={route.link}
        activeClassName="usa-current"
        className="mint-nav__link"
        onClick={() => toggle(false)}
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
          { 'align-right': !mobile },
          'mint-nav__link margin-right-neg-4 display-flex flex-align-center'
        )}
        onClick={() => toggle(false)}
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
      <div className="mint-nav__user margin-bottom-1">{userName}</div>
      <NavLink
        to="/"
        onClick={e => {
          e.preventDefault();
          signout();
        }}
        className="signout-link"
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

  const navItems = mobile
    ? navItemsWithNotification.concat(userLinks)
    : navItemsWithNotification;

  return (
    <nav
      aria-label={t('header:navigation')}
      data-testid="navigation-bar"
      className="border-top-light"
    >
      <div className="grid-container">
        <PrimaryNav
          onClick={() => toggle(false)}
          mobileExpanded={mobile}
          aria-label="Primary navigation"
          className={classNames(
            {
              'navigation-link': flags.notificationsEnabled
            },
            'width-full'
          )}
          items={navItems}
        />
      </div>
    </nav>
  );
};

export default NavigationBar;
