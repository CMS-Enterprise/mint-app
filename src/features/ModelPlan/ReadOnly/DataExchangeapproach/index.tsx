import React from 'react';
import { useTranslation } from 'react-i18next';
import { NotFoundPartial } from 'features/NotFound';
import {
  GetAllDataExchangeApproachQuery,
  useGetAllDataExchangeApproachQuery
} from 'gql/generated/graphql';

import PageLoading from 'components/PageLoading';
import usePlanTranslation from 'hooks/usePlanTranslation';

import ReadOnlyBody from '../_components/Body';
import TitleAndStatus from '../_components/TitleAndStatus';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyDataExchangeApproach = ({
  modelID,
  clearance,
  filteredView
}: ReadOnlyProps) => {
  const { t: dataExchangeApproachMiscT } = useTranslation(
    'dataExchangeApproachMisc'
  );

  const dataExchangeApproachConfig = usePlanTranslation('dataExchangeApproach');

  const { data, loading, error } = useGetAllDataExchangeApproachQuery({
    variables: {
      id: modelID
    }
  });

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  const allDataExchangeApproachData = (data?.modelPlan.dataExchangeApproach ||
    {}) as GetAllDataExchangeApproachQuery['modelPlan']['dataExchangeApproach'];

  return (
    <div
      className="read-only-model-plan--beneficiaries"
      data-testid="read-only-model-plan--beneficiaries"
    >
      <TitleAndStatus
        clearance={clearance}
        clearanceTitle={dataExchangeApproachMiscT('heading')}
        heading={dataExchangeApproachMiscT('heading')}
        isViewingFilteredView={!!filteredView}
        status={allDataExchangeApproachData.status}
        modelID={modelID}
        modifiedOrCreatedDts={
          allDataExchangeApproachData.modifiedDts ||
          allDataExchangeApproachData.createdDts
        }
      />

      {loading && !data ? (
        <div className="height-viewport">
          <PageLoading />
        </div>
      ) : (
        <ReadOnlyBody
          data={allDataExchangeApproachData}
          config={dataExchangeApproachConfig}
          filteredView={filteredView}
        />
      )}
    </div>
  );
};

export default ReadOnlyDataExchangeApproach;
