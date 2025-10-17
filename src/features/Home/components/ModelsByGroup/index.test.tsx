import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { waitFor } from '@testing-library/react';
import {
  ComponentGroup,
  GeneralStatus,
  GetModelPlansByComponentGroupDocument,
  GetModelPlansByComponentGroupQuery,
  GetModelPlansByComponentGroupQueryVariables,
  ModelStatus
} from 'gql/generated/graphql';
import setup from 'tests/util';

import ModelsByGroup from './index';

const mocksPcmg: MockedResponse<
  GetModelPlansByComponentGroupQuery,
  GetModelPlansByComponentGroupQueryVariables
>[] = [
  {
    request: {
      query: GetModelPlansByComponentGroupDocument,
      variables: { key: ComponentGroup.CCMI_PCMG }
    },
    result: {
      data: {
        __typename: 'Query',
        modelPlansByComponentGroup: [
          {
            key: ComponentGroup.CCMI_PCMG,
            modelPlanID: '4fc87324-dbb0-4867-8e4d-5a20a76c8ae1',
            modelPlan: {
              id: 'cfa415d8-312d-44fa-8ae8-4e3068e1fb34',
              modelName: 'Patient Care Model 1',
              status: ModelStatus.PLAN_DRAFT,
              generalStatus: GeneralStatus.PLANNED,
              abbreviation: 'PCM1',
              basics: {
                id: '6a3c2f25-81ce-4364-b631-4c3b08eeb5af',
                modelCategory: null,
                __typename: 'PlanBasics'
              },
              timeline: {
                id: 'cfa415d8-312d-44fa-8ae8-4e3068e1fb34',
                performancePeriodStarts: null,
                performancePeriodEnds: null,
                __typename: 'PlanTimeline'
              },
              __typename: 'ModelPlan'
            },
            __typename: 'ModelPlanAndGroup'
          },
          {
            key: ComponentGroup.CCMI_PCMG,
            modelPlanID: 'e671f056-2634-4af4-abad-a63850832a0a',
            modelPlan: {
              id: 'e671f056-2634-4af4-abad-a63850832a0a',
              modelName: 'Patient Care Model 2',
              status: ModelStatus.ACTIVE,
              generalStatus: GeneralStatus.ACTIVE,
              abbreviation: 'PCM2',
              basics: {
                id: '3a1584a5-6712-4ab8-8832-86faa183d3b1',
                modelCategory: null,
                __typename: 'PlanBasics'
              },
              timeline: {
                id: 'cfa415d8-312d-44fa-8ae8-4e3068e1fb34',
                performancePeriodStarts: '2024-01-01T00:00:00Z',
                performancePeriodEnds: '2025-12-31T00:00:00Z',
                __typename: 'PlanTimeline'
              },
              __typename: 'ModelPlan'
            },
            __typename: 'ModelPlanAndGroup'
          }
        ]
      }
    }
  }
];

const mocksCcsq: MockedResponse<
  GetModelPlansByComponentGroupQuery,
  GetModelPlansByComponentGroupQueryVariables
>[] = [
  {
    request: {
      query: GetModelPlansByComponentGroupDocument,
      variables: { key: ComponentGroup.CCSQ }
    },
    result: {
      data: {
        __typename: 'Query',
        modelPlansByComponentGroup: [
          {
            key: ComponentGroup.CCSQ,
            modelPlanID: '598db9f0-54c0-4346-bb6b-da46a36eff1a',
            modelPlan: {
              id: '598db9f0-54c0-4346-bb6b-da46a36eff1a',
              modelName: 'Quality Standards Model',
              status: ModelStatus.PLAN_COMPLETE,
              generalStatus: GeneralStatus.PLANNED,
              abbreviation: 'QSM',
              basics: {
                id: '3f77db11-da8c-4282-a5c7-c50282833244',
                modelCategory: null,
                __typename: 'PlanBasics'
              },
              timeline: {
                id: '598db9f0-54c0-4346-bb6b-da46a36eff1a',
                performancePeriodStarts: null,
                performancePeriodEnds: null,
                __typename: 'PlanTimeline'
              },
              __typename: 'ModelPlan'
            },
            __typename: 'ModelPlanAndGroup'
          }
        ]
      }
    }
  }
];

describe('ModelsByGroup', () => {
  it('renders with no component groups selected', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <ModelsByGroup componentGroupKeys={[]} />
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { getByText } = setup(
      <MockedProvider mocks={[]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(
      getByText('It looks like you forgot to select at least one group.')
    ).toBeInTheDocument();
    expect(getByText('Select groups')).toBeInTheDocument();
  });

  it('renders with component groups and displays models', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <ModelsByGroup componentGroupKeys={[ComponentGroup.CCMI_PCMG]} />
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { getByText } = setup(
      <MockedProvider mocks={mocksPcmg}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByText(/Patient Care Model 1/)).toBeInTheDocument();
      expect(getByText(/Patient Care Model 2/)).toBeInTheDocument();
    });
  });

  it('displays navigation tabs for multiple groups', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <ModelsByGroup
              componentGroupKeys={[
                ComponentGroup.CCMI_PCMG,
                ComponentGroup.CCSQ
              ]}
            />
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { getAllByText } = setup(
      <MockedProvider mocks={[...mocksPcmg, ...mocksCcsq]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      // Should have navigation buttons for both groups
      const pcmgElements = getAllByText('CMMI/PCMG');
      expect(pcmgElements.length).toBeGreaterThan(0);
      const ccsqElements = getAllByText('CCSQ');
      expect(ccsqElements.length).toBeGreaterThan(0);
    });
  });

  it('switches between component groups using navigation', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <ModelsByGroup
              componentGroupKeys={[
                ComponentGroup.CCMI_PCMG,
                ComponentGroup.CCSQ
              ]}
            />
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { getByText, user, queryByText } = setup(
      <MockedProvider mocks={[...mocksPcmg, ...mocksCcsq]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    // Initially shows CCMI_PCMG models
    await waitFor(() => {
      expect(getByText(/Patient Care Model 1/)).toBeInTheDocument();
    });

    // Click on CCSQ tab (find the button, not the heading)
    const ccsqButtons = document.querySelectorAll('button');
    const ccsqButton = Array.from(ccsqButtons).find(btn =>
      btn.textContent?.includes('CCSQ')
    );
    if (ccsqButton) {
      await user.click(ccsqButton);
    }

    // Should now show CCSQ models
    await waitFor(() => {
      expect(getByText(/Quality Standards Model/)).toBeInTheDocument();
      expect(queryByText(/Patient Care Model 1/)).not.toBeInTheDocument();
    });
  });

  it('displays select dropdown on tablet/mobile or with many groups', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <ModelsByGroup
              componentGroupKeys={[
                ComponentGroup.CCMI_PCMG,
                ComponentGroup.CCMI_PPG,
                ComponentGroup.CCMI_SCMG,
                ComponentGroup.CCMI_SPHG,
                ComponentGroup.CCMI_TBD,
                ComponentGroup.CCSQ
              ]}
            />
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { getByRole } = setup(
      <MockedProvider mocks={[...mocksPcmg, ...mocksCcsq]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    // With more than 5 groups, should show select dropdown
    await waitFor(() => {
      const select = getByRole('combobox');
      expect(select).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <ModelsByGroup componentGroupKeys={[ComponentGroup.CCMI_PCMG]} />
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { asFragment } = setup(
      <MockedProvider mocks={mocksPcmg}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
