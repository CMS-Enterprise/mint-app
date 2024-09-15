import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import TaskListBannerAlert from '.';

describe('The Task List Alert Banner', () => {
  it('renders banner on task list page', async () => {
    const { findByTestId } = render(
      <MemoryRouter
        initialEntries={[
          `/models/0272ca43-1ec1-45a6-a06f-8e2def7f6888/collaboration-area/task-list/beneficiaries`
        ]}
      >
        <Route
          path="/models/:modelID/collaboration-area/task-list"
          component={TaskListBannerAlert}
        />
      </MemoryRouter>
    );

    expect(await findByTestId('task-list-alert')).toBeInTheDocument();
  });

  it('does not banner when not on task list page', async () => {
    const { queryByTestId } = render(
      <MemoryRouter
        initialEntries={[
          `/models/0272ca43-1ec1-45a6-a06f-8e2def7f6888/collaboration-area/task-list`
        ]}
      >
        <Route
          path="/models/:modelID/collaboration-area/task-list"
          component={TaskListBannerAlert}
        />
      </MemoryRouter>
    );

    expect(queryByTestId('task-list-alert')).not.toBeInTheDocument();
  });
});
