import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import { GetMtoCategoriesDocument } from 'gql/generated/graphql';
import { modelID } from 'tests/mock/general';

import CategoryForm from './index';

const mocks = [
  {
    request: {
      query: GetMtoCategoriesDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          mtoMatrix: {
            __typename: 'MtoMatrix',
            categories: [
              {
                __typename: 'MtoCategory',
                id: '123',
                name: 'Category 1'
              },
              {
                __typename: 'MtoCategory',
                id: '456',
                name: 'Category 2'
              }
            ]
          }
        }
      }
    }
  }
];

describe('MTO Modal - Custom Category Form', () => {
  it('renders without errors', async () => {
    const { getByTestId, asFragment } = render(
      // <CategoryForm closeModal={() => {}} />
      <MemoryRouter
        initialEntries={[
          `models/${modelID}/collaboration-area/model-to-operations/matrix?view=milestones`
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="models/:modelID/collaboration-area/model-to-operations/matrix?view=milestones">
            <CategoryForm closeModal={() => {}} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('custom-category-form')).not.toBeDisabled();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
