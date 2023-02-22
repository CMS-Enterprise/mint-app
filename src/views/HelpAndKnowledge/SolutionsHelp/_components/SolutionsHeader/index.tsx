import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';

import Breadcrumbs from 'components/Breadcrumbs';
import GlobalClientFilter from 'components/TableFilter';

import { findCategoryKey } from '../..';

import './index.scss';

type OperationalSolutionsHelpProps = {
  className?: string;
  resultsNum: number;
  resultsMax: number;
  setQuery: (query: string) => void;
};

const SolutionsHeader = ({
  className,
  resultsNum,
  resultsMax,
  setQuery
}: OperationalSolutionsHelpProps) => {
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
        'padding-y-4 padding-bottom-4 bg-primary-darker text-white'
      )}
    >
      <GridContainer>
        <Breadcrumbs
          items={breadcrumbs}
          className="help-header__breadcrumbs bg-primary-darker text-white padding-top-0 margin-top-neg-2 margin-bottom-4"
        />

        <h2 className="margin-0">{t('operationalSolutions')}</h2>

        <p className="margin-bottom-4">{t('operationalSolutionsInfo')}</p>

        <GlobalClientFilter
          setGlobalFilter={setQuery}
          tableID="table-id"
          tableName="table-name"
          className="width-half margin-bottom-3"
        />

        <div className="display-flex">
          <p className="margin-y-0">
            {t('resultsInfo', {
              resultsNum,
              resultsMax
            })}
          </p>
        </div>
      </GridContainer>
    </div>
  );
};

export default SolutionsHeader;
