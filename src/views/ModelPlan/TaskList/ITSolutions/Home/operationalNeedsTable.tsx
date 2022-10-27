/* eslint react/prop-types: 0 */

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import {
  Column,
  useFilters,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { useQuery } from '@apollo/client';
import { Table as UswdsTable } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import TablePagination from 'components/TablePagination';
import GetOperationalNeeds from 'queries/ITSolutions/GetOperationalNeeds';
import {
  GetOperationalNeeds as GetOperationalNeedsType,
  GetOperationalNeeds_modelPlan_operationalNeeds as GetOperationalNeedsOperationalNeedsType,
  GetOperationalNeeds_modelPlan_operationalNeeds_solutions_solutions as GetOperationalNeedsSolutionsType,
  GetOperationalNeedsVariables
} from 'queries/ITSolutions/types/GetOperationalNeeds';
import globalTableFilter from 'utils/globalTableFilter';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';
import { isAssessment } from 'utils/user';

import OperationalNeedsStatusTag, {
  OperationalNeedStatus
} from '../_components/NeedsStatus';

type OperationalNeedsTableProps = {
  hiddenColumns?: string[];
  modelID: string;
  type: 'needs' | 'possibleNeeds';
  readOnly?: boolean;
};

const filterPossibleNeeds = (
  needs: GetOperationalNeedsOperationalNeedsType[]
) => {
  return needs
    .filter(need => !need.needed)
    .map(need => {
      return {
        ...need,
        status:
          need.needed === null
            ? OperationalNeedStatus.NOT_ANSWERED
            : OperationalNeedStatus.NOT_NEEDED
      };
    });
};

const filterNeedsFormatSolutions = (
  needs: GetOperationalNeedsOperationalNeedsType[]
) => {
  const operationalSolutions: GetOperationalNeedsSolutionsType[] = [];
  needs
    .filter(need => !need.needed)
    .forEach(need => {
      operationalSolutions.concat(need.solutions.solutions);
    });
  return operationalSolutions;
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
  const hasEditAccess: boolean = isCollaborator || isAssessment(groups);

  const needsColumns = useMemo<Column<any>[]>(() => {
    return [
      {
        Header: t<string>('itSolutionsTable.need'),
        accessor: 'name'
      },
      // {
      //   Header: t<string>('itSolutionsTable.solution'),
      //   accessor: 'solution'
      // },
      {
        Header: t<string>('itSolutionsTable.finishBy'),
        accessor: 'mustFinishDts'
      }
      // {
      //   Header: t<string>('itSolutionsTable.subtasks'),
      //   accessor: 'mustFinishDts'
      // },
      // {
      //   Header: t<string>('itSolutionsTable.status'),
      //   accessor: 'status'
      // },
      // {
      //   Header: t<string>('itSolutionsTable.action')
      //   // accessor: 'name'
      // }
    ];
  }, [t]);

  const possibleNeedsColumns = useMemo<Column<any>[]>(() => {
    return [
      {
        Header: t<string>('itSolutionsTable.need'),
        accessor: 'name'
      },
      // {
      //   Header: t<string>('itSolutionsTable.section'),
      //   accessor: 'section'
      // },
      {
        Header: t<string>('itSolutionsTable.status'),
        accessor: 'status',
        Cell: ({ row, value }: any): JSX.Element => {
          return <OperationalNeedsStatusTag status={value} />;
        }
      },
      {
        Header: t<string>('itSolutionsTable.actions'),
        accessor: 'id',
        Cell: ({ row }: any): JSX.Element => {
          const linkText: string =
            row.original.status === OperationalNeedStatus.NOT_ANSWERED
              ? t('itSolutionsTable.answer')
              : t('itSolutionsTable.changeAnswer');
          return <UswdsReactLink to="/">{linkText}</UswdsReactLink>;
        }
      }
    ];
  }, [t]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
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
      globalFilter: useMemo(() => globalTableFilter, []),
      autoResetSortBy: false,
      autoResetPage: false,
      initialState: {
        sortBy: useMemo(() => [{ id: 'name', asc: true }], []),
        pageIndex: 0,
        hiddenColumns: hasEditAccess ? [] : ['id']
      }
    },
    useFilters,
    useSortBy,
    usePagination
  );

  if (loading) {
    return <PageLoading />;
  }

  if (error) {
    return (
      <ErrorAlert
        testId="formik-validation-errors"
        classNames="margin-top-3"
        heading={t('itSolutionsTable.error.heading')}
      >
        <ErrorAlertMessage
          errorKey="error-crtdls"
          message={t('itSolutionsTable.error.body')}
        />
      </ErrorAlert>
    );
  }

  return (
    <div className="model-plan-table" data-testid="cr-tdl-table">
      <UswdsTable bordered={false} {...getTableProps()} fullWidth scrollable>
        {/* <caption className="usa-sr-only">{t('requestsTable.caption')}</caption> */}
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers
                // @ts-ignore
                .filter(column => !hiddenColumns?.includes(column.Header))
                .map((column, index) => (
                  <th
                    {...column.getHeaderProps()}
                    aria-sort={getColumnSortStatus(column)}
                    className="table-header"
                    scope="col"
                    style={{
                      minWidth: '138px',
                      paddingLeft: '0',
                      paddingBottom: '.5rem',
                      position: 'relative'
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
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells
                  .filter(cell => {
                    // @ts-ignore
                    return !hiddenColumns?.includes(cell.column.Header);
                  })
                  .map((cell, i) => {
                    if (i === 0) {
                      return (
                        <th
                          {...cell.getCellProps()}
                          scope="row"
                          style={{
                            paddingLeft: '0',
                            borderBottom:
                              index === page.length - 1 ? 'none' : 'auto'
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
        <p data-testid="no-operational-needs">
          {t('itSolutionsTable.noNeeds')}
        </p>
      )}
    </div>
  );
};

export default OperationalNeedsTable;
