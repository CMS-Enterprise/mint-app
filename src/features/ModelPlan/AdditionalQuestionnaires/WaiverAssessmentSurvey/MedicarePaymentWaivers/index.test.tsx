import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { modelID } from 'tests/mock/general';

import MedicarePaymentWaivers from './index';

describe('MedicarePaymentWaivers Component', () => {
  it('renders components properly', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/additional-questionnaires/waiver-assessment-survey/medicare-payment-waivers`
        ]}
      >
        <MedicarePaymentWaivers />
      </MemoryRouter>
    );

    expect(screen.getByText('Medicare payment waivers')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Does your model modify Medicare shared savings programs?'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Selected waivers')).toBeInTheDocument();

    expect(
      screen.queryByText('Please provide an example')
    ).not.toBeInTheDocument();

    const yesRadioOption = screen.getAllByLabelText('Yes')[0];
    await userEvent.click(yesRadioOption);

    expect(screen.getByText('Please provide an example')).toBeInTheDocument();

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(nextButton).toBeInTheDocument();
    });
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/additional-questionnaires/waiver-assessment-survey/medicare-payment-waivers`
        ]}
      >
        <MedicarePaymentWaivers />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
