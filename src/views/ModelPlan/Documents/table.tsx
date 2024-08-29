import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import {
  Alert,
  Button,
  Checkbox,
  Icon,
  Table as UswdsTable
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  DocumentType,
  GetModelPlanDocumentsQuery,
  GetOperationalSolutionQuery,
  useDeleteModelPlanDocumentMutation,
  useGetModelPlanDocumentsQuery
} from 'gql/gen/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import ExternalLinkWithModal from 'components/shared/ExternalLinkWithModal';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { formatDateLocal } from 'utils/date';
import downloadFile from 'utils/downloadFile';
import globalFilterCellText from 'utils/globalFilterCellText';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';
import { isAssessment } from 'utils/user';
import { ModelInfoContext } from 'views/ModelInfoWrapper';

import './index.scss';

type SolutionDocumentType = GetOperationalSolutionQuery['operationalSolution']['documents'][0];

type PlanDocumentsTableProps = {
  hiddenColumns?: string[];
  modelID: string;
  setDocumentMessage: (value: string) => void;
  setDocumentStatus: (value: DocumentStatusType) => void;
  isHelpArticle?: boolean;
  linkedDocs?: string[];
  setLinkedDocs?: Dispatch<SetStateAction<string[]>>;
  className?: string;
};

type GetDocumentType = GetModelPlanDocumentsQuery['modelPlan']['documents'][0];
type DocumentStatusType = 'success' | 'error';

const PlanDocumentsTable = ({
  hiddenColumns,
  modelID,
  setDocumentMessage,
  setDocumentStatus,
  isHelpArticle,
  linkedDocs,
  setLinkedDocs,
  className
}: PlanDocumentsTableProps) => {
  const { t } = useTranslation('documentsMisc');
  const {
    error,
    loading,
    data,
    refetch: refetchDocuments
  } = useGetModelPlanDocumentsQuery({
    variables: {
      id: modelID
    },
    fetchPolicy: setLinkedDocs ? 'network-only' : 'cache-and-network'
  });

  const flags = useFlags();

  const documents = data?.modelPlan?.documents || ([] as GetDocumentType[]);
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
        linkedDocs={linkedDocs}
        setLinkedDocs={setLinkedDocs}
      />
    </div>
  );
};

export default PlanDocumentsTable;

const findDocIDAndRemoveOrInsert = (
  id: string,
  linkedDocs: string[]
): string[] => {
  const linkedDocsCopy = [...linkedDocs];
  const index = linkedDocs.indexOf(id);
  if (index > -1) {
    // Removed from list of docs if already exists
    linkedDocsCopy.splice(index, 1);
  } else {
    linkedDocsCopy.push(id); // Add to list of linked docs
  }
  return linkedDocsCopy;
};

type TableProps = {
  data: GetDocumentType[] | SolutionDocumentType[];
  hiddenColumns?: string[];
  refetch: () => any | undefined;
  setDocumentMessage: (value: string) => void;
  setDocumentStatus: (value: DocumentStatusType) => void;
  linkedDocs?: string[]; // If displaying from LinkedDocuments view
  setLinkedDocs?: Dispatch<SetStateAction<string[]>>; // If displaying from LinkedDocuments view
  handleDocumentUnlink?: (fileToUnlink: string, documentName: string) => void; // Mutation to unlink a document from directly in table
  hasEditAccess?: boolean;
};

export const Table = ({
  data,
  hiddenColumns,
  refetch,
  setDocumentMessage,
  setDocumentStatus,
  linkedDocs,
  setLinkedDocs,
  handleDocumentUnlink,
  hasEditAccess
}: TableProps) => {
  const { t } = useTranslation('documentsMisc');
  const { documentType: documentTypeConfig } = usePlanTranslation('documents');

  const [isModalOpen, setModalOpen] = useState(false);
  const [fileToRemove, setFileToRemove] = useState<GetDocumentType>(
    {} as GetDocumentType
  );

  const { modelName } = useContext(ModelInfoContext);

  const [mutate] = useDeleteModelPlanDocumentMutation();

  const handleDelete = useMemo(() => {
    return (file: GetDocumentType) => {
      mutate({
        variables: {
          id: file.id
        }
      })
        .then(response => {
          if (response?.errors) {
            setDocumentMessage(
              t('documentRemoval.error', {
                documentName: file.fileName,
                modelName
              })
            );
            setDocumentStatus('error');
          } else {
            setDocumentMessage(
              t('documentRemoval.success', {
                documentName: file.fileName,
                modelName
              })
            );
            setDocumentStatus('success');
            refetch();
          }
        })
        .catch(() => {
          setDocumentMessage(
            t('documentRemoval.error', {
              documentName: file.fileName,
              modelName
            })
          );
          setDocumentStatus('error');
        });
    };
  }, [mutate, setDocumentMessage, t, modelName, setDocumentStatus, refetch]);

  const handleDownload = useMemo(() => {
    return (file: GetDocumentType) => {
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

  const renderModal = () => {
    return (
      <Modal
        isOpen={isModalOpen}
        closeModal={() => setModalOpen(false)}
        className="confirmation-modal"
      >
        <PageHeading
          headingLevel="h3"
          className="margin-top-neg-2 margin-bottom-0"
        >
          {t('removeDocumentModal.header', {
            documentName: fileToRemove.fileName
          })}
        </PageHeading>

        {((fileToRemove.numLinkedSolutions > 0 && !handleDocumentUnlink) ||
          (fileToRemove.numLinkedSolutions > 1 && handleDocumentUnlink)) && (
          <Alert type="warning" headingLevel="h4">
            {handleDocumentUnlink
              ? t('removeDocumentModal.linkDocsWarning2', {
                  numLinkedSolutions: fileToRemove.numLinkedSolutions - 1,
                  plural: fileToRemove.numLinkedSolutions - 1 > 1 ? 's' : ''
                })
              : t('removeDocumentModal.linkDocsWarning', {
                  numLinkedSolutions: fileToRemove.numLinkedSolutions,
                  plural: fileToRemove.numLinkedSolutions > 1 ? 's' : ''
                })}
          </Alert>
        )}

        {handleDocumentUnlink && (
          <>
            <p>
              <span className="text-bold">
                {t('removeDocumentModal.removing')}
              </span>
              {fileToRemove.numLinkedSolutions > 1
                ? t('removeDocumentModal.warningRemoveSolution')
                : t('removeDocumentModal.warningRemoveSolution2')}
            </p>
            <p>
              <span className="text-bold">
                {t('removeDocumentModal.disconnecting')}
              </span>
              {t('removeDocumentModal.warningDisconnectSolution')}
            </p>
          </>
        )}

        {!handleDocumentUnlink && (
          <>
            <p>
              {fileToRemove.numLinkedSolutions > 0
                ? t('removeDocumentModal.warning2')
                : t('removeDocumentModal.warning')}
            </p>
          </>
        )}

        <Button
          type="button"
          className="bg-red"
          onClick={() => {
            handleDelete(fileToRemove);
            setModalOpen(false);
          }}
        >
          {handleDocumentUnlink
            ? t('removeDocumentModal.confirmSolutionRemove')
            : t('removeDocumentModal.confirm')}
        </Button>

        {handleDocumentUnlink && (
          <Button
            type="button"
            onClick={() => {
              handleDocumentUnlink(fileToRemove.id, fileToRemove.fileName);
              setModalOpen(false);
            }}
          >
            {t('removeDocumentModal.disconnect')}
          </Button>
        )}

        <Button
          type="button"
          className="margin-left-2"
          unstyled
          onClick={() => setModalOpen(false)}
        >
          {handleDocumentUnlink
            ? t('removeDocumentModal.cancel')
            : t('removeDocumentModal.keepDocument')}
        </Button>
      </Modal>
    );
  };

  const columns = useMemo(() => {
    const documentColumns = [
      {
        Header: () => {
          return t('documentTable.name');
        },
        accessor: 'fileName',
        Cell: ({ row, value }: any) => {
          if (linkedDocs) {
            return (
              <Checkbox
                id={`link-document-${row.original.id}`}
                data-testid={`link-document-${row.original.id}`}
                onChange={() => {
                  const updatedDocs = findDocIDAndRemoveOrInsert(
                    row.original.id,
                    linkedDocs
                  );
                  if (setLinkedDocs) setLinkedDocs(updatedDocs);
                }}
                label={value}
                name={`link-document-${row.original.id}`}
                onBlur={() => null}
                checked={linkedDocs.includes(row.original.id)}
              />
            );
          }
          return value;
        }
      },
      {
        Header: t('documentTable.type'),
        accessor: 'documentType',
        Cell: ({ row, value }: { row: any; value: DocumentType }) => {
          if (value !== DocumentType.OTHER) {
            return documentTypeConfig.options[value];
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
          return formatDateLocal(value, 'MM/dd/yyyy');
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
                {!row.original.isLink ? (
                  <Button
                    type="button"
                    unstyled
                    className="margin-right-2"
                    onClick={() => handleDownload(row.original)}
                  >
                    <span className="display-flex flex-align-center">
                      {t('documentTable.view')}
                      <Icon.FileDownload />
                    </span>
                  </Button>
                ) : (
                  <ExternalLinkWithModal
                    url={row.original.url}
                    buttonText={t('documentTable.visit')}
                  />
                )}
                {hasEditAccess && !linkedDocs && (
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

    return documentColumns;
  }, [
    t,
    handleDownload,
    hasEditAccess,
    linkedDocs,
    setLinkedDocs,
    documentTypeConfig.options
  ]);

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
      globalFilter: useMemo(() => globalFilterCellText, []),
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
          {page.map(row => {
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
                            paddingLeft: '0'
                          }}
                        >
                          {cell.render('Cell')}
                        </th>
                      );
                    }
                    if (i + 1 === row.cells.length) {
                      return (
                        <td
                          {...cell.getCellProps()}
                          style={{
                            paddingLeft: '0',
                            paddingRight: '0'
                          }}
                        >
                          {cell.render('Cell')}
                        </td>
                      );
                    }
                    return (
                      <td
                        {...cell.getCellProps()}
                        style={{
                          paddingLeft: '0',
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

      <div
        className="usa-sr-only usa-table__announcement-region"
        aria-live="polite"
      >
        {currentTableSortDescription(headerGroups[0])}
      </div>

      {data.length === 0 && (
        <p data-testid="no-documents">
          {handleDocumentUnlink
            ? t('noLinkedDocs')
            : t('documentTable.noDocuments')}
        </p>
      )}
    </div>
  );
};
