import React, { useContext, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  Button,
  CardGroup,
  Grid,
  GridContainer,
  Icon,
  Link
} from '@trussworks/react-uswds';
import SolutionDetailsModal from 'features/HelpAndKnowledge/SolutionsHelp/SolutionDetails/Modal';
import { NotFoundPartial } from 'features/NotFound';
import {
  GetMtoCommonSolutionsQuery,
  MtoSolutionType,
  useGetMtoCommonSolutionsQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import CheckboxField from 'components/CheckboxField';
import Expire from 'components/Expire';
import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import { MTOModalContext } from 'contexts/MTOModalContext';
import useMessage from 'hooks/useMessage';
import useModalSolutionState from 'hooks/useModalSolutionState';
import usePagination from 'hooks/usePagination';
import useSearchSortPagination from 'hooks/useSearchSortPagination';

import MTOSolutionCard from './_components/MTOSolutionCard';
import ViewSelector from './_components/ViewSelector';

export type SolutionCardType =
  GetMtoCommonSolutionsQuery['modelPlan']['mtoMatrix']['commonSolutions'][0];

export type SolutionViewType = 'all' | 'it-systems' | 'contracts' | 'cross-cut';

const SolutionLibrary = () => {
  const { t } = useTranslation('modelToOperationsMisc');
  const { modelID } = useParams<{ modelID: string }>();
  const { clearMessage, message } = useMessage();

  const {
    isMTOModalOpen: isModalOpen,
    setMTOModalOpen: setIsModalOpen,
    setMTOModalState
  } = useContext(MTOModalContext);

  // Query parameters
  const location = useLocation();
  const { prevPathname, selectedSolution } = useModalSolutionState();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const hideAddedSolutions = params.get('hide-added-solutions') === 'true';

  let viewParam: SolutionViewType = 'all';

  if (params.get('view')) {
    const view = params.get('view') as SolutionViewType;
    if (['all', 'it-systems', 'contracts', 'cross-cut'].includes(view)) {
      viewParam = view;
    }
  }

  const { data, loading, error } = useGetMtoCommonSolutionsQuery({
    variables: { id: modelID }
  });

  const solutions = useMemo(
    () =>
      data?.modelPlan?.mtoMatrix.commonSolutions || ([] as SolutionCardType[]),
    [data?.modelPlan?.mtoMatrix.commonSolutions]
  );

  const addedSolutions = solutions.filter(solution => solution.isAdded);

  const searchSolutions = (
    query: string,
    items: SolutionCardType[]
  ): SolutionCardType[] => {
    return items.filter(solution =>
      solution.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const { allItems, search, pageSize } = useSearchSortPagination<
    SolutionCardType,
    any
  >({
    items: solutions,
    filterFunction: useMemo(() => searchSolutions, []),
    sortFunction: (items: SolutionCardType[], sort: any) => items,
    sortOptions: [
      {
        value: '',
        label: ''
      }
    ],
    defaultItemsPerPage: 6
  });

  const itSystemsSolutions = useMemo(
    () =>
      allItems.filter(item => {
        if (hideAddedSolutions) {
          return !item.isAdded && item.type === MtoSolutionType.IT_SYSTEM;
        }
        return item.type === MtoSolutionType.IT_SYSTEM;
      }),
    [allItems, hideAddedSolutions]
  );

  const contractsSolutions = useMemo(
    () =>
      allItems.filter(item => {
        if (hideAddedSolutions) {
          return !item.isAdded && item.type === MtoSolutionType.CONTRACTOR;
        }
        return item.type === MtoSolutionType.CONTRACTOR;
      }),
    [allItems, hideAddedSolutions]
  );

  const crossCutSolutions = useMemo(
    () =>
      allItems.filter(item => {
        if (hideAddedSolutions) {
          return (
            !item.isAdded && item.type === MtoSolutionType.CROSS_CUTTING_GROUP
          );
        }
        return item.type === MtoSolutionType.CROSS_CUTTING_GROUP;
      }),
    [allItems, hideAddedSolutions]
  );

  const allSolutions = useMemo(
    () =>
      allItems.filter(solution => {
        if (hideAddedSolutions) {
          return !solution.isAdded;
        }
        return solution;
      }),
    [allItems, hideAddedSolutions]
  );

  const filteredView = useMemo(() => {
    const views = {
      'it-systems': itSystemsSolutions,
      contracts: contractsSolutions,
      'cross-cut': crossCutSolutions,
      all: allSolutions
    };
    return views[viewParam];
  }, [
    viewParam,
    itSystemsSolutions,
    contractsSolutions,
    crossCutSolutions,
    allSolutions
  ]);

  const { query, setQuery, rowLength } = search;
  const totalResults: number = query ? rowLength : allItems.length;

  const { itemsPerPage, setItemsPerPage } = pageSize;

  const {
    currentItems,
    Pagination: PaginationComponent,
    pagination: { pageCount }
  } = usePagination<SolutionCardType[]>({
    items: filteredView,
    itemsPerPage,
    withQueryParams: 'page',
    showPageIfOne: true
  });

  if (error) {
    return <NotFoundPartial />;
  }

  return (
    <>
      {selectedSolution && (
        <SolutionDetailsModal
          solution={selectedSolution}
          openedFrom={prevPathname}
          closeRoute={location.pathname}
        />
      )}
      <GridContainer>
        <Breadcrumbs
          items={[
            BreadcrumbItemOptions.HOME,
            BreadcrumbItemOptions.COLLABORATION_AREA,
            BreadcrumbItemOptions.MODEL_TO_OPERATIONS
          ]}
          customItem={t('solutionLibrary.heading')}
        />
        <h1 className="margin-bottom-2 margin-top-5 line-height-large">
          {t('solutionLibrary.heading')}
        </h1>

        <p className="mint-body-large margin-bottom-2 margin-top-05">
          {t('solutionLibrary.description')}
        </p>

        <div className="margin-bottom-6">
          <UswdsReactLink
            to={`/models/${modelID}/collaboration-area/model-to-operations/matrix`}
            data-testid="return-to-mto"
          >
            <span>
              <Icon.ArrowBack className="top-3px margin-right-1" />
              {t('returnToMTO')}
            </span>
          </UswdsReactLink>
        </div>

        {loading ? (
          <PageLoading />
        ) : (
          <>
            {!isModalOpen && message && (
              <Expire delay={45000}>{message}</Expire>
            )}

            <div className="milestone-card-group">
              <div className="margin-top-2 margin-bottom-4">
                <Grid row>
                  {/* Search bar and results info */}
                  <Grid tablet={{ col: 6 }}>
                    <GlobalClientFilter
                      globalFilter={query}
                      setGlobalFilter={setQuery}
                      tableID="help-articles"
                      tableName=""
                      className="margin-bottom-3 maxw-none tablet:width-mobile-lg"
                    />
                  </Grid>

                  {/* X results for 'query' */}
                  {!!query && (
                    <Grid desktop={{ col: 12 }} className="margin-bottom-3">
                      <span>
                        {t('tableAndPagination:results.resultsFor', {
                          count: totalResults
                        })}
                        <strong>&quot;{query}&quot;</strong>
                      </span>
                    </Grid>
                  )}

                  <Grid
                    desktop={{ col: 12 }}
                    className="desktop:display-flex flex-wrap margin-bottom-2"
                  >
                    <ViewSelector
                      viewParam={viewParam}
                      allSolutions={allSolutions}
                      itSystemsSolutions={itSystemsSolutions}
                      contractsSolutions={contractsSolutions}
                      crossCutSolutions={crossCutSolutions}
                    />

                    <CheckboxField
                      id="hide-added-solutions"
                      name="hide-added-solutions"
                      label={t('solutionLibrary.hideAdded', {
                        count: addedSolutions.length
                      })}
                      value="true"
                      checked={hideAddedSolutions}
                      onBlur={() => null}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        params.set(
                          'hide-added-solutions',
                          hideAddedSolutions ? 'false' : 'true'
                        );
                        history.replace({ search: params.toString() });
                      }}
                    />
                  </Grid>

                  <Grid
                    desktop={{ col: 12 }}
                    className="display-flex flex-wrap bg-primary-lighter padding-x-2 padding-y-1"
                  >
                    <span className="text-bold margin-x-05">
                      {t('solutionLibrary.dontSeeSolution')}
                    </span>

                    {viewParam !== 'all' ? (
                      <Trans
                        t={t}
                        i18nKey="solutionLibrary.checkAllSolutions"
                        components={{
                          link1: (
                            <Button
                              type="button"
                              className="usa-button usa-button--unstyled margin-x-05 margin-top-05"
                              onClick={() => {
                                setQuery('');
                                params.set('view', 'all');
                                history.replace({ search: params.toString() });
                              }}
                            >
                              {' '}
                            </Button>
                          ),
                          button1: (
                            <Button
                              unstyled
                              type="button"
                              className="margin-x-05 margin-top-05"
                              onClick={() => {
                                clearMessage();
                                setMTOModalState({
                                  modalType: 'solution',
                                  modalCalledFrom: 'solution-library'
                                });
                                setIsModalOpen(true);
                              }}
                            >
                              {' '}
                            </Button>
                          )
                        }}
                      />
                    ) : (
                      <Button
                        unstyled
                        type="button"
                        className="margin-x-05"
                        onClick={() => {
                          clearMessage();
                          setMTOModalState({
                            modalType: 'solution',
                            modalCalledFrom: 'solution-library'
                          });
                          setIsModalOpen(true);
                        }}
                      >
                        {t('solutionLibrary.addCustomSolution')}{' '}
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </div>

              {/* No Results Banner Here */}
              {totalResults === 0 && (
                <div
                  role="status"
                  aria-live="polite"
                  className="margin-bottom-4"
                >
                  {query && (
                    <Alert
                      type="warning"
                      heading={t('solutionLibrary.emptyFilter.heading', {
                        solution: t(
                          `solutionLibrary.emptyFilter.solution.${viewParam}.heading`
                        )
                      })}
                    >
                      {t('solutionLibrary.emptyFilter.text-firstHalf')}
                      {t('solutionLibrary.emptyFilter.text-secondHalf', {
                        solution: t(
                          `solutionLibrary.emptyFilter.solution.${viewParam}.body`
                        )
                      })}
                      <Trans
                        t={t}
                        i18nKey="solutionLibrary.emptyFilter.email"
                        components={{
                          email1: (
                            <Link href="mailto:MINTTeam@cms.hhs.gov"> </Link>
                          )
                        }}
                      />
                    </Alert>
                  )}
                </div>
              )}

              {totalResults !== 0 && currentItems.length === 0 ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="margin-bottom-4"
                >
                  {query && (
                    <Alert
                      type="info"
                      heading={t('solutionLibrary.emptyFilter.heading', {
                        solution: t(
                          `solutionLibrary.emptyFilter.solution.${viewParam}.heading`
                        )
                      })}
                    >
                      {t('solutionLibrary.emptyFilter.text-firstHalf')}
                      <Trans
                        t={t}
                        i18nKey="solutionLibrary.emptyFilter.checkAllSolutions"
                        components={{
                          link1: (
                            <Button
                              type="button"
                              className="usa-button usa-button--unstyled"
                              onClick={() => {
                                setQuery('');
                                params.set('view', 'all');
                                history.replace({ search: params.toString() });
                              }}
                            >
                              {' '}
                            </Button>
                          )
                        }}
                      />
                      {t('solutionLibrary.emptyFilter.text-secondHalf', {
                        solution: t(
                          `solutionLibrary.emptyFilter.solution.${viewParam}.body`
                        )
                      })}
                      <Trans
                        t={t}
                        i18nKey="solutionLibrary.emptyFilter.email"
                        components={{
                          email1: (
                            <Link href="mailto:MINTTeam@cms.hhs.gov"> </Link>
                          )
                        }}
                      />
                    </Alert>
                  )}
                </div>
              ) : (
                <CardGroup>
                  {currentItems.map(solution => (
                    <MTOSolutionCard key={solution.key} solution={solution} />
                  ))}
                </CardGroup>
              )}

              {/* Pagination */}

              <div className="display-flex flex-wrap">
                {currentItems.length > 0 && pageCount > 0 && (
                  <>{PaginationComponent}</>
                )}
                {currentItems.length > 0 && (
                  <TablePageSize
                    className="margin-left-auto desktop:grid-col-auto"
                    pageSize={itemsPerPage}
                    setPageSize={setItemsPerPage}
                    valueArray={[6, 9, 'all']}
                    suffix={t('table.solutions')}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </GridContainer>
    </>
  );
};

export default SolutionLibrary;
