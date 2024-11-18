import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import { GetMtoCategoriesDocument } from 'gql/generated/graphql';
import { modelID } from 'tests/mock/general';

import MTOModal from '..';

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
  // ReactModel is throwing warning - App element is not defined. Please use `Modal.setAppElement(el)`.  The app is being set within the modal but RTL is not picking up on it
  // eslint-disable-next-line
  console.error = vi.fn();

  it('renders without errors', async () => {
    const {
      getByText,
      // getByTestId,
      asFragment
    } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/model-to-operations/matrix?view=milestones`
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MTOModal isOpen closeModal={() => {}} />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText('Add a new category')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
