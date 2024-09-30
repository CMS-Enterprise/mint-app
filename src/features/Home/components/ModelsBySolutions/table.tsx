/* eslint-disable react/prop-types */

import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Grid, Link } from '@trussworks/react-uswds';
import ModelsBySolutionsBanner, {
  StatusCategories
} from 'features/Home/components/ModelsBySolutions/banner';
import {
  GetModelsBySolutionQuery,
  ModelCategory,
  OperationalSolutionKey,
  useGetModelsBySolutionQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import Spinner from 'components/Spinner';
import GlobalClientFilter from 'components/TableFilter';
import usePagination from 'hooks/usePagination';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { TranslationBasics } from 'types/translation';
import { formatDateUtc } from 'utils/date';

import ModelSolutionCard from './card';

export type ModelsBySolutionType = GetModelsBySolutionQuery['modelPlansByOperationalSolutionKey'];

type ModelPlansTableProps = {
  operationalSolutionKey: OperationalSolutionKey;
};

const ModelsBySolutionTable = ({
  operationalSolutionKey
}: ModelPlansTableProps) => {
  const { t: customHomeT } = useTranslation('customHome');

  const [selectedStatus, setSelectedStatus] = useState<StatusCategories>(
    'total'
  );

  const basicsConfig = usePlanTranslation('basics');

  const { data, loading } = useGetModelsBySolutionQuery({
    variables: {
      operationalSolutionKey
    }
  });

  const modelsBySolution = useMemo(() => {
    const models = data?.modelPlansByOperationalSolutionKey || [];
    return (
      [...models].sort((a, b) =>
        a.modelPlan.modelName.localeCompare(b.modelPlan.modelName)
      ) || []
    );
  }, [data]);

  const [filteredModels, setFilteredModels] = useState<ModelsBySolutionType>([
    ...modelsBySolution
  ]);

  const [query, setQuery] = useState<string>('');

  const {
    currentItems,
    Pagination,
    Results
  } = usePagination<ModelsBySolutionType>({
    items: filteredModels,
    itemsPerPage: 3,
    loading,
    query
  });

  useEffect(() => {
    if (selectedStatus === 'total' && query.trim() === '') {
      setFilteredModels([...modelsBySolution]);
      return;
    }

    if (selectedStatus === 'total' && query.trim() !== '') {
      setFilteredModels(
        searchModelsFilter(modelsBySolution, query, basicsConfig)
      );
      return;
    }

    if (selectedStatus !== 'total' && query.trim() === '') {
      setFilteredModels(modelsWithStatus(modelsBySolution, selectedStatus));
      return;
    }

    if (selectedStatus !== 'total' && query.trim() !== '') {
      setFilteredModels(
        modelsWithStatus(
          searchModelsFilter(modelsBySolution, query, basicsConfig),
          selectedStatus
        )
      );
    }
  }, [selectedStatus, modelsBySolution, query, basicsConfig]);

  if (loading) {
    return (
      <div className="padding-left-4 padding-top-3">
        <Spinner />
      </div>
    );
  }

  return (
    <div id="models-by-solution-table">
      <ModelsBySolutionsBanner
        solutionKey={operationalSolutionKey}
        solutionModels={modelsBySolution}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {modelsBySolution.length !== 0 &&
        (filteredModels.length > 4 ||
          modelsWithStatus(modelsBySolution, selectedStatus).length > 4 ||
          !!query.trim()) && (
          <div className="margin-top-3">
            <GlobalClientFilter
              globalFilter={query}
              setGlobalFilter={setQuery}
              tableID="models-by-solution-table"
              tableName={customHomeT(
                'settings.MODELS_BY_OPERATIONAL_SOLUTION.heading'
              )}
              className="margin-bottom-3 maxw-none width-mobile-lg"
            />

            {Results}
          </div>
        )}

      {(modelsWithStatus(modelsBySolution, selectedStatus).length === 0 ||
        modelsBySolution.length === 0) && (
        <Alert type="info" heading={customHomeT('noModelSolutionHeading')}>
          <Trans
            i18nKey="customHome:noModelSolutionDescription"
            components={{
              report: (
                <UswdsReactLink to="/report-a-problem" target="_blank">
                  {' '}
                </UswdsReactLink>
              ),
              email: <Link href="mailto:MINTTeam@cms.hhs.gov"> </Link>
            }}
          />
        </Alert>
      )}

      <>
        <Grid row gap={2} className="margin-bottom-2 margin-top-4">
          {currentItems.map(model => (
            <Grid
              desktop={{ col: 4 }}
              tablet={{ col: 6 }}
              key={model.modelPlan.id}
            >
              <ModelSolutionCard
                key={model.modelPlan.id}
                modelPlan={model.modelPlan}
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
  models: ModelsBySolutionType,
  status: StatusCategories
): ModelsBySolutionType => {
  if (status === 'total') {
    return models;
  }
  return models.filter(
    model => model.modelPlan.modelBySolutionStatus === status
  );
};

const searchModelsFilter = (
  models: ModelsBySolutionType,
  query: string,
  basicsConfig: TranslationBasics
): ModelsBySolutionType => {
  const queryValueLower = query.toLowerCase();
  return models.filter(model => {
    return (
      model.modelPlan?.modelName?.toLowerCase().includes(queryValueLower) ||
      model.modelPlan?.status?.toLowerCase().includes(queryValueLower) ||
      basicsConfig.modelCategory.options[
        model.modelPlan?.basics?.modelCategory as ModelCategory
      ]
        ?.toLowerCase()
        .includes(queryValueLower) ||
      formatDateUtc(
        model.modelPlan?.basics?.performancePeriodStarts,
        'MM/dd/yyyy'
      ).includes(queryValueLower) ||
      formatDateUtc(
        model.modelPlan?.basics?.performancePeriodEnds,
        'MM/dd/yyyy'
      ).includes(queryValueLower)
    );
  });
};

export default ModelsBySolutionTable;
