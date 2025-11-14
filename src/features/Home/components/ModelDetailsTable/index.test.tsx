import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { waitFor } from '@testing-library/react';
import {
  modelPlansByStatusGroupActiveMockData,
  modelPlansByStatusGroupPreClearanceMockData,
  modelsByStatusGroupActiveMock,
  modelsByStatusGroupPreClearanceMock
} from 'tests/mock/general';
import setup from 'tests/util';

import ModelDetailsTable from './index';

const hiddenColumnsForPreClearance = ['paymentDate', 'endDate'];
const hiddenColumnsForActive = ['status', 'clearanceDate', 'paymentDate'];

describe('ModelDetailsTable', () => {
  it('renders with model plans that match pre clearance', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <ModelDetailsTable
              models={modelPlansByStatusGroupPreClearanceMockData}
              hiddenColumns={hiddenColumnsForPreClearance}
              canSearch
            />
          )
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
      expect(getByText('Model name')).toBeInTheDocument();
      expect(getByText('Status')).toBeInTheDocument();
      expect(getByText('Anticipated clearance date')).toBeInTheDocument();
      expect(getByText('Showing 1-2 of 2 results')).toBeInTheDocument();
      expect(queryByText('Payment start date')).not.toBeInTheDocument();
      expect(queryByText('Test Plan with Basics')).not.toBeInTheDocument();
    });
  });

  it('renders with model plans that match active', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <ModelDetailsTable
              models={modelPlansByStatusGroupActiveMockData}
              hiddenColumns={hiddenColumnsForActive}
              canSearch
            />
          )
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
      expect(getByText('Test Plan with Basics')).toBeInTheDocument();
      expect(getByText('Model start date')).toBeInTheDocument();
      expect(getByText('Model end date')).toBeInTheDocument();
      expect(queryByText('Status')).not.toBeInTheDocument();
      expect(queryByText('Anticipated clearance date')).not.toBeInTheDocument();
      expect(queryByText('Plan with Data Complete')).not.toBeInTheDocument();
      expect(queryByText('Plan With draft')).not.toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <ModelDetailsTable
              models={modelPlansByStatusGroupActiveMockData}
              hiddenColumns={hiddenColumnsForActive}
              canSearch
            />
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { getByText, asFragment } = setup(
      <MockedProvider mocks={modelsByStatusGroupActiveMock}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByText('Model start date')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
