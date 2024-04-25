import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { TaskStatus } from 'gql/gen/graphql';

import TaskListButton from './index';

describe('The Header component', () => {
  const renderedComponent = (status: TaskStatus) =>
    render(
      <MemoryRouter
        initialEntries={[
          '/models/0747d91f-2f9e-43df-b008-afc9fe3df61a/task-list'
        ]}
      >
        <TaskListButton path="/" status={status} />
      </MemoryRouter>
    );

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
