import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  GetOperationalNeedsQuery,
  TaskStatus,
  useGetOperationalNeedsQuery
} from 'gql/gen/graphql';

import { TaskListStatusTag } from 'views/ModelPlan/TaskList/_components/TaskListItem';
import OperationalNeedsTable from 'views/ModelPlan/TaskList/ITSolutions/Home/operationalNeedsTable';
import { NotFoundPartial } from 'views/NotFound';

type OperationalNeedsType = GetOperationalNeedsQuery['modelPlan']['operationalNeeds'][0];

const ReadOnlyOperationalNeeds = ({
  modelID,
  isExportingPDF
}: {
  modelID: string;
  isExportingPDF?: boolean;
}) => {
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
        isExportingPDF={isExportingPDF}
      />
    </div>
  );
};

export default ReadOnlyOperationalNeeds;
