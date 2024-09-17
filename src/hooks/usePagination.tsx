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
} & JSX.IntrinsicElements['div'];

// Takes in default props for Truss' Pagination component, items to paginates and returns the current items and the Pagination component
const usePagination = <T extends any[]>({
  className,
  items,
  itemsPerPage = 3,
  loading = false,
  query = '',
  withQueryParams
}: PaginationProps): {
  currentItems: T;
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

  // Total number of pages
  const [pageCount, setPageCount] = useState<number>(
    Math.floor(items.length / itemsPerPage)
  );

  // Current items to dsiplay on the current page - contains search and sort data
  const [currentItems, setCurrentItems] = useState(
    items.slice(
      currentPageNum * itemsPerPage,
      currentPageNum * itemsPerPage + itemsPerPage
    )
  );

  // Update the audit changes when the data is loaded.
  useEffect(() => {
    if (!loading) {
      setCurrentPageNum(defaultPage);
      setPageCount(Math.ceil(items.length / itemsPerPage));
    }
  }, [
    loading,
    items.length,
    itemsPerPage,
    history,
    params,
    withQueryParams,
    defaultPage
  ]);

  // Update the current items when the page offset changes.
  useEffect(() => {
    setCurrentItems(
      items.slice(
        (currentPageNum - 1) * itemsPerPage,
        (currentPageNum - 1) * itemsPerPage + itemsPerPage
      )
    );
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [items, currentPageNum, setPageCount, itemsPerPage]);

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
    Pagination: (
      <div className={classNames(className)}>
        {pageCount > 1 && (
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
        filteredRowLength={items.length}
        rowLength={items.length}
      />
    )
  };
};

export default usePagination;
