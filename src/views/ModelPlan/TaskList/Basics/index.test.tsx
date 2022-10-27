import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetModelPlanInfo from 'queries/Basics/GetModelPlanInfo';
import { GetModelPlanInfo_modelPlan as GetModelPlanInfoType } from 'queries/Basics/types/GetModelPlanInfo';
import {
  CMMIGroup,
  CMSCenter,
  ModelCategory
} from 'types/graphql-global-types';

import Basics from './index';

const basicMockData: GetModelPlanInfoType = {
  __typename: 'ModelPlan',
  id: 'f11eb129-2c80-4080-9440-439cbe1a286f',
  modelName: 'My excellent plan that I just initiated',
  nameHistory: ['First Name', 'Second Name', 'Third Name'],
  basics: {
    id: 'asdf',
    __typename: 'PlanBasics',
    modelCategory: ModelCategory.PRIMARY_CARE_TRANSFORMATION,
    cmmiGroups: [
      CMMIGroup.STATE_INNOVATIONS_GROUP,
      CMMIGroup.POLICY_AND_PROGRAMS_GROUP
    ],
    cmsCenters: [CMSCenter.CENTER_FOR_MEDICARE, CMSCenter.OTHER],
    cmsOther: 'The Center for Awesomeness '
  }
};

const mocks = [
  {
    request: {
      query: GetModelPlanInfo,
      variables: { id: 'f11eb129-2c80-4080-9440-439cbe1a286f' }
    },
    result: {
      data: {
        modelPlan: basicMockData
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
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/task-list/basics">
            <Basics />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('model-plan-basics')).toBeInTheDocument();
      expect(
        screen.getByTestId('summary-box--previous-name')
      ).toBeInTheDocument();
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
      expect(screen.getByTestId('model-plan-basics')).toBeInTheDocument();
      expect(
        screen.getByTestId('summary-box--previous-name')
      ).toBeInTheDocument();
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
