import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import { useQuery } from '@apollo/client';
import { Table as UswdsTable } from '@trussworks/react-uswds';

// import { DateTime } from 'luxon';
// import Modal from 'components/Modal';
import PageLoading from 'components/PageLoading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import GetCRDTLs from 'queries/CRTDL/GetCRDTLs';
import {
  GetCRTDLs as GetCRTDLsType,
  GetCRTDLs_modelPlan_crTdls as CDTRLType
} from 'queries/CRTDL/types/GetCRTDLs';
import globalTableFilter from 'utils/globalTableFilter';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';

type CRTDLTableProps = {
  hiddenColumns?: string[];
  modelID: string;
  setCRTDLMessage: (value: string) => void;
  setCRTDLStatus: (value: CRTDLStatusType) => void;
};

type CRTDLStatusType = 'success' | 'error';

const CRTDLTable = ({
  hiddenColumns,
  modelID,
  setCRTDLMessage,
  setCRTDLStatus
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

  const crtdls = (data?.modelPlan?.crTdls ?? []) as CDTRLType[];

  if (loading) {
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
      hiddenColumns={hiddenColumns}
      refetch={refetchCRTDLs}
      setCRTDLMessage={setCRTDLMessage}
      setCRTDLStatus={setCRTDLStatus}
    />
  );
};

export default CRTDLTable;

type TableProps = {
  data: CDTRLType[];
  hiddenColumns?: string[];
  refetch: () => any | undefined;
  setCRTDLMessage: (value: string) => void;
  setCRTDLStatus: (value: CRTDLStatusType) => void;
};

const Table = ({
  data,
  hiddenColumns,
  refetch,
  setCRTDLMessage,
  setCRTDLStatus
}: TableProps) => {
  const { t } = useTranslation('crtdl');
  //   const client = useApolloClient();
  //   const [isModalOpen, setModalOpen] = useState(false);
  //   const [fileToRemove, setFileToRemove] = useState<PlanCRTDLByModelIDType>(
  //     {} as PlanCRTDLByModelIDType
  //   );

  //   const [mutate] = useMutation<DeleteModelPlanCRTDLVariables>(
  //     DeleteModelPlanCRTDL
  //   );

  //   const handleDelete = useMemo(() => {
  //     return (file: PlanCRTDLByModelIDType) => {
  //       mutate({
  //         variables: {
  //           // TODO - update inout variables pending BE changes to delete by ID only
  //           input: {
  //             id: file.id,
  //             modelPlanID: file.modelPlanID,
  //             crtdlsParameters: {
  //               fileSize: file.fileSize
  //             },
  //             url: ''
  //           }
  //         }
  //       })
  //         .then(response => {
  //           if (response?.errors) {
  //             setCRTDLMessage(
  //               t('removeCRTDLFail', {
  //                 crtdlsName: file.fileName
  //               })
  //             );
  //             setCRTDLStatus('error');
  //           } else {
  //             setCRTDLMessage(
  //               t('removeCRTDLSuccess', {
  //                 crtdlsName: file.fileName
  //               })
  //             );
  //             setCRTDLStatus('success');
  //             refetch();
  //           }
  //         })
  //         .catch(() => {
  //           setCRTDLMessage(
  //             t('removeCRTDLFail', {
  //               crtdlsName: file.fileName
  //             })
  //           );
  //           setCRTDLStatus('error');
  //         });
  //     };
  //   }, [mutate, refetch, t, setCRTDLMessage, setCRTDLStatus]);

  //   const renderModal = () => {
  //     return (
  //       <Modal isOpen={isModalOpen} closeModal={() => setModalOpen(false)}>
  //         <PageHeading headingLevel="h2" className="margin-top-0">
  //           {t('removeCRTDLModal.header', {
  //             crtdlsName: fileToRemove.fileName
  //           })}
  //         </PageHeading>
  //         <p>{t('removeCRTDLModal.warning')}</p>
  //         <Button
  //           type="button"
  //           className="margin-right-4"
  //           onClick={() => handleDelete(fileToRemove)}
  //         >
  //           {t('removeCRTDLModal.confirm')}
  //         </Button>
  //         <Button type="button" unstyled onClick={() => setModalOpen(false)}>
  //           {t('removeCRTDLModal.cancel')}
  //         </Button>
  //       </Modal>
  //     );
  //   };

  //   const handleDownload = useMemo(() => {
  //     return (file: PlanCRTDLByModelIDType) => {
  //       if (!file.fileName || !file.fileType) return;
  //       downloadFile({
  //         client,
  //         fileID: file.id,
  //         fileType: file.fileType,
  //         fileName: file.fileName,
  //         query: GetPlanCRTDLDownloadURL,
  //         queryType: 'planCRTDLDownloadURL',
  //         urlKey: 'presignedURL'
  //       })
  //         .then((downloadURL: string) => {}) // TODO: Returning download URL for cypress testing
  //         .catch((error: any) => {
  //           if (error) {
  //             setCRTDLMessage(error);
  //             setCRTDLStatus('error');
  //           }
  //         });
  //     };
  //   }, [client, setCRTDLMessage, setCRTDLStatus]);

  const columns = useMemo(() => {
    return [
      {
        Header: t('crtdlsTable.name'),
        accessor: 'title'
      },
      {
        Header: t('crtdlsTable.type'),
        accessor: 'idNumber'
        // Cell: ({ row, value }: any) => {
        //   if (value !== 'OTHER') {
        //     return translateCRTDLType(value);
        //   }
        //   return row.original.otherType;
        // }
      },
      {
        Header: t('crtdlsTable.notes'),
        accessor: 'dateInitiated'
      },
      {
        Header: t('crtdlsTable.uploadDate'),
        accessor: 'note'
        // Cell: ({ value }: any) => {
        //   return DateTime.fromISO(value).toLocaleString(DateTime.DATE_SHORT);
        // }
      }
    ];
  }, [t]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
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
      globalFilter: useMemo(() => globalTableFilter, []),
      autoResetSortBy: false,
      autoResetPage: false,
      initialState: {
        sortBy: useMemo(() => [{ id: 'modelName', asc: true }], []),
        pageIndex: 0
      }
    },
    useFilters,
    useSortBy,
    usePagination
  );

  return (
    <div className="model-plan-table" data-testid="cr-tdl-table">
      {/* {renderModal()} */}
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
