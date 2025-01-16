import React, {
  useContext,
  useMemo
  // useState
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  CardGroup,
  Grid,
  GridContainer,
  Icon
  // Link
} from '@trussworks/react-uswds';
import SolutionDetailsModal from 'features/HelpAndKnowledge/SolutionsHelp/SolutionDetails/Modal';
import { NotFoundPartial } from 'features/NotFound';
import {
  GetMtoCommonSolutionsQuery,
  MtoSolutionType,
  useGetMtoCommonSolutionsQuery
} from 'gql/generated/graphql';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import CheckboxField from 'components/CheckboxField';
import Expire from 'components/Expire';
import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import TableResults from 'components/TableResults';
import { MTOModalContext } from 'contexts/MTOModalContext';
import useMessage from 'hooks/useMessage';
import useModalSolutionState from 'hooks/useModalSolutionState';
import usePagination from 'hooks/usePagination';
import useSearchSortPagination from 'hooks/useSearchSortPagination';

import MTOSolutionCard from './_components/MTOSolutionCard';

export type SolutionCardType =
  GetMtoCommonSolutionsQuery['modelPlan']['mtoMatrix']['commonSolutions'][0];

type SolutionViewType = 'all' | 'it-systems' | 'contracts' | 'cross-cut';

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

  const allSolutions = useMemo(
    () =>
      data?.modelPlan?.mtoMatrix.commonSolutions || ([] as SolutionCardType[]),
    [data?.modelPlan?.mtoMatrix.commonSolutions]
  );

  const filterSolutionsByType = useMemo(() => {
    return (type: MtoSolutionType) => {
      return allSolutions.filter(solution => {
        if (hideAddedSolutions) {
          return !solution.isAdded && solution.type === type;
        }
        return solution.type === type;
      });
    };
  }, [allSolutions, hideAddedSolutions]);

  const itSystemsSolutions = filterSolutionsByType(MtoSolutionType.IT_SYSTEM);
  const contractsSolutions = filterSolutionsByType(MtoSolutionType.CONTRACTOR);
  const crossCutSolutions = filterSolutionsByType(
    MtoSolutionType.CROSS_CUTTING_GROUP
  );

  const addedSolutions = allSolutions.filter(solution => solution.isAdded);

  const searchSolutions = (
    query: string,
    items: SolutionCardType[]
  ): SolutionCardType[] => {
    return items.filter(solution =>
      solution.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  // const selectedSolutionItems = () => {
  //   switch (viewParam) {
  //     case 'it-systems':
  //       return itSystemsSolutions;
  //     case 'contracts':
  //       return contractsSolutions;
  //     case 'cross-cut':
  //       return crossCutSolutions;
  //     case 'all':
  //     default:
  //       return allSolutions;
  //   }
  // };

  const { allItems, search, pageSize } = useSearchSortPagination<
    SolutionCardType,
    any
  >({
    items: allSolutions,
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

  const selectedSolutions = useMemo(
    () =>
      allItems.filter(solution => {
        if (hideAddedSolutions) {
          return !solution.isAdded;
        }
        return solution;
      }),
    [allItems, hideAddedSolutions]
  );

  const { query, setQuery, rowLength } = search;

  const { itemsPerPage, setItemsPerPage } = pageSize;

  const {
    currentItems,
    Pagination: PaginationComponent,
    pagination: { currentPage, pageCount }
  } = usePagination<SolutionCardType[]>({
    items: selectedSolutions,
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

                  {!!query && (
                    <Grid desktop={{ col: 12 }}>
                      <TableResults
                        globalFilter={query}
                        pageIndex={currentPage - 1}
                        pageSize={itemsPerPage}
                        filteredRowLength={rowLength}
                        rowLength={allItems.length}
                      />
                    </Grid>
                  )}

                  <Grid
                    desktop={{ col: 12 }}
                    className="display-flex flex-wrap margin-bottom-2"
                  >
                    <ButtonGroup type="segmented" className="margin-right-3">
                      <Button
                        type="button"
                        outline={viewParam !== 'all'}
                        onClick={() => {
                          params.set('view', 'all');
                          history.replace({ search: params.toString() });
                        }}
                      >
                        {t('solutionLibrary.tabs.allSolutions', {
                          count: allSolutions.length
                        })}
                      </Button>
                      <Button
                        type="button"
                        outline={viewParam !== 'it-systems'}
                        onClick={() => {
                          params.set('view', 'it-systems');
                          history.replace({ search: params.toString() });
                        }}
                      >
                        {t('solutionLibrary.tabs.itSystems', {
                          count: itSystemsSolutions.length
                        })}
                      </Button>
                      <Button
                        type="button"
                        outline={viewParam !== 'contracts'}
                        onClick={() => {
                          params.set('view', 'contracts');
                          history.replace({ search: params.toString() });
                        }}
                      >
                        {t('solutionLibrary.tabs.contracts', {
                          count: contractsSolutions.length
                        })}
                      </Button>
                      <Button
                        type="button"
                        outline={viewParam !== 'cross-cut'}
                        onClick={() => {
                          params.set('view', 'cross-cut');
                          history.replace({ search: params.toString() });
                        }}
                      >
                        {t('solutionLibrary.tabs.crossCutting', {
                          count: crossCutSolutions.length
                        })}
                      </Button>
                    </ButtonGroup>

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
                            <UswdsReactLink
                              to={`/models/${modelID}/collaboration-area/model-to-operations/solution-library?view=all`}
                              className="margin-x-05"
                            >
                              {' '}
                            </UswdsReactLink>
                          ),
                          button1: (
                            <Button
                              unstyled
                              type="button"
                              className="margin-x-05"
                              onClick={() => {
                                clearMessage();
                                setMTOModalState({ modalType: 'solution' });
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
                          setMTOModalState({ modalType: 'solution' });
                          setIsModalOpen(true);
                        }}
                      >
                        {t('solutionLibrary.addCustomSolution')}{' '}
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </div>

              <>
                <CardGroup className="padding-x-1">
                  <Grid desktop={{ col: 12 }}>
                    <Grid row gap={2}>
                      {currentItems.map(solution => (
                        <Grid
                          desktop={{ col: 4 }}
                          tablet={{ col: 6 }}
                          key={solution.key}
                        >
                          <MTOSolutionCard solution={solution} />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </CardGroup>

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
                    />
                  )}
                </div>
              </>
            </div>
          </>
        )}
      </GridContainer>
    </>
  );
};

export default SolutionLibrary;
