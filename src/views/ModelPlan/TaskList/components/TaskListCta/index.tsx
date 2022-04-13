import React from 'react';

import UswdsReactLink from 'components/LinkWrapper';
// import { isIntakeStarted } from 'data/systemIntake';
// import { attendGrbMeetingTag } from 'data/taskList';
// import { GetSystemIntake_systemIntake as SystemIntake } from 'queries/types/GetSystemIntake';

// CTA for Task List Intake Draft
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
          // to={`/system/${id || 'new'}/contact-details`}
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
