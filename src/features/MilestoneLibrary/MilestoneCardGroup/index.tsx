import React, { useContext, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  CardGroup,
  Grid,
  Link
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import MilestonePanel from 'features/ModelPlan/ModelToOperations/_components/MilestonePanel';
import {
  GetMtoAllCommonMilestonesQuery,
  GetMtoMilestonesQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import Expire from 'components/Expire';
import UswdsReactLink from 'components/LinkWrapper';
import Sidepanel from 'components/Sidepanel';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import TableResults from 'components/TableResults';
import { MTOModalContext } from 'contexts/MTOModalContext';
import useMessage from 'hooks/useMessage';
import usePagination from 'hooks/usePagination';
import useSearchSortPagination from 'hooks/useSearchSortPagination';

import MilestoneCard from '../MilestoneCard';
import MilestoneFilterModal, {
  MilestoneSelectedFilters
} from '../MilestoneFilter/MilestoneFilterModal';
import getMilestoneFilters from '../MilestoneFilter/MilestoneFilterModal/getMilestoneFilters';
import MilestoneFilterTags from '../MilestoneFilterTags';

const searchMilestones = (
  query: string,
  items: MilestoneCardType[]
): MilestoneCardType[] => {
  return items.filter(
    milestone =>
      milestone.name.toLowerCase().includes(query.toLowerCase()) ||
      milestone.categoryName.toLowerCase().includes(query.toLowerCase()) ||
      milestone.subCategoryName?.toLowerCase().includes(query.toLowerCase())
  );
};

type MilestoneViewType = 'suggested' | 'all';

export type MilestoneCardType =
  | GetMtoMilestonesQuery['modelPlan']['mtoMatrix']['commonMilestones'][0]
  | GetMtoAllCommonMilestonesQuery['mtoCommonMilestones'][0];

const MilestoneCardGroup = ({
  milestones,
  showFilters = false
}: {
  milestones: MilestoneCardType[];
  showFilters?: boolean;
}) => {
  const { t } = useTranslation('modelToOperationsMisc');
  const { t: hkcT } = useTranslation('helpAndKnowledge');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const navigate = useNavigate();

  const { clearMessage, message } = useMessage();

  const {
    setMTOModalOpen: setIsModalOpen,
    setMTOModalState,
    isMTOModalOpen
  } = useContext(MTOModalContext);

  // Query parameters
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const appliedFilters: MilestoneSelectedFilters = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);

    return {
      categoryName: searchParams.get('category')
        ? (searchParams.get('category') || '').split(',')
        : [],
      facilitatedByRole: (searchParams.get('role')
        ? (searchParams.get('role') || '').split(',')
        : []) as MilestoneSelectedFilters['facilitatedByRole']
    };
  }, [location.search]);

  const setAppliedFilters = (filters: MilestoneSelectedFilters) => {
    const newParams = new URLSearchParams(location.search);

    if (filters.categoryName.length > 0) {
      newParams.set('category', filters.categoryName.join(','));
    } else {
      newParams.delete('category');
    }

    if (filters.facilitatedByRole.length > 0) {
      newParams.set('role', filters.facilitatedByRole.join(','));
    } else {
      newParams.delete('role');
    }

    // Reset pagination when filters change
    newParams.delete('page');

    navigate({ search: newParams.toString() }, { replace: true });
  };
  const addedMilestonesHidden = params.get('hide-added-milestones') === 'true';
  const milestoneParam: string = params.get('milestone') || '';

  let viewParam: MilestoneViewType = showFilters ? 'all' : 'suggested';

  const [, setIsSidepanelOpen] = useState(false);

  if (params.get('view') && params.get('view') === 'all') {
    viewParam = 'all';
  }

  const selectedMilestone: MilestoneCardType | undefined = useMemo(() => {
    return milestones.find(milestone => milestone.id === milestoneParam);
  }, [milestones, milestoneParam]);

  const addedMilestones = useMemo(
    () => milestones.filter(milestone => milestone.isAdded),
    [milestones]
  );

  const suggestedMilestones = useMemo(
    () =>
      milestones.filter(milestone => {
        if (addedMilestonesHidden) {
          return milestone.suggested.isSuggested && !milestone.isAdded;
        }
        return milestone.suggested.isSuggested;
      }),
    [milestones, addedMilestonesHidden]
  );

  // Filter the milestones based on the Hide added milestones checkbox
  const milestonesNotAdded = useMemo(
    () =>
      milestones.filter(milestone => {
        if (addedMilestonesHidden) {
          return !milestone.isAdded;
        }
        return milestone;
      }),
    [milestones, addedMilestonesHidden]
  );

  const { allItems, search, pageSize } = useSearchSortPagination<
    MilestoneCardType,
    any
  >({
    items: milestones,
    filterFunction: useMemo(() => searchMilestones, []),
    sortFunction: (items: MilestoneCardType[], sort: any) => items,
    sortOptions: [
      {
        value: '',
        label: ''
      }
    ],
    defaultItemsPerPage: 6
  });

  const currentSuggestedMilestones = useMemo(
    () =>
      allItems.filter(milestone => {
        if (addedMilestonesHidden) {
          return milestone.suggested.isSuggested && !milestone.isAdded;
        }
        return milestone.suggested.isSuggested;
      }),
    [allItems, addedMilestonesHidden]
  );

  const currentNotAddedMilestones = useMemo(
    () =>
      allItems.filter(milestone => {
        if (addedMilestonesHidden) {
          return !milestone.isAdded;
        }
        return milestone;
      }),
    [allItems, addedMilestonesHidden]
  );

  // Filter the milestones based on the isSuggested field value
  const selectedMilestones = useMemo(() => {
    const selected =
      viewParam === 'suggested'
        ? currentSuggestedMilestones
        : currentNotAddedMilestones;

    return selected.sort((a, b) => a.name.localeCompare(b.name));
  }, [currentNotAddedMilestones, currentSuggestedMilestones, viewParam]);

  const { query, setQuery, rowLength } = search;

  const { itemsPerPage, setItemsPerPage } = pageSize;

  const filterOptions = useMemo(
    () => getMilestoneFilters(selectedMilestones),
    [selectedMilestones]
  );

  const hasAppliedFilters = useMemo(
    () =>
      showFilters &&
      (appliedFilters.categoryName.length > 0 ||
        appliedFilters.facilitatedByRole.length > 0),
    [appliedFilters, showFilters]
  );

  const filteredMilestones = useMemo(() => {
    if (!showFilters) {
      return selectedMilestones;
    }

    let filtered = [...selectedMilestones];

    if (appliedFilters.categoryName.length > 0) {
      filtered = filtered.filter(milestone =>
        appliedFilters.categoryName.includes(milestone.categoryName)
      );
    }

    if (appliedFilters.facilitatedByRole.length > 0) {
      filtered = filtered.filter(milestone =>
        appliedFilters.facilitatedByRole.some(role =>
          milestone.facilitatedByRole.includes(role)
        )
      );
    }

    return filtered;
  }, [selectedMilestones, appliedFilters, showFilters]);

  const {
    currentItems,
    Pagination: PaginationComponent,
    pagination: { currentPage, pageCount }
  } = usePagination<MilestoneCardType[]>({
    items: filteredMilestones,
    itemsPerPage,
    withQueryParams: 'page',
    showPageIfOne: true
  });

  return (
    <>
      <Sidepanel
        isOpen={!!selectedMilestone}
        closeModal={() => {
          params.delete('milestone');
          navigate({ search: params.toString() }, { replace: true });
          setIsSidepanelOpen(false);
        }}
        ariaLabel={t('modal.editMilestone.milestoneTitle')}
        testid="milestone-sidepanel"
        modalHeading={t('modal.editMilestone.milestoneTitle')}
        noScrollable
      >
        {selectedMilestone && (
          <MilestonePanel
            milestone={selectedMilestone}
            mode={showFilters ? 'hkcMilestoneLibrary' : 'mtoMilestoneLibrary'}
          />
        )}
      </Sidepanel>

      {!isMTOModalOpen && message && <Expire delay={45000}>{message}</Expire>}

      <div className="milestone-card-group">
        <div className="margin-top-2 margin-bottom-4">
          <Grid row>
            <Grid className="display-flex flex-wrap flex-align-center margin-bottom-3">
              {showFilters && (
                <MilestoneFilterModal
                  filters={filterOptions}
                  appliedFilters={appliedFilters}
                  setAppliedFilters={setAppliedFilters}
                />
              )}
              {/* Search bar and results info */}
              <GlobalClientFilter
                globalFilter={query}
                setGlobalFilter={setQuery}
                tableID="help-articles"
                tableName=""
                className={classNames('maxw-none tablet:width-mobile-lg', {
                  'tablet:margin-left-1': showFilters
                })}
                height5
              />
            </Grid>

            {showFilters && (
              <MilestoneFilterTags
                appliedFilters={appliedFilters}
                setAppliedFilters={setAppliedFilters}
                className="margin-top-2"
              />
            )}

            {!!query && (
              <Grid desktop={{ col: 12 }}>
                <TableResults
                  globalFilter={query}
                  pageIndex={currentPage - 1}
                  pageSize={itemsPerPage}
                  filteredRowLength={rowLength}
                  rowLength={allItems.length}
                  showAlert={false}
                />
              </Grid>
            )}

            {!showFilters && (
              <Grid
                desktop={{ col: 12 }}
                className="display-flex flex-wrap margin-bottom-2"
              >
                <ButtonGroup type="segmented" className="margin-right-3">
                  <Button
                    type="button"
                    outline={viewParam !== 'suggested'}
                    onClick={() => {
                      params.set('page', '1');
                      params.set('view', 'suggested');
                      navigate(
                        { search: params.toString() },
                        { replace: true }
                      );
                    }}
                  >
                    {t('milestoneLibrary.suggestedMilestones', {
                      count: query
                        ? currentSuggestedMilestones.length
                        : suggestedMilestones.length
                    })}
                  </Button>
                  <Button
                    type="button"
                    outline={viewParam !== 'all'}
                    onClick={() => {
                      params.set('page', '1');
                      params.set('view', 'all');
                      navigate(
                        { search: params.toString() },
                        { replace: true }
                      );
                    }}
                  >
                    {t('milestoneLibrary.allMilestones', {
                      count: query
                        ? currentNotAddedMilestones.length
                        : milestonesNotAdded.length
                    })}
                  </Button>
                </ButtonGroup>

                <CheckboxField
                  id="hide-added-milestones"
                  name="hide-added-milestones"
                  label={t('milestoneLibrary.hideAdded', {
                    count: addedMilestones.length
                  })}
                  value="true"
                  checked={addedMilestonesHidden}
                  onBlur={() => null}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    params.set(
                      'hide-added-milestones',
                      addedMilestonesHidden ? 'false' : 'true'
                    );
                    navigate({ search: params.toString() }, { replace: true });
                  }}
                />
              </Grid>
            )}

            {!showFilters && (
              <Grid
                desktop={{ col: 12 }}
                className="display-flex flex-wrap bg-primary-lighter padding-x-2 padding-y-1"
              >
                <span className="text-bold margin-x-05">
                  {t('milestoneLibrary.dontSeeMilestone')}
                </span>

                {viewParam === 'suggested' ? (
                  <Trans
                    t={t}
                    i18nKey="milestoneLibrary.checkMilestones"
                    components={{
                      link1: (
                        <UswdsReactLink
                          to={`/models/${modelID}/collaboration-area/model-to-operations/milestone-library?view=all`}
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
                            setMTOModalState({ modalType: 'milestone' });
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
                      setMTOModalState({ modalType: 'milestone' });
                      setIsModalOpen(true);
                    }}
                  >
                    {t('milestoneLibrary.addCustomMilestone')}{' '}
                  </Button>
                )}
              </Grid>
            )}
          </Grid>
        </div>

        {viewParam === 'suggested' &&
          suggestedMilestones.length === 0 &&
          !query && (
            <Alert
              type="info"
              heading={t('milestoneLibrary.noSuggestedHeading')}
              className="mint-body-normal"
            >
              <Trans
                t={t}
                i18nKey="milestoneLibrary.noSuggestedDescription"
                components={{
                  link1: (
                    <UswdsReactLink
                      to={`/models/${modelID}/collaboration-area`}
                    >
                      {' '}
                    </UswdsReactLink>
                  )
                }}
              />
            </Alert>
          )}

        {hasAppliedFilters && filteredMilestones.length === 0 && (
          <Alert
            type="info"
            className="margin-bottom-2"
            heading={hkcT('milestoneLibrary.noResults.heading')}
          >
            {hkcT('milestoneLibrary.noResults.body')}
          </Alert>
        )}

        {
          <>
            <CardGroup className="padding-x-1">
              <Grid desktop={{ col: 12 }}>
                <Grid row gap={2}>
                  {currentItems.map(milestone => (
                    <Grid
                      desktop={{ col: 4 }}
                      tablet={{ col: 6 }}
                      key={milestone.id}
                    >
                      <MilestoneCard
                        milestone={milestone}
                        setIsSidepanelOpen={setIsSidepanelOpen}
                        showFilters={showFilters}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </CardGroup>

            {!!query && currentItems.length === 0 && (
              <>
                <Alert
                  type={addedMilestonesHidden ? 'info' : 'warning'}
                  heading={t('milestoneLibrary.alertHeading', {
                    query
                  })}
                >
                  <Trans
                    t={t}
                    i18nKey="milestoneLibrary.alertDescription"
                    components={{
                      email: <Link href="mailto:MINTTeam@cms.hhs.gov"> </Link>
                    }}
                  />
                </Alert>
              </>
            )}

            {/* Pagination */}
            <div className="display-flex flex-wrap">
              {currentItems.length > 0 && pageCount > 0 && (
                <div key={`pagination-wrapper-page-${currentPage}`}>
                  {PaginationComponent}
                </div>
              )}

              {currentItems.length > 0 && (
                <TablePageSize
                  className="margin-left-auto desktop:grid-col-auto"
                  pageSize={itemsPerPage}
                  setPageSize={setItemsPerPage}
                  valueArray={[6, 9, 'all']}
                  suffix={t('milestones').toLowerCase()}
                />
              )}
            </div>
          </>
        }
      </div>
    </>
  );
};

export default MilestoneCardGroup;
