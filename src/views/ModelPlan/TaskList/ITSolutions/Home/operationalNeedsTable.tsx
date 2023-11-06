/* eslint react/prop-types: 0 */

/*
Table component for rendering both Other Operational Needs and Operational Need Solutions
Queries operationalNeeds which contains possible needs and needs
Can render table of type GetOperationalNeeds_modelPlan_operationalNeeds or GetOperationalNeeds_modelPlan_operationalNeeds_solutions_solutions
*/

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import {
  CellProps,
  Column,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { useQuery } from '@apollo/client';
import { IconArrowForward, Table as UswdsTable } from '@trussworks/react-uswds';
import classNames from 'classnames';
import i18next from 'i18next';
import { useFlags } from 'launchdarkly-react-client-sdk';

import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import GlobalClientFilter from 'components/TableFilter';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
import operationalNeedMap from 'data/operationalNeedMap';
import GetOperationalNeeds from 'queries/ITSolutions/GetOperationalNeeds';
import {
  GetOperationalNeeds as GetOperationalNeedsType,
  GetOperationalNeeds_modelPlan_operationalNeeds as GetOperationalNeedsOperationalNeedsType,
  GetOperationalNeedsVariables
} from 'queries/ITSolutions/types/GetOperationalNeeds';
import { formatDateUtc } from 'utils/date';
import globalFilterCellText from 'utils/globalFilterCellText';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';
import { isAssessment } from 'utils/user';

import OperationalNeedsStatusTag, {
  OperationalNeedsSolutionsStatus
} from '../_components/NeedsStatus';
import {
  filterNeedsFormatSolutions,
  filterPossibleNeeds,
  returnActionLinks,
  returnActionText
} from '../util';

export interface GetOperationalNeedsTableType
  extends GetOperationalNeedsOperationalNeedsType {
  status: OperationalNeedsSolutionsStatus;
  needID: string;
}

type OperationalNeedsTableProps = {
  hiddenColumns?: string[];
  modelID: string;
  type: 'needs' | 'possibleNeeds';
  readOnly?: boolean;
};

const OperationalNeedsTable = ({
  hiddenColumns,
  modelID,
  type,
  readOnly
}: OperationalNeedsTableProps) => {
  const { t } = useTranslation('itSolutions');

  const { data, loading, error } = useQuery<
    GetOperationalNeedsType,
    GetOperationalNeedsVariables
  >(GetOperationalNeeds, {
    variables: {
      id: modelID
    }
  });

  const flags = useFlags();

  // Memoized function to return/filter possible needs and needed solutions
  const operationalNeeds = useMemo(() => {
    const needData = data?.modelPlan?.operationalNeeds
      ? data?.modelPlan?.operationalNeeds
      : ([] as GetOperationalNeedsOperationalNeedsType[]);

    return type === 'possibleNeeds'
      ? filterPossibleNeeds(needData)
      : filterNeedsFormatSolutions(needData);
  }, [data?.modelPlan?.operationalNeeds, type]);

  const isCollaborator = data?.modelPlan?.isCollaborator;

  const { groups } = useSelector((state: RootStateOrAny) => state.auth);

  const hasEditAccess: boolean = isCollaborator || isAssessment(groups, flags);

  const hiddenTableColumns = [...(hiddenColumns || [])];

  if (!hasEditAccess) {
    hiddenTableColumns.push('Actions');
  }

  const needsColumns = useMemo<Column<any>[]>(() => {
    return [
      {
        Header: t<string>('itSolutionsTable.need'),
        accessor: 'needName'
      },
      {
        Header: t<string>('itSolutionsTable.solution'),
        accessor: ({ name, nameOther, otherHeader }: any) => {
          if (!name && !nameOther) {
            return t('itSolutionsTable.selectSolution');
          }
          // Resturn custom name if exists, otherwise return standard solution name plus custom name if exists
          let solutionName = nameOther || name;

          if (otherHeader) {
            solutionName = `${solutionName} (${otherHeader})`;
          }

          return solutionName;
        },
        Cell: ({
          row,
          value
        }: CellProps<
          GetOperationalNeedsTableType,
          OperationalNeedsSolutionsStatus
        >): JSX.Element | string => {
          if (value === t('itSolutionsTable.selectSolution')) {
            if (!hasEditAccess) {
              return <span>{t('itSolutionsTable.noSolutionSelected')}</span>;
            }
            const selectSolutionHref =
              row.original.key !== null
                ? `/models/${modelID}/task-list/it-solutions/${row.original.id}/select-solutions`
                : `/models/${modelID}/task-list/it-solutions/${row.original.id}/add-solution?isCustomNeed=true`;
            return (
              <UswdsReactLink
                to={selectSolutionHref}
                className="display-flex flex-align-center"
              >
                {value}
                <IconArrowForward className="margin-left-1" />
              </UswdsReactLink>
            );
          }
          return value;
        }
      },
      {
        Header: t<string>('itSolutionsTable.finishBy'),
        accessor: ({ mustFinishDts }: any) => {
          if (mustFinishDts) {
            return formatDateUtc(mustFinishDts, 'MM/dd/yyyy');
          }
          return null;
        }
      },
      {
        Header: t<string>('itSolutionsTable.subtasks'),
        accessor: 'operationalSolutionSubtasks',
        Cell: ({
          row,
          value
        }: CellProps<
          GetOperationalNeedsTableType,
          OperationalNeedsSolutionsStatus
        >): string => {
          if (!row.original.name && !row.original.nameOther) {
            return '';
          }
          return value.length.toString();
        }
      },
      {
        Header: t<string>('itSolutionsTable.status'),
        accessor: 'status',
        Cell: ({
          row,
          value
        }: CellProps<
          GetOperationalNeedsTableType,
          OperationalNeedsSolutionsStatus
        >): JSX.Element => {
          return <OperationalNeedsStatusTag status={value} />;
        }
      },
      {
        Header: t<string>('itSolutionsTable.actions'),
        accessor: ({ status }: CellProps<GetOperationalNeedsTableType>) => {
          return returnActionText(status);
        },
        Cell: ({
          row
        }: CellProps<GetOperationalNeedsTableType>): JSX.Element => {
          return returnActionLinks(
            row.original.status,
            row.original,
            modelID,
            readOnly
          );
        }
      }
    ];
  }, [t, modelID, readOnly, hasEditAccess]);

  const possibleNeedsColumns = useMemo<Column<any>[]>(() => {
    return [
      {
        Header: t<string>('itSolutionsTable.need'),
        accessor: 'name'
      },
      {
        Header: t<string>('itSolutionsTable.section'),
        accessor: 'section',
        Cell: ({
          row,
          value
        }: CellProps<
          GetOperationalNeedsTableType,
          OperationalNeedsSolutionsStatus
        >): string => {
          if (row.original.key && operationalNeedMap[row.original.key]) {
            return i18next.t(
              `${operationalNeedMap[row.original.key].section}:heading`
            );
          }
          return '';
        }
      },
      {
        Header: t<string>('itSolutionsTable.status'),
        accessor: 'status',
        Cell: ({
          row,
          value
        }: CellProps<
          GetOperationalNeedsTableType,
          OperationalNeedsSolutionsStatus
        >): JSX.Element => {
          return <OperationalNeedsStatusTag status={value} />;
        }
      },
      {
        Header: t<string>('itSolutionsTable.actions'),
        Cell: ({
          row
        }: CellProps<GetOperationalNeedsTableType>): JSX.Element => {
          return returnActionLinks(row.original.status, row.original, modelID);
        }
      }
    ];
  }, [t, modelID]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    setGlobalFilter,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    page,
    state,
    rows,
    prepareRow
  } = useTable(
    {
      columns: type === 'needs' ? needsColumns : possibleNeedsColumns,
      data: operationalNeeds,
      sortTypes: {
        alphanumeric: (rowOne, rowTwo, columnName) => {
          return sortColumnValues(
            rowOne.values[columnName],
            rowTwo.values[columnName]
          );
        }
      },
      globalFilter: useMemo(() => globalFilterCellText, []),
      autoResetSortBy: false,
      autoResetPage: true,
      initialState: {
        sortBy: useMemo(
          () => [{ id: type === 'needs' ? 'needName' : 'name', asc: true }],
          [type]
        ),
        pageIndex: 0
      }
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  if (loading) {
    return <PageLoading />;
  }

  // Temp fix for `globalFilterCellText` to work with `page` rows
  // The filter function requires all rows to be prepped so that
  // `Column.Cell` is available during filtering
  rows.map(row => prepareRow(row));

  if (error) {
    return (
      <ErrorAlert
        testId="formik-validation-errors"
        classNames="margin-top-3"
        heading={t('itSolutionsTable.error.heading')}
      >
        <ErrorAlertMessage
          errorKey="error-it-solutions"
          message={t('itSolutionsTable.error.body')}
        />
      </ErrorAlert>
    );
  }

  if (readOnly && operationalNeeds.length === 0) {
    return (
      <Alert heading={t('itSolutionsTable.noNeedsReadonly')} type="info">
        {readOnly
          ? t('itSolutionsTable.noNeedsReadonlyEditInfo')
          : t('itSolutionsTable.noNeedsReadonlyInfo')}
      </Alert>
    );
  }

  return (
    <div className="model-plan-table" data-testid={`${type}-table`}>
      <div className="mint-header__basic">
        <GlobalClientFilter
          setGlobalFilter={setGlobalFilter}
          tableID={t('itSolutionsTable.id')}
          tableName={t('itSolutionsTable.title')}
          className="margin-bottom-4 width-mobile-lg maxw-full"
        />
      </div>

      <TableResults
        globalFilter={state.globalFilter}
        pageIndex={state.pageIndex}
        pageSize={state.pageSize}
        filteredRowLength={page.length}
        rowLength={operationalNeeds.length}
        className="margin-bottom-4"
      />

      <UswdsTable bordered={false} {...getTableProps()} fullWidth scrollable>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers
                .filter(
                  column =>
                    // @ts-ignore
                    !hiddenTableColumns?.includes(column.Header)
                )
                .map((column, index) => (
                  <th
                    {...column.getHeaderProps()}
                    aria-sort={getColumnSortStatus(column)}
                    className="table-header"
                    scope="col"
                    style={{
                      minWidth: '138px',
                      paddingBottom: '.5rem',
                      position: 'relative',
                      paddingLeft: index === 0 ? '.5em' : '0px',
                      width: index === 5 ? '235px' : 'auto'
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
          {page.map((row, index) => {
            return (
              <tr {...row.getRowProps()}>
                {row.cells
                  .filter(
                    cell =>
                      // @ts-ignore
                      !hiddenTableColumns?.includes(cell.column.Header)
                  )
                  .map((cell, i) => {
                    if (i === 0) {
                      return (
                        <th
                          {...cell.getCellProps()}
                          scope="row"
                          className={classNames('padding-x-1', {
                            'bg-base-lightest':
                              row.values.status === 'NOT_NEEDED'
                          })}
                          style={{
                            paddingLeft: '0',
                            borderBottom:
                              index === page.length - 1 ? 'none' : 'auto',
                            whiteSpace: 'normal'
                          }}
                        >
                          {cell.render('Cell')}
                        </th>
                      );
                    }
                    return (
                      <td
                        {...cell.getCellProps()}
                        className={classNames({
                          'bg-base-lightest': row.values.status === 'NOT_NEEDED'
                        })}
                        style={{
                          paddingLeft: '0',
                          whiteSpace: 'normal',
                          maxWidth: i === 1 ? '275px' : 'auto',
                          borderBottom:
                            index === page.length - 1 ? 'none' : 'auto'
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

      {operationalNeeds.length > 10 && (
        <TablePagination
          gotoPage={gotoPage}
          previousPage={previousPage}
          nextPage={nextPage}
          canNextPage={canNextPage}
          pageIndex={state.pageIndex}
          pageOptions={pageOptions}
          canPreviousPage={canPreviousPage}
          pageCount={pageCount}
          pageSize={state.pageSize}
          setPageSize={setPageSize}
          page={[]}
        />
      )}

      <div
        className="usa-sr-only usa-table__announcement-region"
        aria-live="polite"
      >
        {currentTableSortDescription(headerGroups[0])}
      </div>

      {operationalNeeds.length === 0 && (
        <Alert heading={t('itSolutionsTable.noNeeds')} type="info">
          {t('itSolutionsTable.noNeedsInfo')}
        </Alert>
      )}
    </div>
  );
};

export default OperationalNeedsTable;
