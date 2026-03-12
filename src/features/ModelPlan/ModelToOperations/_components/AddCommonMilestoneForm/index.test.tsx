import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { modelID } from 'tests/mock/readonly';
import VerboseMockedProvider from 'tests/MockedProvider';

import MessageProvider from 'contexts/MessageContext';

import AddCommonMilestoneForm from './index';

describe('Add common milestone form', () => {
  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/milestone-library',
          element: (
            <MessageProvider>
              <AddCommonMilestoneForm
                milestone={{
                  __typename: 'MTOCommonMilestone',
                  id: '123456',
                  name: 'Milestone 1',
                  description: 'Description 1',
                  isArchived: false,
                  isAdded: false,
                  suggested: {
                    __typename: 'MilestoneSuggestionReasons' as const,
                    isSuggested: false,
                    count: 0,
                    reasons: []
                  },
                  categoryName: 'Category 1',
                  subCategoryName: 'SubCategory 1',
                  facilitatedByRole: [],
                  commonSolutions: []
                }}
                closeModal={() => {}}
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/milestone-library`
        ]
      }
    );

    const { asFragment } = render(
      <VerboseMockedProvider mocks={[]} addTypename={false}>
        <RouterProvider router={router} />
      </VerboseMockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('0 selected')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
