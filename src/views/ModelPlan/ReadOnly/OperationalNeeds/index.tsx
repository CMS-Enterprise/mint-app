import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import GetOperationalNeeds from 'queries/ITSolutions/GetOperationalNeeds';
import {
  GetOperationalNeeds as GetOperationalNeedsType,
  GetOperationalNeeds_modelPlan_operationalNeeds as OperationalNeedsType
} from 'queries/ITSolutions/types/GetOperationalNeeds';
import { TaskStatus } from 'types/graphql-global-types';
import { TaskListStatusTag } from 'views/ModelPlan/TaskList/_components/TaskListItem';
import OperationalNeedsTable from 'views/ModelPlan/TaskList/ITSolutions/Home/operationalNeedsTable';
import { NotFoundPartial } from 'views/NotFound';

const ReadOnlyOperationalNeeds = ({ modelID }: { modelID: string }) => {
  const { t } = useTranslation('opSolutionsMisc');

  const { data, loading, error } = useQuery<GetOperationalNeedsType>(
    GetOperationalNeeds,
    {
      variables: {
        id: modelID
      }
    }
  );

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  const getITSolutionsStatus = (
    operationalNeedsArray: OperationalNeedsType[]
  ) => {
    const inProgress = operationalNeedsArray.find(need => need.modifiedDts);
    return inProgress ? TaskStatus.IN_PROGRESS : TaskStatus.READY;
  };

  const { operationalNeeds } = data?.modelPlan || {};

  return (
    <div
      className="read-only-model-plan--operational-needs"
      data-testid="read-only-model-plan--operational-needs"
    >
      <div className="display-flex flex-justify flex-align-start">
        <h2 className="margin-top-0 margin-bottom-4">{t('headingReadOnly')}</h2>

        {operationalNeeds && (
          <TaskListStatusTag status={getITSolutionsStatus(operationalNeeds)} />
        )}
      </div>

      <OperationalNeedsTable
        modelID={modelID}
        type="needs"
        readOnly
        hiddenColumns={['Subtasks']}
      />
    </div>
  );
};

export default ReadOnlyOperationalNeeds;
