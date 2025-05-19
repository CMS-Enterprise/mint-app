import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { GetModelPlanQuery } from 'gql/generated/graphql';

import MessageProvider from 'contexts/MessageContext';

import TaskListSideNav from './index';

type GetModelPlanType = GetModelPlanQuery['modelPlan'];

const modelPlan = {
  modelName: 'Test',
  id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905'
} as GetModelPlanType;

describe('The TaskListSideNavActions', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          'models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list'
        ]}
      >
        <MockedProvider>
          <Route path="models/:modelID/collaboration-area/task-list">
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
