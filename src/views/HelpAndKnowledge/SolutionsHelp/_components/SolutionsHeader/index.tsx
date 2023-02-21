import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';

import Breadcrumbs from 'components/Breadcrumbs';

import { findCategoryKey } from '../..';

import './index.scss';

type OperationalSolutionsHelpProps = {
  className?: string;
};

const SolutionsHeader = ({ className }: OperationalSolutionsHelpProps) => {
  const { category } = useParams<{ category: string }>();
  const { t } = useTranslation('helpAndKnowledge');

  const categoryKey = findCategoryKey(category);

  const breadcrumbs = [
    { text: t('heading'), url: '/help-and-knowledge' },
    {
      text: t('operationalSolutions'),
      url: `/help-and-knowledge/operational-solutions`
    }
  ];

  if (categoryKey) {
    breadcrumbs.push({ text: t(`categories.${categoryKey}`), url: '' });
  }

  return (
    <div
      className={classNames(
        className,
        'padding-y-4 padding-bottom-6 bg-primary-darker text-white'
      )}
    >
      <GridContainer>
        <Breadcrumbs
          items={breadcrumbs}
          className="help-header__breadcrumbs bg-primary-darker text-white padding-top-0 margin-top-neg-2 margin-bottom-4"
        />

        <h2 className="margin-0">{t('operationalSolutions')}</h2>

        <p className="margin-bottom-4">{t('operationalSolutionsInfo')}</p>
      </GridContainer>
    </div>
  );
};

export default SolutionsHeader;
