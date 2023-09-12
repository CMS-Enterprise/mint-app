/* eslint-disable react/prop-types */

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Row,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { useQuery } from '@apollo/client';
import {
  Button,
  IconComment,
  Table as UswdsTable
} from '@trussworks/react-uswds';
import i18next from 'i18next';

import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import GlobalClientFilter from 'components/TableFilter';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
import { GetModelCollaborators_modelPlan_collaborators as CollaboratorsType } from 'queries/Collaborators/types/GetModelCollaborators';
import GetDraftModelPlans from 'queries/GetModelPlans';
import {
  GetModelPlans as GetDraftModelPlansType,
  GetModelPlans_modelPlanCollection as DraftModelPlanType,
  GetModelPlans_modelPlanCollection_crTdls as CRTDLType
} from 'queries/types/GetModelPlans';
import {
  KeyCharacteristic,
  ModelPlanFilter,
  ModelStatus
} from 'types/graphql-global-types';
import { formatDateLocal, formatDateUtc } from 'utils/date';
import CsvExportLink from 'utils/export/CsvExportLink';
import globalFilterCellText from 'utils/globalFilterCellText';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';

import './index.scss';

export const RenderFilteredNameHistory = ({ names }: { names: string[] }) => {
  const { t } = useTranslation('home');
  const [isShowingAllNames, setShowAllNames] = useState(false);

  const firstThreeNames = names.slice(0, 3);

  return (
    <>
      <p className="margin-y-0 font-body-xs line-height-sans-2">
        {t('previously')}{' '}
        {isShowingAllNames
          ? `${names.join(', ')}`
          : `${firstThreeNames.join(', ')}`}
      </p>
      {names.length > 3 && (
        <Button
          unstyled
          type="button"
          className="margin-top-1 font-body-xs"
          onClick={() => {
            setShowAllNames(!isShowingAllNames);
          }}
        >
          {isShowingAllNames
            ? t('viewLess')
            : t('viewMore', { number: `${names.length - 3}` })}
        </Button>
      )}
    </>
  );
};

type TableProps = {
  hiddenColumns?: string[];
  userModels: boolean;
  isAssessment: boolean;
  isMAC: boolean;
  // callback used to hide parent header if assessment user has no associated model plans
  hideTable?: (tableHidden: boolean) => void;
  tableHidden?: boolean;
};

const DraftModelPlansTable = ({
  hiddenColumns,
  userModels,
  isAssessment,
  isMAC,
  hideTable,
  tableHidden
}: TableProps) => {
  const { t } = useTranslation('home');
  const { t: modelPlanT } = useTranslation('modelPlan');

  let queryType = ModelPlanFilter.COLLAB_ONLY;

  if (!userModels && !isMAC) {
    queryType = ModelPlanFilter.INCLUDE_ALL;
  } else if (isMAC) {
    queryType = ModelPlanFilter.WITH_CR_TDLS;
  }

  const { error, loading, data: modelPlans } = useQuery<GetDraftModelPlansType>(
    GetDraftModelPlans,
    { variables: { filter: queryType, isMAC } }
  );

  const data = useMemo(() => {
    return (modelPlans?.modelPlanCollection ?? []) as DraftModelPlanType[];
  }, [modelPlans?.modelPlanCollection]);

  const columns = useMemo(() => {
    return [
      {
        Header: t('requestsTable.headers.name'),
        accessor: 'modelName',
        Cell: ({
          row,
          value
        }: {
          row: Row<DraftModelPlanType>;
          value: string;
        }) => {
          const filteredNameHistory: string[] = row.original.nameHistory?.slice(
            1
          );
          return (
            <>
              <UswdsReactLink
                to={`/models/${row.original.id}/${
                  isMAC ? 'read-only' : 'task-list'
                }`}
                className="display-block"
              >
                {value}
              </UswdsReactLink>
              {filteredNameHistory && filteredNameHistory.length > 0 && (
                <RenderFilteredNameHistory names={filteredNameHistory} />
              )}
            </>
          );
        }
      },
      {
        Header: t('requestsTable.headers.modelPoc'),
        accessor: 'collaborators',
        Cell: ({ value }: { value: CollaboratorsType[] }) => {
          if (value) {
            const leads = value.filter((item: CollaboratorsType) => {
              return item.teamRole.toLowerCase().includes('model_lead');
            });
            return (
              <>
                {leads.map((item: CollaboratorsType, index: number) => {
                  return `${item.userAccount.commonName}${
                    index === leads.length - 1 ? '' : ', '
                  }`;
                })}
              </>
            );
          }
          return '';
        }
      },
      {
        Header: t('requestsTable.headers.clearanceDate'),
        accessor: ({ basics: { clearanceStarts } }: any) => {
          if (clearanceStarts) {
            return formatDateUtc(clearanceStarts, 'MM/dd/yyyy');
          }
          return null;
        },
        Cell: ({ value }: { value: string }) => {
          if (!value) {
            return <div>{t('requestsTable.tbd')}</div>;
          }
          return value;
        }
      },
      {
        Header: t('requestsTable.headers.status'),
        accessor: 'status',
        Cell: ({ value }: { value: ModelStatus }) => {
          return modelPlanT(`status.options.${value}`);
        }
      },
      {
        Header: t('requestsTable.headers.recentActivity'),
        accessor: 'modifiedDts',
        Cell: ({
          row,
          value
        }: {
          row: Row<DraftModelPlanType>;
          value: string;
        }) => {
          const { discussions } = row.original;
          const formattedUpdatedDate = `${t(
            'requestsTable.updated'
          )} ${formatDateLocal(
            value || row.original.createdDts,
            'MM/dd/yyyy'
          )}`;
          return (
            <>
              {formattedUpdatedDate}
              {discussions.length > 0 && (
                <div className="display-flex flex-align-center text-bold">
                  <IconComment className="text-primary margin-right-05" />{' '}
                  {discussions.length}{' '}
                  {i18next.t('discussions:discussionBanner.discussion', {
                    count: discussions.length
                  })}
                </div>
              )}
            </>
          );
        }
      }
    ];
  }, [t, isMAC, modelPlanT]);

  const macColumns = useMemo(() => {
    return [
      {
        Header: t('requestsTable.headers.name'),
        accessor: 'modelName',
        Cell: ({
          row,
          value
        }: {
          row: Row<DraftModelPlanType>;
          value: string;
        }) => {
          const filteredNameHistory: string[] = row.original.nameHistory?.slice(
            1
          );
          return (
            <>
              <UswdsReactLink
                to={`/models/${row.original.id}/task-list`}
                className="display-block"
              >
                {value}
              </UswdsReactLink>
              {filteredNameHistory && filteredNameHistory.length > 0 && (
                <RenderFilteredNameHistory names={filteredNameHistory} />
              )}
            </>
          );
        }
      },
      {
        Header: t('requestsTable.headers.startDate'),
        accessor: ({ basics: { applicationsStart } }: any) => {
          if (applicationsStart) {
            return formatDateUtc(applicationsStart, 'MM/dd/yyyy');
          }
          return null;
        },
        Cell: ({ value }: { value: string | null }) => {
          if (!value) {
            return <div>{t('requestsTable.tbd')}</div>;
          }
          return value;
        }
      },
      {
        Header: t('requestsTable.headers.paymentDate'),
        accessor: ({ payments: { paymentStartDate } }: any) => {
          if (paymentStartDate) {
            return formatDateUtc(paymentStartDate, 'MM/dd/yyyy');
          }
          return null;
        },
        Cell: ({ value }: { value: string | null }) => {
          if (!value) {
            return <div>{t('requestsTable.tbd')}</div>;
          }
          return value;
        }
      },
      {
        Header: t('requestsTable.headers.keyCharacteristics'),
        accessor: 'generalCharacteristics.keyCharacteristics',
        Cell: ({ value }: { value: KeyCharacteristic[] }) => {
          if (value) {
            return value
              .map(characteristics => {
                return i18next.t<string>(
                  `generalCharacteristics:keyCharacteristics.options.${characteristics}`
                );
              })
              .join(', ');
          }
          return null;
        }
      },
      {
        Header: t('requestsTable.headers.demoCode'),
        accessor: 'basics.demoCode'
      },
      {
        Header: t('requestsTable.headers.crTDLs'),
        accessor: 'crTdls',
        Cell: ({ value }: { value: CRTDLType[] }) => {
          if (!value || value.length === 0) {
            return <div>{t('requestsTable.tbd')}</div>;
          }
          const crtdlIDs = value
            .map((crtdl: CRTDLType) => crtdl.idNumber)
            .join(', ');
          return crtdlIDs;
        }
      },
      {
        Header: t('requestsTable.headers.modelPoc'),
        accessor: 'collaborators',
        Cell: ({ value }: any) => {
          if (value) {
            const leads = value.filter((item: CollaboratorsType) => {
              return item.teamRole.toLowerCase().includes('model_lead');
            });
            return (
              <>
                {leads.map((item: CollaboratorsType, index: number) => {
                  return `${item.userAccount.commonName}${
                    index === leads.length - 1 ? '' : ', '
                  }`;
                })}
              </>
            );
          }
          return '';
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
    setGlobalFilter,
    state,
    rows,
    prepareRow
  } = useTable(
    {
      columns: isMAC ? macColumns : columns,
      data,
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
      autoResetPage: false,
      initialState: {
        sortBy: useMemo(() => [{ id: 'modelName', asc: true }], []),
        pageIndex: 0
      }
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // Checking if the table is for Assessment and if they have no associated models
  // If so, do not render the table at all
  useEffect(() => {
    if (!loading && isAssessment && userModels && data.length === 0) {
      if (hideTable) hideTable(true);
    }
  }, [loading, isAssessment, userModels, data, hideTable]);

  if (tableHidden) {
    return null;
  }

  if (loading) {
    return <PageLoading />;
  }

  if (error) {
    return <Alert type="error">{t('fetchError')}</Alert>;
  }

  rows.map(row => prepareRow(row));

  if (data.length === 0) {
    return (
      <Alert
        type="info"
        heading={
          isMAC
            ? t('requestsTable.mac.empty.heading')
            : t('requestsTable.empty.heading')
        }
      >
        {isMAC
          ? t('requestsTable.mac.empty.body')
          : t('requestsTable.empty.body')}
      </Alert>
    );
  }

  return (
    <div className="model-plan-table">
      <div className="mint-header__basic">
        {!userModels && (
          <GlobalClientFilter
            setGlobalFilter={setGlobalFilter}
            tableID={t('requestsTable.id')}
            tableName={t('requestsTable.title')}
            className="margin-bottom-4"
          />
        )}

        {isAssessment && !userModels && (
          <div className="flex-align-self-center">
            <CsvExportLink />
          </div>
        )}
      </div>

      {!userModels && (
        <TableResults
          globalFilter={state.globalFilter}
          pageIndex={state.pageIndex}
          pageSize={state.pageSize}
          filteredRowLength={page.length}
          rowLength={data.length}
          className="margin-bottom-4"
        />
      )}

      <UswdsTable bordered={false} {...getTableProps()} fullWidth scrollable>
        <caption className="usa-sr-only">{t('requestsTable.caption')}</caption>
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
                      maxWidth: '250px',
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
                            paddingLeft: '0'
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
                          paddingLeft: '0'
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

      {!userModels && (
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
    </div>
  );
};

export default DraftModelPlansTable;
