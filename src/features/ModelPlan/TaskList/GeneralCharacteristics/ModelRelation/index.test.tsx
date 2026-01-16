import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  GetExistingModelPlansDocument,
  GetExistingModelPlansQuery,
  GetExistingModelPlansQueryVariables,
  GetGeneralCharacteristicsDocument,
  GetGeneralCharacteristicsQuery,
  GetGeneralCharacteristicsQueryVariables,
  GetModelPlansBaseDocument,
  GetModelPlansBaseQuery,
  GetModelPlansBaseQueryVariables,
  ModelPlanFilter,
  ModelStatus,
  YesNoOtherType
} from 'gql/generated/graphql';

import { ModelInfoContext } from 'contexts/ModelInfoContext';

import ModelRelation, { separateLinksByType } from './index';

const generalCharacteristicsMockData: GetGeneralCharacteristicsQuery['modelPlan']['generalCharacteristics'] =
  {
    __typename: 'PlanGeneralCharacteristics',
    id: '123',
    isNewModel: false,
    existingModelID: null,
    currentModelPlanID: '7467634',
    resemblesExistingModel: YesNoOtherType.NO,
    resemblesExistingModelWhich: {
      __typename: 'ExistingModelLinks',
      links: [
        {
          __typename: 'ExistingModelLink',
          id: '1224534',
          existingModelID: 3465254,
          currentModelPlanID: '876578754'
        }
      ]
    },
    resemblesExistingModelWhyHow: 'We think it is right',
    resemblesExistingModelHow: '',
    resemblesExistingModelOtherSpecify: '',
    resemblesExistingModelOtherOption: 'Other model',
    resemblesExistingModelOtherSelected: true,
    resemblesExistingModelNote: '',
    participationInModelPrecondition: YesNoOtherType.YES,
    participationInModelPreconditionWhyHow: 'It is a condition',
    participationInModelPreconditionOtherSpecify: '',
    participationInModelPreconditionOtherOption: 'Other model',
    participationInModelPreconditionOtherSelected: true,
    participationInModelPreconditionNote: 'Precondition note',
    hasComponentsOrTracks: true,
    hasComponentsOrTracksDiffer: 'Differ text',
    hasComponentsOrTracksNote: 'Component note',
    participationInModelPreconditionWhich: null
  };

const generalCharacteristicsMock: MockedResponse<
  GetGeneralCharacteristicsQuery,
  GetGeneralCharacteristicsQueryVariables
>[] = [
  {
    request: {
      query: GetGeneralCharacteristicsDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        __typename: 'Query',
        modelPlan: {
          __typename: 'ModelPlan',
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          generalCharacteristics: generalCharacteristicsMockData
        }
      }
    }
  }
];

const modelPlanCollectionMock: MockedResponse<
  GetModelPlansBaseQuery,
  GetModelPlansBaseQueryVariables
>[] = [
  {
    request: {
      query: GetModelPlansBaseDocument,
      variables: { filter: ModelPlanFilter.INCLUDE_ALL }
    },
    result: {
      data: {
        __typename: 'Query',
        modelPlanCollection: [
          {
            __typename: 'ModelPlan',
            id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
            modelName: 'My excellent plan that I just initiated'
          }
        ]
      }
    }
  }
];

const existingModelPlanMock: MockedResponse<
  GetExistingModelPlansQuery,
  GetExistingModelPlansQueryVariables
>[] = [
  {
    request: {
      query: GetExistingModelPlansDocument
    },
    result: {
      data: {
        __typename: 'Query',
        existingModelCollection: [
          {
            __typename: 'ExistingModel',
            id: 100066,
            modelName: 'My excellent plan that I just initiated 2'
          }
        ]
      }
    }
  }
];

describe('Model Plan Characteristics', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/characteristics',
          element: (
            <ModelInfoContext.Provider
              value={{
                __typename: 'ModelPlan',
                id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
                modelName: 'My excellent plan that I just initiated',
                abbreviation: '',
                modifiedDts: '',
                createdDts: '2024-01-01T00:00:00Z',
                status: ModelStatus.PLAN_DRAFT,
                isMTOStarted: false
              }}
            >
              <ModelRelation />
            </ModelInfoContext.Provider>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/characteristics'
        ]
      }
    );

    render(
      <MockedProvider
        mocks={[
          ...generalCharacteristicsMock,
          ...modelPlanCollectionMock,
          ...existingModelPlanMock
        ]}
        addTypename={false}
      >
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('plan-characteristics-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('plan-characteristics-tracks-differ-how')
      ).toHaveValue('Differ text');
    });
  });

  it('separates model plans by existing/current type', () => {
    const currentModelPlanIDs: any = [
      { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    ];
    const existingModelIDs: any = [{ id: 100045 }, { id: 103222 }];
    const linksForMutation = separateLinksByType(
      [100045, 'ce3405a0-3399-4e3a-88d7-3cfc613d2905', 103222],
      currentModelPlanIDs,
      existingModelIDs
    );
    expect(linksForMutation).toEqual({
      currentModelPlanIDs: ['ce3405a0-3399-4e3a-88d7-3cfc613d2905'],
      existingModelIDs: [100045, 103222]
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/characteristics',
          element: (
            <ModelInfoContext.Provider
              value={{
                __typename: 'ModelPlan',
                id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
                modelName: 'My excellent plan that I just initiated',
                abbreviation: '',
                modifiedDts: '',
                createdDts: '2024-01-01T00:00:00Z',
                status: ModelStatus.PLAN_DRAFT,
                isMTOStarted: false
              }}
            >
              <ModelRelation />
            </ModelInfoContext.Provider>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/characteristics'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider
        mocks={[
          ...generalCharacteristicsMock,
          ...modelPlanCollectionMock,
          ...existingModelPlanMock
        ]}
        addTypename={false}
      >
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(
          'plan-characteristics-participation-model-precondition-note'
        )
      ).toHaveValue('Precondition note');
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('plan-characteristics-tracks-differ-how')
      ).toHaveValue('Differ text');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
