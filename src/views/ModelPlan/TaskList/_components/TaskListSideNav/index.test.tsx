import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';

import { MessageProvider } from 'hooks/useMessage';
import { GetModelPlan_modelPlan as GetModelPlanType } from 'queries/types/GetModelPlan';

import TaskListSideNav from './index';

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
              <TaskListSideNav modelPlan={modelPlan} collaborators={[]} />
            </MessageProvider>
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
