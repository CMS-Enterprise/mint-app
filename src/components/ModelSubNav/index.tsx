import React from 'react';
import { useTranslation } from 'react-i18next';

import UswdsReactLink from 'components/LinkWrapper';

type ModelSubNavProps = {
  link: 'task-list' | 'read-only';
  modelID: string;
};

const ModelSubNav = ({ link, modelID }: ModelSubNavProps) => {
  const { t } = useTranslation('header');

  return (
    <nav
      aria-label={t('subHeader.label')}
      data-testid="sub-navigation-bar"
      className="position-sticky z-100 top-0 bg-primary-darker text-white padding-105"
    >
      <div className="grid-container">
        {t('subHeader.body')}{' '}
        <UswdsReactLink
          to={`/models/${modelID}/${link}`}
          className="text-white text-bold"
        >
          {t('subHeader.link')}
        </UswdsReactLink>
      </div>
    </nav>
  );
};

export default ModelSubNav;
