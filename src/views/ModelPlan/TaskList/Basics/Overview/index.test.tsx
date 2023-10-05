import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import GetBasics from 'gql/apolloGQL/Basics/GetBasics';
import { BasicsOverviewFieldsFragment } from 'gql/gen/graphql';

import Overview from './index';

const overviewMockData: BasicsOverviewFieldsFragment = {
  __typename: 'PlanBasics',
  id: '123',
  modelType: null,
  problem: '',
  goal: '',
  testInterventions: '',
  note: ''
};

const mocks = [
  {
    request: {
      query: GetBasics,
      variables: { id: 'f11eb129-2c80-4080-9440-439cbe1a286f' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'f11eb129-2c80-4080-9440-439cbe1a286f',
          modelName: 'My excellent plan that I just initiated',
          basics: overviewMockData
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
          '/models/f11eb129-2c80-4080-9440-439cbe1a286f/task-list/overview'
        ]}
      >
        <MockedProvider>
          <Route path="/models/:modelID/task-list/overview">
            <Overview />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('model-plan-overview')).toBeInTheDocument();
    });
  });
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/f11eb129-2c80-4080-9440-439cbe1a286f/task-list/overview'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/task-list/overview">
            <Overview />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
