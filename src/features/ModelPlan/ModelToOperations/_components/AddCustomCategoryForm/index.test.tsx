import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { GetMtoCategoriesDocument } from 'gql/generated/graphql';
import { modelID } from 'tests/mock/readonly';
import VerboseMockedProvider from 'tests/MockedProvider';

import MessageProvider from 'contexts/MessageContext';

import CategoryForm from './index';

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

describe('Custom Catergory form', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={[`/models/${modelID}/`]}>
        <MessageProvider>
          <VerboseMockedProvider mocks={mocks} addTypename={false}>
            <Route path="/models/:modelID/">
              <CategoryForm closeModal={() => {}} />
            </Route>
          </VerboseMockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'Choose a primary category if you are adding a sub-category, or choose "None" if you are adding a primary category.'
        )
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
