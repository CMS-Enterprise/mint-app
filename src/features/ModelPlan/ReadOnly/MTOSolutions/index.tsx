import React from 'react';
import { useTranslation } from 'react-i18next';
import ITSystemsTable from 'features/ModelPlan/ModelToOperations/_components/ITSystemsTable';
import { NotFoundPartial } from 'features/NotFound';
import {
  GetModelToOperationsMatrixQuery,
  MtoStatus,
  useGetMtoSolutionsAndMilestonesQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import PageLoading from 'components/PageLoading';

import TitleAndStatus from '../_components/TitleAndStatus';

const ReadOnlyMTOSolutions = ({ modelID }: { modelID: string }) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { data, loading, error } = useGetMtoSolutionsAndMilestonesQuery({
    variables: { id: modelID }
  });

  const modelToOperationsMatrix =
    data?.modelPlan?.mtoMatrix ||
    ({} as GetModelToOperationsMatrixQuery['modelPlan']['mtoMatrix']);

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
        subHeading={t('solutions')}
        isViewingFilteredView={false}
        status={modelToOperationsMatrix.status}
        modelID={modelID}
        modifiedOrCreatedDts={modelToOperationsMatrix.recentEdit?.date}
      />

      {mtoNotStarted ? (
        <Alert type="info" slim className="margin-bottom-2">
          {t('emptyMTOReadViewWithSolutions')}
        </Alert>
      ) : (
        <ITSystemsTable readView />
      )}
    </div>
  );
};

export default ReadOnlyMTOSolutions;
