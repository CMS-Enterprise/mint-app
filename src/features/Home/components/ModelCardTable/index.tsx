/* eslint-disable react/prop-types */

import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Grid, Link } from '@trussworks/react-uswds';
import ModelsBanner, {
  StatusCategories
} from 'features/Home/components/ModelsBanner';
import {
  ComponentGroup,
  GetModelPlansByComponentGroupQuery,
  GetModelsByMtoSolutionQuery,
  ModelCategory,
  MtoCommonSolutionKey
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import GlobalClientFilter from 'components/TableFilter';
import usePagination from 'hooks/usePagination';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { TranslationBasics } from 'types/translation';
import { formatDateUtc } from 'utils/date';

import ModelCard from '../ModelCard';

export type ModelsBySolutionType =
  GetModelsByMtoSolutionQuery['modelPlansByMTOSolutionKey'][0]['modelPlan'];

export type ModelsByGroupType =
  GetModelPlansByComponentGroupQuery['modelPlansByComponentGroup'][0]['modelPlan'];

export type ModelType = ModelsBySolutionType | ModelsByGroupType;

export type ModelsType = ModelsBySolutionType[] | ModelsByGroupType[];

type ModelsCardTableProps = {
  models: ModelsBySolutionType[] | ModelsByGroupType[];
  filterKey: MtoCommonSolutionKey | ComponentGroup;
  type: 'solution' | 'group';
};

const ModelsCardTable = ({ models, filterKey, type }: ModelsCardTableProps) => {
  const { t: customHomeT } = useTranslation('customHome');

  const [selectedStatus, setSelectedStatus] =
    useState<StatusCategories>('total');

  const basicsConfig = usePlanTranslation('basics');

  const [filteredModels, setFilteredModels] = useState<ModelsType>([...models]);

  const [query, setQuery] = useState<string>('');

  const { currentItems, Pagination, Results } = usePagination<ModelsType>({
    items: filteredModels,
    itemsPerPage: 3,
    loading: false,
    query
  });

  useEffect(() => {
    if (selectedStatus === 'total' && query.trim() === '') {
      setFilteredModels([...models]);
      return;
    }

    if (selectedStatus === 'total' && query.trim() !== '') {
      setFilteredModels(searchModelsFilter(models, query, basicsConfig));
      return;
    }

    if (selectedStatus !== 'total' && query.trim() === '') {
      setFilteredModels(modelsWithStatus(models, selectedStatus));
      return;
    }

    if (selectedStatus !== 'total' && query.trim() !== '') {
      setFilteredModels(
        modelsWithStatus(
          searchModelsFilter(models, query, basicsConfig),
          selectedStatus
        )
      );
    }
  }, [selectedStatus, models, query, basicsConfig]);

  return (
    <div id="models-by-solution-table">
      <ModelsBanner
        type={type}
        filterKey={filterKey}
        models={models}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {models.length !== 0 &&
        (filteredModels.length > 4 ||
          modelsWithStatus(models, selectedStatus).length > 4 ||
          !!query.trim()) && (
          <div className="margin-top-3">
            <GlobalClientFilter
              globalFilter={query}
              setGlobalFilter={setQuery}
              tableID="models-by-solution-table"
              tableName={
                type === 'solution'
                  ? customHomeT('settings.MODELS_BY_SOLUTION.heading')
                  : customHomeT('settings.MODELS_BY_GROUP.heading')
              }
              className="margin-bottom-3 maxw-none width-mobile-lg"
            />

            {Results}
          </div>
        )}

      {(modelsWithStatus(models, selectedStatus).length === 0 ||
        models.length === 0) && (
        <Alert type="info">
          <>
            <Trans
              i18nKey="customHome:noModelsHeading"
              components={{
                h3: <h3 className="margin-0"> </h3>
              }}
              values={{
                status:
                  selectedStatus === 'total'
                    ? ''
                    : customHomeT(
                        `generalStatus.${selectedStatus}`
                      )?.toLowerCase(),
                type,
                article: type === 'solution' ? 'using' : 'in'
              }}
            />
            <Trans
              i18nKey="customHome:noModelsDescription"
              components={{
                report: (
                  <UswdsReactLink to="/report-a-problem" target="_blank">
                    {' '}
                  </UswdsReactLink>
                ),
                email: <Link href="mailto:MINTTeam@cms.hhs.gov"> </Link>
              }}
            />
          </>
        </Alert>
      )}

      <>
        <Grid row gap={2} className="margin-bottom-1 margin-top-4">
          {currentItems.map(model => (
            <Grid
              desktop={{ col: 4 }}
              tablet={{ col: 6 }}
              key={model.id}
              className="display-flex"
            >
              <ModelCard
                key={model.id}
                modelPlan={model}
                className="width-full"
              />
            </Grid>
          ))}
        </Grid>

        {Pagination}
      </>
    </div>
  );
};

const modelsWithStatus = (
  models: ModelsType,
  status: StatusCategories
): ModelsType => {
  if (status === 'total') {
    return models;
  }
  return models.filter(model => model.generalStatus === status);
};

const searchModelsFilter = (
  models: ModelsType,
  query: string,
  basicsConfig: TranslationBasics
): ModelsType => {
  const queryValueLower = query.toLowerCase();
  return models.filter(model => {
    return (
      model?.modelName?.toLowerCase().includes(queryValueLower) ||
      model?.status?.toLowerCase().includes(queryValueLower) ||
      model?.abbreviation?.toLowerCase().includes(queryValueLower) ||
      basicsConfig.modelCategory.options[
        model?.basics?.modelCategory as ModelCategory
      ]
        ?.toLowerCase()
        .includes(queryValueLower) ||
      formatDateUtc(
        model?.timeline?.performancePeriodStarts,
        'MM/dd/yyyy'
      ).includes(queryValueLower) ||
      formatDateUtc(
        model?.timeline?.performancePeriodEnds,
        'MM/dd/yyyy'
      ).includes(queryValueLower)
    );
  });
};

export default ModelsCardTable;
