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
import FilterTags from './components/FilterTags';
import Search from './components/Search';
import {
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
  const params = new URLSearchParams(location.search);
  const pageParam = params.get('page');
  const queryParam = params.get('query');
  const sortParam = params.get('sort') as SortProps['value'];

  const { modelName, createdDts } = useContext(ModelInfoContext);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [filters, setFilters] = useState<FilterType>({
    users: [],
    typeOfChange: [],
    startDate: '',
    endDate: ''
  });

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
  // Contains sort state of select option dropdown
  const [sort, setSort] = useState<SortProps['value']>(sortOptions[0].value);

  // Search/query configuration
  const [query, setQuery] = useState<string>('');
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

  //  If no query, return all solutions, otherwise, matching query solutions
  useEffect(() => {
    if (query.trim()) {
      const filteredAudits = searchChanges(query, sortedAudits);

      // Sets audit changes based on the filtered audits
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
      params.delete('page');
      navigate({ search: params.toString() });
    }

    // Return the page to the first page when the query changes
    setCurrentPage(1);
  }, [query, searchChanges, setCurrentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update the audit changes when the data is loaded.
  useEffect(() => {
    if (!loading) {
      setAuditChanges([...sortedChanges]);
      setSortedAudits([...sortedChanges]);

      // Set the sort based on the sort query parameter or default value
      setSort(sortParam || sortOptions[0].value);

      setTimeout(() => {
        // Set the query based on the query parameter
        setQuery(queryParam || '');
      }, 0);

      // Set the page offset based on the page parameter
      setCurrentPage(pageParam ? Number(pageParam) - 1 : 1);
      setPageCount(Math.ceil(auditChanges.length / itemsPerPage));
    }
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Sort the changes when the sort option changes.
  useEffect(() => {
    setAuditChanges(handleSortOptions(auditChanges, sort));
    setSortedAudits(handleSortOptions(sortedChanges, sort));
  }, [sort]); // eslint-disable-line react-hooks/exhaustive-deps

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
                      query={query}
                      resultsNum={resultsNum}
                      itemsPerPage={itemsPerPage}
                      currentPage={currentPage - 1}
                      setQuery={setQuery}
                      results={auditChanges}
                      currentResults={currentItems}
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
                      value={sort}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        setSort(e.target.value as SortProps['value']);
                        params.set('sort', e.target.value);
                        navigate({ search: params.toString() });
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

                <Grid tablet={{ col: 12 }}>
                  <FilterTags filters={filters} setFilters={setFilters} />
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
