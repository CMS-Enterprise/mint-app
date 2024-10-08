import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
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
import Search from 'features/ModelPlan/ChangeHistory/components/Search';
import i18next from 'i18next';

import TablePageSize from 'components/TablePageSize';
import { tObject } from 'utils/translation';

import { ArticleProps, HelpArticle } from '../..';
import ExternalResourceCard from '../ExternalResourceCard';

import './index.scss';

type HelpCardGroupType = {
  className?: string;
  resources: ArticleProps[];
  showFirstThree?: boolean;
  tag?: boolean;
  pagination?: boolean;
};

// Sort options type for the select dropdown
type SortProps = {
  value: 'by-title-a-z' | 'by-title-z-a';
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
  tag,
  pagination = false
}: HelpCardGroupType) => {
  const { t } = useTranslation('helpAndKnowledge');

  const articleNames = tObject<HelpArticle>(
    'helpAndKnowledge:helpArticleNames'
  );

  const history = useHistory();

  // Query parameters
  const params = new URLSearchParams(history.location.search);
  const pageParam = params.get('page') || '1';
  const queryParam = params.get('query');
  const category = params.get('category');
  const sortParam = params.get('sort') as SortProps['value'];

  resources.sort((a, b) =>
    articleNames[a.key]
      .toLowerCase()
      .localeCompare(articleNames[b.key].toLowerCase())
  );

  // Contains the sorted changes based on select/sort option
  const [sortedResources, setSortedResources] = useState([...resources]);
  // Contains the current set of changes to display, including search and sort
  const [helpResources, setHelpResources] = useState([...resources]);
  // Contains sort state of select option dropdown
  const [sort, setSort] = useState<SortProps['value']>(sortOptions[0].value);

  // Search/query configuration
  const [query, setQuery] = useState<string>('');
  const [resultsNum, setResultsNum] = useState<number>(0);

  // Pagination Configuration
  const [itemsPerPage, setItemsPerPage] = useState<number>(9);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(
    Math.floor(helpResources.length / itemsPerPage)
  );

  // Current items to dsiplay on the current page - contains search and sort data
  const [currentItems, setCurrentItems] = useState(
    helpResources.slice(
      currentPage * itemsPerPage,
      currentPage * itemsPerPage + itemsPerPage
    )
  );

  // searchChanges is a function to filter audits based on query
  const searchChanges = useCallback(filterResourceArticles, []);

  //  If no query, return all solutions, otherwise, matching query solutions
  useEffect(() => {
    if (query.trim()) {
      const filteredAudits = searchChanges(query, sortedResources);

      // Sets audit changes based on the filtered audits
      setHelpResources(filteredAudits);
      setResultsNum(filteredAudits.length);
    } else {
      // Sets the default audits if no query present
      setHelpResources(sortedResources);
    }

    // Update the URL's query parameters
    if (query) {
      params.set('query', query);
    } else {
      // Delete the 'query' parameter
      params.delete('query');
    }
    params.delete('page');
    history.push({ search: params.toString() });

    // Return the page to the first page when the query changes
    setCurrentPage(1);
  }, [query, searchChanges, setCurrentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update the audit changes when the data is loaded.
  useEffect(() => {
    setHelpResources([...resources]);
    setSortedResources([...resources]);

    // Set the sort based on the sort query parameter or default value
    setSort(sortParam || sortOptions[0].value);

    setTimeout(() => {
      // Set the query based on the query parameter
      setQuery(queryParam || '');
    }, 0);

    // Set the page offset based on the page parameter
    setCurrentPage(pageParam ? Number(pageParam) : 1);
    setPageCount(Math.ceil(helpResources.length / itemsPerPage));
  }, [resources]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update the current items when the page offset changes.
  useEffect(() => {
    setCurrentItems(
      helpResources.slice(
        (currentPage - 1) * itemsPerPage,
        (currentPage - 1) * itemsPerPage + itemsPerPage
      )
    );
    setPageCount(Math.ceil(helpResources.length / itemsPerPage));
  }, [helpResources, currentPage, setPageCount, itemsPerPage]);

  // Reset pagination if itemsPerPage changes and the current page is greater than the new page count
  useEffect(() => {
    if (currentItems.length === 0) {
      params.set('page', '1');
      history.push({ search: params.toString() });
      setCurrentPage(1);
    }
  }, [currentItems]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sort the changes when the sort option changes.
  useEffect(() => {
    setHelpResources(handleSortOptions(helpResources, sort));
    setSortedResources(handleSortOptions(sortedResources, sort));
  }, [sort]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = () => {
    const nextPage = currentPage + 1;
    params.set('page', nextPage.toString());
    history.push({ search: params.toString() });
    setCurrentPage(nextPage);
  };

  const handlePrevious = () => {
    const prevPage = currentPage - 1;
    params.set('page', prevPage.toString());
    history.push({ search: params.toString() });
    setCurrentPage(prevPage);
  };

  const handlePageNumber = (
    event: React.MouseEvent<HTMLButtonElement>,
    pageNum: number
  ) => {
    params.set('page', pageNum.toString());
    history.push({ search: params.toString() });
    setCurrentPage(pageNum);
  };

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
              <Search
                query={query}
                resultsNum={resultsNum}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage - 1}
                setQuery={setQuery}
                results={helpResources as any}
                currentResults={currentItems as any}
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
                  value={sort}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    setSort(e.target.value as SortProps['value']);
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

const filterResourceArticles = (
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
