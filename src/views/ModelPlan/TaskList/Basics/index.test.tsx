import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { mount } from 'enzyme';
import toJson, { OutputMapper } from 'enzyme-to-json';

import GetModelPlanInfo from 'queries/Basics/GetModelPlanInfo';
import { GetModelPlanInfo_modelPlan as GetModelPlanInfoType } from 'queries/Basics/types/GetModelPlanInfo';
import {
  CMMIGroup,
  CMSCenter,
  ModelCategory
} from 'types/graphql-global-types';
import renameTooltipAriaAndID from 'utils/testing/snapshotSerializeReplacements';

import Basics from './index';

const basicMockData: GetModelPlanInfoType = {
  __typename: 'ModelPlan',
  id: 'f11eb129-2c80-4080-9440-439cbe1a286f',
  modelName: 'My excellent plan that I just initiated',
  abbreviation: 'MEP',
  nameHistory: ['First Name', 'Second Name', 'Third Name'],
  basics: {
    id: 'asdf',
    __typename: 'PlanBasics',
    demoCode: '123',
    amsModelID: '2414213',
    modelCategory: ModelCategory.STATE_BASED,
    additionalModelCategories: [],
    cmmiGroups: [
      CMMIGroup.STATE_AND_POPULATION_HEALTH_GROUP,
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

describe('Model Plan Task List Basics page', () => {
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
    const component = mount(
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
      expect(component.text().includes('State-Based')).toBe(true);
    });

    expect(
      toJson(component, {
        mode: 'deep',
        map: renameTooltipAriaAndID as OutputMapper
      })
    ).toMatchSnapshot();
  });
});
