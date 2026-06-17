import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { CommonWaiverFragment, CommonWaiverType } from 'gql/generated/graphql';
import { allCommonWaiversMocks } from 'tests/mock/general';
import MockedProvider from 'tests/MockedProvider';

import SelectedWaiversSection from './index';

const MOCK_SELECTED_WAIVERS: CommonWaiverFragment[] = [
  {
    __typename: 'CommonWaiver',
    id: '123',
    name: 'short Waiver 2',
    waiverType: CommonWaiverType.MEDICARE_PAYMENT
  },
  {
    __typename: 'CommonWaiver',
    id: '124',
    name: 'Waiver 3',
    waiverType: CommonWaiverType.MEDICARE_PAYMENT
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
