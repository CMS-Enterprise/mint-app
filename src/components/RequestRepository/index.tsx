import React, { useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Row,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  IconFileDownload,
  Table
} from '@trussworks/react-uswds';
import classnames from 'classnames';
import { DateTime } from 'luxon';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import TruncatedText from 'components/shared/TruncatedText';
import GlobalClientFilter from 'components/TableFilter';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
import { convertIntakeToCSV } from 'data/systemIntake';
import useCheckResponsiveScreen from 'hooks/checkMobile';
import { GetSystemIntake_systemIntake_lastAdminNote as LastAdminNote } from 'queries/types/GetSystemIntake';
import { AppState } from 'reducers/rootReducer';
import { fetchSystemIntakes } from 'types/routines';
import { SystemIntakeForm } from 'types/systemIntake';
import { formatDate } from 'utils/date';
import globalTableFilter from 'utils/globalTableFilter';
import {
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';

import csvHeaderMap from './csvHeaderMap';
import tableMap from './tableMap';

import './index.scss';

const RequestRepository = () => {
  type TableTypes = 'open' | 'closed';
  const isMobile = useCheckResponsiveScreen('tablet');
  const [activeTable, setActiveTable] = useState<TableTypes>('open');
  const { t } = useTranslation('governanceReviewTeam');
  const dispatch = useDispatch();
  const systemIntakes = useSelector(
    (state: AppState) => state.systemIntakes.systemIntakes
  );

  // Character limit for length of free text (Admin Note, LCID Scope, etc.), any
  // text longer then this limit will be displayed with a button to allow users
  // to expand/unexpand the text
  const freeFormTextCharLimit = 25;

  const submissionDateColumn = {
    Header: t('intake:fields.submissionDate'),
    accessor: 'submittedAt',
    Cell: ({ value }: any) => {
      if (value) {
        return DateTime.fromISO(value).toLocaleString(DateTime.DATE_FULL);
      }

      return t('requestRepository.table.submissionDate.null');
    }
  };

  const requestNameColumn = {
    Header: t('intake:fields.projectName'),
    accessor: 'requestName',
    Cell: ({ row, value }: any) => {
      return (
        <Link to={`/governance-review-team/${row.original.id}/intake-request`}>
          {value}
        </Link>
      );
    }
  };

  const requesterNameAndComponentColumn = {
    Header: t('intake:contactDetails.requester'),
    accessor: 'requester',
    Cell: ({ value }: any) => {
      return value;
    }
  };

  const adminLeadColumn = {
    Header: t('intake:fields.adminLead'),
    accessor: (value: SystemIntakeForm) => {
      if (value.adminLead) {
        return value.adminLead;
      }
      return t('governanceReviewTeam:adminLeads.notAssigned');
    },
    Cell: ({ value }: any) => {
      if (value === t('governanceReviewTeam:adminLeads.notAssigned')) {
        return (
          <>
            {/* TODO: should probably make this a button that opens up the assign admin
                lead automatically. Similar to the Dates functionality */}
            <i className="fa fa-exclamation-circle text-secondary margin-right-05" />
            {value}
          </>
        );
      }
      return value;
    }
  };

  const grtDateColumn = {
    Header: t('intake:fields.grtDate'),
    accessor: 'grtDate',
    Cell: ({ row, value }: any) => {
      if (!value) {
        return (
          <UswdsReactLink
            data-testid="add-grt-date-cta"
            to={`/governance-review-team/${row.original.id}/dates`}
          >
            {t('requestRepository.table.addDate')}
          </UswdsReactLink>
        );
      }
      return formatDate(value);
    }
  };

  const grbDateColumn = {
    Header: t('intake:fields.grbDate'),
    accessor: 'grbDate',
    Cell: ({ row, value }: any) => {
      if (!value) {
        return (
          <UswdsReactLink
            data-testid="add-grb-date-cta"
            to={`/governance-review-team/${row.original.id}/dates`}
          >
            {t('requestRepository.table.addDate')}
          </UswdsReactLink>
        );
      }
      return formatDate(value);
    }
  };

  const statusColumn = {
    Header: t('intake:fields.status'),
    accessor: 'status',
    Cell: ({ row, value }: any) => {
      // Check if status is LCID_ISSUED (need to check for translation)

      // If LCID_ISSUED append LCID Scope to status
      if (value === `LCID: ${row.original.lcid}`) {
        return (
          <>
            {value}
            <br />
            <TruncatedText
              id="lcid-scope"
              label="less"
              closeLabel="more"
              text={`Scope: ${row.original.lcidScope}`}
              charLimit={freeFormTextCharLimit}
              className="margin-top-2"
            />
          </>
        );
      }

      // If any other value just display status
      return value;
    }
  };

  const lcidExpirationDateColumn = {
    Header: t('intake:fields.lcidExpirationDate'),
    accessor: 'lcidExpiresAt',
    Cell: ({ value }: any) => {
      if (value) {
        return DateTime.fromISO(value).toLocaleString(DateTime.DATE_FULL);
      }

      // If no LCID Expiration exists, display 'No LCID Issued'
      return 'No LCID Issued';
    }
  };

  const lastAdminNoteColumn = {
    Header: t('intake:fields.lastAdminNote'),
    accessor: ({ lastAdminNote }: { lastAdminNote: LastAdminNote }) => {
      if (lastAdminNote?.content) {
        /* eslint react/prop-types: 0 */
        return lastAdminNote.content;
      }
      return null;
    },
    Cell: ({ value }: any) => {
      if (value) {
        return (
          // Display admin note using truncated text field that
          // will display note with expandable extra text (if applicable)
          <TruncatedText
            id="last-admin-note"
            label="less"
            closeLabel="more"
            text={value}
            charLimit={freeFormTextCharLimit}
          />
        );
      }

      // If no admin note exits, display 'No Admin Notes'
      return 'No Admin Notes';
    }
  };

  const columns: any = useMemo(() => {
    if (activeTable === 'open') {
      return [
        submissionDateColumn,
        requestNameColumn,
        requesterNameAndComponentColumn,
        adminLeadColumn,
        statusColumn,
        grtDateColumn,
        grbDateColumn
      ];
    }
    if (activeTable === 'closed') {
      return [
        submissionDateColumn,
        requestNameColumn,
        requesterNameAndComponentColumn,
        lcidExpirationDateColumn,
        statusColumn,
        lastAdminNoteColumn
      ];
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTable, t]);

  // Modifying data for table sorting and prepping for Cell configuration
  const data = useMemo(() => {
    if (systemIntakes) {
      return tableMap(systemIntakes, t);
    }
    return [];
  }, [systemIntakes, t]);

  useEffect(() => {
    dispatch(fetchSystemIntakes({ status: activeTable }));
  }, [dispatch, activeTable]);

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
    setGlobalFilter,
    state,
    page,
    prepareRow
  } = useTable(
    {
      columns,
      sortTypes: {
        alphanumeric: (rowOne, rowTwo, columnName) => {
          return sortColumnValues(
            rowOne.values[columnName],
            rowTwo.values[columnName]
          );
        }
      },
      globalFilter: useMemo(() => globalTableFilter, []),
      data,
      autoResetSortBy: false,
      autoResetPage: false,
      initialState: {
        sortBy: useMemo(() => [{ id: 'submittedAt', desc: true }], [])
      }
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const csvHeaders = csvHeaderMap(t);

  const convertIntakesToCSV = (intakes: any[]) => {
    return intakes.map(intake => convertIntakeToCSV(intake));
  };

  return (
    <MainContent className="padding-x-4 margin-bottom-5">
      <div className="display-flex flex-justify flex-wrap margin-bottom-2">
        <BreadcrumbBar variant="wrap">
          <Breadcrumb>
            <BreadcrumbLink asCustom={Link} to="/">
              <span>Home</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb current>Requests</Breadcrumb>
        </BreadcrumbBar>
        <CSVLink
          className="flex-align-self-center text-no-underline"
          data={convertIntakesToCSV(data)}
          filename="request-repository.csv"
          headers={csvHeaders}
        >
          <IconFileDownload />
          &nbsp;{' '}
          <span className="text-underline">
            Download all requests as excel file
          </span>
        </CSVLink>
      </div>
      <nav aria-label="Request Repository Table Navigation">
        <ul className="easi-request-repo__tab-list">
          <li
            className={classnames('easi-request-repo__tab', {
              'easi-request-repo__tab--active': activeTable === 'open'
            })}
          >
            <button
              type="button"
              className="easi-request-repo__tab-btn"
              onClick={() => setActiveTable('open')}
              aria-label={
                activeTable === 'open' ? 'Open requests selected' : ''
              }
            >
              Open Requests
            </button>
          </li>
          <li
            className={classnames('easi-request-repo__tab', {
              'easi-request-repo__tab--active': activeTable === 'closed'
            })}
          >
            <button
              type="button"
              className="easi-request-repo__tab-btn"
              onClick={() => setActiveTable('closed')}
              data-testid="view-closed-intakes-btn"
              aria-label={
                activeTable === 'closed' ? 'Closed requests selected' : ''
              }
            >
              Closed Requests
            </button>
          </li>
        </ul>
      </nav>
      {/* h1 for screen reader */}
      <PageHeading className="usa-sr-only">
        {t('requestRepository.requestCount', {
          context: activeTable,
          count: data.length
        })}
      </PageHeading>

      <GlobalClientFilter
        setGlobalFilter={setGlobalFilter}
        tableID={t('requestRepository.id')}
        tableName={t('requestRepository.title')}
        className="margin-bottom-4"
      />

      <TableResults
        globalFilter={state.globalFilter}
        pageIndex={state.pageIndex}
        pageSize={state.pageSize}
        filteredRowLength={page.length}
        rowLength={data.length}
        className="margin-bottom-4"
      />

      {/* This is the only table that expands past the USWDS desktop dimensions.  Only convert to scrollable when in tablet/mobile */}
      <Table
        scrollable={isMobile}
        fullWidth
        bordered={false}
        {...getTableProps()}
      >
        <caption className="usa-sr-only">
          {activeTable === 'open' &&
            t('requestRepository.aria.openTableCaption')}
          {activeTable === 'closed' &&
            t('requestRepository.aria.closedTableCaption')}
        </caption>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  aria-sort={getColumnSortStatus(column)}
                  style={{
                    minWidth: index === 0 ? '175px' : '150px',
                    position: 'relative'
                  }}
                >
                  <button
                    className="usa-button usa-button--unstyled"
                    type="button"
                    {...column.getSortByToggleProps()}
                  >
                    {column.render('Header')}
                    {getHeaderSortIcon(column)}
                  </button>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row: Row) => {
            prepareRow(row);
            return (
              // @ts-ignore
              <tr {...row.getRowProps()} data-testid={`${row.original.id}-row`}>
                {row.cells.map((cell, i) => {
                  if (i === 0) {
                    return (
                      <th
                        {...cell.getCellProps()}
                        style={{ verticalAlign: 'top' }}
                        scope="row"
                      >
                        {cell.render('Cell')}
                      </th>
                    );
                  }
                  return (
                    <td
                      {...cell.getCellProps()}
                      style={{ verticalAlign: 'top' }}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>

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
    </MainContent>
  );
};

export default RequestRepository;
