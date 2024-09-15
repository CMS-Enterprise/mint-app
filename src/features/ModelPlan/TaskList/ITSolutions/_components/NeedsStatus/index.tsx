import React from 'react';
import { useTranslation } from 'react-i18next';
import { OpSolutionStatus } from 'gql/gen/graphql';

import Tag from 'components/Tag';

export enum OperationalNeedStatus {
  NOT_ANSWERED = 'NOT_ANSWERED',
  NOT_NEEDED = 'NOT_NEEDED'
}

export type OperationalNeedsSolutionsStatus =
  | OpSolutionStatus
  | OperationalNeedStatus;

const OperationalNeedsStatusTag = ({
  status
}: {
  status: OperationalNeedsSolutionsStatus;
}) => {
  const { t: opSolutionsMiscT } = useTranslation('opSolutionsMisc');

  const tagText = opSolutionsMiscT(`status.${status}`);

  switch (status) {
    case OperationalNeedStatus.NOT_ANSWERED:
    case OperationalNeedStatus.NOT_NEEDED:
    case OpSolutionStatus.NOT_STARTED:
      return (
        <Tag className="line-height-body-1 text-bold bg-transparent border-2px text-base">
          {tagText}
        </Tag>
      );
    case OpSolutionStatus.ONBOARDING:
      return (
        <Tag className="line-height-body-1 text-bold bg-base-lighter text-base-darker">
          {tagText}
        </Tag>
      );
    case OpSolutionStatus.IN_PROGRESS:
      return (
        <Tag className="line-height-body-1 text-bold bg-gold text-base-darkest">
          {tagText}
        </Tag>
      );
    case OpSolutionStatus.BACKLOG:
      return (
        <Tag className="line-height-body-1 text-bold bg-accent-cool text-base-darkest">
          {tagText}
        </Tag>
      );
    case OpSolutionStatus.COMPLETED:
      return (
        <Tag className="line-height-body-1 text-bold bg-success-dark text-white">
          {tagText}
        </Tag>
      );
    case OpSolutionStatus.AT_RISK:
      return (
        <Tag className="line-height-body-1 text-bold bg-secondary-dark text-white">
          {tagText}
        </Tag>
      );
    default:
      return null;
  }
};

export default OperationalNeedsStatusTag;
