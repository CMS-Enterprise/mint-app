import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { IconArrowForward } from '@trussworks/react-uswds';

import './index.scss';

type ModelSubNavProps = {
  link: 'task-list' | 'read-only';
  modelID: string;
};

const ModelSubNav = ({ link, modelID }: ModelSubNavProps) => {
  const { t } = useTranslation('header');
  const history = useHistory();

  return (
    <nav
      aria-label={t('subHeader.label')}
      data-testid="sub-navigation-bar"
      className="position-sticky z-100 top-0 bg-primary-darker text-white padding-105 sub-nav"
    >
      <div
        role="link"
        tabIndex={0}
        aria-label={t('subHeader.label')}
        className="pointer"
        data-testid="sub-navigation-link"
        onClick={() => history.push(`/models/${modelID}/${link}`)}
        onKeyDown={() => history.push(`/models/${modelID}/${link}`)}
      >
        <div className="grid-container" data-testid="sub-navigation-text">
          {link === 'read-only'
            ? t('subHeader.taskListBody')
            : t('subHeader.readOnlyBody')}{' '}
          <div className="text-white text-bold display-inline-flex margin-left-05">
            <div data-testid="sub-navigation-link-text">
              {' '}
              {link === 'read-only'
                ? t('subHeader.taskListLink')
                : t('subHeader.readOnlyLink')}{' '}
            </div>
            <IconArrowForward className="text-white margin-left-1 right-icon" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ModelSubNav;
