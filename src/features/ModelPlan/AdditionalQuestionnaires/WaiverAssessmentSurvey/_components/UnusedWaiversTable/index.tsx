import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Column, Row, useSortBy, useTable } from 'react-table';
import { Button, Table as UswdsTable } from '@trussworks/react-uswds';
import { CommonWaiverFragment } from 'gql/generated/graphql';

import { getHeaderSortIcon, sortColumnValues } from 'utils/tableSort';

const LearnMoreButton = ({ waiverId }: { waiverId: string }) => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );
  const [, setSearchParams] = useSearchParams();

  return (
    <Button
      type="button"
      className="margin-y-0 margin-right-3 deep-underline mint-body-normal"
      unstyled
      onClick={() => {
        setSearchParams(prev => {
          const nextParams = new URLSearchParams(prev);
          nextParams.set('waiverId', waiverId);
          return nextParams;
        });
      }}
    >
      {waiverAssessmentSurveyMiscT(
        'waiverSelectionAndConfirmation.learnMoreAboutThisWaiver'
      )}
    </Button>
  );
};

const AddUnusedWaiverButton = ({
  waiver,
  onAddUnusedWaiver
}: {
  waiver: CommonWaiverFragment;
  onAddUnusedWaiver: (waiver: CommonWaiverFragment) => void;
}) => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );

  return (
    <Button
      type="button"
      className="margin-y-0 deep-underline mint-body-normal"
      unstyled
      onClick={() => onAddUnusedWaiver(waiver)}
    >
      {waiverAssessmentSurveyMiscT(
        'waiverSelectionAndConfirmation.iPlanToUseThisWaiver'
      )}
    </Button>
  );
};

type UnusedWaiverType = CommonWaiverFragment[][number];
type ColumnType = UnusedWaiverType & { actions: unknown };

type UnusedWaiversTableProps = {
  unusedWaivers: UnusedWaiverType[];
  onAddUnusedWaiver: (waiver: CommonWaiverFragment) => void;
};

const UnusedWaiversTable = ({
  unusedWaivers,
  onAddUnusedWaiver
}: UnusedWaiversTableProps) => {
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
              <LearnMoreButton waiverId={row.original.id} />
              <AddUnusedWaiverButton
                waiver={row.original}
                onAddUnusedWaiver={onAddUnusedWaiver}
              />
            </div>
          );
        }
      }
    ],
    [onAddUnusedWaiver, waiverAssessmentSurveyMiscT]
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

  if (unusedWaivers.length === 0) {
    return null;
  }

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
          {rows.map(row => {
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
