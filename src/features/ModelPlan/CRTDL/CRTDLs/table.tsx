import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import { Button, Table as UswdsTable } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  GetCrtdLsQuery,
  useDeleteCrMutation,
  useDeleteTdlMutation,
  useGetCrtdLsQuery
} from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { ErrorAlert, ErrorAlertMessage } from 'components/ErrorAlert';
import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import TablePagination from 'components/TablePagination';
import { formatDateUtc } from 'utils/date';
import globalFilterCellText from 'utils/globalFilterCellText';
import { insertIf } from 'utils/modelPlan';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';
import { isAssessment } from 'utils/user';

type GetCRsType = GetCrtdLsQuery['modelPlan']['crs'][0];
type GetTDLsType = GetCrtdLsQuery['modelPlan']['tdls'][0];

// Type guard to check union type
export const isCRType = (
  crtdl: GetCRsType | GetTDLsType
): crtdl is GetCRsType => {
  /* eslint no-underscore-dangle: 0 */
  return crtdl.__typename === 'PlanCR';
};

type CRTDLTableProps = {
  hiddenColumns?: string[];
  modelID: string;
  readOnly?: boolean;
  setCRTDLMessage: (value: string) => void;
  setCRTDLStatus: (value: CRTDLStatusType) => void;
  isHelpArticle?: boolean;
};

type CRTDLStatusType = 'success' | 'error';

const CRTDLTable = ({
  hiddenColumns,
  modelID,
  readOnly,
  setCRTDLMessage,
  setCRTDLStatus,
  isHelpArticle
}: CRTDLTableProps) => {
  const { t } = useTranslation('crtdlsMisc');
  const {
    error,
    loading,
    data,
    refetch: refetchCRTDLs
  } = useGetCrtdLsQuery({
    variables: {
      id: modelID
    }
  });

  const flags = useFlags();

  const crs = data?.modelPlan?.crs ?? [];
  const tdls = data?.modelPlan?.tdls ?? [];

  const modelName = data?.modelPlan.modelName;

  const isCollaborator = data?.modelPlan?.isCollaborator;
  const { groups } = useSelector((state: RootStateOrAny) => state.auth);
  const hasEditAccess: boolean =
    !isHelpArticle && (isCollaborator || isAssessment(groups, flags));

  if (!data && loading) {
    return <PageLoading />;
  }

  if (error) {
    return (
      <ErrorAlert
        testId="formik-validation-errors"
        classNames="margin-top-3"
        heading={t('crtdlsTable.error.heading')}
      >
        <ErrorAlertMessage
          errorKey="error-crtdls"
          message={t('crtdlsTable.error.body')}
        />
      </ErrorAlert>
    );
  }

  return (
    <>
      <h2 className="margin-bottom-0 margin-top-4">{t('crs')}</h2>
      <Table
        data={crs}
        type="cr"
        modelID={modelID}
        modelName={modelName}
        hiddenColumns={hiddenColumns}
        refetch={refetchCRTDLs}
        setCRTDLMessage={setCRTDLMessage}
        setCRTDLStatus={setCRTDLStatus}
        readOnly={readOnly}
        hasEditAccess={hasEditAccess}
      />

      <h2 className="margin-bottom-0 margin-top-4">{t('tdls')}</h2>
      <Table
        data={tdls}
        type="tdl"
        modelID={modelID}
        modelName={modelName}
        hiddenColumns={hiddenColumns}
        refetch={refetchCRTDLs}
        setCRTDLMessage={setCRTDLMessage}
        setCRTDLStatus={setCRTDLStatus}
        readOnly={readOnly}
        hasEditAccess={hasEditAccess}
      />
    </>
  );
};

export default CRTDLTable;

type TableProps = {
  data: GetCRsType[] | GetTDLsType[];
  type: 'cr' | 'tdl';
  modelID: string;
  modelName?: string;
  hiddenColumns?: string[];
  refetch: () => any | undefined;
  setCRTDLMessage: (value: string) => void;
  setCRTDLStatus: (value: CRTDLStatusType) => void;
  readOnly?: boolean;
  hasEditAccess?: boolean;
};

const Table = ({
  data,
  type,
  modelID,
  modelName,
  hiddenColumns,
  refetch,
  setCRTDLMessage,
  setCRTDLStatus,
  readOnly,
  hasEditAccess
}: TableProps) => {
  const { t } = useTranslation('crtdlsMisc');
  const [isModalOpen, setModalOpen] = useState(false);
  const [crtdlToRemove, setCRTDLToRemove] = useState<GetCRsType | GetTDLsType>(
    {} as GetCRsType | GetTDLsType
  );

  const [deleteCR] = useDeleteCrMutation();
  const [deleteTDL] = useDeleteTdlMutation();

  const handleDelete = useMemo(() => {
    return (crtdl: GetCRsType | GetTDLsType) => {
      const responseHandler = (response: any): void => {
        if (response?.errors) {
          setCRTDLMessage(
            t('removeCRTDLModal.removeCRTDLFail', {
              crtdl: crtdl.idNumber
            })
          );
          setCRTDLStatus('error');
        } else {
          setCRTDLMessage(
            t('removeCRTDLModal.removeCRTDLSuccess', {
              crtdl: crtdl.idNumber,
              modelName
            })
          );
          setCRTDLStatus('success');
          refetch();
        }
        setModalOpen(false);
      };

      const catchHandler = (): void => {
        setCRTDLMessage(
          t('removeCRTDLModal.removeCRTDLFail', {
            crtdl: crtdl.idNumber
          })
        );
        setCRTDLStatus('error');
      };

      if (isCRType(crtdl)) {
        deleteCR({
          variables: {
            id: crtdl.id
          }
        })
          .then(responseHandler)
          .catch(catchHandler);
      } else {
        deleteTDL({
          variables: {
            id: crtdl.id
          }
        })
          .then(responseHandler)
          .catch(catchHandler);
      }
    };
  }, [
    deleteCR,
    deleteTDL,
    refetch,
    t,
    setCRTDLMessage,
    setCRTDLStatus,
    modelName
  ]);

  const renderModal = () => {
    return (
      <Modal
        isOpen={isModalOpen}
        closeModal={() => setModalOpen(false)}
        className="confirmation-modal"
      >
        <PageHeading
          headingLevel="h3"
          className="margin-top-neg-2 margin-bottom-1"
        >
          {t('removeCRTDLModal.header', {
            crtdl: crtdlToRemove.idNumber
          })}
        </PageHeading>
        <p>{t('removeCRTDLModal.warning')}</p>
        <Button
          type="button"
          className="margin-right-4"
          onClick={() => handleDelete(crtdlToRemove)}
        >
          {t('removeCRTDLModal.confirm')}
        </Button>
        <Button type="button" unstyled onClick={() => setModalOpen(false)}>
          {t('removeCRTDLModal.cancel')}
        </Button>
      </Modal>
    );
  };

  const columns = useMemo(() => {
    return [
      {
        Header: t<string, {}, string>('crtdlsTable.idNumber'),
        accessor: 'idNumber',
        width: 150
      },
      {
        Header: t<string, {}, string>('crtdlsTable.title'),
        accessor: 'title',
        width: 250
      },
      {
        Header: t<string, {}, string>('crtdlsTable.date'),
        accessor: ({ dateInitiated }: any) => {
          if (dateInitiated) {
            return formatDateUtc(dateInitiated, 'MM/dd/yyyy');
          }
          return null;
        },
        width: 150
      },
      ...insertIf(type === 'cr', {
        Header: t<string, {}, string>('crtdlsTable.dateImplemented'),
        accessor: ({ dateImplemented }: any) => {
          if (dateImplemented) {
            return formatDateUtc(dateImplemented, 'MMMM yyyy');
          }
          return null;
        },
        width: 150
      }),
      {
        Header: t<string, {}, string>('crtdlsTable.notes'),
        accessor: 'note',
        width: type === 'cr' ? 285 : 435
      },
      {
        Header: t<string, {}, string>('crtdlsTable.actions'),
        accessor: 'id',
        Cell: ({ row }: any) => {
          return (
            <>
              <UswdsReactLink
                to={`/models/${modelID}/collaboration-area/cr-and-tdl/add-cr-and-tdl?type=${type}&id=${
                  row.original.id
                }${readOnly ? '#read-only' : ''}`}
                className="margin-right-2"
              >
                {t('crtdlsTable.edit')}
              </UswdsReactLink>
              <Button
                type="button"
                unstyled
                className="text-red"
                data-testid="remove-cr-tdl"
                onClick={() => {
                  setModalOpen(true);
                  setCRTDLToRemove(row.original);
                }}
              >
                {t('crtdlsTable.remove')}
              </Button>
            </>
          );
        }
      }
    ];
  }, [t, modelID, readOnly, type]);

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
      columns,
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
        sortBy: useMemo(() => [{ id: 'idNumber', asc: true }], []),
        pageIndex: 0,
        hiddenColumns: hasEditAccess ? [] : ['id'],
        pageSize: 5
      }
    },
    useFilters,
    useSortBy,
    usePagination
  );

  return (
    <div className="model-plan-table" data-testid={`cr-tdl-table-${type}`}>
      {renderModal()}
      <UswdsTable bordered={false} {...getTableProps()} scrollable>
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
                      // minWidth: '138px',
                      paddingLeft: '0',
                      paddingBottom: '.5rem',
                      position: 'relative',
                      minWidth: column.width,
                      maxWidth: column.width
                    }}
                  >
                    <button
                      className={classNames(
                        'usa-button usa-button--unstyled position-relative',
                        {
                          'text-no-underline text-bold text-black':
                            column.Header === 'Actions'
                        }
                      )}
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
                    return (
                      <td
                        {...cell.getCellProps()}
                        style={{
                          paddingLeft: '0',
                          borderBottom:
                            index === page.length - 1 ? 'none' : 'auto',
                          whiteSpace: 'normal'
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

      {data.length > 5 && (
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

      {data.length === 0 && (
        <p data-testid="no-crtdls">
          {t('crtdlsTable.noCRTDLs', { type: type.toUpperCase() })}
        </p>
      )}
    </div>
  );
};
