import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { categoryMock } from 'tests/mock/mto';
import { modelID } from 'tests/mock/readonly';
import VerboseMockedProvider from 'tests/MockedProvider';

import MessageProvider from 'contexts/MessageContext';

import EditCategoryTitleForm from './index';

describe('Custom Catergory form', () => {
  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MessageProvider>
              <EditCategoryTitleForm />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/matrix?view=solutions&hide-milestones-without-solutions=false&type=all`
        ]
      }
    );

    const { asFragment } = render(
      <VerboseMockedProvider mocks={[...[...categoryMock]]} addTypename={false}>
        <RouterProvider router={router} />
      </VerboseMockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Current title')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
