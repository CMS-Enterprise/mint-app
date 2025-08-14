import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  allMTOSolutionsMock,
  categoryMock,
  milestoneMock,
  modelID
} from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import EditMilestoneForm from '.';

describe('EditMilestoneForm', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/model-to-operations/matrix?view=milestones&edit-milestone=123`
        ]}
      >
        <MessageProvider>
          <MockedProvider
            mocks={[
              ...milestoneMock('123'),
              ...categoryMock,
              ...allMTOSolutionsMock
            ]}
            addTypename={false}
          >
            <Route path="/models/:modelID/collaboration-area/model-to-operations/matrix">
              <EditMilestoneForm
                closeModal={() => {}}
                setIsDirty={() => {}}
                setCloseDestination={vi.fn()}
                setFooter={() => {}}
                submitted={{ current: false }}
              />
            </Route>
          </MockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Milestone 1')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
