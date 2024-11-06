import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import {
  GetNewMethodologiesAndConsiderationsDocument,
  GetNewMethodologiesAndConsiderationsQuery
} from 'gql/generated/graphql';

import NewMethologiesAndConsiderations from '.';

type NewMethodologiesAndConsiderationsType =
  GetNewMethodologiesAndConsiderationsQuery['modelPlan']['dataExchangeApproach'];

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
          dataExchangeApproach: dataExchangeApproachMock
        }
      }
    }
  }
];

describe('TestComponent', () => {
  it('renders correctly and matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/data-exchange-approach/new-methodologies-and-additional-consideration'
        ]}
      >
        <MockedProvider mocks={mock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/data-exchange-approach/new-methodologies-and-additional-consideration">
            <NewMethologiesAndConsiderations />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    // Check if the label and help text are rendered
    expect(await screen.findByText('new data note')).toBeInTheDocument();

    // Create a snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
