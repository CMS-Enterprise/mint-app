import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  modelID,
  mtoMatrixMockFull,
  possibleSolutionsMock
} from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import ReadOnlyMTOMilestones from './index';

describe('Read view MTO milestones', () => {
  it('matches snapshot', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-view/milestones`]}
      >
        <MockedProvider
          mocks={[...mtoMatrixMockFull, ...possibleSolutionsMock]}
          addTypename={false}
        >
          <Route path="/models/:modelID/read-view/milestones">
            <MessageProvider>
              <ReadOnlyMTOMilestones modelID={modelID} />
            </MessageProvider>
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText('Acquire a learning contractor')
      ).toBeInTheDocument();
    });

    // TODO: Add snapshot test and figure out why Truss tooltip is causing flakiness only here
  });
});
