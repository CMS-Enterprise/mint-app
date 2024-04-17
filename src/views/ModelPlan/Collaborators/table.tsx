import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { useSortBy, useTable } from 'react-table';
import { Table as UswdsTable } from '@trussworks/react-uswds';
import { TeamRole } from 'gql/gen/graphql';
import { GetModelCollaborators_modelPlan_collaborators as CollaboratorType } from 'gql/gen/types/GetModelCollaborators';

import UswdsReactLink from 'components/LinkWrapper';
import { Avatar } from 'components/shared/Avatar';
import { formatDateLocal } from 'utils/date';
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

  const { t: collaboratorsT } = useTranslation('collaborators');
  const { t: collaboratorsMiscT } = useTranslation('collaboratorsMisc');

  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const manageOrAdd = params.get('view') || 'manage';

  const columns: any = useMemo(() => {
    return [
      {
        Header: collaboratorsMiscT('table.name'),
        accessor: 'userAccount.commonName',
        Cell: ({ value }: any) => {
          return <Avatar user={value} />;
        }
      },
      {
        Header: collaboratorsMiscT('table.role'),
        accessor: 'teamRoles',

        Cell: ({ value }: any) => {
          const modelLeadFirst = [
            ...value.filter((role: TeamRole) => role === TeamRole.MODEL_LEAD),
            ...value.filter((role: TeamRole) => role !== TeamRole.MODEL_LEAD)
          ];
          return modelLeadFirst
            .map((role: TeamRole) => {
              return collaboratorsT(`teamRoles.options.${role}`);
            })
            .join(', ');
        }
      },
      {
        Header: collaboratorsMiscT('table.dateAdded'),
        accessor: 'createdDts',
        Cell: ({ value }: any) => {
          return formatDateLocal(value, 'MMMM d, yyyy');
        }
      },
      {
        Header: collaboratorsMiscT('table.actions'),
        Cell: ({ row }: any) => {
          return (
            <>
              <UswdsReactLink
                className="margin-right-2"
                to={`/models/${modelID}/collaborators/add-collaborator/${row.original.id}?view=${manageOrAdd}`}
                aria-label={`${collaboratorsMiscT('table.edit')} ${
                  row.original.userAccount.commonName
                }`}
              >
                {collaboratorsMiscT('table.edit')}
              </UswdsReactLink>
              {!(
                row.original.teamRoles.includes(TeamRole.MODEL_LEAD) &&
                isLastLead
              ) &&
                collaborators.length > 1 && (
                  <button
                    className="usa-button usa-button--unstyled line-height-body-5 text-red"
                    type="button"
                    aria-label={`${collaboratorsMiscT('modal.remove')} ${
                      row.original.userAccount.commonName
                    }`}
                    onClick={() => {
                      setRemoveCollaborator(row.original);
                      setModalOpen(true);
                    }}
                  >
                    {collaboratorsMiscT('modal.remove')}
                  </button>
                )}
            </>
          );
        }
      }
    ];
  }, [
    collaboratorsT,
    collaboratorsMiscT,
    modelID,
    setModalOpen,
    setRemoveCollaborator,
    collaborators.length,
    isLastLead,
    manageOrAdd
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
            rowTwo.values[columnName],
            TeamRole.MODEL_LEAD
          );
        }
      },
      autoResetSortBy: false,
      autoResetPage: false,
      initialState: {
        pageIndex: 0
      }
    },
    useSortBy
  );

  return (
    <div className="collaborator-table">
      <UswdsTable bordered={false} {...getTableProps()} fullWidth>
        <caption className="usa-sr-only">
          {collaboratorsMiscT('requestsTable.caption')}
        </caption>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  aria-sort={getColumnSortStatus(column)}
                  className="table-header"
                  scope="col"
                  style={{
                    paddingBottom: '.5rem'
                  }}
                >
                  <button
                    className="usa-button usa-button--unstyled position-relative"
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
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        whiteSpace: 'normal'
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
