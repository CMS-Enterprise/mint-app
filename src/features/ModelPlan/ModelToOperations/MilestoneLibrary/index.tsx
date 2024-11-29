import React, { useEffect, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  CardGroup,
  Grid,
  Icon,
  Link
} from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import {
  GetMtoMilestonesQuery,
  useGetMtoMilestonesQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import CheckboxField from 'components/CheckboxField';
import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import TableResults from 'components/TableResults';
import usePagination from 'hooks/usePagination';
import useSearchSortPagination from 'hooks/useSearchSortPagination';

import MilestoneCard from '../_components/MilestoneCard';

import './index.scss';

export type MilestoneCardType =
  GetMtoMilestonesQuery['modelPlan']['mtoMatrix']['commonMilestones'][0];

const MilestoneLibrary = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  const { data, loading, error } = useGetMtoMilestonesQuery({
    variables: {
      id: modelID
    }
  });

  // TEMP only for demo
  const milestones = useMemo(
    () =>
      data?.modelPlan?.mtoMatrix?.commonMilestones ||
      ([] as MilestoneCardType[]),
    [data?.modelPlan?.mtoMatrix?.commonMilestones]
  );

  if (error) {
    return <NotFoundPartial />;
  }

  return (
    <>
      <Breadcrumbs
        items={[
          BreadcrumbItemOptions.HOME,
          BreadcrumbItemOptions.COLLABORATION_AREA,
          BreadcrumbItemOptions.MODEL_TO_OPERATIONS
        ]}
        customItem={t('milestoneLibrary.heading')}
      />

      <h1 className="margin-bottom-2 margin-top-5 line-height-large">
        {t('milestoneLibrary.heading')}
      </h1>

      <p className="mint-body-large margin-bottom-2 margin-top-05">
        {t('milestoneLibrary.description')}
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
        <MilstoneCardGroup milestones={milestones} />
      )}
    </>
  );
};

const searchMilestones = (
  query: string,
  items: MilestoneCardType[]
): MilestoneCardType[] => {
  return items.filter(milestone =>
    milestone.name.toLowerCase().includes(query.toLowerCase())
  );
};

type MilestoneViewType = 'suggested' | 'all';

const MilstoneCardGroup = ({
  milestones
}: {
  milestones: MilestoneCardType[];
}) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  const history = useHistory();

  // Query parameters
  const params = new URLSearchParams(history.location.search);
  const addedMilestonesHidden = params.get('hide-added-milestones') === 'true';
  let viewParam: MilestoneViewType = 'suggested';

  if (params.get('view') && params.get('view') === 'all') {
    viewParam = 'all';
  }

  const addedMilestones = useMemo(
    () => milestones.filter(milestone => milestone.isAdded),
    [milestones]
  );

  const suggestedMilestones = useMemo(
    () =>
      milestones.filter(milestone => {
        if (addedMilestonesHidden) {
          return milestone.isSuggested && !milestone.isAdded;
        }
        return milestone.isSuggested;
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
          return milestone.isSuggested && !milestone.isAdded;
        }
        return milestone.isSuggested;
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
  const selectedMilestones = useMemo(
    () =>
      viewParam === 'suggested'
        ? currentSuggestedMilestones
        : currentNotAddedMilestones,
    [currentNotAddedMilestones, currentSuggestedMilestones, viewParam]
  );

  const { query, setQuery, rowLength } = search;

  const { itemsPerPage, setItemsPerPage } = pageSize;

  const {
    currentItems,
    Pagination: PaginationComponent,
    pagination: { currentPage, pageCount }
  } = usePagination<MilestoneCardType[]>({
    items: selectedMilestones,
    itemsPerPage,
    withQueryParams: 'page',
    showPageIfOne: true
  });

  useEffect(() => {
    params.set('page', '1');
    history.push({ search: params.toString() });
  }, [viewParam]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="milestone-card-group">
      <div className="margin-top-2 margin-bottom-4">
        <Grid row>
          <Grid tablet={{ col: 6 }}>
            {/* Search bar and results info */}
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
                outline={viewParam !== 'suggested'}
                onClick={() => {
                  params.set('view', 'suggested');
                  history.push({ search: params.toString() });
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
                  params.set('view', 'all');
                  history.push({ search: params.toString() });
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
                history.push({ search: params.toString() });
              }}
            />
          </Grid>

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
                    <Button unstyled type="button" className="margin-x-05">
                      {' '}
                    </Button>
                  )
                }}
              />
            ) : (
              <Button unstyled type="button" className="margin-x-05">
                {t('milestoneLibrary.addCustomMilestone')}{' '}
              </Button>
            )}
          </Grid>
        </Grid>
      </div>

      {viewParam === 'suggested' && suggestedMilestones.length === 0 ? (
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
                  to={`/models/${modelID}/collaboration-area/model-to-operations/milestone-library?view=all`}
                >
                  {' '}
                </UswdsReactLink>
              ),
              link2: (
                <UswdsReactLink to={`/models/${modelID}/collaboration-area`}>
                  {' '}
                </UswdsReactLink>
              ),
              email1: <Link href="mailto:MINTTeam@cms.hhs.gov"> </Link>
            }}
          />
        </Alert>
      ) : (
        <>
          <CardGroup className="padding-x-1">
            <Grid desktop={{ col: 12 }}>
              <Grid row gap={2}>
                {currentItems.map(milestone => (
                  <Grid
                    desktop={{ col: 4 }}
                    tablet={{ col: 6 }}
                    key={milestone.key}
                  >
                    <MilestoneCard milestone={milestone} />
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
                suffix={t('milestones')}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MilestoneLibrary;
