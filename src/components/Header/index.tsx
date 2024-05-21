import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { GovBanner, Icon } from '@trussworks/react-uswds';
import classnames from 'classnames';

import { NavContext } from 'components/Header/navContext';
import UswdsReactLink from 'components/LinkWrapper';
import NavigationBar from 'components/NavigationBar';
import { localAuthStorageKey } from 'constants/localAuth';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';

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

  const isMobile = useCheckResponsiveScreen('tablet', 'smaller');

  const isLoggedIn = authState?.isAuthenticated;

  const isLanding: boolean = pathname === '/' && !isLoggedIn;
  const isGetAccess: boolean = pathname === '/how-to-get-access';

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
    <>
      <header
        className={classnames('usa-header mint-header', {
          'bg-primary-darker': isLanding,
          'shadow-2':
            !isLanding &&
            (pathname === '/pre-decisional-notice' ||
              pathname === '/signin' ||
              isMobile)
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
          <div
            className={`usa-logo site-logo ${isMobile ? '' : 'margin-y-4'}`}
            id="logo"
          >
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
          {isLoggedIn ? (
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
                <Icon.Menu size={3} />
              </button>
            </div>
          ) : (
            <div className="display-flex">
              {!isMobile && (
                <UswdsReactLink
                  to="/how-to-get-access"
                  className="landing__access-link margin-right-2 margin-top-1"
                >
                  {t('landing:getAccess')}
                </UswdsReactLink>
              )}
              <Link
                className={classnames('mint-header__nav-link margin-right-2', {
                  'text-white radius-md border padding-y-105': isLanding,
                  'text-white radius-md border padding-y-105 bg-primary': isGetAccess
                })}
                to="/signin"
              >
                {t('header:signIn')}
              </Link>
            </div>
          )}
        </div>

        <div
          className={classnames('usa-overlay', {
            'is-visible': isMobileSideNavExpanded
          })}
        />
        {/* Mobile Display */}
        <div ref={mobileSideNav} className={mobileSideNavClasses}>
          <div className="usa-nav__inner">
            {isLoggedIn ? (
              <NavigationBar
                isMobile={isMobile}
                expandMobileSideNav={setIsMobileSideNavExpanded}
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
    </>
  );
};

export default Header;
