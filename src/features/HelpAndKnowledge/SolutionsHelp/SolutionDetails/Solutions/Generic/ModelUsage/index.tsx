import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Column, Row, useSortBy, useTable } from 'react-table';
import { Button, Link, Table as UswdsTable } from '@trussworks/react-uswds';
import { HelpSolutionType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { useGetModelsByMtoSolutionQuery } from 'gql/generated/graphql';
import i18next from 'i18next';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import TablePageSize from 'components/TablePageSize';
import usePagination from 'hooks/usePagination';
import { getHeaderSortIcon, sortColumnValues } from 'utils/tableSort';

type ModelsUsageType = {
  modelId: string;
  modelName: string;
  modelStatus: string;
}[];

type SingleModelUsageType = ModelsUsageType[number];

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
    const rawModels = data?.modelPlansByMTOSolutionKey || [];
    const formattedModels = rawModels.map(model => {
      const modelPlanNameWithAbbr = model.modelPlan.abbreviation
        ? `${model.modelPlan.modelName} (${model.modelPlan.abbreviation})`
        : model.modelPlan.modelName;
      return {
        modelId: model.modelPlanID,
        modelName: modelPlanNameWithAbbr,
        modelStatus: i18next.t(
          `modelPlan:status:options.${model.modelPlan.status}`
        )
      };
    });

    return (
      [...formattedModels].sort((a, b) =>
        a.modelName.localeCompare(b.modelName)
      ) || []
    );
  }, [data]);

  const [resultsNum, setResultsNum] = useState<number>(0);

  const [pageSize, setPageSize] = useState<'all' | number>(
    DEFAULT_ROWS_PER_PAGE
  );

  const { currentItems, Pagination } = usePagination<ModelsUsageType>({
    items: modelsPerSolution,
    itemsPerPage: pageSize === 'all' ? modelsPerSolution.length : pageSize,
    loading,
    showPageIfOne: true
  });

  const columns: Column<SingleModelUsageType>[] = useMemo(
    () => [
      {
        id: 'modelName',
        Header: t('modelUsage.modelName'),
        accessor: 'modelName',
        sortType: 'alphanumeric',
        Cell: ({
          row,
          value
        }: {
          row: Row<SingleModelUsageType>;
          value: string;
        }) => {
          return (
            <UswdsReactLink
              to={`/models/${row.original.modelId}/read-only/model-basics`}
            >
              {value}
            </UswdsReactLink>
          );
        }
      },
      {
        id: 'modelStatus',
        Header: t('modelUsage.status'),
        accessor: 'modelStatus',
        sortType: 'alphanumeric',
        Cell: ({ value }: { value: string }) => value
      }
    ],
    [t]
  );

  const {
    page,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns: columns as Column<object>[],
      data: currentItems,
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
    useSortBy
  );

  rows.map(row => prepareRow(row));

  const totalPages = useMemo(() => {
    return Math.ceil(
      resultsNum / (pageSize === 'all' ? modelsPerSolution.length : pageSize)
    );
  }, [resultsNum, pageSize, modelsPerSolution.length]);

  useEffect(() => {
    setResultsNum(currentItems.length);
  }, [setResultsNum, currentItems]);
  console.log('page', page);
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
          resultsNum,
          resultsMax: modelsPerSolution.length
        })}
      </p>

      <UswdsTable
        bordered={false}
        {...getTableProps()}
        className="margin-top-0"
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
          {rows.length === 0 && (
            <tr>
              <td className="border-0">
                <p className="margin-top-1 text-italic w-full">
                  <Trans
                    i18nKey="helpAndKnowledge:modelUsage.noResults"
                    values={{ solutionTitle: solution.name }}
                  />
                </p>
              </td>
            </tr>
          )}
          {rows.map((row, i) => {
            const { getRowProps, cells, id } = { ...row };
            prepareRow(row);

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
        {/* TODO(Elle) or just {totalPages > 0 && Pagination} ? */}
        {currentItems.length > 0 && totalPages > 0 && Pagination}

        {rows.length > 0 && (
          <TablePageSize
            className="margin-left-auto desktop:grid-col-auto"
            pageSize={pageSize}
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
