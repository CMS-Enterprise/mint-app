import React from 'react';
import { useTranslation } from 'react-i18next';
import MTOTable from 'features/ModelPlan/ModelToOperations/_components/MatrixTable';
import { NotFoundPartial } from 'features/NotFound';
import {
  GetModelToOperationsMatrixQuery,
  MtoStatus,
  useGetModelToOperationsMatrixQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import PageLoading from 'components/PageLoading';

import TitleAndStatus from '../_components/TitleAndStatus';

const ReadOnlyMTOMilestones = ({ modelID }: { modelID: string }) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { data, loading, error } = useGetModelToOperationsMatrixQuery({
    variables: {
      id: modelID
    }
  });

  const modelToOperationsMatrix =
    data?.modelPlan?.mtoMatrix ||
    ({} as GetModelToOperationsMatrixQuery['modelPlan']['mtoMatrix']);

  const mtoNotStarted = modelToOperationsMatrix.status === MtoStatus.READY;

  const hasNoMilestones = modelToOperationsMatrix.milestones?.length === 0;

  if (loading && !modelToOperationsMatrix) {
    <PageLoading />;
  }

  if (error || !modelToOperationsMatrix) {
    return <NotFoundPartial />;
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
        modelID={modelID}
        modifiedOrCreatedDts={modelToOperationsMatrix.recentEdit?.modifiedDts}
      />

      {hasNoMilestones ? (
        <>
          {mtoNotStarted ? (
            <Alert type="info" slim className="margin-bottom-2">
              {t('emptyMTOReadView')}
            </Alert>
          ) : (
            <Alert type="info" slim className="margin-bottom-2">
              {t('noMilestonesReadView')}
            </Alert>
          )}
        </>
      ) : (
        <MTOTable queryData={data} loading={loading} error={error} readView />
      )}
    </div>
  );
};

export default ReadOnlyMTOMilestones;
