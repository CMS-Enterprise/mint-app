import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { allCommonWaiversMocks } from 'tests/mock/general';
import MockedProvider from 'tests/MockedProvider';

import { MedicarePaymentSuggestedWaivers } from '../../MedicarePaymentWaivers';

import SelectedWaiversSection from './index';

const MOCK_SELECTED_WAIVERS: MedicarePaymentSuggestedWaivers = [
  {
    __typename: 'SuggestedWaiver',
    id: '456',
    commonWaiver: {
      __typename: 'CommonWaiver',
      name: 'short Waiver 2'
    }
  },
  {
    __typename: 'SuggestedWaiver',
    id: '789',
    commonWaiver: {
      __typename: 'CommonWaiver',
      name: 'Waiver 3'
    }
  }
];

describe('SelectedWaiversSection Component', () => {
  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/selected-waivers',
          element: (
            <SelectedWaiversSection
              selectedWaivers={MOCK_SELECTED_WAIVERS}
              waiverType="MEDICAID_PAYMENT"
              waiverTypeText="Mocked Waivers"
            />
          )
        }
      ],
      {
        initialEntries: ['/selected-waivers']
      }
    );
    const { asFragment } = render(
      <MockedProvider mocks={allCommonWaiversMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Selected waivers')).toBeInTheDocument();
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
