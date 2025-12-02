import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Column,
  useFilters,
  useGlobalFilter,
  useSortBy,
  useTable
} from 'react-table';
import { Button, Icon, Table as UswdsTable } from '@trussworks/react-uswds';

import globalFilterCellText from 'utils/globalFilterCellText';
import { getHeaderSortIcon, sortColumnValues } from 'utils/tableSort';

import { SmeType } from '..';

const KeyContactTable = ({ smes }: { smes: SmeType[] }) => {
  const { t } = useTranslation('helpAndKnowledge');

  const columns: Column<SmeType>[] = useMemo(
    () => [
      {
        id: 'subjectArea',
        Header: t('keyContactDirectory.subjectArea'),
        accessor: 'subjectArea'
      },
      {
        id: 'name',
        Header: t('keyContactDirectory.sme'),
        accessor: ({ name, email }) => `${name} (${email})`
      }
      // {
      //  id: 'actions',
      //   Header: t('keyContactDirectory.actions'),
      //   accessor: 'actions'
      // }
    ],
    [t]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns: columns as Column<object>[],
        data: smes,
        sortTypes: {
          alphanumeric: (rowOne, rowTwo, columnName) => {
            return sortColumnValues(
              rowOne.values[columnName],
              rowTwo.values[columnName]
            );
          }
        },
        globalFilter: useMemo(() => globalFilterCellText, [])
      },
      useFilters,
      useGlobalFilter,
      useSortBy
    );

  rows.map(row => prepareRow(row));

  return (
    <UswdsTable
      bordered={false}
      {...getTableProps()}
      className="margin-y-0 padding-0"
      fullWidth
    >
      <thead>
        {headerGroups.map(headerGroup => (
          <tr
            {...headerGroup.getHeaderGroupProps()}
            key={{ ...headerGroup.getHeaderGroupProps() }.key}
          >
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps()}
                scope="col"
                key={column.id}
                className="padding-left-0 padding-bottom-1"
                colSpan={1}
              >
                {column.id === 'actions' ? (
                  <p className="text-bold">
                    {column.render('Header') as React.ReactElement}
                  </p>
                ) : (
                  <Button
                    className="usa-button position-relative deep-underline"
                    type="button"
                    unstyled
                    {...column.getSortByToggleProps()}
                  >
                    {column.render('Header') as React.ReactElement}
                    {getHeaderSortIcon(column, false)}
                  </Button>
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody {...getTableBodyProps()}>
        {rows.length === 0 && (
          <tr>
            <td
              className="border-0 padding-0"
              colSpan={headerGroups[0].headers.length}
            >
              {/* <Icon.Warning
                className="margin-right-1 top-2px text-warning"
                aria-label="warning"
              /> */}
              <p className="margin-top-1 text-italic w-full">
                {t('keyContactDirectory.noSmesInCategory')}
              </p>
            </td>
          </tr>
        )}
        {rows.map((row, i) => {
          prepareRow(row);
          const { getRowProps, cells, id } = { ...row };

          return (
            <tr {...getRowProps()} key={id}>
              {cells.map(cell => {
                return (
                  <td
                    {...cell.getCellProps()}
                    key={cell.getCellProps().key}
                    className="padding-left-0"
                  >
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </UswdsTable>
  );
};

export default KeyContactTable;
