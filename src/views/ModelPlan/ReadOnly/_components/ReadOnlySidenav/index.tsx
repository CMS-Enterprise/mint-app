import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { SideNav } from '@trussworks/react-uswds';

const ReadOnlySideNav = () => {
  const { t } = useTranslation('modelSummary');

  const subNavigationObject: string[] = t('navigation', {
    returnObjects: true
  });
  console.log(subNavigationObject);

  // Mapping of all sub navigation links
  const subNavigationLinks: React.ReactNode[] = Object.keys(
    subNavigationObject
  ).map((key: string) => (
    <NavLink
      to="asdf"
      key={key}
      activeClassName="usa-current"
      // className={classnames({
      //   'nav-group-border': subNavigationObject[key].groupEnd
      // })}
    >
      {t(`navigation.${key}`)}
    </NavLink>
  ));

  return <SideNav items={subNavigationLinks} />;
};

export default ReadOnlySideNav;
