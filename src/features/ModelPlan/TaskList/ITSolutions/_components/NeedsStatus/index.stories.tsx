import React from 'react';
import { Meta } from '@storybook/react';
import { OpSolutionStatus } from 'gql/generated/graphql';

import NeedsStatus, {
  OperationalNeedsSolutionsStatus,
  OperationalNeedStatus
} from '.';

export default {
  title: 'Operational Need Solution Status Tag',
  component: NeedsStatus
} as Meta<typeof NeedsStatus>;

export const NeedTags = () => (
  <div>
    {Object.keys(OperationalNeedStatus).map(status => {
      return (
        <div className="margin-y-2" key={status}>
          <NeedsStatus status={status as OperationalNeedsSolutionsStatus} />
        </div>
      );
    })}
  </div>
);

export const SolutionTags = () => (
  <div>
    {Object.keys(OpSolutionStatus).map(status => {
      return (
        <div className="margin-y-2" key={status}>
          <NeedsStatus status={status as OperationalNeedsSolutionsStatus} />
        </div>
      );
    })}
  </div>
);
