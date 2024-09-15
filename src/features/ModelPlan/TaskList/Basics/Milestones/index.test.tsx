import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import {
  GetMilestonesDocument,
  GetMilestonesQuery,
  TaskStatus
} from 'gql/generated/graphql';

import Milestones from './index';

type GetMilestonesType = GetMilestonesQuery['modelPlan']['basics'];

const milestonesMockData: GetMilestonesType = {
  __typename: 'PlanBasics',
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
    __typename: 'UserAccount',
    commonName: 'ASDF',
    id: '000'
  },
  readyForReviewDts: '2022-05-12T15:01:39.190679Z',
  status: TaskStatus.IN_PROGRESS
};

const mocks = [
  {
    request: {
      query: GetMilestonesDocument,
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

describe('Model Basics Milestones page', () => {
  it('renders without errors and matches snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/f11eb129-2c80-4080-9440-439cbe1a286f/collaboration-area/task-list/milestones'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/milestones">
            <Milestones />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('ModelType-phasedInNote')).toHaveValue(
        'Phased in note'
      );
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
