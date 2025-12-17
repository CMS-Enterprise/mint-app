import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  CmmiGroup,
  CmsCenter,
  GetBasicsDocument,
  GetBasicsQuery,
  GetModelPlanBaseDocument,
  ModelCategory,
  ModelStatus,
  MtoStatus
} from 'gql/generated/graphql';

import ModelInfoWrapper from 'contexts/ModelInfoContext';

import BasicsInfo from './index';

type GetModelPlanInfoType = GetBasicsQuery['modelPlan'];

const basicMockData: GetModelPlanInfoType = {
  __typename: 'ModelPlan',
  id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
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
    cmsCenters: [
      CmsCenter.CENTER_FOR_MEDICARE,
      CmsCenter.CENTER_FOR_MEDICAID_AND_CHIP_SERVICES
    ]
  }
};

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';

const mocks = [
  {
    request: {
      query: GetBasicsDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: basicMockData
      }
    }
  },
  {
    request: {
      query: GetModelPlanBaseDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelID,
          modelName: basicMockData.modelName,
          abbreviation: basicMockData.abbreviation,
          modifiedDts: '2024-01-01T00:00:00Z',
          createdDts: '2024-01-01T00:00:00Z',
          status: ModelStatus.PLAN_DRAFT,
          mtoMatrix: {
            __typename: 'ModelsToOperationMatrix',
            status: MtoStatus.READY,
            info: {
              __typename: 'MTOInfo',
              id: 'mto-id'
            }
          }
        }
      }
    }
  }
];

describe('Model Plan Basics page', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/basics',
          element: (
            <ModelInfoWrapper>
              <BasicsInfo />
            </ModelInfoWrapper>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/basics'
        ]
      }
    );

    render(
      <MockedProvider mocks={mocks}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('model-plan-basics')).toBeInTheDocument();
      expect(
        screen.getByTestId('summary-box--previous-name')
      ).toBeInTheDocument();
    });
  });

  it('disables and clears checkbox when user selects corresponding radio button', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/basics',
          element: (
            <ModelInfoWrapper>
              <BasicsInfo />
            </ModelInfoWrapper>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/basics'
        ]
      }
    );

    render(
      <MockedProvider mocks={mocks}>
        <RouterProvider router={router} />
      </MockedProvider>
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
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/basics',
          element: (
            <ModelInfoWrapper>
              <BasicsInfo />
            </ModelInfoWrapper>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/basics'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={mocks}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(
      await screen.findByTestId('plan-basics-model-name')
    ).not.toBeDisabled();

    expect(await screen.findByText('First Name')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
