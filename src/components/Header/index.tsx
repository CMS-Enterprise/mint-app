import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { GovBanner, IconMenu } from '@trussworks/react-uswds';
import classnames from 'classnames';

import { NavContext } from 'components/Header/navContext';
import UswdsReactLink from 'components/LinkWrapper';
import NavigationBar from 'components/NavigationBar';
import { localAuthStorageKey } from 'constants/localAuth';

import './index.scss';

type HeaderProps = {
  children?: React.ReactNode | React.ReactNodeArray;
};

export const Header = ({ children }: HeaderProps) => {
  const { authState, oktaAuth } = useOktaAuth();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const [userName, setUserName] = useState('');
  const { isMobileSideNavExpanded, setIsMobileSideNavExpanded } = useContext(
    NavContext
  );
  const dropdownNode = useRef<any>();
  const mobileSideNav = useRef<any>();
  const navbarRef = useRef<HTMLDivElement | null>(null); // Ref used for setting setNavbarHeight

  const isLanding: boolean = pathname === '/' && !authState?.isAuthenticated;

  useEffect(() => {
    let isMounted = true;
    if (authState?.isAuthenticated) {
      oktaAuth.getUser().then((info: any) => {
        if (isMounted) {
          setUserName(info.name);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [authState, oktaAuth]);

  useEffect(() => {
    const handleClick = (e: Event) => {
      if (
        dropdownNode &&
        dropdownNode.current &&
        dropdownNode.current.contains(e.target)
      ) {
        return;
      }

      if (
        mobileSideNav &&
        mobileSideNav.current &&
        mobileSideNav.current.contains(e.target)
      ) {
        return;
      }

      setIsMobileSideNavExpanded(false);
    };

    document.addEventListener('mouseup', handleClick);

    return () => {
      document.removeEventListener('mouseup', handleClick);
    };
  }, [setIsMobileSideNavExpanded]);

  useEffect(() => {
    const handleResize = () => {
      if (isMobileSideNavExpanded && window.innerWidth > 1023) {
        setIsMobileSideNavExpanded(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mobileSideNavClasses = classnames('usa-nav', 'sidenav-mobile', {
    'is-visible': isMobileSideNavExpanded
  });

  const signout = () => {
    localStorage.removeItem(localAuthStorageKey);
    oktaAuth.signOut();
  };

  return (
    <header
      className={classnames('usa-header mint-header', {
        'bg-primary-darker shadow-none': isLanding
      })}
      role="banner"
      ref={navbarRef}
    >
      <GovBanner
        className={classnames({
          'landing-gov-banner bg-base-darkest': isLanding
        })}
      />
      <div
        className={classnames('grid-container mint-header__basic', {
          'margin-top-2': isLanding
        })}
      >
        <div className="usa-logo site-logo margin-y-4" id="logo">
          <Link to="/">
            <em
              className={classnames('usa-logo__text heading', {
                'text-white': isLanding
              })}
              aria-label={t('header:returnHome')}
            >
              {t('general:appName')}
            </em>
          </Link>
        </div>
        {authState?.isAuthenticated ? (
          <div>
            <div className="navbar--container mint-nav__user">
              <div className="mint-header__user">{userName}</div>
              <div>&nbsp; | &nbsp;</div>
              <button
                type="button"
                className="usa-button usa-button--unstyled"
                data-testid="signout-link"
                aria-expanded="false"
                aria-controls="sign-out"
                onClick={signout}
              >
                {t('header:signOut')}
              </button>
            </div>
            <button
              type="button"
              className="usa-menu-btn"
              onClick={() => setIsMobileSideNavExpanded(true)}
            >
              <IconMenu size={3} />
            </button>
          </div>
        ) : (
          <Link
            className={classnames('mint-header__nav-link margin-right-2', {
              'text-white radius-md border padding-y-105': isLanding
            })}
            to="/signin"
          >
            {t('header:signIn')}
          </Link>
        )}
      </div>

      {authState?.isAuthenticated && pathname !== '/pre-decisional-notice' && (
        <NavigationBar
          toggle={setIsMobileSideNavExpanded}
          signout={signout}
          userName={userName}
        />
      )}

      <div className="grid-container mint-header--desktop ">{children}</div>
      <div
        className={classnames('usa-overlay', {
          'is-visible': isMobileSideNavExpanded
        })}
      />
      {/* Mobile Display */}
      <div ref={mobileSideNav} className={mobileSideNavClasses}>
        <div className="usa-nav__inner">
          {children}
          {authState?.isAuthenticated ? (
            <NavigationBar
              mobile
              toggle={setIsMobileSideNavExpanded}
              signout={signout}
              userName={userName}
            />
          ) : (
            <UswdsReactLink className="mint-header__nav-link" to="/signin">
              {t('header:signIn')}
            </UswdsReactLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
