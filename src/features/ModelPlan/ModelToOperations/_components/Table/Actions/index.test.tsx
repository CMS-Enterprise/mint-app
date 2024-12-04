import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  commonMilestonesMock,
  commonSolutionsMock,
  modelID
} from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import MTOTableActions from '.';

describe('MTO Table Actions Component', () => {
  it('renders correctly and matches snapshot', async () => {
    const { asFragment } = render(
      <MockedProvider
        mocks={[...commonSolutionsMock, ...commonMilestonesMock]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[
            `/models/${modelID}/collaboration-area/model-to-operations`
          ]}
        >
          <MessageProvider>
            <Route path="/models/:modelID/collaboration-area/model-to-operations">
              <MTOTableActions />
            </Route>
          </MessageProvider>
        </MemoryRouter>
      </MockedProvider>
    );

    userEvent.click(screen.getAllByRole('button', { name: /Show actions/ })[0]);
    await waitFor(async () => {
      expect(screen.getByText(/1 common milestones/i)).toBeInTheDocument();
      expect(
        screen.getByText(/2 common solutions and IT systems/i)
      ).toBeInTheDocument();
    });

    // Match the snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
