import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { MtoCommonMilestoneKey } from 'gql/generated/graphql';
import { modelID } from 'tests/mock/readonly';
import VerboseMockedProvider from 'tests/MockedProvider';

import MessageProvider from 'contexts/MessageContext';

import AddCommonMilestoneForm from './index';

describe('Add common milestone form', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/model-to-operations/milestone-library`
        ]}
      >
        <MessageProvider>
          <VerboseMockedProvider mocks={[]} addTypename={false}>
            <Route path="/models/:modelID/">
              <AddCommonMilestoneForm
                milestone={{
                  __typename: 'MTOCommonMilestone',
                  name: 'Milestone 1',
                  key: MtoCommonMilestoneKey.ACQUIRE_AN_EVAL_CONT,
                  isAdded: false,
                  isSuggested: false,
                  categoryName: 'Category 1',
                  subCategoryName: 'SubCategory 1',
                  commonSolutions: []
                }}
                closeModal={() => {}}
              />
            </Route>
          </VerboseMockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('0 selected')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
