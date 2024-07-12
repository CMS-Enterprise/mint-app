/* eslint-disable react/prop-types */

import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Row,
  useFilters,
  useFlexLayout,
  useGlobalFilter,
  usePagination,
  useTable
} from 'react-table';
import {
  CardGroup,
  Grid,
  Link,
  Table as UswdsTable
} from '@trussworks/react-uswds';
import {
  GetModelsBySolutionQuery,
  ModelCategory,
  OperationalSolutionKey,
  useGetModelsBySolutionQuery
} from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import Alert from 'components/shared/Alert';
import Spinner from 'components/Spinner';
import GlobalClientFilter from 'components/TableFilter';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { formatDateUtc } from 'utils/date';
import ModelsBySolutionsBanner, {
  StatusCategories
} from 'views/HomeNew/components/ModelsBySolutions/banner';

import ModelSolutionCard from '.';

export type ModelsBySolutionType = GetModelsBySolutionQuery['modelPlansByOperationalSolutionKey'];

type ModelPlansTableProps = {
  operationalSolutionKey: OperationalSolutionKey;
};

/**
 * Creating a bare table to house models by solution cards
 * Utilizing pagination if more than three favories
 * Possbility for sort functionality in future
 * */

const ModelsBySolutionTable = ({
  operationalSolutionKey
}: ModelPlansTableProps) => {
  const { t: customHomeT } = useTranslation('customHome');

  const [selectedStatus, setSelectedStatus] = useState<StatusCategories>(
    'total'
  );

  const basicsConfig = usePlanTranslation('basics');

  const { data, loading } = useGetModelsBySolutionQuery({
    variables: {
      operationalSolutionKey
    }
  });

  const modelsBySolution = useMemo(() => {
    return data?.modelPlansByOperationalSolutionKey || [];
  }, [data?.modelPlansByOperationalSolutionKey]);

  const [filteredModels, setFilteredModels] = useState<ModelsBySolutionType>([
    ...modelsBySolution
  ]);

  const columns: any = useMemo(() => {
    return [
      {
        accessor: 'id',
        Cell: ({ row }: { row: Row<ModelsBySolutionType[0]> }) => {
          return (
            <CardGroup className="margin-top-2 margin-x-0">
              <Grid desktop={{ col: 4 }} tablet={{ col: 6 }}>
                <ModelSolutionCard
                  key={row.original.modelPlan.id}
                  modelPlan={row.original.modelPlan}
                />
              </Grid>
            </CardGroup>
          );
        }
      }
    ];
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setGlobalFilter,
    setPageSize,
    page,
    state,
    prepareRow
  } = useTable(
    {
      columns,
      data: filteredModels,
      globalFilter: useMemo(
        () => (
          rows: Row<any>[],
          columnIds: string[],
          filterValue: string
        ): Row<any>[] => {
          const filterValueLower = filterValue.toLowerCase();
          return rows.filter((row: Row<ModelsBySolutionType[0]>) => {
            return (
              row?.original?.modelPlan?.modelName
                ?.toLowerCase()
                .includes(filterValueLower) ||
              row?.original?.modelPlan?.status
                ?.toLowerCase()
                .includes(filterValueLower) ||
              basicsConfig.modelCategory.options[
                row?.original?.modelPlan?.basics?.modelCategory as ModelCategory
              ]
                ?.toLowerCase()
                .includes(filterValueLower) ||
              formatDateUtc(
                row?.original?.modelPlan?.basics?.applicationsStart,
                'MM/dd/yyyy'
              ).includes(filterValueLower) ||
              formatDateUtc(
                row?.original?.modelPlan?.basics?.applicationsEnd,
                'MM/dd/yyyy'
              ).includes(filterValueLower)
            );
          });
        },
        [basicsConfig.modelCategory.options]
      ),
      initialState: {
        pageSize: 3
      }
    },
    useFlexLayout,
    useFilters,
    useGlobalFilter,
    usePagination
  );

  useEffect(() => {
    if (selectedStatus === 'total') {
      setFilteredModels([...modelsBySolution]);
      return;
    }

    setFilteredModels(
      [...modelsBySolution].filter(model => {
        return model.modelPlan.status === selectedStatus;
      })
    );
  }, [selectedStatus, modelsBySolution]);

  if (loading) {
    return (
      <div className="padding-left-4 padding-top-3">
        <Spinner />
      </div>
    );
  }

  return (
    <div id="models-by-solution-table">
      <ModelsBySolutionsBanner
        solutionKey={operationalSolutionKey}
        solutionModels={modelsBySolution}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {filteredModels.length > 4 && (
        <div>
          <GlobalClientFilter
            setGlobalFilter={setGlobalFilter}
            tableID="models-by-solution-table"
            tableName={customHomeT(
              'settings.MODELS_BY_OPERATIONAL_SOLUTION.heading'
            )}
            className="margin-bottom-3 maxw-none width-mobile-lg"
          />

          <TableResults
            globalFilter={state.globalFilter}
            pageIndex={state.pageIndex}
            pageSize={state.pageSize}
            filteredRowLength={page.length}
            rowLength={filteredModels.length}
          />
        </div>
      )}

      {filteredModels.length === 0 && (
        <Alert type="info" heading={customHomeT('noModelSolutionHeading')}>
          <Trans
            i18nKey="customHome:noModelSolutionDescription"
            components={{
              report: (
                <UswdsReactLink to="/report-a-problem" target="_blank">
                  {' '}
                </UswdsReactLink>
              ),
              email: <Link href="mailto:MINTTeam@cms.hhs.gov"> </Link>
            }}
          />
        </Alert>
      )}

      <UswdsTable {...getTableProps()} fullWidth>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, i) => {
                  return (
                    <td className="border-0 padding-0" {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </UswdsTable>

      {modelsBySolution.length > 3 && (
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
    </div>
  );
};

export default ModelsBySolutionTable;
