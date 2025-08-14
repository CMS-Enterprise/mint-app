import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import { GetMtoCategoriesDocument } from 'gql/generated/graphql';
import { modelID } from 'tests/mock/readonly';
import VerboseMockedProvider from 'tests/MockedProvider';

import MessageProvider from 'contexts/MessageContext';

import CustomMilestoneForm from './index';

const mocks = [
  {
    request: {
      query: GetMtoCategoriesDocument,
      variables: {
        id: modelID
      }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelID,
          mtoMatrix: {
            __typename: 'MtoMatrix',
            info: {
              __typename: 'MTOInfo',
              id: modelID
            },
            categories: [
              {
                __typename: 'MtoCategory',
                id: '123',
                name: 'Category 1',
                subCategories: {
                  __typename: 'MtoSubCategory',
                  id: '123',
                  name: 'SubCategory 1'
                }
              },
              {
                __typename: 'MtoCategory',
                id: '456',
                name: 'Category 2',
                subCategories: {
                  __typename: 'MtoSubCategory',
                  id: '123',
                  name: 'SubCategory 2'
                }
              }
            ]
          }
        }
      }
    }
  }
];

describe('Custom Milestone form', () => {
  it('matches snapshot', async () => {
    const { getAllByTestId, getByTestId, asFragment } = render(
      <MemoryRouter initialEntries={[`/models/${modelID}/`]}>
        <MessageProvider>
          <VerboseMockedProvider mocks={mocks} addTypename={false}>
            <Route path="/models/:modelID/">
              <CustomMilestoneForm />
            </Route>
          </VerboseMockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('alert')).toBeInTheDocument();
      const selectPrimaryCategory = getAllByTestId('Select')[0];
      const primaryCategoryOptions =
        selectPrimaryCategory.querySelectorAll('option');

      expect(primaryCategoryOptions).toHaveLength(3);

      expect(primaryCategoryOptions[0].value).toBe('default');
      expect(primaryCategoryOptions[1].value).toBe('123');
      expect(primaryCategoryOptions[2].value).toBe('456');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
