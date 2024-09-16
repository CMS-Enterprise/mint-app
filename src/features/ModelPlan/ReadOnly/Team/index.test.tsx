import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { collaboratorsMocks as mocks, modelID } from 'tests/mock/readonly';

import ReadOnlyTeamInfo from './index';

describe('Read Only Model Plan Summary -- Model Basics', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter initialEntries={[`/models/${modelID}/read-only/team`]}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/team">
            <ReadOnlyTeamInfo modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('read-only-model-plan--team-info')
      ).toBeInTheDocument();
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });
  });
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={[`/models/${modelID}/read-only/team`]}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/team">
            <ReadOnlyTeamInfo modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId('read-only-model-plan--team-info')
      ).toBeInTheDocument();
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
