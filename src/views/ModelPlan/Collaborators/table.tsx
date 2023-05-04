import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useSortBy, useTable } from 'react-table';
import { Table as UswdsTable } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import IconInitial from 'components/shared/IconInitial';
import { GetModelCollaborators_modelPlan_collaborators as CollaboratorType } from 'queries/Collaborators/types/GetModelCollaborators';
import { formatDateLocal } from 'utils/date';
import { translateTeamRole } from 'utils/modelPlan';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';

type TableProps = {
  collaborators: CollaboratorType[];
  setModalOpen: (isModalOpen: boolean) => void;
  setRemoveCollaborator: (removeUser: CollaboratorType) => void;
  isLastLead: boolean;
};

const CollaboratorsTable = ({
  collaborators,
  setModalOpen,
  setRemoveCollaborator,
  isLastLead
}: TableProps) => {
  const { modelID } = useParams<{ modelID: string }>();
  const { t } = useTranslation('newModel');

  const columns: any = useMemo(() => {
    return [
      {
        Header: t('table.name'),
        accessor: 'userAccount.commonName',
        Cell: ({ row, value }: any) => {
          return (
            <IconInitial
              className="margin-bottom-1"
              user={value}
              index={row.index}
            />
          );
        }
      },
      {
        Header: t('table.role'),
        accessor: 'teamRole',
        Cell: ({ row, value }: any) => {
          return <>{translateTeamRole(value)}</>;
        }
      },
      {
        Header: t('table.dateAdded'),
        accessor: 'createdDts',
        Cell: ({ value }: any) => {
          return formatDateLocal(value, 'MMMM d, yyyy');
        }
      },
      {
        Header: t('table.actions'),
        Cell: ({ row }: any) => {
          if (row.original.teamRole === 'MODEL_LEAD' && isLastLead) {
            return <></>;
          }
          return (
            <>
              <UswdsReactLink
                className="margin-right-2"
                to={`/models/${modelID}/collaborators/add-collaborator/${row.original.id}`}
                aria-label={`${t('table.edit')} ${
                  row.original.userAccount.commonName
                }`}
              >
                {t('table.edit')}
              </UswdsReactLink>

              {collaborators.length > 1 && (
                <button
                  className="usa-button usa-button--unstyled line-height-body-5 text-red"
                  type="button"
                  aria-label={`${t('modal.remove')} ${
                    row.original.userAccount.commonName
                  }`}
                  onClick={() => {
                    setRemoveCollaborator(row.original);
                    setModalOpen(true);
                  }}
                >
                  {t('modal.remove')}
                </button>
              )}
            </>
          );
        }
      }
    ];
  }, [
    t,
    modelID,
    setModalOpen,
    setRemoveCollaborator,
    collaborators.length,
    isLastLead
  ]);

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
        sortBy: useMemo(
          () => [{ id: 'userAccount.commonName', asc: true }],
          []
        ),
        pageIndex: 0
      }
    },
    useSortBy
  );

  return (
    <div className="collaborator-table">
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
                    paddingLeft: '0',
                    paddingBottom: '.5rem'
                  }}
                >
                  <button
                    className="usa-button usa-button--unstyled"
                    type="button"
                    {...column.getSortByToggleProps()}
                  >
                    {column.render('Header')}
                    {getHeaderSortIcon(column, false)}
                  </button>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, i) => {
                  if (i === 0) {
                    return (
                      <th
                        {...cell.getCellProps()}
                        scope="row"
                        style={{
                          paddingLeft: '0',
                          borderBottom:
                            index === rows.length - 1 ? 'none' : 'auto'
                        }}
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
                        borderBottom:
                          index === rows.length - 1 ? 'none' : 'auto'
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
