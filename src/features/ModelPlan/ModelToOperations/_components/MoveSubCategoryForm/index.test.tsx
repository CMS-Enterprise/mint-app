import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { categoryMock, modelID } from 'tests/mock/mto';
import VerboseMockedProvider from 'tests/MockedProvider';

import MessageProvider from 'contexts/MessageContext';

import MoveSubCategoryForm from '.';

describe('Custom Catergory form', () => {
  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/',
          element: <MoveSubCategoryForm />
        }
      ],
      {
        initialEntries: [`/models/${modelID}/`]
      }
    );

    const { asFragment } = render(
      <MessageProvider>
        <VerboseMockedProvider
          mocks={[...[...categoryMock]]}
          addTypename={false}
        >
          <RouterProvider router={router} />
        </VerboseMockedProvider>
      </MessageProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'This action will also move any milestones within this sub-category.'
        )
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
