import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';

import LockedTaskListSection from '.';

const modelID = '53e06174-83b9-462a-86d0-3a936f3c2670';

describe('Locked Task List Section Page', () => {
  it('renders a page that is locked', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/models/${modelID}/locked-task-list-section`,
            state: { error: false, route: 'basics' }
          }
        ]}
      >
        <Route path="/models/:modelID/locked-task-list-section">
          <LockedTaskListSection />
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('page-locked')).toHaveTextContent(
        'Someone is currently editing the Model Plan section you’re trying to access'
      );
    });
  });

  it('renders a page that is errored', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/models/${modelID}/locked-task-list-section`,
            state: { error: true, route: 'basics' }
          }
        ]}
      >
        <Route path="/models/:modelID/locked-task-list-section">
          <LockedTaskListSection />
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('page-error')).toHaveTextContent(
        'Sorry, an has error occured.'
      );
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/models/${modelID}/locked-task-list-section`,
            state: { error: false, route: 'basics' }
          }
        ]}
      >
        <Route path="/models/:modelID/locked-task-list-section">
          <LockedTaskListSection />
        </Route>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
