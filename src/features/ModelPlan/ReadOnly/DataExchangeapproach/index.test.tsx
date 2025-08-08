import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  dataExchangeApproachMocks as mocks,
  modelID
} from 'tests/mock/readonly';

import ReadOnlyDataExchangeApproach from './index';

describe('Read view - Data exchange approach', () => {
  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/data-exchange-approach',
          element: <ReadOnlyDataExchangeApproach modelID={modelID} />
        }
      ],
      {
        initialEntries: [`/models/${modelID}/read-view/data-exchange-approach`]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('data available note')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
