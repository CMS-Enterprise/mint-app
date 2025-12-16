import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, Row, useSortBy, useTable } from 'react-table';
import { Button, Table as UswdsTable } from '@trussworks/react-uswds';

import { Alert } from 'components/Alert';
import { getHeaderSortIcon, sortColumnValues } from 'utils/tableSort';

import { SmeType } from '../..';
import { KeyContactCategoryType } from '../CategoryModal';
import RemoveModal from '../RemoveModal';
import SmeModal from '../SmeModal';

const EditSmeButton = ({
  sme,
  allCategories
}: {
  sme: SmeType;
  allCategories: KeyContactCategoryType[];
}) => {
  const { t } = useTranslation('helpAndKnowledge');
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <SmeModal
        isOpen={isModalOpen}
        mode="edit"
        closeModal={() => setIsModalOpen(false)}
        contact={sme}
        allCategories={allCategories}
      />
      <Button
        type="button"
        className="margin-right-2 deep-underline"
        unstyled
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        {t('keyContactDirectory.editAction')}
      </Button>
    </>
  );
};

const RemoveSmeButton = ({ sme }: { sme: SmeType }) => {
  const { t } = useTranslation('helpAndKnowledge');
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <RemoveModal
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        removedObject={sme}
      />
      <Button
        type="button"
        className="text-error deep-underline"
        unstyled
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        {t('keyContactDirectory.removeAction')}
      </Button>
    </>
  );
};

type ColumnType = SmeType & { actions: unknown };

const KeyContactTable = ({
  smes,
  allCategories = [],
  isAssessmentTeam,
  isSearching
}: {
  smes: SmeType[];
  allCategories?: KeyContactCategoryType[];
  isAssessmentTeam: boolean;
  isSearching: boolean;
}) => {
  const { t } = useTranslation('helpAndKnowledge');

  const columns: Column<ColumnType>[] = useMemo(
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
      },
      {
        id: 'actions',
        Header: t('keyContactDirectory.actions'),
        accessor: 'actions',
        Cell: ({ row }: { row: Row<ColumnType> }) => {
          return (
            <div>
              <EditSmeButton sme={row.original} allCategories={allCategories} />

              <RemoveSmeButton sme={row.original} />
            </div>
          );
        }
      }
    ],
    [t, allCategories]
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
        }
      },
      useSortBy
    );

  return (
    <UswdsTable
      bordered={false}
      {...getTableProps()}
      className="margin-top-0 margin-bottom-3"
      fullWidth
    >
      <thead className="margin-x-2">
        {headerGroups.map(headerGroup => (
          <tr
            {...headerGroup.getHeaderGroupProps()}
            key={{ ...headerGroup.getHeaderGroupProps() }.key}
          >
            {headerGroup.headers
              .filter(column =>
                isAssessmentTeam ? column : column.id !== 'actions'
              )
              .map(column => (
                <th
                  {...column.getHeaderProps()}
                  scope="col"
                  key={column.id}
                  style={{ width: isAssessmentTeam ? '30%' : '50%' }}
                  className="padding-left-2 padding-bottom-1 padding-top-3"
                  colSpan={1}
                >
                  {column.id === 'actions' ? (
                    <p className="text-bold margin-0">
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
              {isSearching ? (
                <Alert type="warning" slim className="margin-top-2">
                  {t('keyContactDirectory.noSearchResults')}
                </Alert>
              ) : (
                <p className="margin-y-1 margin-left-2 text-italic w-full">
                  {t('keyContactDirectory.noSmesInCategory')}
                </p>
              )}
            </td>
          </tr>
        )}

        {rows.map((row, i) => {
          prepareRow(row);
          const { getRowProps, cells, id } = { ...row };

          return (
            <tr {...getRowProps()} key={id}>
              {cells
                .filter(cell =>
                  isAssessmentTeam ? cell : cell.column.id !== 'actions'
                )
                .map(cell => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      key={cell.getCellProps().key}
                      className="padding-left-2"
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
