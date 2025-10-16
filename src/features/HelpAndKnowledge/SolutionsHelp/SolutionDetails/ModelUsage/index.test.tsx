import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import {
  GetModelsByMtoSolutionDocument,
  GetModelsByMtoSolutionQuery,
  GetModelsByMtoSolutionQueryVariables,
  ModelBySolutionStatus,
  ModelStatus,
  MtoCommonSolutionKey
} from 'gql/generated/graphql';

import { helpSolutions } from '../../solutionsMap';

import ModelUsage from '.';

const modelUsageMock: MockedResponse<
  GetModelsByMtoSolutionQuery,
  GetModelsByMtoSolutionQueryVariables
>[] = [
  {
    request: {
      query: GetModelsByMtoSolutionDocument,
      variables: {
        solutionKey: MtoCommonSolutionKey.AMS
      }
    },
    result: {
      data: {
        __typename: 'Query',
        modelPlansByMTOSolutionKey: [
          {
            __typename: 'ModelPlanAndMTOCommonSolution',
            modelPlanID: 'notrealid',
            modelPlan: {
              __typename: 'ModelPlan',
              id: 'notrealid',
              modelName: 'Test Model 1',
              abbreviation: 'TM1',
              status: ModelStatus.ACTIVE,
              modelBySolutionStatus: ModelBySolutionStatus.ACTIVE,
              basics: {
                __typename: 'PlanBasics',
                id: 'basicsid'
              },
              timeline: {
                __typename: 'PlanTimeline',
                id: 'timelineid'
              }
            }
          }
        ]
      }
    }
  }
];

describe('Operational Solutions Model Usage Components', () => {
  it('should render correctly', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions',
          element: (
            <MockedProvider mocks={modelUsageMock} addTypename={false}>
              <ModelUsage solution={helpSolutions.AMS} />
            </MockedProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/help-and-knowledge/operational-solutions?solution-key=${helpSolutions.AMS.key}&section=model-usage`
        ]
      }
    );

    const { getByText, asFragment } = render(
      <RouterProvider router={router} />
    );

    await waitFor(() => {
      expect(getByText('Model usage')).toBeInTheDocument();
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
