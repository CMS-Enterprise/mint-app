import React, {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import ReactPaginate from 'react-paginate';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  Grid,
  GridContainer,
  Icon,
  Label,
  Select,
  SummaryBox
} from '@trussworks/react-uswds';
import { useGetChangeHistoryQuery } from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import GlobalClientFilter from 'components/TableFilter';
import i18n from 'i18n';
import { formatDateUtc } from 'utils/date';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import NotFound from 'views/NotFound';

import BatchRecord from './components/BatchRecord';
import ChangeRecord from './components/ChangeRecord';
import {
  batchedTables,
  filterQueryAudits,
  handleSortOptions,
  sortAllChanges,
  sortChangesByDay
} from './util';

type LocationProps = {
  state: {
    from: string;
  };
  from?: string;
};

// Sort options type for the select dropdown
type SortProps = {
  value: 'newest' | 'oldest';
  label: string;
};

// Sort options for the select dropdown
const sortOptions: SortProps[] = [
  {
    value: 'newest',
    label: i18n.t('changeHistory:sort.newest')
  },
  {
    value: 'oldest',
    label: i18n.t('changeHistory:sort.oldest')
  }
];

const ChangeHistory = () => {
  const { t } = useTranslation('changeHistory');

  const { modelID } = useParams<{
    modelID: string;
  }>();

  const { state } = useLocation<LocationProps>();

  const fromReadView = state?.from === 'readview';

  const history = useHistory();

  // Query parameters
  const params = new URLSearchParams(history.location.search);
  const pageParam = params.get('page');
  const queryParam = params.get('query');
  const sortParam = params.get('sort') as SortProps['value'];

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useGetChangeHistoryQuery({
    variables: {
      modelPlanID: modelID
    }
  });

  const changes = [...(data?.translatedAuditCollection || [])];

  const sortedChanges = sortAllChanges(changes);

  // Contains the sorted changes based on select/sort option
  const [sortedAudits, setSortedAudits] = useState([...sortedChanges]);

  // Contains the current set of changes to display, including search and sort
  const [auditChanges, setAuditChanges] = useState([...sortedChanges]);

  // Contains sort state of select options
  const [sort, setSort] = useState<SortProps['value']>(
    sortParam || sortOptions[0].value
  );

  // Pagination Configuration
  const itemsPerPage = 10;
  const [pageOffset, setPageOffset] = useState(
    Number.isNaN(Number(pageParam)) ? 0 : Number(pageParam)
  );
  const endOffset = pageOffset + itemsPerPage;
  const [pageCount, setPageCount] = useState(
    auditChanges ? Math.ceil(auditChanges.length / itemsPerPage) : 1
  );

  // Current items to dsiplay on the current page - contains search and sort data
  const [currentItems, setCurrentItems] = useState(
    auditChanges.slice(pageOffset, endOffset)
  );

  // Search/query configuration
  const [query, setQuery] = useState<string>('');
  const [resultsNum, setResultsNum] = useState<number>(0);

  // searchChanges is a function to filter audits based on query
  const searchChanges = useCallback(filterQueryAudits, []);

  //  If no query, return all solutions, otherwise, matching query solutions
  useEffect(() => {
    if (query.trim()) {
      const filteredAudits = searchChanges(query, sortedAudits);

      setAuditChanges(filteredAudits);
      setResultsNum(filteredAudits.length);
    } else {
      // Sets the default audits if no query present
      setAuditChanges(sortedAudits);
    }

    if (!loading) {
      // Update the URL's query parameters
      if (query) {
        params.set('query', query);
      } else {
        // Delete the 'query' parameter
        params.delete('query');
      }
      history.push({ search: params.toString() });
    }

    // Return the page to the first page when the query changes
    setPageOffset(0);
  }, [query, searchChanges, setPageOffset]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update the audit changes when the data is loaded.
  useEffect(() => {
    if (!loading) {
      setAuditChanges([...sortedChanges]);
      setSortedAudits([...sortedChanges]);

      // Set the query based on the query parameter
      setQuery(queryParam || '');

      // Set the page offset based on the page parameter
      const newOffset = pageParam ? (Number(pageParam) - 1) * itemsPerPage : 0;
      setPageOffset(newOffset);
    }
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update the current items when the page offset changes.
  useEffect(() => {
    setCurrentItems(auditChanges.slice(pageOffset, endOffset));
    setPageCount(
      auditChanges ? Math.ceil(auditChanges.length / itemsPerPage) : 1
    );
  }, [auditChanges, endOffset, pageOffset]);

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % auditChanges?.length;
    setPageOffset(newOffset);
    params.set('page', (newOffset / itemsPerPage + 1).toString());
    history.push({ search: params.toString() });
  };

  // Sort the changes when the sort option changes.
  useEffect(() => {
    setAuditChanges(handleSortOptions(auditChanges, sort));
    setSortedAudits(handleSortOptions(sortedChanges, sort));
  }, [sort]); // eslint-disable-line react-hooks/exhaustive-deps

  // Group changes by day
  const changesByDay = sortChangesByDay(currentItems);

  if (error) {
    return <NotFound />;
  }

  return (
    <MainContent>
      {/* Summary banner */}
      <SummaryBox
        className="padding-y-6 padding-x-2 border-0 bg-primary-lighter radius-0 margin-top-0"
        data-testid="read-only-model-summary"
      >
        <GridContainer>
          <div className="display-flex flex-justify">
            <UswdsReactLink
              to={`/models/${modelID}/${
                fromReadView ? 'read-only' : 'task-list'
              }`}
              className="display-flex flex-align-center margin-bottom-4"
            >
              <Icon.ArrowBack className="text-primary margin-right-1" />
              {fromReadView ? t('backToReadView') : t('back')}
            </UswdsReactLink>
          </div>

          <PageHeading
            className="margin-0 line-height-sans-2 minh-6 margin-bottom-2"
            headingLevel="h1"
          >
            {t('heading')}
          </PageHeading>

          <span className="font-body-lg">
            {t('subheading', {
              modelName
            })}
          </span>

          {/* TODO: implement once we have a definitive release date */}
          <div className="bg-white-opacity-50 margin-top-4 padding-y-1 padding-x-2">
            {t('changesSinceRelease')}
          </div>
        </GridContainer>
      </SummaryBox>

      <GridContainer className="padding-y-4">
        {loading ? (
          <PageLoading />
        ) : (
          <>
            <div className="margin-top-2 margin-bottom-4">
              <Grid row>
                <Grid tablet={{ col: 6 }}>
                  {/* Search bar */}
                  <GlobalClientFilter
                    setGlobalFilter={setQuery}
                    tableID="table-id"
                    tableName="table-name"
                    className="width-full maxw-mobile-lg margin-bottom-3 padding-top-1"
                    initialFilter={queryParam || ''}
                  />

                  {/* Results text */}
                  {query && (
                    <div className="display-flex padding-bottom-2">
                      <p className="margin-y-0">
                        {auditChanges.length > itemsPerPage
                          ? t('resultsInfo', {
                              resultsNum: (pageOffset / itemsPerPage) * 10 + 1,
                              count:
                                (pageOffset / itemsPerPage) * 10 +
                                currentItems?.length,
                              total: resultsNum,
                              query: 'for'
                            })
                          : t('resultsNoInfo', {
                              resultsNum: auditChanges.length,
                              count: auditChanges.length,
                              query: 'for'
                            })}
                        {query && (
                          <span className="text-bold">{` "${query}"`}</span>
                        )}
                      </p>
                    </div>
                  )}
                </Grid>

                {/* Select sort display */}
                <Grid tablet={{ col: 6 }}>
                  <div
                    className="margin-left-auto display-flex"
                    style={{ maxWidth: '13rem' }}
                  >
                    <Label
                      htmlFor="sort"
                      className="text-normal margin-top-1 margin-right-1"
                    >
                      {t('sort.label')}
                    </Label>

                    <Select
                      id="sort"
                      className="margin-bottom-2 margin-top-0"
                      name="sort"
                      value={sort}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        setSort(e.target.value as SortProps['value']);
                        params.set('sort', e.target.value);
                        history.push({ search: params.toString() });
                      }}
                    >
                      {sortOptions.map(option => {
                        return (
                          <option
                            key={`sort-${option.value}`}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        );
                      })}
                    </Select>
                  </div>
                </Grid>
              </Grid>
            </div>
            {/* No results from query */}
            {auditChanges.length === 0 && query && (
              <Alert
                type="info"
                className="margin-bottom-2"
                heading={t('noResults.heading')}
              >
                {t('noResults.body')}
              </Alert>
            )}
            {/* No audits alert */}
            {auditChanges.length === 0 && !query && (
              <Alert type="info" slim className="margin-bottom-2">
                {t('noChanges')}
              </Alert>
            )}

            {/* Renders the day grouping, then maps over that day's changes */}
            {Object.keys(changesByDay).map(day => {
              return (
                <div key={day}>
                  <h3 className="margin-y-4">
                    {formatDateUtc(day, 'MMMM d, yyyy')}
                  </h3>
                  {changesByDay[day].map(changeRecords => {
                    if (batchedTables.includes(changeRecords[0].tableName)) {
                      return (
                        <BatchRecord
                          changeRecords={changeRecords}
                          key={changeRecords[0].id}
                        />
                      );
                    }
                    return (
                      <ChangeRecord
                        changeRecord={changeRecords[0]}
                        key={changeRecords[0].id}
                      />
                    );
                  })}
                </div>
              );
            })}
            {/* Pagination */}
            {pageCount > 1 && (
              <ReactPaginate
                breakLabel="..."
                breakClassName="usa-pagination__item usa-pagination__overflow"
                nextLabel="Next >"
                containerClassName="mint-pagination usa-pagination usa-pagination__list margin-top-2"
                previousLinkClassName={
                  pageOffset === 0
                    ? 'display-none'
                    : 'usa-pagination__link usa-pagination__previous-page prev-page'
                }
                nextLinkClassName={
                  pageOffset / itemsPerPage === pageCount - 1
                    ? 'display-none'
                    : 'usa-pagination__link usa-pagination__previous-page next-page'
                }
                disabledClassName="pagination__link--disabled"
                activeClassName="usa-current"
                activeLinkClassName="usa-current"
                pageClassName="usa-pagination__item"
                pageLinkClassName="usa-pagination__button"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< Previous"
                onClick={() => window.scrollTo(0, 0)}
                forcePage={pageOffset / itemsPerPage}
                renderOnZeroPageCount={null}
              />
            )}
          </>
        )}
      </GridContainer>
    </MainContent>
  );
};

export default ChangeHistory;
