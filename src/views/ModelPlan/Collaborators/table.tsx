import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useSortBy, useTable } from 'react-table';
import { Table as UswdsTable } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import Alert from 'components/shared/Alert';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';

// TEMP: collaborator types
type Collaborator = {
  id: string;
  modelPlanID: string;
  euaUserID: string;
  fullName: string;
  cmsCenter: string;
  teamRole: string;
};

// TEMP: collaborator types
type TableProps = {
  collaborators: Collaborator[];
  setModalOpen: () => void;
};

const CollaboratorsTable = ({ collaborators, setModalOpen }: TableProps) => {
  const { modelId } = useParams<{ modelId: string }>();
  const { t } = useTranslation('newModel');

  const columns: any = useMemo(() => {
    // TODO: Import collaborator types
    return [
      {
        Header: t('table.name'),
        accessor: 'fullName'
      },
      {
        Header: t('table.role'),
        accessor: 'teamRole'
      },
      {
        Header: t('table.dateAdded'),
        accessor: 'createdAt'
      },
      {
        Header: t('table.actions'),
        Cell: ({ row }: any) => {
          return (
            <UswdsReactLink
              to={`/models/new-plan/${modelId}/add-collaborator/${row.original.id}`}
            >
              {t('table.edit')}
            </UswdsReactLink>
          );
        }
      }
    ];
  }, [t, modelId]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data: collaborators,
      sortTypes: {
        alphanumeric: (rowOne, rowTwo, columnName) => {
          return sortColumnValues(
            rowOne.values[columnName],
            rowTwo.values[columnName]
          );
        }
      },
      autoResetSortBy: false,
      autoResetPage: false,
      initialState: {
        sortBy: useMemo(() => [{ id: 'modelName', asc: true }], []),
        pageIndex: 0
      }
    },
    useSortBy
  );

  if (collaborators.length === 0) {
    return (
      <Alert type="info" heading={t('requestsTable.empty.heading')}>
        {t('requestsTable.empty.body')}
      </Alert>
    );
  }

  return (
    <div className="model-plan-table">
      <UswdsTable bordered={false} {...getTableProps()} fullWidth scrollable>
        <caption className="usa-sr-only">{t('requestsTable.caption')}</caption>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => (
                <th
                  {...column.getHeaderProps()}
                  aria-sort={getColumnSortStatus(column)}
                  className="table-header"
                  scope="col"
                  style={{
                    paddingLeft: '0'
                  }}
                >
                  <button
                    className="usa-button usa-button--unstyled"
                    type="button"
                    {...column.getSortByToggleProps()}
                  >
                    {column.render('Header')}
                    {getHeaderSortIcon(column)}
                  </button>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, i) => {
                  if (i === 0) {
                    return (
                      <th
                        {...cell.getCellProps()}
                        scope="row"
                        style={{ paddingLeft: '0', verticalAlign: 'top' }}
                      >
                        {cell.render('Cell')}
                      </th>
                    );
                  }
                  return (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        paddingLeft: '0',
                        verticalAlign: 'top'
                      }}
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

      <div
        className="usa-sr-only usa-table__announcement-region"
        aria-live="polite"
      >
        {currentTableSortDescription(headerGroups[0])}
      </div>
    </div>
  );
};

export default CollaboratorsTable;
