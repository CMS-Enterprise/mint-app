import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { modelID, programWaiversMocks } from 'tests/mock/general';

import ProgramWaivers from './index';

describe('ProgramWaivers Component', () => {
  const setupRouter = () => {
    return createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/additional-questionnaires/waiver-assessment-survey/program-waivers',
          element: <ProgramWaivers />
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/additional-questionnaires/waiver-assessment-survey/program-waivers`
        ]
      }
    );
  };

  it('renders components properly', async () => {
    const user = userEvent.setup();

    const router = setupRouter();

    render(
      <MockedProvider mocks={programWaiversMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'Program waivers - Medicare Benefit Enhancements (BEs)'
        )
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText('Will your model be impacting site of care payments?')
    ).toBeInTheDocument();

    expect(screen.getByText('Selected waivers')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Please provide an example')).toBeInTheDocument();
    });

    const noRadioOption = screen.getAllByLabelText('No')[0];
    await user.click(noRadioOption);

    await waitFor(() => {
      expect(
        screen.queryByText('Please provide an example')
      ).not.toBeInTheDocument();
    });

    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    await waitFor(() => {
      expect(nextButton).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const router = setupRouter();

    const { asFragment } = render(
      <MockedProvider mocks={programWaiversMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'Program waivers - Medicare Benefit Enhancements (BEs)'
        )
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
