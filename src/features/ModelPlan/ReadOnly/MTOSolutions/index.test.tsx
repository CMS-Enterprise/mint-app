import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import Sinon from 'sinon';
import { modelID, solutionAndMilestoneMock } from 'tests/mock/mto';
import { possibleSolutionsMock } from 'tests/mock/solutions';

import MessageProvider from 'contexts/MessageContext';

import ReadOnlyMTOSolutions from './index';

describe('Read view MTO milestones', () => {
  // Stubing Math.random that occurs in Truss Tooltip component for deterministic output
  Sinon.stub(Math, 'random').returns(0.5);

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-view/milestones`]}
      >
        <MockedProvider
          mocks={[...solutionAndMilestoneMock, ...possibleSolutionsMock]}
          addTypename={false}
        >
          <Route path="/models/:modelID/read-view/milestones">
            <MessageProvider>
              <ReadOnlyMTOSolutions modelID={modelID} />
            </MessageProvider>
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Ready for review')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Solution 1')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
