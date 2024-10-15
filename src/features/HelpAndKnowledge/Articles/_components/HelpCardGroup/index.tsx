import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  CardGroup,
  Grid,
  Label,
  Pagination,
  Select
} from '@trussworks/react-uswds';
import i18n from 'config/i18n';
import ArticleCard from 'features/HelpAndKnowledge/Articles/_components/ArticleCard';
import i18next from 'i18next';

import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import TableResults from 'components/TableResults';
import useSearchSortPagination from 'hooks/useSearchSortPagination';
import { tObject } from 'utils/translation';

import { ArticleProps, HelpArticle } from '../..';
import ExternalResourceCard from '../ExternalResourceCard';

import './index.scss';

type HelpCardGroupType = {
  className?: string;
  resources: ArticleProps[];
  showFirstThree?: boolean;
  tag?: boolean;
};

type SortOptionsType = 'by-title-a-z' | 'by-title-z-a';

// Sort options type for the select dropdown
type SortProps = {
  value: SortOptionsType;
  label: string;
};

// Sort options for the select dropdown
const sortOptions: SortProps[] = [
  {
    value: 'by-title-a-z',
    label: i18n.t('helpAndKnowledge:sortAsc')
  },
  {
    value: 'by-title-z-a',
    label: i18n.t('helpAndKnowledge:sortDesc')
  }
];

const HelpCardGroup = ({
  className,
  resources,
  showFirstThree,
  tag
}: HelpCardGroupType) => {
  const { t } = useTranslation('helpAndKnowledge');

  const articleNames = tObject<HelpArticle>(
    'helpAndKnowledge:helpArticleNames'
  );

  resources.sort((a, b) =>
    articleNames[a.key]
      .toLowerCase()
      .localeCompare(articleNames[b.key].toLowerCase())
  );

  const { currentItems, pagination, search, pageSize, sort } =
    useSearchSortPagination<ArticleProps, SortOptionsType>({
      items: resources,
      sortOptions,
      filterFunction: filterResourceArticles,
      sortFunction: handleSortOptions
    });

  const { query, setQuery, rowLength } = search;

  const { sorted, setSorted } = sort;

  const { itemsPerPage, setItemsPerPage } = pageSize;

  const {
    currentPage,
    handleNext,
    handlePageNumber,
    handlePrevious,
    pageCount
  } = pagination;

  const history = useHistory();

  // Query parameters
  const params = new URLSearchParams(history.location.search);
  const category = params.get('category');

  const firstThreeArticles = showFirstThree
    ? currentItems.slice(0, 3)
    : currentItems;

  return (
    <div className="help-card-group">
      {!showFirstThree && !category && (
        <div className="margin-top-2 margin-bottom-4">
          <Grid row>
            <Grid tablet={{ col: 6 }}>
              {/* Search bar and results info */}
              <GlobalClientFilter
                globalFilter={query}
                setGlobalFilter={setQuery}
                tableID="help-articles"
                tableName=""
                className="margin-bottom-3 maxw-none tablet:width-mobile-lg"
              />
            </Grid>

            {/* Select sort display */}
            <Grid tablet={{ col: 6 }}>
              <div
                className="margin-left-auto display-flex"
                style={{ maxWidth: '13rem' }}
              >
                <Label
                  htmlFor="sort"
                  className="text-normal margin-top-1 margin-right-1"
                >
                  {t('sort')}
                </Label>

                <Select
                  id="sort"
                  className="margin-bottom-2 margin-top-0"
                  name="sort"
                  value={sorted}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    setSorted(e.target.value as SortProps['value']);
                    params.set('sort', e.target.value);
                    history.push({ search: params.toString() });
                  }}
                >
                  {sortOptions.map(option => {
                    return (
                      <option key={`sort-${option.value}`} value={option.value}>
                        {option.label}
                      </option>
                    );
                  })}
                </Select>
              </div>
            </Grid>

            <Grid desktop={{ col: 12 }}>
              <TableResults
                globalFilter={query}
                pageIndex={currentPage - 1}
                pageSize={itemsPerPage}
                filteredRowLength={currentItems.length}
                rowLength={rowLength}
              />
            </Grid>
          </Grid>
        </div>
      )}

      <CardGroup className={className}>
        {firstThreeArticles.map(article => (
          <React.Fragment key={article.key}>
            {article.external ? (
              <ExternalResourceCard
                {...article}
                tag={tag}
                type={article.type}
                key={article.key}
              />
            ) : (
              <ArticleCard
                {...article}
                isLink
                tag={tag}
                type={article.type}
                key={article.key}
              />
            )}
          </React.Fragment>
        ))}
      </CardGroup>

      {/* Pagination */}

      <div className="display-flex">
        {!showFirstThree &&
          resources.length > itemsPerPage &&
          pageCount > 1 && (
            <Pagination
              pathname={history.location.pathname}
              currentPage={currentPage}
              maxSlots={7}
              onClickNext={handleNext}
              onClickPageNumber={handlePageNumber}
              onClickPrevious={handlePrevious}
              totalPages={pageCount}
            />
          )}
        {!showFirstThree && !category && (
          <TablePageSize
            className="margin-left-auto desktop:grid-col-auto"
            pageSize={itemsPerPage}
            setPageSize={setItemsPerPage}
            valueArray={[6, 9, 'all']}
          />
        )}
      </div>
    </div>
  );
};

export const filterResourceArticles = (
  queryString: string,
  helpResources: ArticleProps[]
): ArticleProps[] => {
  return helpResources.filter((resource: any) => {
    let resourceTitle = '';
    let resourceDescription = '';

    if (resource.external) {
      resourceTitle = i18next.t(
        `helpAndKnowledge:externalResources.${resource.translation}.title`
      );
      resourceDescription = i18next.t(
        `helpAndKnowledge:externalResources.${resource.translation}.description`
      );
    } else {
      resourceTitle = i18next.t(`${resource.translation}:title`);
      resourceDescription = i18next.t(`${resource.translation}:description`);
    }

    return (
      resourceTitle.toLowerCase().includes(queryString.toLowerCase()) ||
      resourceDescription.toLowerCase().includes(queryString.toLowerCase())
    );
  });
};

// Sorts the changes based on the sort option
export const handleSortOptions = (
  resources: ArticleProps[],
  sort: 'by-title-a-z' | 'by-title-z-a'
) => {
  const articleNames = tObject<HelpArticle>(
    'helpAndKnowledge:helpArticleNames'
  );

  let sortedResources: ArticleProps[] = [];

  if (sort === 'by-title-a-z') {
    sortedResources = [...resources].sort((a, b) =>
      articleNames[a.key]
        .toLowerCase()
        .localeCompare(articleNames[b.key].toLowerCase())
    );
  } else if (sort === 'by-title-z-a') {
    sortedResources = [...resources].sort((a, b) =>
      articleNames[b.key]
        .toLowerCase()
        .localeCompare(articleNames[a.key].toLowerCase())
    );
  }

  return sortedResources;
};

export default HelpCardGroup;
