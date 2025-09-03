import React, {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Grid,
  GridContainer,
  Icon,
  Label,
  Pagination,
  Select,
  SummaryBox
} from '@trussworks/react-uswds';
import i18n from 'config/i18n';
import NotFound from 'features/NotFound';
import {
  useGetChangeHistoryQuery,
  useGetModelCollaboratorsQuery
} from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import { ModelInfoContext } from 'contexts/ModelInfoContext';
import { formatDateUtc } from 'utils/date';

import BatchRecord from './components/BatchRecord';
import ChangeRecord from './components/ChangeRecord';
import FilterForm, { FilterType } from './components/FilterForm';
import {
  filterAuditsBetweenDates,
  TypeChangeFilter
} from './components/FilterForm/filterUtil';
import FilterTags from './components/FilterTags';
import Search, { SearchResults } from './components/Search';
import {
  ChangeRecordType,
  filterQueryAudits,
  handleSortOptions,
  shouldRenderExistingLinkBatch,
  sortAllChanges,
  sortChangesByDay
} from './util';

import './index.scss';

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

/**
 * ChangeHistory Component
 *
 * Displays a paginated, filterable, and searchable list of model plan changes.
 * Features include:
 * - URL-driven state management for filters, search, pagination, and sorting
 * - Real-time filtering by users, change types, and date ranges
 * - Search functionality across change records
 * - Pagination with configurable items per page
 * - Sorting options (newest/oldest)
 */
const ChangeHistory = () => {
  const { t } = useTranslation('changeHistory');

  const { modelName, createdDts } = useContext(ModelInfoContext);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const flags = useFlags();

  let chReleaseDate: string = flags.changeHistoryReleaseDate;

  // Attempt to parse LD date string to ISO string for date comparison of model plan creation
  try {
    chReleaseDate = new Date(chReleaseDate).toISOString();
  } catch (e) {
    chReleaseDate = '';
  }

  const { modelID = '' } = useParams<{
    modelID: string;
  }>();

  const { state } = useLocation();

  const fromReadView = state?.from === 'readview';

  const navigate = useNavigate();

  // Query parameters - Extract and manage URL search parameters
  const location = useLocation();

  // Memoized URL search parameters to prevent unnecessary re-parsing
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  // Current page number from URL parameters, defaults to 1
  const pageNum = useMemo(() => {
    const page = params.get('page');
    return page ? Number(page) : 1;
  }, [params]);

  // Updates the current page in URL parameters
  const setCurrentPage = useCallback(
    (page: number) => {
      const newParams = new URLSearchParams(location.search);
      newParams.set('page', page.toString());
      navigate({ search: newParams.toString() });
    },
    [location.search, navigate]
  );

  // Current search query from URL parameters
  const queryParam = useMemo(() => params.get('query'), [params]);

  // Updates the search query in URL parameters and resets to page 1
  const setQuery = useCallback(
    (query: string) => {
      const newParams = new URLSearchParams(location.search);
      if (query) {
        newParams.set('query', query);
      } else {
        // Delete the 'query' parameter if empty
        newParams.delete('query');
      }
      // Reset to page 1 when query changes
      newParams.delete('page');
      navigate({ search: newParams.toString() });
    },
    [location.search, navigate]
  );

  // Current sort option from URL parameters, defaults to first sort option
  const sortParam = useMemo(
    () => (params.get('sort') as SortProps['value']) || sortOptions[0].value,
    [params]
  );

  // Updates the sort parameter in URL
  const setSortParam = useCallback(
    (sort: SortProps['value']) => {
      const newParams = new URLSearchParams(location.search);
      newParams.set('sort', sort);
      navigate({ search: newParams.toString() });
    },
    [location.search, navigate]
  );

  // Filter state derived from URL parameters
  const filters: FilterType = {
    // Comma-separated list of users from URL
    users: useMemo(
      () => params.get('users')?.split(',') || ([] as string[]),
      [params]
    ),
    // Comma-separated list of change types from URL
    typeOfChange: useMemo(
      () =>
        (params.get('typeOfChange')?.split(',') || []) as TypeChangeFilter[],
      [params]
    ),
    // Start date filter from URL
    startDate: useMemo(() => params.get('startDate') || '', [params]),
    // End date filter from URL
    endDate: useMemo(() => params.get('endDate') || '', [params])
  };

  // Updates filter parameters in URL and resets to page 1 when filters change
  const setFilters = useCallback(
    (filtersParams: FilterType) => {
      const newParams = new URLSearchParams(location.search);

      // Update users filter
      if (filtersParams.users.length > 0) {
        newParams.set('users', filtersParams.users.join(','));
      } else {
        newParams.delete('users');
      }

      // Update type of change filter
      if (filtersParams.typeOfChange.length > 0) {
        newParams.set('typeOfChange', filtersParams.typeOfChange.join(','));
      } else {
        newParams.delete('typeOfChange');
      }

      // Update start date filter
      if (filtersParams.startDate) {
        newParams.set('startDate', filtersParams.startDate);
      } else {
        newParams.delete('startDate');
      }

      // Update end date filter
      if (filtersParams.endDate) {
        newParams.set('endDate', filtersParams.endDate);
      } else {
        newParams.delete('endDate');
      }

      // Reset to page 1 when filters change
      newParams.delete('page');
      navigate({ search: newParams.toString() });
    },
    [location.search, navigate]
  );

  // Fetch model collaborators for filter options
  const { data: collaboratorsData } = useGetModelCollaboratorsQuery({
    variables: {
      id: modelID
    }
  });

  // Extract and sort collaborator names for filter dropdown
  const collaborators = useMemo(() => {
    return (
      collaboratorsData?.modelPlan?.collaborators
        .map(collaborator => collaborator.userAccount.commonName)
        .sort() || []
    );
  }, [collaboratorsData]);

  // Fetch change history data for the model plan
  const { data, loading, error } = useGetChangeHistoryQuery({
    variables: {
      modelPlanID: modelID
    }
  });

  // Process and sort all changes using the sortAllChanges utility
  const sortedChanges = useMemo(() => {
    const changes = [...(data?.translatedAuditCollection || [])];

    return sortAllChanges(changes);
  }, [data?.translatedAuditCollection]);

  // Contains the sorted changes based on select/sort option
  const [sortedAudits, setSortedAudits] = useState([...sortedChanges]);
  // Contains the current set of changes to display, including search and sort
  const [auditChanges, setAuditChanges] = useState([...sortedChanges]);

  // Number of results after filtering (for display purposes)
  const [resultsNum, setResultsNum] = useState<number>(0);

  // Pagination Configuration
  const itemsPerPage = 10;

  // Memoized sorted audit changes to prevent unnecessary re-sorting and flicker
  const sortedAuditChanges = useMemo(
    () => handleSortOptions(auditChanges, sortParam),
    [auditChanges, sortParam]
  );

  // Total number of pages based on filtered results
  const [pageCount, setPageCount] = useState<number>(
    Math.floor(sortedAuditChanges.length / itemsPerPage)
  );

  // Current items to display on the current page - contains search and sort data
  const [currentItems, setCurrentItems] = useState(
    sortedAuditChanges.slice(
      (pageNum - 1) * itemsPerPage,
      pageNum * itemsPerPage
    )
  );

  // Memoized search function to filter audits based on query
  const searchChanges = useCallback(filterQueryAudits, []);

  // Main useEffect for filtering audits based on filters and query strings
  useEffect(() => {
    // Start with all sorted audits
    let filteredAudits: ChangeRecordType[][] = [...sortedAudits];

    // Apply search query filter if present
    if (queryParam?.trim()) {
      filteredAudits = searchChanges(queryParam, filteredAudits);
    }

    // Apply user filters - combine results from all selected users
    if (filters.users.length > 0) {
      let filteredUserAudits: ChangeRecordType[][] = [];
      filters.users.forEach(user => {
        filteredUserAudits = [
          ...filteredUserAudits,
          ...searchChanges(user, filteredAudits)
        ];
      });
      filteredAudits = filteredUserAudits;
    }

    // Apply type of change filters - combine results from all selected types
    if (filters.typeOfChange.length > 0) {
      let filteredTypeAudits: ChangeRecordType[][] = [];
      filters.typeOfChange.forEach(type => {
        filteredTypeAudits = [
          ...filteredTypeAudits,
          ...searchChanges(type, filteredAudits)
        ];
      });
      filteredAudits = filteredTypeAudits;
    }

    // Apply date range filter if start or end date is specified
    if (filters.startDate || filters.endDate) {
      filteredAudits = filterAuditsBetweenDates(
        filteredAudits,
        filters.startDate,
        filters.endDate
      );
    }

    // Update the audit changes state with filtered results
    setAuditChanges(filteredAudits);

    // Update the results count for display
    setResultsNum(filteredAudits.length);

    // Note: We don't call setQuery here anymore to avoid resetting the page
    // The query parameter is already set correctly from the URL
  }, [
    queryParam,
    searchChanges,
    sortedAudits,
    loading,
    navigate,
    filters.users,
    filters.typeOfChange,
    filters.startDate,
    filters.endDate,
    params,
    sortParam
  ]);

  // Track whether URL parameters have been initialized to prevent duplicate processing
  const [areParamsSet, setAreParamsSet] = useState(false);

  // Initialize component state from URL parameters when data is first loaded
  useEffect(() => {
    if (!loading && !areParamsSet) {
      setAuditChanges(auditChanges);
      setSortedAudits(handleSortOptions(sortedChanges, sortParam));

      setTimeout(() => {
        // Set the query based on the query parameter
        setQuery(queryParam || '');
      }, 0);

      // Set the page offset based on the page parameter
      setPageCount(Math.ceil(sortedAuditChanges.length / itemsPerPage));

      setAreParamsSet(true);
    }
  }, [
    loading,
    queryParam,
    pageNum,
    params,
    navigate,
    sortedChanges,
    sortParam,
    sortedAuditChanges.length,
    areParamsSet,
    auditChanges,
    setQuery
  ]);

  // Update the current items when the page number or sorted data changes
  useEffect(() => {
    // Calculate the slice of items to display for the current page
    setCurrentItems(
      sortedAuditChanges.slice(
        (pageNum - 1) * itemsPerPage,
        pageNum * itemsPerPage
      )
    );
    // Update the total page count based on filtered results
    setPageCount(Math.ceil(sortedAuditChanges.length / itemsPerPage));
  }, [sortedAuditChanges, pageNum, setPageCount]);

  // Navigate to the next page if not at the last page
  const handleNext = () => {
    const nextPage = pageNum + 1;
    const maxPage = Math.ceil(sortedAuditChanges.length / itemsPerPage);
    if (nextPage <= maxPage) {
      setCurrentPage(nextPage);
    }
  };

  // Navigate to the previous page if not at the first page
  const handlePrevious = () => {
    const prevPage = pageNum - 1;
    if (prevPage >= 1) {
      setCurrentPage(prevPage);
    }
  };

  // Navigate to a specific page number
  const handlePageNumber = (
    event: React.MouseEvent<HTMLButtonElement>,
    pageNumber: number
  ) => {
    setCurrentPage(pageNumber);
  };

  // Group current page items by day for display
  const changesByDay = useMemo(
    () => sortChangesByDay(currentItems),
    [currentItems]
  );

  // Check if any filters are currently applied
  const isFiltered: boolean =
    filters.users.length +
      filters.typeOfChange.length +
      (filters.startDate ? 1 : 0) +
      (filters.endDate ? 1 : 0) >
    0;

  if (error) {
    return <NotFound />;
  }

  return (
    <MainContent className="change-history">
      {/* Summary banner */}
      <SummaryBox
        className="padding-y-6 padding-x-2 border-0 bg-primary-lighter radius-0 margin-top-0"
        data-testid="read-only-model-summary"
      >
        <GridContainer>
          <div className="display-flex flex-justify">
            <UswdsReactLink
              to={`/models/${modelID}/${
                fromReadView ? 'read-only' : 'collaboration-area'
              }`}
              className="display-flex flex-align-center margin-bottom-4"
            >
              <Icon.ArrowBack className="margin-right-1" aria-label="back" />
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

          {chReleaseDate && createdDts < chReleaseDate && (
            <div className="bg-white-opacity-50 margin-top-4 padding-y-1 padding-x-2">
              {t('changesSinceRelease', {
                date: flags.changeHistoryReleaseDate
              })}
            </div>
          )}
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
                  {/* Search bar and results info */}

                  <div className="display-flex flex-justify flex-align-start">
                    <FilterForm
                      changes={auditChanges}
                      filters={filters}
                      setFilters={setFilters}
                      isOpen={isFilterModalOpen}
                      closeModal={() => setIsFilterModalOpen(false)}
                      collaborators={collaborators}
                      createdDts={createdDts}
                    />

                    <Button
                      type="button"
                      outline
                      className="margin-right-2 margin-top-1"
                      onClick={() => setIsFilterModalOpen(true)}
                    >
                      {t('filter')}
                    </Button>

                    <Search
                      query={queryParam}
                      resultsNum={resultsNum}
                      itemsPerPage={itemsPerPage}
                      currentPage={pageNum}
                      setQuery={setQuery}
                      results={auditChanges}
                      currentResults={currentItems}
                      showResults={false}
                    />
                  </div>
                </Grid>

                {/* Select sort display */}
                <Grid tablet={{ col: 6 }}>
                  <div
                    className="margin-left-auto display-flex flex-align-center"
                    style={{ maxWidth: '13rem' }}
                  >
                    <Label
                      htmlFor="sort"
                      className="text-normal margin-right-1 margin-top-1"
                    >
                      {t('sort.label')}
                    </Label>

                    <Select
                      id="sort"
                      name="sort"
                      value={sortParam}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        setSortParam(e.target.value as SortProps['value']);
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

                {isFiltered && (
                  <Grid tablet={{ col: 12 }} className="margin-top-2">
                    <FilterTags filters={filters} setFilters={setFilters} />
                  </Grid>
                )}

                {queryParam && (
                  <Grid tablet={{ col: 12 }} className="margin-top-4">
                    <SearchResults
                      query={queryParam}
                      resultsNum={resultsNum}
                      itemsPerPage={itemsPerPage}
                      currentPage={pageNum}
                      results={auditChanges}
                      currentResults={currentItems}
                    />
                  </Grid>
                )}
              </Grid>
            </div>

            {/* No results from query */}
            {sortedAuditChanges.length === 0 && (queryParam || isFiltered) && (
              <Alert
                type="info"
                className="margin-bottom-2"
                heading={t('noResults.heading')}
              >
                {t('noResults.body')}
              </Alert>
            )}

            {/* No audits alert */}
            {sortedAuditChanges.length === 0 && !queryParam && !isFiltered && (
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
                  {changesByDay[day].map((changeRecords, index) => {
                    // If the change is a batch, render as a batch
                    if (shouldRenderExistingLinkBatch(changeRecords)) {
                      return (
                        <BatchRecord
                          changeRecords={changeRecords}
                          index={index}
                          key={changeRecords[0].id}
                        />
                      );
                    }

                    // Otherwise, render as a single change
                    return (
                      <ChangeRecord
                        changeRecord={changeRecords[0]}
                        index={index}
                        key={changeRecords[0].id}
                      />
                    );
                  })}
                </div>
              );
            })}

            {/* Pagination */}
            {pageCount > 1 && (
              <Pagination
                pathname={location.pathname}
                currentPage={pageNum}
                maxSlots={7}
                onClickNext={handleNext}
                onClickPageNumber={handlePageNumber}
                onClickPrevious={handlePrevious}
                totalPages={pageCount}
              />
            )}
          </>
        )}
      </GridContainer>
    </MainContent>
  );
};

export default ChangeHistory;
