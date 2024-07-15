/* eslint-disable react/prop-types */

import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import ReactPaginate from 'react-paginate';
import { Grid, Link } from '@trussworks/react-uswds';
import {
  GetModelsBySolutionQuery,
  ModelCategory,
  ModelStatus,
  OperationalSolutionKey,
  useGetModelsBySolutionQuery
} from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import Alert from 'components/shared/Alert';
import Spinner from 'components/Spinner';
import GlobalClientFilter from 'components/TableFilter';
import TableResults from 'components/TableResults';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { TranslationBasics } from 'types/translation';
import { formatDateUtc } from 'utils/date';
import ModelsBySolutionsBanner, {
  StatusCategories
} from 'views/HomeNew/components/ModelsBySolutions/banner';

import ModelSolutionCard from '.';

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

  const [pageOffset, setPageOffset] = useState(0);

  // Pagination Configuration
  const itemsPerPage = 3;
  const endOffset = pageOffset + itemsPerPage;
  const currentModels = filteredModels?.slice(pageOffset, endOffset);
  const pageCount = filteredModels
    ? Math.ceil(filteredModels.length / itemsPerPage)
    : 1;

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % filteredModels?.length;
    setPageOffset(newOffset);
  };

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
          modelsWithStatus(modelsBySolution, selectedStatus).length > 0) && (
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

            <TableResults
              globalFilter={query}
              pageIndex={pageOffset / itemsPerPage}
              pageSize={itemsPerPage}
              filteredRowLength={filteredModels.length}
              currentRowLength={currentModels.length}
              rowLength={modelsBySolution.length}
            />
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
          {currentModels.map(model => (
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

        {pageCount > 1 && (
          <ReactPaginate
            data-testid="notification-pagination"
            breakLabel="..."
            breakClassName="usa-pagination__item usa-pagination__overflow"
            nextLabel="Next >"
            containerClassName="mint-pagination usa-pagination usa-pagination__list"
            previousLinkClassName={
              pageOffset === 0
                ? 'display-none'
                : 'usa-pagination__link usa-pagination__previous-page prev-page'
            }
            nextLinkClassName={
              pageOffset / itemsPerPage === pageCount - 1
                ? 'display-none'
                : 'usa-pagination__link usa-pagination__previous-page next-page'
            }
            disabledClassName="pagination__link--disabled"
            activeClassName="usa-current"
            activeLinkClassName="usa-current"
            pageClassName="usa-pagination__item"
            pageLinkClassName="usa-pagination__button"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="< Previous"
          />
        )}
      </>
    </div>
  );
};

const modelsWithStatus = (
  models: ModelsBySolutionType,
  status: StatusCategories
): ModelsBySolutionType => {
  if (status === 'total') return models;
  if (status === ModelStatus.ACTIVE || status === ModelStatus.ENDED) {
    return models.filter(model => model.modelPlan.status === status);
  }
  return models;
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
        model.modelPlan?.basics?.applicationsStart,
        'MM/dd/yyyy'
      ).includes(queryValueLower) ||
      formatDateUtc(
        model.modelPlan?.basics?.applicationsEnd,
        'MM/dd/yyyy'
      ).includes(queryValueLower)
    );
  });
};

export default ModelsBySolutionTable;
