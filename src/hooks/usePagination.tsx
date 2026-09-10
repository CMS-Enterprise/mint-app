import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
} & React.HTMLAttributes<HTMLDivElement>;

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
  Pagination: React.ReactNode;
  Results: React.ReactNode;
} => {
  const location = useLocation();
  const navigate = useNavigate();

  const prevItemsRef = useRef(items);

  // Query parameters
  const params = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  const pageParam = withQueryParams ? params.get(withQueryParams) : undefined;

  const itemsLength = itemLength || items.length;

  // Total number of pages
  const pageCount = Math.max(1, Math.ceil(itemsLength / itemsPerPage));

  // Read directly from URL
  const urlPage =
    Number.isFinite(Number(pageParam)) && Number(pageParam) > 0
      ? Number(pageParam)
      : null;

  // page number when withQueryParams is not provided
  const [localPage, setLocalPage] = useState(1);

  const activePage = urlPage ?? localPage;

  // Current page number, either from URL or local state
  const currentPageNum = Math.min(Math.max(1, activePage), pageCount);

  // Current items to dsiplay on the current page - contains search and sort data
  const currentItems = useMemo(() => {
    const pageIndex = currentPageNum - 1;

    return sliceFn
      ? sliceFn(items, pageIndex, itemsPerPage)
      : items.slice(
          pageIndex * itemsPerPage,
          pageIndex * itemsPerPage + itemsPerPage
        );
  }, [items, currentPageNum, itemsPerPage, sliceFn]);

  const updatePage = (nextPage: number) => {
    if (withQueryParams) {
      params.set(withQueryParams, nextPage.toString());
      navigate({ search: params.toString() });
    } else {
      setLocalPage(nextPage);
    }
  };

  const handleNext = () => updatePage(currentPageNum + 1);

  const handlePrevious = () => updatePage(currentPageNum - 1);

  const handlePageNumber = (
    _event: React.MouseEvent<HTMLButtonElement>,
    pageNum: number
  ) => updatePage(pageNum);

  const pageOffset = (currentPageNum - 1) * itemsPerPage;

  // Reset page to 1 when items change
  useEffect(() => {
    // skip on initial load
    if (prevItemsRef.current !== items) {
      prevItemsRef.current = items;

      if (!withQueryParams) {
        setLocalPage(1); // reset params should be handled by parent component
      }
    }
  }, [items, withQueryParams]);

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
