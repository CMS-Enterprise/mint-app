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

const ChangeHistory = () => {
  const { t } = useTranslation('changeHistory');

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

  // Query parameters
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const pageParam = useMemo(() => params.get('page'), [params]);
  const queryParam = useMemo(() => params.get('query'), [params]);
  const sortParam = useMemo(
    () => (params.get('sort') as SortProps['value']) || sortOptions[0].value,
    [params]
  );
  const filters: FilterType = {
    users: useMemo(
      () => params.get('users')?.split(',') || ([] as string[]),
      [params]
    ),
    typeOfChange: useMemo(
      () =>
        (params.get('typeOfChange')?.split(',') || []) as TypeChangeFilter[],
      [params]
    ),
    startDate: useMemo(() => params.get('startDate') || '', [params]),
    endDate: useMemo(() => params.get('endDate') || '', [params])
  };

  // Manages state and URL parameters for the filters
  const setFilters = useCallback(
    (filtersParams: FilterType) => {
      if (filtersParams.users.length > 0) {
        params.set('users', filtersParams.users.join(','));
      } else {
        params.delete('users');
      }
      if (filtersParams.typeOfChange.length > 0) {
        params.set('typeOfChange', filtersParams.typeOfChange.join(','));
      } else {
        params.delete('typeOfChange');
      }
      if (filtersParams.startDate) {
        params.set('startDate', filtersParams.startDate);
      } else {
        params.delete('startDate');
      }
      if (filtersParams.endDate) {
        params.set('endDate', filtersParams.endDate);
      } else {
        params.delete('endDate');
      }
      navigate({ search: params.toString() });
    },
    [params, navigate]
  );

  const { modelName, createdDts } = useContext(ModelInfoContext);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const { data: collaboratorsData } = useGetModelCollaboratorsQuery({
    variables: {
      id: modelID
    }
  });

  const collaborators = useMemo(() => {
    return (
      collaboratorsData?.modelPlan?.collaborators
        .map(collaborator => collaborator.userAccount.commonName)
        .sort() || []
    );
  }, [collaboratorsData]);

  const { data, loading, error } = useGetChangeHistoryQuery({
    variables: {
      modelPlanID: modelID
    }
  });

  const sortedChanges = useMemo(() => {
    const changes = [...(data?.translatedAuditCollection || [])];

    return sortAllChanges(changes);
  }, [data?.translatedAuditCollection]);

  // Contains the sorted changes based on select/sort option
  const [sortedAudits, setSortedAudits] = useState([...sortedChanges]);
  // Contains the current set of changes to display, including search and sort
  const [auditChanges, setAuditChanges] = useState([...sortedChanges]);

  // Search/query configuration
  const setQuery = useCallback(
    (query: string) => {
      if (query) {
        params.set('query', query);
      } else {
        // Delete the 'query' parameter
        params.delete('query');
      }
      params.delete('page');
      navigate({ search: params.toString() });
    },
    [params, navigate]
  );

  const [resultsNum, setResultsNum] = useState<number>(0);

  // Pagination Configuration
  const itemsPerPage = 10;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(
    Math.floor(auditChanges.length / itemsPerPage)
  );

  // Current items to dsiplay on the current page - contains search and sort data
  const [currentItems, setCurrentItems] = useState(
    auditChanges.slice(
      currentPage * itemsPerPage,
      currentPage * itemsPerPage + itemsPerPage
    )
  );

  // searchChanges is a function to filter audits based on query
  const searchChanges = useCallback(filterQueryAudits, []);

  // Main hook for filtering audits based on filters and query strings
  useEffect(() => {
    let filteredAudits: ChangeRecordType[][] = [...sortedAudits];

    // If query is present, filter the audits based on the query
    if (queryParam?.trim()) {
      filteredAudits = searchChanges(queryParam, filteredAudits);
    }

    // If users are filtered, filter the audits based on the users
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

    // If type of change is filtered, filter the audits based on the type of change
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

    // If date range is filtered, filter the audits based on the date range
    if (filters.startDate || filters.endDate) {
      filteredAudits = filterAuditsBetweenDates(
        filteredAudits,
        filters.startDate,
        filters.endDate
      );
    }

    // Set the audit changes based on the filtered audits
    setAuditChanges(filteredAudits);

    // Set the results number based on the filtered audits
    setResultsNum(filteredAudits.length);

    if (!loading) {
      // Update the URL's query parameters
      setQuery(queryParam || '');
    }

    // Return the page to the first page when the query changes
    setCurrentPage(1);
  }, [
    queryParam,
    setQuery,
    searchChanges,
    setCurrentPage,
    sortedAudits,
    loading,
    navigate,
    filters.users,
    filters.typeOfChange,
    filters.startDate,
    filters.endDate,
    params
  ]);

  // Determine if the parameters have been set
  const [areParamsSet, setAreParamsSet] = useState(false);

  // Update the audit changes when the data is loaded.
  useEffect(() => {
    if (!loading && !areParamsSet) {
      setAuditChanges(handleSortOptions(auditChanges, sortParam));
      setSortedAudits(handleSortOptions(sortedChanges, sortParam));

      setTimeout(() => {
        // Set the query based on the query parameter
        setQuery(queryParam || '');
      }, 0);

      // Set the page offset based on the page parameter
      setCurrentPage(pageParam ? Number(pageParam) - 1 : 1);
      setPageCount(Math.ceil(auditChanges.length / itemsPerPage));

      setAreParamsSet(true);
    }
  }, [
    loading,
    queryParam,
    pageParam,
    params,
    navigate,
    sortedChanges,
    sortParam,
    auditChanges.length,
    areParamsSet,
    auditChanges,
    setQuery
  ]);

  // Update the current items when the page offset changes.
  useEffect(() => {
    setCurrentItems(
      auditChanges.slice(
        (currentPage - 1) * itemsPerPage,
        (currentPage - 1) * itemsPerPage + itemsPerPage
      )
    );
    setPageCount(Math.ceil(auditChanges.length / itemsPerPage));
  }, [auditChanges, currentPage, setPageCount]);

  const handleNext = () => {
    const nextPage = currentPage + 1;
    params.set('page', nextPage.toString());
    navigate({ search: params.toString() });
    setCurrentPage(nextPage);
  };

  const handlePrevious = () => {
    const prevPage = currentPage - 1;
    params.set('page', prevPage.toString());
    navigate({ search: params.toString() });
    setCurrentPage(prevPage);
  };

  const handlePageNumber = (
    event: React.MouseEvent<HTMLButtonElement>,
    pageNum: number
  ) => {
    params.set('page', pageNum.toString());
    navigate({ search: params.toString() });
    setCurrentPage(pageNum);
  };

  // Group changes by day
  const changesByDay = useMemo(
    () => sortChangesByDay(currentItems),
    [currentItems]
  );

  // Determine if the filters are applied
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
                      currentPage={currentPage - 1}
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
                        params.set('sort', e.target.value);
                        navigate({ search: params.toString() });

                        setAuditChanges(
                          handleSortOptions(
                            auditChanges,
                            e.target.value as SortProps['value']
                          )
                        );
                        setSortedAudits(
                          handleSortOptions(
                            sortedChanges,
                            e.target.value as SortProps['value']
                          )
                        );
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
                      currentPage={currentPage - 1}
                      results={auditChanges}
                      currentResults={currentItems}
                    />
                  </Grid>
                )}
              </Grid>
            </div>

            {/* No results from query */}
            {auditChanges.length === 0 && (queryParam || isFiltered) && (
              <Alert
                type="info"
                className="margin-bottom-2"
                heading={t('noResults.heading')}
              >
                {t('noResults.body')}
              </Alert>
            )}

            {/* No audits alert */}
            {auditChanges.length === 0 && !queryParam && !isFiltered && (
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
                currentPage={currentPage}
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
