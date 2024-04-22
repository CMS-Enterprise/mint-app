import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  GetExistingModelPlansDocument,
  GetGeneralCharacteristicsDocument,
  GetGeneralCharacteristicsQuery,
  GetModelPlansBaseDocument,
  ModelPlanFilter,
  YesNoOtherType
} from 'gql/gen/graphql';

import { CharacteristicsContent, separateLinksByType } from './index';

const generalCharacteristicsMockData: GetGeneralCharacteristicsQuery['modelPlan']['generalCharacteristics'] = {
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

const generalCharacteristicsMock = [
  {
    request: {
      query: GetGeneralCharacteristicsDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          existingModelLinks: [],
          generalCharacteristics: generalCharacteristicsMockData
        }
      }
    }
  },
  {
    request: {
      query: GetModelPlansBaseDocument,
      variables: { filter: ModelPlanFilter.INCLUDE_ALL }
    },
    result: {
      data: {
        modelPlanCollection: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated'
        }
      }
    }
  },
  {
    request: {
      query: GetExistingModelPlansDocument
    },
    result: {
      data: {
        existingModelCollection: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d29056',
          modelName: 'My excellent plan that I just initiated 2'
        }
      }
    }
  }
];

describe('Model Plan Characteristics', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/characteristics'
        ]}
      >
        <MockedProvider mocks={generalCharacteristicsMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/characteristics">
            <CharacteristicsContent />
          </Route>
        </MockedProvider>
      </MemoryRouter>
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
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/characteristics'
        ]}
      >
        <MockedProvider mocks={generalCharacteristicsMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/characteristics">
            <CharacteristicsContent />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('plan-characteristics-tracks-differ-how')
      ).toHaveValue('Differ text');
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
