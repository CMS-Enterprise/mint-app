import React from 'react';
// import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { NotFoundPartial } from 'features/NotFound';
import { useGetModelToOperationsMatrixQuery } from 'gql/generated/graphql';

import PageLoading from 'components/PageLoading';

import MTOOptionsPanel from '../OptionPanel';

const MTOTable = () => {
  //   const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  const { data, loading, error } = useGetModelToOperationsMatrixQuery({
    variables: {
      id: modelID
    }
  });

  if (loading) {
    return <PageLoading />;
  }

  if (error) {
    return <NotFoundPartial />;
  }

  if (data?.modelPlan.mtoMatrix.milestones.length === 0) {
    return <MTOOptionsPanel />;
  }

  return <></>;
};

export default MTOTable;
