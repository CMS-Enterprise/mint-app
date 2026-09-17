import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActiveModelWaiversMocks, modelID } from 'tests/mock/general';

import ActiveModelWaivers from './index';

describe('ActiveModelWaivers Component', () => {
  const setupRouter = () => {
    return createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/additional-questionnaires/waiver-assessment-survey/active-model-waivers',
          element: <ActiveModelWaivers />
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/additional-questionnaires/waiver-assessment-survey/active-model-waivers`
        ]
      }
    );
  };

  it('renders components properly', async () => {
    const user = userEvent.setup();

    const router = setupRouter();

    render(
      <MockedProvider mocks={ActiveModelWaiversMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Active model waivers')).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        'Does your model modify Medicare shared savings programs?'
      )
    ).toBeInTheDocument();

    expect(screen.getByText('Available waivers')).toBeInTheDocument();

    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    await waitFor(() => {
      expect(nextButton).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const router = setupRouter();

    const { asFragment } = render(
      <MockedProvider mocks={ActiveModelWaiversMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Active model waivers')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
