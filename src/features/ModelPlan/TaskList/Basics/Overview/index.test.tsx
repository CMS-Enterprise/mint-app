import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
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
      variables: { id: 'f11eb129-2c80-4080-9440-439cbe1a286f' }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: 'f11eb129-2c80-4080-9440-439cbe1a286f',
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
          '/models/f11eb129-2c80-4080-9440-439cbe1a286f/collaboration-area/task-list/overview'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false} showWarnings>
          <Route path="/models/:modelID/collaboration-area/task-list/overview">
            <Overview />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('ModelType-Problem')).toHaveValue('My problem');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
