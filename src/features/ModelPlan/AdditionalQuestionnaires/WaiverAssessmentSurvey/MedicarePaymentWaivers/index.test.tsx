import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { medicalPaymentWaiversMocks, modelID } from 'tests/mock/readonly';

import MedicarePaymentWaivers from './index';

describe('MedicarePaymentWaivers Component', () => {
  const setupRouter = () => {
    return createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/additional-questionnaires/waiver-assessment-survey/medicare-payment-waivers',
          element: <MedicarePaymentWaivers />
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/additional-questionnaires/waiver-assessment-survey/medicare-payment-waivers`
        ]
      }
    );
  };

  it('renders components properly', async () => {
    const user = userEvent.setup();

    const router = setupRouter();

    render(
      <MockedProvider mocks={medicalPaymentWaiversMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Medicare payment waivers')).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        'Does your model modify Medicare shared savings programs?'
      )
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
      <MockedProvider mocks={medicalPaymentWaiversMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Medicare payment waivers')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
