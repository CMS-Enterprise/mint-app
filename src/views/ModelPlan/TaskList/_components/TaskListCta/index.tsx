import React from 'react';

import UswdsReactLink from 'components/LinkWrapper';
// const ModelPlanTaskListCta = ({ intake }: { intake: SystemIntake }) => {
const TaskListCta = ({ status }: { status: string }) => {
  // const { id, status } = intake || {};
  switch (status) {
    // TODO: Determine what the status are
    case 'IN_PROGRESS':
      return (
        <UswdsReactLink
          className="usa-button"
          variant="unstyled"
          // to={`/system/${id}/contact-details`}
          to="/system/1234/contact-details"
        >
          Continue
        </UswdsReactLink>
      );
    case 'READY':
      return (
        <UswdsReactLink
          data-testid="intake-start-btn"
          className="usa-button"
          variant="unstyled"
          // /models/:modelId/task-list/basics
          to={`/system/'new'/contact-details`}
        >
          Start
        </UswdsReactLink>
      );
    default:
      return <></>;
  }
};

export default TaskListCta;
