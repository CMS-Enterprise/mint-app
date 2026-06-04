import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Column, Row, useSortBy, useTable } from 'react-table';
import { Button, Table as UswdsTable } from '@trussworks/react-uswds';
import WaiverInfoPanel from 'features/ModelPlan/AdditionalQuestionnaires/WaiverAssessmentSurvey/_components/WaiverInfoPanel';
import { GetAllWaiverAssessmentSurveyQuery } from 'gql/generated/graphql';

import { getHeaderSortIcon, sortColumnValues } from 'utils/tableSort';

const LearnMoreButton = ({
  selectedWaiver
}: {
  selectedWaiver: SelectedWaiver;
}) => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const shouldPanelOpen = searchParams.get('waiverId') === selectedWaiver.id;

  const handleLearnMore = () => {
    setSearchParams(prev => {
      const nextParams = new URLSearchParams(prev);
      nextParams.set('waiverId', selectedWaiver.id);
      return nextParams;
    });
  };

  return (
    <>
      {/* Selected waiver at this point should be willUseWaiver and has no notUsingReason */}
      {shouldPanelOpen && (
        <WaiverInfoPanel
          waiverInfo={{
            willUseWaiver: true,
            notUsingReason: ''
          }}
        />
      )}

      <Button
        type="button"
        className="margin-y-0 margin-right-3 deep-underline mint-body-normal"
        unstyled
        onClick={handleLearnMore}
      >
        {waiverAssessmentSurveyMiscT(
          'selectedWaivers.readonlyColumns.viewDetails'
        )}
      </Button>
    </>
  );
};

type SelectedWaiver =
  GetAllWaiverAssessmentSurveyQuery['modelPlan']['questionnaires']['waiverAssessmentSurvey']['waivers'][number];

type ColumnType = SelectedWaiver & { actions: unknown };

const SelectedWaiversTable = ({
  selectedWaivers
}: {
  selectedWaivers: SelectedWaiver[];
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
        Cell: ({ row }: { row: Row<ColumnType> }) => (
          <LearnMoreButton selectedWaiver={row.original} />
        )
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
    <>
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
    </>
  );
};

export default SelectedWaiversTable;
