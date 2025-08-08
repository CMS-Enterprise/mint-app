import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { TaskStatus } from 'gql/generated/graphql';

import TaskListButton from './index';

describe('The Header component', () => {
  const renderedComponent = (status: TaskStatus) => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/*',
          element: <TaskListButton path="/" status={status} />
        }
      ],
      {
        initialEntries: [
          '/models/0747d91f-2f9e-43df-b008-afc9fe3df61a/collaboration-area/task-list'
        ]
      }
    );

    return render(<RouterProvider router={router} />);
  };

  it('renders without crashing', async () => {
    renderedComponent(TaskStatus.READY);
    expect(await screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Start')).toBeInTheDocument();
  });

  describe('displays the correct text', () => {
    it('for IN_PROGRESS status', () => {
      renderedComponent(TaskStatus.IN_PROGRESS);

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Continue')).toBeInTheDocument();
    });
    it('for READY_FOR_REVIEW status', () => {
      renderedComponent(TaskStatus.READY_FOR_REVIEW);

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Update')).toBeInTheDocument();
    });
  });
});
