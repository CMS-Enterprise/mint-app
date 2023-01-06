import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Table as UswdsTable } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { DateTime } from 'luxon';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import DeleteModelPlanDocument from 'queries/Documents/DeleteModelPlanDocument';
import GetModelPlanDocuments from 'queries/Documents/GetModelPlanDocuments';
import { DeleteModelPlanDocumentVariables } from 'queries/Documents/types/DeleteModelPlanDocument';
import {
  GetModelPlanDocuments as GetModelPlanDocumentsType,
  GetModelPlanDocuments_modelPlan_documents as DocumentType,
  GetModelPlanDocumentsVariables
} from 'queries/Documents/types/GetModelPlanDocuments';
import downloadFile from 'utils/downloadFile';
import globalTableFilter from 'utils/globalTableFilter';
import { translateDocumentType } from 'utils/modelPlan';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';
import { isAssessment } from 'utils/user';

type PlanDocumentsTableProps = {
  hiddenColumns?: string[];
  modelID: string;
  setDocumentMessage: (value: string) => void;
  setDocumentStatus: (value: DocumentStatusType) => void;
  isHelpArticle?: boolean;
  className?: string;
};

type DocumentStatusType = 'success' | 'error';

const PlanDocumentsTable = ({
  hiddenColumns,
  modelID,
  setDocumentMessage,
  setDocumentStatus,
  isHelpArticle,
  className
}: PlanDocumentsTableProps) => {
  const { t } = useTranslation('documents');
  const { error, loading, data, refetch: refetchDocuments } = useQuery<
    GetModelPlanDocumentsType,
    GetModelPlanDocumentsVariables
  >(GetModelPlanDocuments, {
    variables: {
      id: modelID
    }
  });

  const documents = data?.modelPlan?.documents || ([] as DocumentType[]);
  const isCollaborator = data?.modelPlan?.isCollaborator;
  const { groups } = useSelector((state: RootStateOrAny) => state.auth);
  const hasEditAccess: boolean =
    !isHelpArticle && (isCollaborator || isAssessment(groups));

  if (loading) {
    return <PageLoading />;
  }

  if (error) {
    return (
      <ErrorAlert
        testId="formik-validation-errors"
        classNames="margin-top-3"
        heading={t('documentTable.error.heading')}
      >
        <ErrorAlertMessage
          errorKey="error-document"
          message={t('documentTable.error.body')}
        />
      </ErrorAlert>
    );
  }

  return (
    <div className={classNames(className)}>
      <Table
        data={documents}
        hiddenColumns={hiddenColumns}
        refetch={refetchDocuments}
        setDocumentMessage={setDocumentMessage}
        setDocumentStatus={setDocumentStatus}
        hasEditAccess={hasEditAccess}
      />
    </div>
  );
};

export default PlanDocumentsTable;

type TableProps = {
  data: DocumentType[];
  hiddenColumns?: string[];
  refetch: () => any | undefined;
  setDocumentMessage: (value: string) => void;
  setDocumentStatus: (value: DocumentStatusType) => void;
  hasEditAccess?: boolean;
};

const Table = ({
  data,
  hiddenColumns,
  refetch,
  setDocumentMessage,
  setDocumentStatus,
  hasEditAccess
}: TableProps) => {
  const { t } = useTranslation('documents');
  const [isModalOpen, setModalOpen] = useState(false);
  const [fileToRemove, setFileToRemove] = useState<DocumentType>(
    {} as DocumentType
  );

  const [mutate] = useMutation<DeleteModelPlanDocumentVariables>(
    DeleteModelPlanDocument
  );

  const handleDelete = useMemo(() => {
    return (file: DocumentType) => {
      mutate({
        variables: {
          id: file.id
        }
      })
        .then(response => {
          if (response?.errors) {
            setDocumentMessage(
              t('removeDocumentFail', {
                documentName: file.fileName
              })
            );
            setDocumentStatus('error');
          } else {
            setDocumentMessage(
              t('removeDocumentSuccess', {
                documentName: file.fileName
              })
            );
            setDocumentStatus('success');
            refetch();
          }
        })
        .catch(() => {
          setDocumentMessage(
            t('removeDocumentFail', {
              documentName: file.fileName
            })
          );
          setDocumentStatus('error');
        });
    };
  }, [mutate, refetch, t, setDocumentMessage, setDocumentStatus]);

  const renderModal = () => {
    return (
      <Modal isOpen={isModalOpen} closeModal={() => setModalOpen(false)}>
        <PageHeading headingLevel="h2" className="margin-top-0">
          {t('removeDocumentModal.header', {
            documentName: fileToRemove.fileName
          })}
        </PageHeading>
        <p>{t('removeDocumentModal.warning')}</p>
        <Button
          type="button"
          className="margin-right-4"
          onClick={() => handleDelete(fileToRemove)}
        >
          {t('removeDocumentModal.confirm')}
        </Button>
        <Button type="button" unstyled onClick={() => setModalOpen(false)}>
          {t('removeDocumentModal.cancel')}
        </Button>
      </Modal>
    );
  };

  const handleDownload = useMemo(() => {
    return (file: DocumentType) => {
      if (!file.fileName || !file.fileType) return;
      downloadFile({
        fileType: file.fileType,
        fileName: file.fileName,
        downloadURL: file.downloadUrl!
      })
        .then()
        .catch((error: any) => {
          if (error) {
            setDocumentMessage(error);
            setDocumentStatus('error');
          }
        });
    };
  }, [setDocumentMessage, setDocumentStatus]);

  const columns = useMemo(() => {
    return [
      {
        Header: t('documentTable.name'),
        accessor: 'fileName'
      },
      {
        Header: t('documentTable.type'),
        accessor: 'documentType',
        Cell: ({ row, value }: any) => {
          if (value !== 'OTHER') {
            return translateDocumentType(value);
          }
          return row.original.otherType;
        }
      },
      {
        Header: t('documentTable.notes'),
        accessor: 'optionalNotes'
      },
      {
        Header: t('documentTable.uploadDate'),
        accessor: 'createdDts',
        Cell: ({ value }: any) => {
          return DateTime.fromISO(value).toLocaleString(DateTime.DATE_SHORT);
        }
      },
      {
        Header: t('documentTable.visibility'),
        accessor: 'restricted',
        Cell: ({ row, value }: any) => {
          return value ? t('restricted') : t('all');
        }
      },
      {
        Header: t('documentTable.actions'),
        accessor: 'virusScanned',
        Cell: ({ row, value }: any) => {
          if (value) {
            return row.original.virusClean ? (
              <>
                <Button
                  type="button"
                  unstyled
                  className="margin-right-1"
                  onClick={() => handleDownload(row.original)}
                >
                  {t('documentTable.view')}
                </Button>
                {hasEditAccess && (
                  <Button
                    type="button"
                    unstyled
                    className="text-red"
                    data-testid="remove-document"
                    onClick={() => {
                      setModalOpen(true);
                      setFileToRemove(row.original);
                    }}
                  >
                    {t('documentTable.remove')}
                  </Button>
                )}
              </>
            ) : (
              t('documentTable.virusFound')
            );
          }
          return t('documentTable.scanInProgress');
        }
      }
    ];
  }, [t, handleDownload, hasEditAccess]);

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
    <div className="model-plan-table" data-testid="model-plan-documents-table">
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
        <p data-testid="no-documents">{t('documentTable.noDocuments')}</p>
      )}
    </div>
  );
};
