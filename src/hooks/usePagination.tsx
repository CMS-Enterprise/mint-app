import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Pagination as TrussPagination } from '@trussworks/react-uswds';
import classNames from 'classnames';

import TableResults from 'components/TableResults';

type PaginationProps = {
  className?: string;
  items: any[];
  itemsPerPage: number;
  loading?: boolean;
  query?: string;
  withQueryParams?: string; // Query parameter to use for pagination - ex: withQueryParams: 'page' -> ?page=1'
  sliceFn?: (items: any[], start: number, end: number) => any[];
  itemLength?: number;
  showPageIfOne?: boolean; // Show page component even if there is only one page
} & JSX.IntrinsicElements['div'];

type PaginationState = {
  currentPage: number;
  pageCount: number;
};

// Takes in default props for Truss' Pagination component, items to paginates and returns the current items and the Pagination component
const usePagination = <T extends any[]>({
  className,
  items,
  itemsPerPage = 3,
  loading = false,
  query = '',
  withQueryParams,
  sliceFn,
  itemLength,
  showPageIfOne
}: PaginationProps): {
  currentItems: T;
  pagination: PaginationState;
  Pagination: JSX.Element;
  Results: JSX.Element;
} => {
  const location = useLocation();
  const history = useHistory();

  // Query parameters
  const params = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  const pageParam = withQueryParams ? params.get(withQueryParams) : undefined;

  const defaultPage = pageParam ? Number(pageParam) : 1;

  // Current page number
  const [currentPageNum, setCurrentPageNum] = useState<number>(defaultPage);

  const itemsLength = itemLength || items.length;

  // Total number of pages
  const [pageCount, setPageCount] = useState<number>(
    Math.floor(itemsLength / itemsPerPage)
  );

  // Current items to dsiplay on the current page - contains search and sort data
  const [currentItems, setCurrentItems] = useState(
    sliceFn
      ? sliceFn(items, currentPageNum - 1, itemsPerPage)
      : items.slice(
          currentPageNum * itemsPerPage,
          currentPageNum * itemsPerPage + itemsPerPage
        )
  );

  // Update the audit changes when the data is loaded.
  useEffect(() => {
    if (!loading) {
      setCurrentPageNum(defaultPage);
      setPageCount(Math.ceil(itemsLength / itemsPerPage));
    }
  }, [
    loading,
    itemsLength,
    itemsPerPage,
    history,
    params,
    withQueryParams,
    defaultPage
  ]);

  // Update the current items when the page offset changes.
  useEffect(() => {
    setCurrentItems(
      sliceFn
        ? sliceFn(items, currentPageNum - 1, itemsPerPage)
        : items.slice(
            (currentPageNum - 1) * itemsPerPage,
            (currentPageNum - 1) * itemsPerPage + itemsPerPage
          )
    );
    setPageCount(Math.ceil(itemsLength / itemsPerPage));
  }, [items, currentPageNum, setPageCount, itemsPerPage, sliceFn, itemsLength]);

  const handleNext = () => {
    const nextPage = currentPageNum + 1;

    if (withQueryParams) {
      params.set(withQueryParams, nextPage.toString());
      history.push({ search: params.toString() });
    }

    setCurrentPageNum(nextPage);
  };

  const handlePrevious = () => {
    const prevPage = currentPageNum - 1;

    if (withQueryParams) {
      params.set(withQueryParams, prevPage.toString());
      history.push({ search: params.toString() });
    }

    setCurrentPageNum(prevPage);
  };

  const handlePageNumber = (
    event: React.MouseEvent<HTMLButtonElement>,
    pageNum: number
  ) => {
    if (withQueryParams) {
      params.set(withQueryParams, pageNum.toString());
      history.push({ search: params.toString() });
    }

    setCurrentPageNum(pageNum);
  };

  const pageOffset = (currentPageNum - 1) * itemsPerPage;

  return {
    currentItems: currentItems as T,
    pagination: {
      currentPage: currentPageNum,
      pageCount
    },
    Pagination: (
      <div className={classNames(className)}>
        {(pageCount > 1 || (pageCount === 1 && showPageIfOne)) && (
          <TrussPagination
            className="mint-pagination"
            pathname={location.pathname}
            currentPage={currentPageNum}
            maxSlots={7}
            onClickNext={handleNext}
            onClickPageNumber={handlePageNumber}
            onClickPrevious={handlePrevious}
            totalPages={pageCount}
          />
        )}
      </div>
    ),
    Results: (
      <TableResults
        globalFilter={query}
        pageIndex={pageOffset / itemsPerPage}
        pageSize={itemsPerPage}
        filteredRowLength={itemsLength}
        rowLength={itemsLength}
      />
    )
  };
};

export default usePagination;
