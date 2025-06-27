import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import {
  GetTimelineDocument,
  GetTimelineQuery,
  TaskStatus
} from 'gql/generated/graphql';

import Timeline from './index';

type GetTimelineType = GetTimelineQuery['modelPlan']['timeline'];

const timelineMockData: GetTimelineType = {
  __typename: 'PlanTimeline',
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
      query: GetTimelineDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          timeline: timelineMockData
        }
      }
    }
  }
];

describe('Model Timeline page', () => {
  it('renders without errors and matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/timeline'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/timeline">
            <Timeline />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(await screen.findByText('High level note')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
