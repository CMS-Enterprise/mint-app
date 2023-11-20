import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Table as UswdsTable } from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';

import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import TablePagination from 'components/TablePagination';
import DeleteCRTDL from 'queries/CRTDL/DeleteCRTDL';
import GetCRDTLs from 'queries/CRTDL/GetCRDTLs';
import { DeleteCRTDLVariables } from 'queries/CRTDL/types/DeleteCRTDL';
import {
  GetCRTDLs as GetCRTDLsType,
  GetCRTDLs_modelPlan_crTdls as CDTRLType
} from 'queries/CRTDL/types/GetCRTDLs';
import { formatDateUtc } from 'utils/date';
import globalFilterCellText from 'utils/globalFilterCellText';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';
import { isAssessment } from 'utils/user';

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
  const { t } = useTranslation('crtdl');
  const {
    error,
    loading,
    data,
    refetch: refetchCRTDLs
  } = useQuery<GetCRTDLsType>(GetCRDTLs, {
    variables: {
      id: modelID
    }
  });

  const flags = useFlags();

  const crtdls = (data?.modelPlan?.crTdls ?? []) as CDTRLType[];

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
    <Table
      data={crtdls}
      modelID={modelID}
      modelName={modelName}
      hiddenColumns={hiddenColumns}
      refetch={refetchCRTDLs}
      setCRTDLMessage={setCRTDLMessage}
      setCRTDLStatus={setCRTDLStatus}
      readOnly={readOnly}
      hasEditAccess={hasEditAccess}
    />
  );
};

export default CRTDLTable;

type TableProps = {
  data: CDTRLType[];
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
  modelID,
  modelName,
  hiddenColumns,
  refetch,
  setCRTDLMessage,
  setCRTDLStatus,
  readOnly,
  hasEditAccess
}: TableProps) => {
  const { t } = useTranslation('crtdl');
  const [isModalOpen, setModalOpen] = useState(false);
  const [crtdlToRemove, setCRTDLToRemove] = useState<CDTRLType>(
    {} as CDTRLType
  );

  const [deleteCRTDL] = useMutation<DeleteCRTDLVariables>(DeleteCRTDL);

  const handleDelete = useMemo(() => {
    return (crtdl: CDTRLType) => {
      deleteCRTDL({
        variables: {
          id: crtdl.id
        }
      })
        .then((response: any) => {
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
        })
        .catch(() => {
          setCRTDLMessage(
            t('removeCRTDLModal.removeCRTDLFail', {
              crtdl: crtdl.idNumber
            })
          );
          setCRTDLStatus('error');
        });
    };
  }, [deleteCRTDL, refetch, t, setCRTDLMessage, setCRTDLStatus, modelName]);

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
        Header: t<string>('crtdlsTable.idNumber'),
        accessor: 'idNumber'
      },
      {
        Header: t<string>('crtdlsTable.date'),
        accessor: ({ dateInitiated }: any) => {
          if (dateInitiated) {
            return formatDateUtc(dateInitiated, 'MM/dd/yyyy');
          }
          return null;
        }
      },
      {
        Header: t<string>('crtdlsTable.title'),
        accessor: 'title'
      },
      {
        Header: t<string>('crtdlsTable.notes'),
        accessor: 'note'
      },
      {
        Header: t<string>('crtdlsTable.actions'),
        accessor: 'id',
        Cell: ({ row }: any) => {
          return (
            <>
              <UswdsReactLink
                to={`/models/${modelID}/cr-and-tdl/add-cr-and-tdl/${
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
  }, [t, modelID, readOnly]);

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
        hiddenColumns: hasEditAccess ? [] : ['id']
      }
    },
    useFilters,
    useSortBy,
    usePagination
  );

  return (
    <div className="model-plan-table" data-testid="cr-tdl-table">
      {renderModal()}
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
                      paddingLeft: '0',
                      paddingBottom: '.5rem',
                      position: 'relative'
                    }}
                  >
                    <button
                      className="usa-button usa-button--unstyled position-relative"
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

      {data.length > 10 && (
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
        <p data-testid="no-crtdls">{t('crtdlsTable.noCRTDLs')}</p>
      )}
    </div>
  );
};
