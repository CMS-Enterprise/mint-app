import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import {
  GetModelCollaboratorsDocument,
  GetModelCollaboratorsQuery,
  TeamRole
} from 'gql/generated/graphql';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'constants/jobCodes';
import MessageProvider from 'contexts/MessageContext';

import { CollaboratorsContent } from './index';

type GetModelPlanType = GetModelCollaboratorsQuery['modelPlan'];

const mockAuthReducer = {
  isUserSet: true,
  groups: [ASSESSMENT],
  euaId: 'ABCD'
};

const mockStore = configureMockStore();
const store = mockStore({ auth: mockAuthReducer });

const mockCollaborator: GetModelPlanType = {
  __typename: 'ModelPlan',
  id: '123',
  modelName: 'My Model',
  collaborators: [
    {
      __typename: 'PlanCollaborator',
      userID: '123',
      id: '61c7b30c-969d-4dd4-b13b-a5065f43be43',
      modelPlanID: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
      userAccount: {
        id: '890',
        __typename: 'UserAccount',
        email: '',
        username: 'ABCD',
        commonName: 'John Doe'
      },
      teamRoles: [TeamRole.MODEL_LEAD],
      createdDts: '2022-10-22T00:00:00Z'
    }
  ]
};

const mocks = [
  {
    request: {
      query: GetModelCollaboratorsDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: mockCollaborator
      }
    }
  }
];

describe('Collaborator/Team Member page w/table', () => {
  it('displays a table with collaborator', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          'models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/collaborators?view=add'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Provider store={store}>
            <MessageProvider>
              <Route path="models/:modelID/collaboration-area/collaborators">
                <CollaboratorsContent />
              </Route>
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('table')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Model Lead')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          'models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/collaborators?view=add'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Provider store={store}>
            <MessageProvider>
              <Route path="models/:modelID/collaboration-area/collaborators">
                <CollaboratorsContent />
              </Route>
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(asFragment()).toMatchSnapshot();
  });
});
