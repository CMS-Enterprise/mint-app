import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  CardGroup,
  Grid,
  Icon,
  Pagination
} from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import {
  GetMtoMilestonesQuery,
  useGetMtoMilestonesQuery
} from 'gql/generated/graphql';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import CheckboxField from 'components/CheckboxField';
import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import TableResults from 'components/TableResults';
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

  const milestones =
    data?.modelPlan?.mtoMatrix?.commonMilestones || ([] as MilestoneCardType[]);

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
          to={`/models/${modelID}/collaboration-area`}
          data-testid="return-to-collaboration"
        >
          <span>
            <Icon.ArrowBack className="top-3px margin-right-1" />
            {t('returnToCollaboration')}
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

const MilstoneCardGroup = ({
  milestones
}: {
  milestones: MilestoneCardType[];
}) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const history = useHistory();

  const [selectedType, setSelectedType] = useState<'suggested' | 'all'>('all');

  const [addedMilestonesHidden, setAddedMilestonesHidden] = useState(false);

  // Filter the milestones based on the isAdded field value
  const filteredMilestones = addedMilestonesHidden
    ? milestones.filter(milestone => milestone.isAdded)
    : milestones;

  // Filter the milestones based on the isSuggested field value
  const selectedMilestones =
    selectedType === 'suggested'
      ? filteredMilestones.filter(milestone => milestone.isSuggested)
      : filteredMilestones;

  const { currentItems, pagination, search, pageSize } =
    useSearchSortPagination<MilestoneCardType, any>({
      items: selectedMilestones,
      filterFunction: searchMilestones,
      sortFunction: (items: MilestoneCardType[]) => items,
      sortOptions: [
        {
          value: '',
          label: ''
        }
      ],
      defaultItemsPerPage: 6
    });

  const { query, setQuery, rowLength } = search;

  const { itemsPerPage, setItemsPerPage } = pageSize;

  const {
    currentPage,
    handleNext,
    handlePageNumber,
    handlePrevious,
    pageCount
  } = pagination;

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
                filteredRowLength={currentItems.length}
                rowLength={rowLength}
              />
            </Grid>
          )}

          <Grid desktop={{ col: 12 }} className="display-flex flex-wrap">
            <ButtonGroup type="segmented" className="margin-right-3">
              <Button
                type="button"
                outline={selectedType !== 'suggested'}
                onClick={() => setSelectedType('suggested')}
              >
                {t('milestoneLibrary.suggestedMilestones', {
                  count: milestones.filter(milestone => milestone.isSuggested)
                    .length
                })}
              </Button>
              <Button
                type="button"
                outline={selectedType !== 'all'}
                onClick={() => setSelectedType('all')}
              >
                {t('milestoneLibrary.allMilestones', {
                  count: milestones.length
                })}
              </Button>
            </ButtonGroup>

            <CheckboxField
              id="hide-added-milestones"
              name="hide-added-milestones"
              label={t('milestoneLibrary.hideAdded', {
                count: milestones.filter(milestone => milestone.isAdded).length
              })}
              value="true"
              checked={addedMilestonesHidden}
              onBlur={() => null}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setAddedMilestonesHidden(!addedMilestonesHidden);
              }}
            />
          </Grid>
        </Grid>
      </div>

      <CardGroup className="padding-x-1">
        <Grid desktop={{ col: 12 }}>
          <Grid row gap={2}>
            {currentItems.map(milestone => (
              <Grid desktop={{ col: 4 }} tablet={{ col: 6 }}>
                <MilestoneCard key={milestone.key} milestone={milestone} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </CardGroup>

      {/* Pagination */}

      <div className="display-flex">
        {milestones.length > itemsPerPage && pageCount > 1 && (
          <Pagination
            pathname={history.location.pathname}
            currentPage={currentPage}
            maxSlots={7}
            onClickNext={handleNext}
            onClickPageNumber={handlePageNumber}
            onClickPrevious={handlePrevious}
            totalPages={pageCount}
          />
        )}

        <TablePageSize
          className="margin-left-auto desktop:grid-col-auto"
          pageSize={itemsPerPage}
          setPageSize={setItemsPerPage}
          valueArray={[6, 9, 'all']}
          suffix={t('milestones')}
        />
      </div>
    </div>
  );
};

export default MilestoneLibrary;
