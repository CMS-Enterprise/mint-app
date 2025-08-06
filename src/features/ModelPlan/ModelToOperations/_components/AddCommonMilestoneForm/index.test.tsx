import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { MtoCommonMilestoneKey } from 'gql/generated/graphql';
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
                  name: 'Milestone 1',
                  key: MtoCommonMilestoneKey.ACQUIRE_AN_EVAL_CONT,
                  isAdded: false,
                  isSuggested: false,
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
