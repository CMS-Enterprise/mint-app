import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Sort options type for the select dropdown
type SortProps<K> = {
  value: K;
  label: string;
};

// Props for the SearchSortPagination hook
type SearchSortPaginationProps<T, K> = {
  items: T[];
  sortOptions: SortProps<K>[];
  filterFunction: (query: string, items: T[]) => T[];
  sortFunction: (items: T[], sort: K) => T[];
  defaultItemsPerPage?: number;
} & JSX.IntrinsicElements['div'];

/**
 * useSearchSortPagination is a hook that handles search, sort, and pagination for a list of items.
 *
 * @param {T[]} props.items - The list of items to be managed.
 * @param {SortProps<K>[]} props.sortOptions - The available sort options.
 * @param {(query: string, items: T[]) => T[]} props.filterFunction - The function to filter items based on a query.
 * @param {(items: T[], sort: K) => T[]} props.sortFunction - The function to sort items based on a sort option.
 *
 * @returns {Object} The state and handlers for managing search, sort, and pagination.
 * @returns {T[]} return.sortedItems - The sorted list of items.
 * @returns {T[]} return.searchAndSortedItems - The list of items after applying search and sort.
 * @returns {K} return.sort - The current sort option.
 * @returns {string} return.query - The current search query.
 * @returns {number} return.itemsPerPage - The number of items per page.
 * @returns {number} return.currentPage - The current page number.
 * @returns {number} return.pageCount - The total number of pages.
 * @returns {T[]} return.currentItems - The list of items to be displayed on the current page.
 * @returns {(query: string) => void} return.setQuery - The function to set the search query.
 * @returns {(sort: K) => void} return.setSort - The function to set the sort option.
 * @returns {(page: number) => void} return.setCurrentPage - The function to set the current page number.
 * @returns {(itemsPerPage: number) => void} return.setItemsPerPage - The function to set the number of items per page.
 */

const useSearchSortPagination = <T, K extends string>({
  items,
  sortOptions,
  filterFunction,
  sortFunction,
  defaultItemsPerPage = 9
}: SearchSortPaginationProps<T, K>) => {
  const history = useHistory();

  // Query parameters
  const params = new URLSearchParams(history.location.search);
  const pageParam = params.get('page') || '1';
  const queryParam = params.get('query');
  const sortParam = params.get('sort') as SortProps<K>['value'];

  // Contains the sorted changes based on select/sort option
  const [sortedItems, setSortedItems] = useState([...items]);

  // Contains the current set of changes to display, including search and sort
  const [searchAndSortedItems, setSearchAndSortedItems] = useState([...items]);

  // Contains sort state of select option dropdown
  const [sort, setSort] = useState<K>(sortOptions[0].value);

  // Search/query configuration
  const [query, setQuery] = useState<string>('');

  // Pagination Configuration
  const [itemsPerPage, setItemsPerPage] = useState<number>(defaultItemsPerPage);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [pageCount, setPageCount] = useState<number>(
    Math.floor(searchAndSortedItems.length / itemsPerPage)
  );

  // Current items to dsiplay on the current page - contains search and sort data
  const [currentItems, setCurrentItems] = useState<T[]>(
    searchAndSortedItems.slice(
      currentPage * itemsPerPage,
      currentPage * itemsPerPage + itemsPerPage
    )
  );

  // searchChanges is a function to filter audits based on query
  const searchChanges = useCallback(filterFunction, [filterFunction]);

  //  If no query, return all solutions, otherwise, matching query solutions
  useEffect(() => {
    if (query.trim()) {
      const filteredAudits = searchChanges(query, sortedItems);

      // Sets audit changes based on the filtered audits
      setSearchAndSortedItems(filteredAudits);
    } else {
      // Sets the default audits if no query present
      setSearchAndSortedItems(sortedItems);
    }

    // Update the URL's query parameters
    if (query.trim()) {
      params.set('query', query);
      params.set('page', '1');
    } else {
      // Delete the 'query' parameter
      params.delete('query');
    }

    history.push({ search: params.toString() });

    // Return the page to the first page when the query changes
    setCurrentPage(1);
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update the audit changes when the data is loaded.
  useEffect(() => {
    setSearchAndSortedItems([...items]);
    setSortedItems([...items]);

    // Set the sort based on the sort query parameter or default value
    setSort(sortParam || sortOptions[0].value);

    setTimeout(() => {
      // Set the query based on the query parameter
      setQuery(queryParam || '');
    }, 0);

    // Set the page offset based on the page parameter
    setCurrentPage(pageParam ? Number(pageParam) : 1);
    setPageCount(Math.ceil(searchAndSortedItems.length / itemsPerPage));
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update the current items when the page offset changes.
  useEffect(() => {
    setCurrentItems(
      searchAndSortedItems.slice(
        (currentPage - 1) * itemsPerPage,
        (currentPage - 1) * itemsPerPage + itemsPerPage
      )
    );
    setPageCount(Math.ceil(searchAndSortedItems.length / itemsPerPage));
  }, [searchAndSortedItems, currentPage, setPageCount, itemsPerPage]);

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
    setSearchAndSortedItems(sortFunction(searchAndSortedItems, sort));
    setSortedItems(sortFunction(sortedItems, sort));
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

  return {
    allItems: searchAndSortedItems,
    currentItems,
    pagination: {
      currentPage,
      handleNext,
      handlePageNumber,
      handlePrevious,
      pageCount
    },
    sort: {
      sorted: sort,
      setSorted: setSort,
      sortOptions
    },
    search: {
      query,
      setQuery,
      rowLength: searchAndSortedItems.length
    },
    pageSize: {
      itemsPerPage,
      setItemsPerPage
    }
  };
};

export default useSearchSortPagination;
