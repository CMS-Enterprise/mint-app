import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetMilestones from 'queries/Basics/GetMilestones';
import { GetMilestones_modelPlan_basics as GetMilestonesType } from 'queries/Basics/types/GetMilestones';
import { TaskStatus } from 'types/graphql-global-types';

import Milestones from './index';

const milestonesMockData: GetMilestonesType = {
  __typename: 'PlanBasics',
  id: '123',
  completeICIP: null,
  clearanceStarts: null,
  clearanceEnds: null,
  announced: null,
  applicationsStart: null,
  applicationsEnd: null,
  performancePeriodStarts: null,
  performancePeriodEnds: null,
  wrapUpEnds: null,
  highLevelNote: '',
  phasedIn: null,
  phasedInNote: '',
  readyForReviewByUserAccount: {
    commonName: 'ASDF',
    id: '000',
    __typename: 'UserAccount'
  },
  readyForReviewDts: '2022-05-12T15:01:39.190679Z',
  status: TaskStatus.IN_PROGRESS
};

const mocks = [
  {
    request: {
      query: GetMilestones,
      variables: { id: 'f11eb129-2c80-4080-9440-439cbe1a286f' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'f11eb129-2c80-4080-9440-439cbe1a286f',
          modelName: 'My excellent plan that I just initiated',
          basics: milestonesMockData
        }
      }
    }
  }
];

describe('Model Plan Documents page', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/f11eb129-2c80-4080-9440-439cbe1a286f/task-list/milestones'
        ]}
      >
        <MockedProvider>
          <Route path="/models/:modelID/task-list/milestones">
            <Milestones />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('model-plan-milestones')).toBeInTheDocument();
    });
  });
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/f11eb129-2c80-4080-9440-439cbe1a286f/task-list/milestones'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/task-list/milestones">
            <Milestones />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
