import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

import TaskListBannerAlert from '.';

describe('The Task List Alert Banner', () => {
  it('renders banner on task list page', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/beneficiaries',
          element: <TaskListBannerAlert />
        }
      ],
      {
        initialEntries: [
          `/models/0272ca43-1ec1-45a6-a06f-8e2def7f6888/collaboration-area/task-list/beneficiaries`
        ]
      }
    );

    const { findByTestId } = render(<RouterProvider router={router} />);

    expect(await findByTestId('task-list-alert')).toBeInTheDocument();
  });

  it('does not banner when not on task list page', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list',
          element: <TaskListBannerAlert />
        }
      ],
      {
        initialEntries: [
          `/models/0272ca43-1ec1-45a6-a06f-8e2def7f6888/collaboration-area/task-list`
        ]
      }
    );

    const { queryByTestId } = render(<RouterProvider router={router} />);

    expect(queryByTestId('task-list-alert')).not.toBeInTheDocument();
  });
});
