import React from 'react';
import { ModelStatus, TaskStatus } from 'gql/gen/graphql';

import TaskListStatus from 'views/ModelPlan/TaskList/_components/TaskListStatus';

type TitleAndStatusProps = {
  modelID: string;
  clearance: boolean | undefined;
  clearanceTitle: string;
  heading: string;
  isViewingFilteredView?: boolean;
  status: ModelStatus | TaskStatus;
  modifiedOrCreatedDts?: string | null;
};

const TitleAndStatus = ({
  modelID,
  clearance,
  clearanceTitle,
  heading,
  isViewingFilteredView,
  status,
  modifiedOrCreatedDts
}: TitleAndStatusProps) => {
  return (
    <div>
      <h2 className="margin-top-0 margin-bottom-2">
        {clearance ? clearanceTitle : heading}
      </h2>

      {!isViewingFilteredView && status && (
        <TaskListStatus
          modelID={modelID}
          status={status}
          updateLabel
          statusLabel
          modifiedDts={modifiedOrCreatedDts}
          modifiedOrCreateLabel
          condensed
          className="margin-bottom-4"
        />
      )}
    </div>
  );
};

export default TitleAndStatus;
