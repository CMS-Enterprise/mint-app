import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, Row, useSortBy, useTable } from 'react-table';
import { Button, Table as UswdsTable } from '@trussworks/react-uswds';
import { SuggestedCommonWaiverFragment } from 'gql/generated/graphql';

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
          'waiverSelectionAndConfirmation.learnMoreAboutThisWaiver'
        )}
      </Button>
    </>
  );
};

const IPlanToUseButton = () => {
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
        className="margin-y-0 deep-underline mint-body-normal"
        unstyled
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        {waiverAssessmentSurveyMiscT(
          'waiverSelectionAndConfirmation.iPlanToUseThisWaiver'
        )}
      </Button>
    </>
  );
};

type UnusedWaiverType = SuggestedCommonWaiverFragment[][number];
type ColumnType = UnusedWaiverType & { actions: unknown };

const UnusedWaiversTable = ({
  unusedWaivers
}: {
  unusedWaivers: UnusedWaiverType[];
}) => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );

  const columns: Column<ColumnType>[] = useMemo(
    () => [
      {
        Header: waiverAssessmentSurveyMiscT(
          'waiverSelectionAndConfirmation.unusedWaiver.name'
        ),
        accessor: row => row.name
      },
      {
        Header: waiverAssessmentSurveyMiscT(
          'waiverSelectionAndConfirmation.unusedWaiver.action'
        ),
        accessor: 'actions',
        Cell: ({ row }: { row: Row<ColumnType> }) => {
          return (
            <div className="display-flex">
              <LearnMoreButton />
              <IPlanToUseButton />
            </div>
          );
        }
      }
    ],
    [waiverAssessmentSurveyMiscT]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns: columns as Column<object>[],
        data: unusedWaivers,
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
    <div>
      <h4 className="margin-top-0 margin-bottom-05">
        {waiverAssessmentSurveyMiscT(
          'waiverSelectionAndConfirmation.unusedWaiver.heading'
        )}
      </h4>
      <p className="mint-body-normal margin-top-0 margin-bottom-2">
        {waiverAssessmentSurveyMiscT(
          'waiverSelectionAndConfirmation.unusedWaiver.description'
        )}
      </p>

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
                  style={{ width: '50%' }}
                  className="padding-left-2 padding-y-1 border-bottom-2px"
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
    </div>
  );
};

export default UnusedWaiversTable;
