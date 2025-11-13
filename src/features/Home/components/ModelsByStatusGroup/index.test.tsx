import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { waitFor } from '@testing-library/react';
import { modelsByStatusGroupPreClearanceMock } from 'tests/mock/general';
import setup from 'tests/util';

import ModelsByStatusGroup from './index';

describe('ModelsByStatusGroup', () => {
  it('renders with default status group selected', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <ModelsByStatusGroup />
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { getByText, queryByText } = setup(
      <MockedProvider mocks={modelsByStatusGroupPreClearanceMock}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByText('Plan with Data Complete')).toBeInTheDocument();
      expect(getByText('Plan With draft')).toBeInTheDocument();
      expect(getByText('Pre-clearance')).toBeInTheDocument();
      expect(getByText('Active')).toBeInTheDocument();
      expect(queryByText('Payment start date')).not.toBeInTheDocument();
      expect(queryByText('Test Plan with Basics')).not.toBeInTheDocument();
      expect(queryByText('Test Plan with Timeline')).not.toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <ModelsByStatusGroup />
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { getByText, asFragment } = setup(
      <MockedProvider mocks={modelsByStatusGroupPreClearanceMock}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByText('Plan with Data Complete')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
