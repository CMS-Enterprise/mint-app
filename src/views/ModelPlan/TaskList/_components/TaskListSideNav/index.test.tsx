import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';

import TaskListSideNav from './index';

describe('The TaskListSideNavActions', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          'models/new-plan/f11eb129-2c80-4080-9440-439cbe1a286f/task-list'
        ]}
      >
        <MockedProvider>
          <Route path="models/new-plan/:modelId/task-list">
            <TaskListSideNav />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
