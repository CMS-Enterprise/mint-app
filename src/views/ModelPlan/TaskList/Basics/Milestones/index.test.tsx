import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import GetMilestones from 'gql/apolloGQL/Basics/GetMilestones';
import { BasicsMilestonesFieldsFragment } from 'gql/gen/graphql';

import { TaskStatus } from 'types/graphql-global-types';
import VerboseMockedProvider from 'utils/testing/MockedProvider';

import Milestones from './index';

const milestonesMockData: Required<BasicsMilestonesFieldsFragment> = {
  __typename: 'PlanBasics',
  ' $fragmentName': 'BasicsMilestonesFieldsFragment',
  id: '123',
  completeICIP: '2029-05-12T15:01:39.190679Z',
  clearanceStarts: '2030-06-12T15:01:39.190679Z',
  clearanceEnds: '2028-12-12T15:01:39.190679Z',
  announced: '2029-07-08T15:01:39.190679Z',
  applicationsStart: '2031-02-114T15:01:39.190679Z',
  applicationsEnd: '2031-01-23T15:01:39.190679Z',
  performancePeriodStarts: '2029-06-12T15:01:39.190679Z',
  performancePeriodEnds: '2029-012-28T15:01:39.190679Z',
  wrapUpEnds: '2030-05-08T15:01:39.190679Z',
  highLevelNote: 'High level note',
  phasedIn: true,
  phasedInNote: 'Phased in note',
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
          __typename: 'ModelPlan',
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
        <VerboseMockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/task-list/milestones">
            <Milestones />
          </Route>
        </VerboseMockedProvider>
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
        <VerboseMockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/task-list/milestones">
            <Milestones />
          </Route>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('model-plan-milestones')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
