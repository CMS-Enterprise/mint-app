import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import GetModelPlanInfo from 'gql/apolloGQL/Basics/GetModelPlanInfo';
import {
  BasicsModelPlanInfoFieldsFragment,
  CmmiGroup,
  CmsCenter,
  ModelCategory
} from 'gql/gen/graphql';
import Sinon from 'sinon';

import Basics from './index';

const basicMockData: Required<BasicsModelPlanInfoFieldsFragment> = {
  __typename: 'ModelPlan',
  ' $fragmentName': 'BasicsModelPlanInfoFieldsFragment',
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
      CmmiGroup.STATE_AND_POPULATION_HEALTH_GROUP,
      CmmiGroup.POLICY_AND_PROGRAMS_GROUP
    ],
    cmsCenters: [CmsCenter.CENTER_FOR_MEDICARE, CmsCenter.OTHER],
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
  // Stubing Math.random that occurs in Truss Tooltip component for deterministic output
  Sinon.stub(Math, 'random').returns(0.5);

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

  it('disables and clears checkbox when user selects corresponding radio button', async () => {
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
      // Page loaded
      expect(screen.getByTestId('model-plan-basics')).toBeInTheDocument();

      // Ensure the radio element is checked (based on Mock Data)
      expect(
        screen.getByTestId('plan-basics-model-category-STATE_BASED')
      ).toBeChecked();

      // Corresponding checkbox should be unchecked and disabled
      expect(
        screen.getByTestId('plan-basics-model-additional-category-STATE_BASED')
      ).not.toBeChecked();
      expect(
        screen.getByTestId('plan-basics-model-additional-category-STATE_BASED')
      ).toBeDisabled();

      // Check a different checkbox (Accountable Care)
      screen
        .getByTestId('plan-basics-model-additional-category-ACCOUNTABLE_CARE')
        .click();
      expect(
        screen.getByTestId(
          'plan-basics-model-additional-category-ACCOUNTABLE_CARE'
        )
      ).toBeChecked();

      // Click accountable care radio button, which should clear previous checkbox
      screen.getByTestId('plan-basics-model-category-ACCOUNTABLE_CARE').click();

      // Ensure checkbox is now unchecked and disabled
      expect(
        screen.getByTestId(
          'plan-basics-model-additional-category-ACCOUNTABLE_CARE'
        )
      ).not.toBeChecked();
      expect(
        screen.getByTestId(
          'plan-basics-model-additional-category-ACCOUNTABLE_CARE'
        )
      ).toBeDisabled();
    });

    expect(asFragment()).toMatchSnapshot();
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
