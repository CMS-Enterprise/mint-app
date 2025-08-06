import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { MtoCommonSolutionKey } from 'gql/generated/graphql';
import { allMilestonesMock, modelID } from 'tests/mock/mto';
import VerboseMockedProvider from 'tests/MockedProvider';

import MessageProvider from 'contexts/MessageContext';

import AddToExistingMilestoneForm from '.';

describe('Custom Catergory form', () => {
  it('runs without errors and matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/',
          element: (
            <AddToExistingMilestoneForm
              closeModal={() => {}}
              solutionName="Test Solution"
              solutionKey={MtoCommonSolutionKey.ACO_OS}
            />
          )
        }
      ],
      {
        initialEntries: [`/models/${modelID}/`]
      }
    );

    render(
      <MessageProvider>
        <VerboseMockedProvider mocks={[allMilestonesMock]} addTypename={false}>
          <RouterProvider router={router} />
        </VerboseMockedProvider>
      </MessageProvider>
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
    if (
      allMilestonesMock &&
      'result' in allMilestonesMock &&
      allMilestonesMock.result &&
      'data' in allMilestonesMock.result &&
      allMilestonesMock.result.data?.modelPlan?.mtoMatrix
    ) {
      allMilestonesMock.result.data.modelPlan.mtoMatrix.milestones = [];
    }

    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/',
          element: (
            <AddToExistingMilestoneForm
              closeModal={() => {}}
              solutionName="Test Solution"
              solutionKey={MtoCommonSolutionKey.ACO_OS}
            />
          )
        }
      ],
      {
        initialEntries: [`/models/${modelID}/`]
      }
    );

    const { asFragment } = render(
      <MessageProvider>
        <VerboseMockedProvider mocks={[allMilestonesMock]} addTypename={false}>
          <RouterProvider router={router} />
        </VerboseMockedProvider>
      </MessageProvider>
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
