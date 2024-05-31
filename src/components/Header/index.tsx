import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { GovBanner, Icon, NavMenuButton } from '@trussworks/react-uswds';
import classnames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import NavigationBar from 'components/NavigationBar';
import { localAuthStorageKey } from 'constants/localAuth';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import useOutsideClick from 'hooks/useOutsideClick';

import { NavContext } from './navContext';

import './index.scss';

const Header = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const [userName, setUserName] = useState('');

  const mobileNavRef = useRef<HTMLDivElement | null>(null);
  const { isMobileSideNavExpanded, setIsMobileSideNavExpanded } = useContext(
    NavContext
  );

  const isMobile = useCheckResponsiveScreen('tablet', 'smaller');

  // Setting variables
  const isLoggedIn = authState?.isAuthenticated;
  const isLanding: boolean = pathname === '/' && !isLoggedIn;
  const isGetAccess: boolean = pathname === '/how-to-get-access';

  // Detects click outside mobile navigation and close mobile nav
  useOutsideClick(mobileNavRef, () => setIsMobileSideNavExpanded(false));

  useEffect(() => {
    let isMounted = true;
    if (isLoggedIn) {
      oktaAuth.getUser().then((info: any) => {
        if (isMounted) {
          setUserName(info.name);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, oktaAuth]);

  const signout = () => {
    localStorage.removeItem(localAuthStorageKey);
    oktaAuth.signOut();
  };

  return (
    <>
      {/* Dark overlay when mobile nav is expanded */}
      <div
        className={classnames('usa-overlay', {
          'is-visible': isMobileSideNavExpanded && isMobile
        })}
      />

      {/* Gov Banner */}
      <GovBanner
        className={classnames({
          'landing-gov-banner bg-base-darkest': isLanding
        })}
      />

      {/* Header with logo and user links */}
      <header
        className={classnames('usa-header mint-header bg-white', {
          'position-sticky top-0 shadow-2': isMobile && !isLanding,
          'bg-primary-darker': isLanding,
          'shadow-2':
            !isLanding &&
            (pathname === '/pre-decisional-notice' ||
              pathname === '/signin' ||
              isGetAccess ||
              isMobile)
        })}
        role="banner"
      >
        <div
          className={classnames(
            'grid-container display-flex flex-justify flex-align-center',
            {
              'margin-top-2': isLanding,
              'padding-right-0': isLoggedIn && isMobile
            }
          )}
        >
          <div
            className={classnames('usa-logo site-logo margin-x-0', {
              'margin-y-4': !isMobile
            })}
            id="logo"
          >
            <Link to="/">
              <em
                className={classnames('usa-logo__text ', {
                  'text-white': isLanding
                })}
                aria-label={t('header:returnHome')}
              >
                {t('general:appName')}
              </em>
            </Link>
          </div>
          {isLoggedIn ? (
            <>
              {!isMobile && (
                <div className="navbar--container mint-nav__user display-flex flex-align-center">
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
              )}
              <NavMenuButton
                onClick={() => setIsMobileSideNavExpanded(true)}
                label={<Icon.Menu size={3} />}
              />
            </>
          ) : (
            <div className="display-flex flex-align-center">
              {!isMobile && (
                <UswdsReactLink
                  to="/how-to-get-access"
                  className={classnames('landing__access-link margin-right-2', {
                    'text-base-darker': !isLanding
                  })}
                >
                  {t('landing:getAccess')}
                </UswdsReactLink>
              )}
              <Link
                className={classnames(
                  'mint-header__nav-link  radius-md padding-y-105 padding-x-2',
                  {
                    'text-white border': isLanding,
                    'text-base-darker': !isLanding
                  }
                )}
                to="/signin"
              >
                {t('header:signIn')}
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Desktop Navigation Bar */}
      {isLoggedIn && pathname !== '/pre-decisional-notice' && (
        <NavigationBar
          className={classnames(
            'position-sticky top-0 z-100 bg-white shadow-2',
            {
              'border-top-light': !isMobile
            }
          )}
          expandMobileSideNav={setIsMobileSideNavExpanded}
          signout={signout}
          userName={userName}
        />
      )}

      {/* Mobile Nav that slides in */}
      {isMobile && (
        <div
          ref={mobileNavRef}
          className={classnames('usa-nav', 'sidenav-mobile', {
            'is-visible': isMobileSideNavExpanded
          })}
        >
          <NavigationBar
            isMobile={isMobile}
            expandMobileSideNav={setIsMobileSideNavExpanded}
            signout={signout}
            userName={userName}
          />
        </div>
      )}
    </>
  );
};

export default Header;
