import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { GetModelPlanQuery } from 'gql/gen/graphql';

import { MessageProvider } from 'hooks/useMessage';

import TaskListSideNav from './index';

type GetModelPlanType = GetModelPlanQuery['modelPlan'];

const modelPlan = {
  modelName: 'Test',
  id: 'f11eb129-2c80-4080-9440-439cbe1a286f'
} as GetModelPlanType;

describe('The TaskListSideNavActions', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          'models/f11eb129-2c80-4080-9440-439cbe1a286f/task-list'
        ]}
      >
        <MockedProvider>
          <Route path="models/:modelID/task-list">
            <MessageProvider>
              <TaskListSideNav
                modelPlan={modelPlan}
                collaborators={[]}
                setStatusMessage={() => null}
              />
            </MessageProvider>
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
