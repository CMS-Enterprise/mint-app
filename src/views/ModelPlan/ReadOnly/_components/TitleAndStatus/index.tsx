import React from 'react';
import { TaskStatus } from 'gql/gen/graphql';

import { TaskListStatusTag } from 'views/ModelPlan/TaskList/_components/TaskListItem';

type TitleAndStatusProps = {
  clearance: boolean | undefined;
  clearanceTitle: string;
  heading: string;
  isViewingFilteredView?: boolean;
  status: TaskStatus | undefined;
};

const TitleAndStatus = ({
  clearance,
  clearanceTitle,
  heading,
  isViewingFilteredView,
  status
}: TitleAndStatusProps) => {
  return (
    <div className="display-flex flex-justify flex-align-start">
      <h2 className="margin-top-0 margin-bottom-4">
        {clearance ? clearanceTitle : heading}
      </h2>
      <div>
        {!isViewingFilteredView && status && (
          <TaskListStatusTag status={status} />
        )}
      </div>
    </div>
  );
};

export default TitleAndStatus;
