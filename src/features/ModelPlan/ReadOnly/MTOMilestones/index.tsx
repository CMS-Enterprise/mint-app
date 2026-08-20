import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import MTOTable from 'features/ModelPlan/ModelToOperations/_components/MatrixTable';
import { countMtoCategoryHeaderRows } from 'features/ModelPlan/ModelToOperations/_components/MatrixTable/_utils';
import MTOTableFilters from 'features/ModelPlan/ModelToOperations/_components/MTOTableFilters';
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

  const [, setParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');

  const { data, loading, error } = useGetModelToOperationsMatrixQuery({
    variables: {
      id: modelID || modelIDFromParams || ''
    }
  });

  const modelToOperationsMatrix =
    data?.modelPlan?.mtoMatrix ||
    ({} as GetModelToOperationsMatrixQuery['modelPlan']['mtoMatrix']);

  const mtoNotStarted = modelToOperationsMatrix.status === MtoStatus.READY;

  const categoryHeaderRowCount = countMtoCategoryHeaderRows(
    modelToOperationsMatrix?.categories
  );

  const handleSearchChange = (input: string) => {
    setSearchQuery(input);

    setParams(
      prev => {
        const currentPage = prev.get('page');

        // Reset page to 1 whenever search query changes and the current page is not 1
        if (currentPage && currentPage !== '1') {
          const next = new URLSearchParams(prev);
          next.set('page', '1');
          return next;
        }

        return prev;
      },
      { replace: true }
    );
  };

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
            categoryHeaderRowCount={categoryHeaderRowCount}
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
          />
          <MTOTable
            queryData={data}
            loading={loading}
            searchQuery={searchQuery}
            error={error}
            readView
          />
        </>
      )}
    </div>
  );
};

export default ReadOnlyMTOMilestones;
