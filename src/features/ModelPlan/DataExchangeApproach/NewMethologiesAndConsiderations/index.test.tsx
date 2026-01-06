import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import {
  GetNewMethodologiesAndConsiderationsDocument,
  GetNewMethodologiesAndConsiderationsQuery
} from 'gql/generated/graphql';

import NewMethologiesAndConsiderations from '.';

type NewMethodologiesAndConsiderationsType =
  GetNewMethodologiesAndConsiderationsQuery['modelPlan']['questionnaires']['dataExchangeApproach'];

const dataExchangeApproachMock: NewMethodologiesAndConsiderationsType = {
  __typename: 'PlanDataExchangeApproach',
  id: '123',
  willImplementNewDataExchangeMethods: false,
  newDataExchangeMethodsDescription: '',
  newDataExchangeMethodsNote: 'new data note',
  additionalDataExchangeConsiderationsDescription: 'consideration desc',
  isDataExchangeApproachComplete: false,
  markedCompleteByUserAccount: {
    __typename: 'UserAccount',
    id: '567',
    commonName: 'John Doe'
  },
  markedCompleteDts: '2021-09-01T00:00:00Z'
};

const mock = [
  {
    request: {
      query: GetNewMethodologiesAndConsiderationsDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          questionnaires: {
            dataExchangeApproach: dataExchangeApproachMock
          }
        }
      }
    }
  }
];

describe('TestComponent', () => {
  it('renders correctly and matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/additional-questionnaires/new-methodologies-and-additional-consideration',
          element: <NewMethologiesAndConsiderations />
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/additional-questionnaires/new-methodologies-and-additional-consideration'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={mock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    // Check if the label and help text are rendered
    expect(await screen.findByText('new data note')).toBeInTheDocument();

    // Create a snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
