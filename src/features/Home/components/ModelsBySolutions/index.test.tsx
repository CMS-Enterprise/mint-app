import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import {
  GetModelsByMtoSolutionDocument,
  GetModelsByMtoSolutionQuery,
  GetModelsByMtoSolutionQueryVariables,
  ModelBySolutionStatus,
  ModelCategory,
  ModelStatus,
  MtoCommonSolutionKey
} from 'gql/generated/graphql';
import setup from 'tests/util';

import ModelsBySolutionTable from './table';

const mocks: MockedResponse<
  GetModelsByMtoSolutionQuery,
  GetModelsByMtoSolutionQueryVariables
>[] = [
  {
    request: {
      query: GetModelsByMtoSolutionDocument,
      variables: { solutionKey: MtoCommonSolutionKey.INNOVATION }
    },
    result: {
      data: {
        __typename: 'Query',
        modelPlansByMTOSolutionKey: [
          {
            modelPlanID: '4fc87324-dbb0-4867-8e4d-5a20a76c8ae1',
            modelPlan: {
              id: 'cfa415d8-312d-44fa-8ae8-4e3068e1fb34',
              modelName: 'Plan With CRs and TDLs',
              status: ModelStatus.PLAN_DRAFT,
              modelBySolutionStatus: ModelBySolutionStatus.PLANNED,
              abbreviation: 'PWCRT',
              basics: {
                id: '6a3c2f25-81ce-4364-b631-4c3b08eeb5af',
                modelCategory: null,
                performancePeriodStarts: null,
                performancePeriodEnds: null,
                __typename: 'PlanBasics'
              },
              __typename: 'ModelPlan'
            },
            __typename: 'ModelPlanAndMTOCommonSolution'
          },
          {
            modelPlanID: 'e671f056-2634-4af4-abad-a63850832a0a',
            modelPlan: {
              id: 'e671f056-2634-4af4-abad-a63850832a0a',
              modelName: 'Plan With Collaborators',
              status: ModelStatus.PLAN_DRAFT,
              modelBySolutionStatus: ModelBySolutionStatus.PLANNED,
              abbreviation: 'PWCLB',
              basics: {
                id: '3a1584a5-6712-4ab8-8832-86faa183d3b1',
                modelCategory: null,
                performancePeriodStarts: null,
                performancePeriodEnds: null,
                __typename: 'PlanBasics'
              },
              __typename: 'ModelPlan'
            },
            __typename: 'ModelPlanAndMTOCommonSolution'
          },
          {
            modelPlanID: '598db9f0-54c0-4346-bb6b-da46a36eff1a',
            modelPlan: {
              id: '598db9f0-54c0-4346-bb6b-da46a36eff1a',
              modelName: 'Enhancing Oncology Model',
              status: ModelStatus.PLAN_DRAFT,
              modelBySolutionStatus: ModelBySolutionStatus.PLANNED,
              abbreviation: 'EOM',
              basics: {
                id: '3f77db11-da8c-4282-a5c7-c50282833244',
                modelCategory: null,
                performancePeriodStarts: null,
                performancePeriodEnds: null,
                __typename: 'PlanBasics'
              },
              __typename: 'ModelPlan'
            },
            __typename: 'ModelPlanAndMTOCommonSolution'
          },
          {
            modelPlanID: 'c9cf987d-8543-46bb-a668-2c560ce5b149',
            modelPlan: {
              id: 'c9cf987d-8543-46bb-a668-2c560ce5b149',
              modelName: 'Empty Plan',
              status: ModelStatus.PLAN_DRAFT,
              modelBySolutionStatus: ModelBySolutionStatus.PLANNED,
              abbreviation: 'EP',
              basics: {
                id: '9a9547e2-b1d0-4ff7-a86b-9dc9339500fa',
                modelCategory: ModelCategory.STATE_BASED,
                performancePeriodStarts: '2024-07-24T05:00:00Z',
                performancePeriodEnds: '2024-07-31T05:00:00Z',
                __typename: 'PlanBasics'
              },
              __typename: 'ModelPlan'
            },
            __typename: 'ModelPlanAndMTOCommonSolution'
          },
          {
            modelPlanID: '4fc87324-dbb0-4867-8e4d-5a20a76c8ae2',
            modelPlan: {
              id: '4fc87324-dbb0-4867-8e4d-5a20a76c8ae2',
              modelName: 'Plan with Basics',
              modelBySolutionStatus: ModelBySolutionStatus.ENDED,
              status: ModelStatus.ENDED,
              abbreviation: 'PWB',
              basics: {
                id: 'f34b62fa-4ad4-4e6b-a60d-fb77fdf23831',
                modelCategory: null,
                performancePeriodStarts: null,
                performancePeriodEnds: null,
                __typename: 'PlanBasics'
              },
              __typename: 'ModelPlan'
            },
            __typename: 'ModelPlanAndMTOCommonSolution'
          },
          {
            modelPlanID: '4fc87324-dbb0-4867-8e4d-5a20a76c8ae3',
            modelPlan: {
              id: '4fc87324-dbb0-4867-8e4d-5a20a76c8ae3',
              modelName: 'Z Paused Model',
              modelBySolutionStatus: ModelBySolutionStatus.OTHER,
              status: ModelStatus.PAUSED,
              abbreviation: 'ZPM',
              basics: {
                id: 'f34b62fa-4ad4-4e6b-a60d-fb77fdf23831',
                modelCategory: null,
                performancePeriodStarts: null,
                performancePeriodEnds: null,
                __typename: 'PlanBasics'
              },
              __typename: 'ModelPlan'
            },
            __typename: 'ModelPlanAndMTOCommonSolution'
          },
          {
            modelPlanID: '4fc87324-dbb0-4867-8e4d-5a20a76c8ae4',
            modelPlan: {
              id: '4fc87324-dbb0-4867-8e4d-5a20a76c8ae4',
              modelName: 'Z Canceled Model',
              modelBySolutionStatus: ModelBySolutionStatus.OTHER,
              status: ModelStatus.CANCELED,
              abbreviation: 'ZCM',
              basics: {
                id: 'f34b62fa-4ad4-4e6b-a60d-fb77fdf23831',
                modelCategory: null,
                performancePeriodStarts: null,
                performancePeriodEnds: null,
                __typename: 'PlanBasics'
              },
              __typename: 'ModelPlan'
            },
            __typename: 'ModelPlanAndMTOCommonSolution'
          }
        ]
      }
    }
  }
];

describe('ModelsBySolution Table and Card', () => {
  it('renders solution models banner and cards and matches snapshot', async () => {
    const { getByText, getByTestId, user, asFragment } = setup(
      <MemoryRouter initialEntries={['/']}>
        <Route path="/">
          <MockedProvider mocks={mocks} addTypename={false}>
            <ModelsBySolutionTable
              solutionKey={MtoCommonSolutionKey.INNOVATION}
            />
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('spinner'));

    // Counts on banner should reflect the number of models with each status
    await waitFor(() => {
      expect(getByTestId('total-count')).toHaveTextContent('7');
      expect(getByTestId('planned-count')).toHaveTextContent('4');
      expect(getByTestId('active-count')).toHaveTextContent('0');
      expect(getByTestId('ended-count')).toHaveTextContent('1');
    });

    await waitFor(async () => {
      await user.click(getByTestId('active-count'));
      expect(
        getByText('There is no record of any models using this solution.')
      ).toBeInTheDocument();
    });

    // First three models should be visible
    await waitFor(async () => {
      await user.click(getByTestId('total-count'));
      expect(getByText('Empty Plan (EP)')).toBeInTheDocument();
      expect(getByText('Enhancing Oncology Model (EOM)')).toBeInTheDocument();
      expect(getByText('Plan with Basics (PWB)')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
