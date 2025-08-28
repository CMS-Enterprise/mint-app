import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { ModelPhase, ModelStatus } from 'gql/generated/graphql';

import IncorrectModelStatus from './IncorrectModelStatus';

const incorrectModelStatusProps = {
  modelPlanName: 'Wonderful Plan',
  modelPlanID: 'notarealid',
  modelPlan: {
    id: 'notarealid',
    modelName: 'Wonderful Plan',
    status: ModelStatus.CMS_CLEARANCE
  },
  phaseSuggestion: {
    __typename: 'PhaseSuggestion' as const,
    phase: ModelPhase.IN_CLEARANCE,
    suggestedStatuses: [ModelStatus.ENDED]
  }
};

describe('Incorrect Model Status in Notifications', () => {
  it('should render accordingly and matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/notifications',
          element: <IncorrectModelStatus {...incorrectModelStatusProps} />
        }
      ],
      {
        initialEntries: [`/notifications`]
      }
    );

    const { asFragment } = render(
      <RouterProvider router={router} addTypename={false} />
    );

    await waitFor(() => {
      expect(screen.getByTestId('incorrect-model-status')).toBeInTheDocument();
      expect(screen.getByText(/Wonderful Plan/i)).toBeInTheDocument();
      expect(
        screen.getByText(/timeline suggests that it is now in clearance/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/In CMS clearance/i)).toBeInTheDocument();

      expect(
        screen.getByText('Yes, update my model’s status').closest('a')
      ).toHaveAttribute(
        'href',
        `/models/${incorrectModelStatusProps.modelPlanID}/collaboration-area/status?model-status=${incorrectModelStatusProps.phaseSuggestion.suggestedStatuses[0]}`
      );
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
