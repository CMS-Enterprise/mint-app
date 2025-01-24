import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { MtoCommonSolutionKey } from 'gql/generated/graphql';
import { modelID, mtoMatrixMock } from 'tests/mock/mto';
import VerboseMockedProvider from 'tests/MockedProvider';

import MessageProvider from 'contexts/MessageContext';

import AddToExistingMilestoneForm from './AddToExistingMilestoneForm';

describe('Custom Catergory form', () => {
  it('runs without errors and matches snapshot', async () => {
    render(
      <MemoryRouter initialEntries={[`/models/${modelID}/`]}>
        <MessageProvider>
          <VerboseMockedProvider mocks={[...mtoMatrixMock]} addTypename={false}>
            <Route path="/models/:modelID/">
              <AddToExistingMilestoneForm
                closeModal={() => {}}
                solutionName="Test Solution"
                solutionKey={MtoCommonSolutionKey.ACO_OS}
              />
            </Route>
          </VerboseMockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'You may choose to add this solution to existing milestones in your MTO, or you may do so later.'
        )
      ).toBeInTheDocument();
    });
  });

  it('shows warning message when zero milestones and matches snapshot', async () => {
    // Set milestone array to empty
    mtoMatrixMock[0].result.data.modelPlan.mtoMatrix.milestones = [];

    const { asFragment } = render(
      <MemoryRouter initialEntries={[`/models/${modelID}/`]}>
        <MessageProvider>
          <VerboseMockedProvider mocks={[...mtoMatrixMock]} addTypename={false}>
            <Route path="/models/:modelID/">
              <AddToExistingMilestoneForm
                closeModal={() => {}}
                solutionName="Test Solution"
                solutionKey={MtoCommonSolutionKey.ACO_OS}
              />
            </Route>
          </VerboseMockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'You may choose to add this solution to existing milestones in your MTO, or you may do so later.'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'You have not yet added any milestones to your MTO. You may do so from the milestone library or by adding a custom milestone.'
        )
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
