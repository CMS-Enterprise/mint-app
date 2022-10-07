import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import ModelSubNav from './index';

describe('The ModelSubNav component', () => {
  it('renders the correct text and link for task list', async () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/models/123/task-list']}>
        <Route path="/models/:modelID/task-list">
          <ModelSubNav modelID="123" link="read-only" />
        </Route>
      </MemoryRouter>
    );
    expect(getByTestId('sub-navigation-link-text')).toHaveTextContent(
      'Go to the Model Plan read view'
    );
    expect(getByTestId('sub-navigation-text')).toHaveTextContent(
      'Want to view a shareable version of this Model Plan?'
    );
  });

  it('renders the correct text and link for read-only', async () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/models/123/task-list']}>
        <Route path="/models/:modelID/task-list">
          <ModelSubNav modelID="123" link="task-list" />
        </Route>
      </MemoryRouter>
    );
    expect(getByTestId('sub-navigation-link-text')).toHaveTextContent(
      'Go to the Model Plan task list'
    );
    expect(getByTestId('sub-navigation-text')).toHaveTextContent(
      'Need to update this information?'
    );
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/models/123/task-list']}>
        <Route path="/models/:modelID/task-list">
          <ModelSubNav modelID="123" link="task-list" />
        </Route>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
