import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import { Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import useOutsideClick from 'hooks/useOutsideClick';

export const helpSubmenuLinks = [
  {
    link: '/help-and-knowledge',
    label: 'allHelpResourcesAndLinks'
  },
  {
    link: '/help-and-knowledge/contract-assistance',
    label: 'contractAssistance'
  },
  {
    link: '/help-and-knowledge/milestone-library',
    label: 'milestoneLibrary'
  },
  {
    link: '/help-and-knowledge/operational-solutions',
    label: 'operationalSolutions'
  },
  {
    link: '/help-and-knowledge#contact-directory',
    label: 'contactDirectory'
  }
] as const;

export const isHelpNavActive = (pathname: string) =>
  pathname.startsWith('/help-and-knowledge');

export const isHelpSubmenuLinkActive = (
  link: string,
  pathname: string,
  hash: string
) => {
  const [path, linkHash] = link.split('#');

  if (linkHash) {
    return pathname === path && hash === `#${linkHash}`;
  }

  if (path === '/help-and-knowledge') {
    return pathname === '/help-and-knowledge' && !hash;
  }

  return pathname.startsWith(path);
};

type HelpNavMenuProps = {
  isMobile?: boolean;
  expandMobileSideNav: (active: boolean) => void;
};

const HelpNavMenu = ({ isMobile, expandMobileSideNav }: HelpNavMenuProps) => {
  const { t } = useTranslation();
  const { pathname, hash } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(menuRef, () => setIsOpen(false));

  const isActive = isHelpNavActive(pathname);

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsOpen(current => !current);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
    expandMobileSideNav(false);
  };

  return (
    <div
      className={classNames('mint-nav mint-nav--help', {
        'mint-nav--help-open': isOpen
      })}
      ref={menuRef}
    >
      <button
        type="button"
        className={classNames('mint-nav__link mint-nav__link--dropdown', {
          'usa-current': isActive,
          'mint-nav__link--open': isOpen
        })}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="help-nav-submenu"
        onClick={handleToggle}
        data-testid="navmenu__help"
      >
        <em
          className="usa-logo__text mint-nav__label"
          aria-label={t('header:help')}
        >
          {t('header:help')}
        </em>
        <Icon.ExpandMore
          className={classNames('mint-nav__dropdown-icon', {
            'mint-nav__dropdown-icon--open': isOpen
          })}
          aria-hidden
        />
      </button>

      {isOpen && (
        <ul
          id="help-nav-submenu"
          className={classNames('mint-nav__submenu', {
            'mint-nav__submenu--mobile': isMobile
          })}
          role="menu"
        >
          {helpSubmenuLinks.map(item => (
            <li key={item.link} className="mint-nav__submenu-item" role="none">
              <NavLink
                to={item.link}
                role="menuitem"
                className={() =>
                  classNames('mint-nav__submenu-link', {
                    'usa-current': isHelpSubmenuLinkActive(
                      item.link,
                      pathname,
                      hash
                    )
                  })
                }
                onClick={handleLinkClick}
                data-testid={`navmenu__help-${item.label}`}
              >
                {t(`header:helpSubmenu.${item.label}`)}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HelpNavMenu;
