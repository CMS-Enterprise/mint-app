import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconArrowForward } from '@trussworks/react-uswds';

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
      <div className="grid-container" data-testid="sub-navigation-text">
        {link === 'read-only'
          ? t('subHeader.taskListBody')
          : t('subHeader.readOnlyBody')}{' '}
        <UswdsReactLink
          to={`/models/${modelID}/${link}`}
          data-testid="sub-navigation-link"
          className="text-white text-bold display-inline-flex margin-left-05"
        >
          <div data-testid="sub-navigation-link-text">
            {' '}
            {link === 'read-only'
              ? t('subHeader.taskListLink')
              : t('subHeader.readOnlyLink')}{' '}
          </div>
          <IconArrowForward className="text-white margin-left-1" />
        </UswdsReactLink>
      </div>
    </nav>
  );
};

export default ModelSubNav;
