import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetModelPlan from 'queries/GetModelPlan';
import {
  CMMIGroup,
  CMSCenter,
  ModelCategory,
  ModelStatus
} from 'types/graphql-global-types';

import Basics from './index';

const mocks = [
  {
    request: {
      query: GetModelPlan,
      variables: { id: 'f11eb129-2c80-4080-9440-439cbe1a286f' }
    },
    result: {
      data: {
        modelPlan: {
          modelName: 'My excellent plan that I just initiated',
          __typename: 'ModelPlan',
          id: 'f11eb129-2c80-4080-9440-439cbe1a286f',
          status: ModelStatus.PLAN_DRAFT,
          modelCategory: ModelCategory.PRIMARY_CARE_TRANSFORMATION,
          cmmiGroups: [
            CMMIGroup.STATE_INNOVATIONS_GROUP,
            CMMIGroup.POLICY_AND_PROGRAMS_GROUP
          ],
          cmsCenters: [CMSCenter.CENTER_FOR_MEDICARE, CMSCenter.OTHER],
          cmsOther: 'The Center for Awesomeness ',
          archived: false,
          discussions: [],
          generalCharacteristics: [],
          participantsAndProviders: [],
          opsEvalAndLearning: [],
          basics: [],
          documents: [],
          milestones: [],
          modifiedDts: ''
        }
      }
    }
  }
];

describe('Model Plan Documents page', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/f11eb129-2c80-4080-9440-439cbe1a286f/task-list/basics'
        ]}
      >
        <MockedProvider>
          <Route path="/models/:modelID/task-list/basics">
            <Basics />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('model-plan-basics')).toBeInTheDocument();
    });
  });
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/f11eb129-2c80-4080-9440-439cbe1a286f/task-list/basics'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/task-list/basics">
            <Basics />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
