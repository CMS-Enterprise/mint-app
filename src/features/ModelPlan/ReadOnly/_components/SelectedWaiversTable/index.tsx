import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, Row, useSortBy, useTable } from 'react-table';
import { Button, Table as UswdsTable } from '@trussworks/react-uswds';
import { GetAllWaiverAssessmentSurveyQuery } from 'gql/generated/graphql';

import { getHeaderSortIcon, sortColumnValues } from 'utils/tableSort';

const LearnMoreButton = () => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* modal goes here */}
      <Button
        type="button"
        className="margin-y-0 margin-right-3 deep-underline mint-body-normal"
        unstyled
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        {waiverAssessmentSurveyMiscT(
          'selectedWaivers.readonlyColumns.viewDetails'
        )}
      </Button>
    </>
  );
};

type SelectedWaivers =
  GetAllWaiverAssessmentSurveyQuery['modelPlan']['questionnaires']['waiverAssessmentSurvey']['waivers'][number];

type ColumnType = SelectedWaivers & { actions: unknown };

const SelectedWaiversTable = ({
  selectedWaivers
}: {
  selectedWaivers: SelectedWaivers[];
}) => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );

  const columns: Column<ColumnType>[] = useMemo(
    () => [
      {
        Header: waiverAssessmentSurveyMiscT(
          'selectedWaivers.readonlyColumns.waiverName'
        ),
        accessor: row => row.commonWaiver.name
      },
      {
        Header: waiverAssessmentSurveyMiscT(
          'selectedWaivers.readonlyColumns.waiverCategory'
        ),
        accessor: row => row.commonWaiver.waiverType
      },
      {
        Header: waiverAssessmentSurveyMiscT(
          'selectedWaivers.readonlyColumns.actions'
        ),
        accessor: 'actions',
        Cell: ({ row }: { row: Row<ColumnType> }) => <LearnMoreButton />
      }
    ],
    [waiverAssessmentSurveyMiscT]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns: columns as Column<object>[],
        data: selectedWaivers,
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
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps()}
                scope="col"
                key={column.id}
                style={{ width: '33.333%' }}
                className="padding-left-2 padding-y-1 border-bottom-2px text-no-wrap"
                colSpan={1}
              >
                {column.id === 'actions' ? (
                  <p className="text-bold margin-0">
                    {column.render('Header') as React.ReactElement}
                  </p>
                ) : (
                  <Button
                    className="usa-button position-relative deep-underline margin-top-0"
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

export default SelectedWaiversTable;
