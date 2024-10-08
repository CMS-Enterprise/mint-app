import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CardGroup, Pagination } from '@trussworks/react-uswds';
import i18n from 'config/i18n';
import ArticleCard from 'features/HelpAndKnowledge/Articles/_components/ArticleCard';
import Search from 'features/ModelPlan/ChangeHistory/components/Search';
import i18next from 'i18next';

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
  value: 'newest' | 'oldest';
  label: string;
};

// Sort options for the select dropdown
const sortOptions: SortProps[] = [
  {
    value: 'newest',
    label: i18n.t('changeHistory:sort.newest')
  },
  {
    value: 'oldest',
    label: i18n.t('changeHistory:sort.oldest')
  }
];

const HelpCardGroup = ({
  className,
  resources,
  showFirstThree,
  tag,
  pagination = false
}: HelpCardGroupType) => {
  const articleNames = tObject<HelpArticle>(
    'helpAndKnowledge:helpArticleNames'
  );

  const history = useHistory();

  // Query parameters
  const params = new URLSearchParams(history.location.search);
  const pageParam = params.get('page') || '1';
  const queryParam = params.get('query');
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
  const itemsPerPage = 9;

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
  }, [helpResources, currentPage, setPageCount]);

  // Sort the changes when the sort option changes.
  useEffect(() => {
    // setHelpResources(handleSortOptions(helpResources, sort));
    // setSortedResources(handleSortOptions(articles, sort));
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
      {resources.length > itemsPerPage && (
        <Search
          query={query}
          resultsNum={resultsNum}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage - 1}
          setQuery={setQuery}
          results={helpResources as any}
          currentResults={currentItems as any}
        />
      )}

      <CardGroup className={className}>
        {firstThreeArticles.map(article => (
          <>
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
          </>
        ))}
      </CardGroup>

      {/* Pagination */}
      {resources.length > itemsPerPage && pageCount > 1 && (
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

export default HelpCardGroup;
