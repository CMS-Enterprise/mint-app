import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  generalCharacteristicMocks as mocks,
  modelID
} from 'tests/mock/readonly';

import ReadOnlyGeneralCharacteristics from './index';

describe('Read Only Model Plan Summary -- General Characteristics', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/general-characteristics',
          element: <ReadOnlyGeneralCharacteristics modelID={modelID} />
        }
      ],
      {
        initialEntries: [`/models/${modelID}/read-view/general-characteristics`]
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
      expect(
        screen.getByText(
          'Accountable Care Organizations (ACOs): General Information'
        )
      ).toBeInTheDocument();
    });
  });
  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/general-characteristics',
          element: <ReadOnlyGeneralCharacteristics modelID={modelID} />
        }
      ],
      {
        initialEntries: [`/models/${modelID}/read-view/general-characteristics`]
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
      expect(
        screen.getByText(
          'Accountable Care Organizations (ACOs): General Information'
        )
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
