import React from 'react';
import { useTranslation } from 'react-i18next';
import { MtoMilestoneStatus, MtoSolutionStatus } from 'gql/generated/graphql';

export const MilestoneStatusTag = ({
  status,
  classname
}: {
  status: MtoMilestoneStatus | MtoSolutionStatus;

  classname?: string;
}) => {
  const { t } = useTranslation('mtoMilestone');
  const { t: solutionT } = useTranslation('mtoSolution');

  let tagStyle;
  let tagCopy;
  switch (status) {
    case MtoMilestoneStatus.NOT_STARTED:
      tagCopy = t(`status.options.${MtoMilestoneStatus.NOT_STARTED}`);
      tagStyle = 'bg-white border-2px text-base';
      break;
    case MtoSolutionStatus.ONBOARDING:
      tagCopy = solutionT(`status.options.${MtoSolutionStatus.ONBOARDING}`);
      tagStyle = 'bg-base-lighter text-base-darker';
      break;
    case MtoSolutionStatus.BACKLOG:
      tagCopy = solutionT(`status.options.${MtoSolutionStatus.BACKLOG}`);
      tagStyle = 'bg-info-light text-base-darkest';
      break;
    case MtoMilestoneStatus.IN_PROGRESS:
      tagCopy = t(`status.options.${MtoMilestoneStatus.IN_PROGRESS}`);
      tagStyle = 'bg-warning';
      break;
    case MtoMilestoneStatus.COMPLETED:
      tagCopy = t(`status.options.${MtoMilestoneStatus.COMPLETED}`);
      tagStyle = 'bg-success-dark text-white';
      break;

    default:
      tagCopy = '';
      tagStyle = 'bg-info-light';
  }

  return (
    <div
      data-testid="tasklist-tag"
      className={`model-plan-task-list__task-tag line-height-body-1 text-bold mint-no-print ${tagStyle} ${
        classname ?? ''
      }`}
    >
      <span>{tagCopy}</span>
    </div>
  );
};

export default MilestoneStatusTag;
