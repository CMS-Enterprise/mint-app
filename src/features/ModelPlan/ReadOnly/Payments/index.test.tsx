import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { modelID, paymentsMocks as mocks } from 'tests/mock/readonly';

import ReadOnlyPayments from './index';

describe('Read Only Model Plan Summary -- Payment', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/payment',
          element: <ReadOnlyPayments modelID={modelID} />
        }
      ],
      {
        initialEntries: [`/models/${modelID}/read-view/payment`]
      }
    );

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
    });
  });
  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/payment',
          element: <ReadOnlyPayments modelID={modelID} />
        }
      ],
      {
        initialEntries: [`/models/${modelID}/read-view/payment`]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
