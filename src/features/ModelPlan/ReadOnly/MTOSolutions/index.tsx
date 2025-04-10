import React from 'react';
import { useTranslation } from 'react-i18next';
import MTOTable from 'features/ModelPlan/ModelToOperations/_components/MatrixTable';
import { NotFoundPartial } from 'features/NotFound';
import {
  GetModelToOperationsMatrixQuery,
  useGetModelToOperationsMatrixQuery
} from 'gql/generated/graphql';

import PageLoading from 'components/PageLoading';

import TitleAndStatus from '../_components/TitleAndStatus';

const ReadOnlyMTOSolutions = ({ modelID }: { modelID: string }) => {
  const { t } = useTranslation('opSolutionsMisc');

  const { data, loading, error } = useGetModelToOperationsMatrixQuery({
    variables: {
      id: modelID
    }
  });

  const modelToOperationsMatrix =
    data?.modelPlan?.mtoMatrix ||
    ({} as GetModelToOperationsMatrixQuery['modelPlan']['mtoMatrix']);

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
        isViewingFilteredView={false}
        status={modelToOperationsMatrix.status}
        modelID={modelID}
        modifiedOrCreatedDts={modelToOperationsMatrix.recentEdit?.modifiedDts}
      />

      <MTOTable queryData={data} loading={loading} error={error} />
    </div>
  );
};

export default ReadOnlyMTOSolutions;
