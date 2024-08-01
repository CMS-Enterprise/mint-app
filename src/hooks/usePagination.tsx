import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Pagination as TrussPagination } from '@trussworks/react-uswds';
import classNames from 'classnames';

type PaginationProps = {
  className?: string;
  items: any[];
  itemsPerPage: number;
  loading?: boolean;
} & {
  pathname?: string;
  currentPage?: number;
  onClickNext?: () => void;
  onClickPrevious?: () => void;
  onClickPageNumber?: (
    event: React.MouseEvent<HTMLButtonElement>,
    page: number
  ) => void;
} & JSX.IntrinsicElements['div'];

// Takes in default props for Truss' Pagination component, items to paginates and returns the current items and the Pagination component
const usePagination = <T extends any[]>({
  className,
  items,
  itemsPerPage = 3,
  loading = false,
  pathname,
  currentPage,
  onClickPrevious,
  onClickNext,
  onClickPageNumber
}: PaginationProps): { currentItems: T; Pagination: JSX.Element } => {
  const location = useLocation();

  // Current page number
  const [currentPageNum, setCurrentPageNum] = useState<number>(
    currentPage || 1
  );

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
      setCurrentPageNum(1);
      setPageCount(Math.ceil(items.length / itemsPerPage));
    }
  }, [loading, items.length, itemsPerPage]);

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
    setCurrentPageNum(nextPage);
  };

  const handlePrevious = () => {
    const prevPage = currentPageNum - 1;
    setCurrentPageNum(prevPage);
  };

  const handlePageNumber = (
    event: React.MouseEvent<HTMLButtonElement>,
    pageNum: number
  ) => {
    setCurrentPageNum(pageNum);
  };

  return {
    currentItems: currentItems as T,
    Pagination: (
      <div className={classNames(className)}>
        {pageCount > 1 && (
          <TrussPagination
            pathname={pathname || location.pathname}
            currentPage={currentPageNum}
            maxSlots={7}
            onClickNext={onClickNext || handleNext}
            onClickPageNumber={onClickPageNumber || handlePageNumber}
            onClickPrevious={onClickPrevious || handlePrevious}
            totalPages={pageCount}
          />
        )}
      </div>
    )
  };
};

export default usePagination;
