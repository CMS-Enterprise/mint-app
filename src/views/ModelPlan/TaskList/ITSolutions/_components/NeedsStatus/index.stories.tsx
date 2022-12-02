import React from 'react';
import { ComponentMeta } from '@storybook/react';

import { OpSolutionStatus } from 'types/graphql-global-types';

import NeedsStatus, {
  OperationalNeedsSolutionsStatus,
  OperationalNeedStatus
} from '.';

export default {
  title: 'Operational Need Solution Status Tag',
  component: NeedsStatus
} as ComponentMeta<typeof NeedsStatus>;

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
