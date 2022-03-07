import React from 'react';
import { HeaderGroup } from 'react-table';
import {
  IconExpandLess,
  IconExpandMore,
  IconUnfoldMore
} from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

export type sortColumnProps = null | string | number | DateTime;
export type columnStatusProps = 'descending' | 'ascending' | 'none';

// Populates 'aria-sort' on table elements based on sort status
export const getColumnSortStatus = <T extends {}>(
  column: HeaderGroup<T>
): columnStatusProps => {
  if (column.isSorted) {
    if (column.isSortedDesc) {
      return 'descending';
    }
    return 'ascending';
  }

  return 'none';
};

// Returns header sort icon based on sort status
export const getHeaderSortIcon = <T extends {}>(column: HeaderGroup<T>) => {
  const sharedClassName = 'margin-left-05 position-absolute';
  if (!column.isSorted) {
    return (
      <IconUnfoldMore className={sharedClassName} data-testid="caret--sort" />
    );
  }

  if (column.isSortedDesc) {
    return (
      <IconExpandMore className={sharedClassName} data-testid="caret--down" />
    );
  }

  return <IconExpandLess className={sharedClassName} data-testid="caret--up" />;
};

// Description beneath tables for sorting status
export const currentTableSortDescription = <T extends {}>(headerGroup: {
  headers: HeaderGroup<T>[];
}) => {
  const sortedHeader = headerGroup.headers.find(
    (header: HeaderGroup<T>) => header.isSorted
  );

  if (sortedHeader) {
    const direction = sortedHeader.isSortedDesc ? 'descending' : 'ascending';
    return `Requests table sorted by ${sortedHeader.Header} ${direction}`;
  }
  return 'Requests table reset to default sort order';
};

export const sortColumnValues = (
  rowOneElem: sortColumnProps,
  rowTwoElem: sortColumnProps
) => {
  // Null checks for columns with data potentially empty (LCID Expiration, Admin Notes, etc.)
  if (rowOneElem === null) {
    return 1;
  }

  if (rowTwoElem === null) {
    return -1;
  }

  // If string and number, sort out number first
  if (typeof rowOneElem === 'number' && typeof rowTwoElem === 'string') {
    return 1;
  }

  // If string and number, sort out number first
  if (typeof rowOneElem === 'string' && typeof rowTwoElem === 'number') {
    return -1;
  }

  // If string/number and datetime, sort out datetimes
  if (
    rowOneElem instanceof DateTime &&
    (typeof rowTwoElem === 'string' || typeof rowTwoElem === 'number')
  ) {
    return 1;
  }

  // If string/number and datetime, sort out datetimes
  if (
    rowTwoElem instanceof DateTime &&
    (typeof rowOneElem === 'string' || typeof rowOneElem === 'number')
  ) {
    return -1;
  }

  // If both items are strings, enforce capitalization (temporarily) and then compare
  if (typeof rowOneElem === 'string' && typeof rowTwoElem === 'string') {
    return rowOneElem.toUpperCase() > rowTwoElem.toUpperCase() ? 1 : -1;
  }

  // Default case if both are number/datetime
  return rowOneElem > rowTwoElem ? 1 : -1;
};
