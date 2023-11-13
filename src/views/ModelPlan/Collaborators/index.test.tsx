import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'constants/jobCodes';
import { MessageProvider } from 'hooks/useMessage';
import GetModelPlanCollaborators from 'queries/Collaborators/GetModelCollaborators';
import { GetModelCollaborators_modelPlan as GetModelPlanCollaboratorsType } from 'queries/Collaborators/types/GetModelCollaborators';
import { TeamRole } from 'types/graphql-global-types';

import { CollaboratorsContent } from './index';

const mockAuthReducer = {
  isUserSet: true,
  groups: [ASSESSMENT],
  euaId: 'ABCD'
};

const mockStore = configureMockStore();
const store = mockStore({ auth: mockAuthReducer });

const mockCollaborator: GetModelPlanCollaboratorsType = {
  __typename: 'ModelPlan',
  id: '123',
  modelName: 'My Model',
  collaborators: [
    {
      __typename: 'PlanCollaborator',
      userID: '123',
      id: '61c7b30c-969d-4dd4-b13b-a5065f43be43',
      modelPlanID: 'f11eb129-2c80-4080-9440-439cbe1a286f',
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

describe('Collaborator/Team Member page w/table', () => {
  const mocks = [
    {
      request: {
        query: GetModelPlanCollaborators,
        variables: { id: 'f11eb129-2c80-4080-9440-439cbe1a286f' }
      },
      result: {
        data: {
          modelPlan: mockCollaborator
        }
      }
    }
  ];
  it('displays a table with collaborator', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          'models/f11eb129-2c80-4080-9440-439cbe1a286f/collaborators?view=add'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Provider store={store}>
            <MessageProvider>
              <Route path="models/:modelID/collaborators">
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
          'models/f11eb129-2c80-4080-9440-439cbe1a286f/collaborators?view=add'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Provider store={store}>
            <MessageProvider>
              <Route path="models/:modelID/collaborators">
                <CollaboratorsContent />
              </Route>
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
