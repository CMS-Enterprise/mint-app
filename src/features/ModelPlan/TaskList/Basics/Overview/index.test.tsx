import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import {
  GetOverviewDocument,
  GetOverviewQuery,
  ModelType
} from 'gql/generated/graphql';

import Overview from './index';

type GetOverviewType = GetOverviewQuery['modelPlan']['basics'];

const overviewMockData: GetOverviewType = {
  __typename: 'PlanBasics',
  id: '123',
  modelType: [ModelType.MANDATORY_NATIONAL],
  modelTypeOther: 'Other model type',
  problem: 'My problem',
  goal: 'A goal',
  testInterventions: 'Intervention',
  note: 'Test note'
};

const mocks = [
  {
    request: {
      query: GetOverviewDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          basics: overviewMockData
        }
      }
    }
  }
];

describe('Basics overview page', () => {
  it('renders without errors and matches snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/overview'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false} showWarnings>
          <Route path="/models/:modelID/collaboration-area/task-list/overview">
            <Overview />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() =>
      screen.getByTestId('ModelType-note-add-note-toggle')
    );

    await waitFor(() => {
      expect(getByTestId('ModelType-Problem')).toHaveValue('My problem');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
