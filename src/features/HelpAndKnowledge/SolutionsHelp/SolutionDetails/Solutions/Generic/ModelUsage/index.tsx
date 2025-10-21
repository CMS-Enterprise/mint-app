import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Column, Row, usePagination, useSortBy, useTable } from 'react-table';
import { Button, Link, Table as UswdsTable } from '@trussworks/react-uswds';
import { HelpSolutionType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import {
  GetModelsByMtoSolutionQuery,
  useGetModelsByMtoSolutionQuery
} from 'gql/generated/graphql';
import i18next from 'i18next';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import TablePageSize from 'components/TablePageSize';
import TablePagination from 'components/TablePagination';
import { getHeaderSortIcon, sortColumnValues } from 'utils/tableSort';

import './index.scss';

type ModelUsageType =
  GetModelsByMtoSolutionQuery['modelPlansByMTOSolutionKey'][0];

const DEFAULT_ROWS_PER_PAGE = 10;
const PAGE_SIZE_VALUE_ARRAY: (number | 'all')[] = [5, 10, 15, 20, 'all'];

export const GenericModelUsage = ({
  solution
}: {
  solution: HelpSolutionType;
}) => {
  const { t } = useTranslation('helpAndKnowledge');

  const { data, loading } = useGetModelsByMtoSolutionQuery({
    variables: {
      solutionKey: solution.key
    }
  });

  const modelsPerSolution = useMemo(() => {
    const models = data?.modelPlansByMTOSolutionKey || [];
    return (
      [...models].sort((a, b) =>
        a.modelPlan.modelName.localeCompare(b.modelPlan.modelName)
      ) || []
    );
  }, [data]);

  const columns: Column<ModelUsageType>[] = useMemo(
    () => [
      {
        id: 'modelName',
        Header: t('modelUsage.modelName'),
        accessor: ({ modelPlan: { modelName, abbreviation } }) => {
          const modelPlanNameWithAbbr = abbreviation
            ? `${modelName} (${abbreviation})`
            : modelName;
          return modelPlanNameWithAbbr;
        },
        sortType: 'alphanumeric',
        Cell: ({ row, value }: { row: Row<ModelUsageType>; value: string }) => {
          return (
            <UswdsReactLink
              to={`/models/${row.original.modelPlanID}/read-only/model-basics`}
            >
              {value}
            </UswdsReactLink>
          );
        }
      },
      {
        id: 'modelStatus',
        Header: t('modelUsage.status'),
        accessor: ({ modelPlan: { status } }) =>
          i18next.t(`modelPlan:status:options.${status}`),
        sortType: 'alphanumeric',
        Cell: ({ value }: { value: string }) => value
      }
    ],
    [t]
  );

  const {
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    state,
    rows,
    prepareRow
  } = useTable(
    {
      columns: columns as Column<object>[],
      data: modelsPerSolution as ModelUsageType[],
      sortTypes: {
        alphanumeric: (rowOne, rowTwo, columnName) => {
          return sortColumnValues(
            rowOne.values[columnName],
            rowTwo.values[columnName]
          );
        }
      },
      initialState: { pageIndex: 0, pageSize: DEFAULT_ROWS_PER_PAGE }
    },
    useSortBy,
    usePagination
  );

  if (!solution || loading) {
    return <PageLoading testId="model-usage" />;
  }

  return (
    <div className="operational-solution-details line-height-body-5 font-body-md text-pre-wrap">
      <p>
        <Trans
          i18nKey="helpAndKnowledge:modelUsage.description"
          values={{ solutionTitle: solution.name }}
        />
      </p>

      <Alert type="info" slim className="margin-y-3">
        <Trans
          i18nKey="helpAndKnowledge:modelUsage.info"
          components={{
            email: <Link href="mailto:MINTTeam@cms.hhs.gov"> </Link>
          }}
        />
      </Alert>

      <p className="margin-y-0">
        {t('modelUsage.resultsInfo', {
          resultsNum: page.length,
          resultsMax: rows.length
        })}
      </p>

      <UswdsTable
        bordered={false}
        {...getTableProps()}
        className="margin-y-0"
        fullWidth
      >
        <thead>
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
                  className="padding-left-0 padding-bottom-1"
                  colSpan={1}
                >
                  <Button
                    className="usa-button position-relative deep-underline"
                    type="button"
                    unstyled
                    {...column.getSortByToggleProps()}
                  >
                    {column.render('Header') as React.ReactElement}
                    {getHeaderSortIcon(column, false)}
                  </Button>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.length === 0 && (
            <tr>
              <td className="border-0" colSpan={headerGroups[0].headers.length}>
                <p className="margin-top-1 text-italic w-full">
                  <Trans
                    i18nKey="helpAndKnowledge:modelUsage.noResults"
                    values={{ solutionTitle: solution.name }}
                  />
                </p>
              </td>
            </tr>
          )}
          {page.map((row, i) => {
            prepareRow(row);
            const { getRowProps, cells, id } = { ...row };

            return (
              <tr {...getRowProps()} key={id}>
                {cells.map(cell => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      key={cell.getCellProps().key}
                      className="padding-left-0"
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

      <div className="display-flex">
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
          className="noMarginList"
        />

        {pageCount > 0 && (
          <TablePageSize
            className="margin-left-auto desktop:grid-col-auto"
            pageSize={state.pageSize}
            setPageSize={setPageSize}
            valueArray={PAGE_SIZE_VALUE_ARRAY}
            suffix={t('modelUsage.suffix')}
          />
        )}
      </div>
    </div>
  );
};

export default GenericModelUsage;
