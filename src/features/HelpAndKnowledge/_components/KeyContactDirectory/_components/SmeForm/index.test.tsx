import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import { keyContactsMock } from 'tests/mock/general';

import SmeForm from './index';

const mocks = [...keyContactsMock];

describe('Sme form', () => {
  it('should render content', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge',
          element: (
            <SmeForm
              mode="addWithoutCategory"
              closeModal={() => {}}
              setDisableButton={() => {}}
            />
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge']
      }
    );
    const { getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByText('Subject category')).toBeInTheDocument();
      expect(
        getByText(
          "If you don't see the overall category you need, add a category before adding a SME."
        )
      ).toBeInTheDocument();
      expect(getByText('Individual')).toBeInTheDocument();
      expect(getByText('Team mailbox')).toBeInTheDocument();
    });
  });

  it('should matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge',
          element: (
            <SmeForm
              mode="addWithoutCategory"
              closeModal={() => {}}
              setDisableButton={() => {}}
            />
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge']
      }
    );
    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
