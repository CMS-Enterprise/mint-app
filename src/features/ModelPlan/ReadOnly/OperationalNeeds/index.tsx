import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  GetOperationalNeedsQuery,
  TaskStatus,
  useGetOperationalNeedsQuery
} from 'gql/generated/graphql';

import OperationalNeedsTable from 'features/ModelPlan/TaskList/ITSolutions/Home/operationalNeedsTable';
import { NotFoundPartial } from 'features/NotFound';

import TitleAndStatus from '../_components/TitleAndStatus';

type OperationalNeedsType =
  GetOperationalNeedsQuery['modelPlan']['operationalNeeds'][0];

const ReadOnlyOperationalNeeds = ({ modelID }: { modelID: string }) => {
  const { t } = useTranslation('opSolutionsMisc');

  const { data, loading, error } = useGetOperationalNeedsQuery({
    variables: {
      id: modelID
    }
  });

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  const getITSolutionsStatus = (
    operationalNeedsArray: OperationalNeedsType[]
  ): TaskStatus => {
    const inProgress = operationalNeedsArray.find(need => need.modifiedDts);
    return inProgress ? TaskStatus.IN_PROGRESS : TaskStatus.READY;
  };

  const { operationalNeeds } = data?.modelPlan || {};

  return (
    <div
      className="read-only-model-plan--operational-needs"
      data-testid="read-only-model-plan--operational-needs"
    >
      <TitleAndStatus
        clearance={false}
        clearanceTitle=""
        heading={t('headingReadOnly')}
        isViewingFilteredView={false}
        status={getITSolutionsStatus(operationalNeeds || [])}
        modelID={modelID}
        modifiedOrCreatedDts={data?.modelPlan.opSolutionLastModifiedDts}
      />

      <OperationalNeedsTable modelID={modelID} type="needs" readOnly />
    </div>
  );
};

export default ReadOnlyOperationalNeeds;
