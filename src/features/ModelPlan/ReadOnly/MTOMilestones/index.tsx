import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import MTOTable from 'features/ModelPlan/ModelToOperations/_components/MatrixTable';
import MTOTableFilters from 'features/ModelPlan/ModelToOperations/_components/MTOTableFilters';
import { getMilestonesNeededWithin30DaysCount } from 'features/ModelPlan/ModelToOperations/_utils/neededWithin30Days';
import { NotFoundPartial } from 'features/NotFound';
import {
  GetModelToOperationsMatrixQuery,
  MtoStatus,
  useGetModelToOperationsMatrixQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import PageLoading from 'components/PageLoading';

import TitleAndStatus from '../_components/TitleAndStatus';

const ReadOnlyMTOMilestones = ({ modelID }: { modelID?: string }) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID: modelIDFromParams } = useParams();

  const { data, loading, error } = useGetModelToOperationsMatrixQuery({
    variables: {
      id: modelID || modelIDFromParams || ''
    }
  });

  const modelToOperationsMatrix =
    data?.modelPlan?.mtoMatrix ||
    ({} as GetModelToOperationsMatrixQuery['modelPlan']['mtoMatrix']);

  const milestonesNeededWithin30DaysCount = useMemo(
    () =>
      getMilestonesNeededWithin30DaysCount(
        modelToOperationsMatrix?.categories || []
      ),
    [modelToOperationsMatrix?.categories]
  );

  const mtoNotStarted = modelToOperationsMatrix.status === MtoStatus.READY;

  if (loading && !modelToOperationsMatrix) {
    <PageLoading />;
  }

  if (error || !modelToOperationsMatrix) {
    return <NotFoundPartial componentNotFound />;
  }

  return (
    <div
      className="read-only-model-plan--mto-milestones"
      data-testid="read-only-model-plan--mto-milestones"
    >
      <TitleAndStatus
        clearance={false}
        clearanceTitle=""
        heading={t('heading')}
        subHeading={t('milestones')}
        isViewingFilteredView={false}
        status={modelToOperationsMatrix.status}
        modelID={modelID || modelIDFromParams || ''}
        modifiedOrCreatedDts={modelToOperationsMatrix.recentEdit?.date}
      />

      {mtoNotStarted ? (
        <Alert type="info" slim className="margin-bottom-2">
          {t('emptyMTOReadView')}
        </Alert>
      ) : (
        <>
          <MTOTableFilters
            milestonesNeededWithin30DaysCount={
              milestonesNeededWithin30DaysCount
            }
          />
          <MTOTable queryData={data} loading={loading} error={error} readView />
        </>
      )}
    </div>
  );
};

export default ReadOnlyMTOMilestones;
