import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetModelPlanCollaborators from 'queries/Collaborators/GetModelCollaborators';
import { TeamRole } from 'types/graphql-global-types';

import ReadOnlyTeamInfo from './index';

const modelID = 'f11eb129-2c80-4080-9440-439cbe1a286f';

const mockData = [
  {
    __typename: 'PlanCollaborator',
    id: '1',
    fullName: 'Luke Skywalker',
    euaUserID: '123',
    email: 'luke@skywalker.com',
    teamRole: TeamRole.MODEL_LEAD,
    modelPlanID: modelID,
    createdDts: '2022-06-03T19:32:24.412662Z'
  },
  {
    __typename: 'PlanCollaborator',
    id: '2',
    fullName: 'Boba Fett',
    euaUserID: '321',
    email: 'boba@fett.com',
    teamRole: TeamRole.LEADERSHIP,
    modelPlanID: modelID,
    createdDts: '2022-06-03T19:32:24.412662Z'
  }
];

const mocks = [
  {
    request: {
      query: GetModelPlanCollaborators,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          id: modelID,
          modelName: 'My Model',
          collaborators: mockData
        }
      }
    }
  }
];

describe('Read Only Model Plan Summary -- Model Basics', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter initialEntries={[`/models/${modelID}/read-only/team`]}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/team">
            <ReadOnlyTeamInfo modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('read-only-model-plan--team-info')
      ).toBeInTheDocument();
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });
  });
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={[`/models/${modelID}/read-only/team`]}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/team">
            <ReadOnlyTeamInfo modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId('read-only-model-plan--team-info')
      ).toBeInTheDocument();
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
