import React from 'react';
import { useTranslation } from 'react-i18next';

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
    link: '/help',
    label: 'help'
  }
];

const ModelSubNav = () => {
  const { t } = useTranslation('header');

  return (
    <nav
      aria-label={t('subHeader.body')}
      data-testid="sub-navigation-bar"
      className="border-top-light"
    >
      <div className="grid-container">
        {t('subHeader.link')}
        {/* <PrimaryNav
          onClick={() => toggle(false)}
          mobileExpanded={mobile}
          aria-label="Primary navigation"
          items={navItems}
        /> */}
      </div>
    </nav>
  );
};

export default ModelSubNav;
