import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetGeneralCharacteristics from 'queries/GeneralCharacteristics/GetGeneralCharacteristics';
import { GetGeneralCharacteristics_modelPlan_generalCharacteristics as GetGeneralCharacteristicsType } from 'queries/GeneralCharacteristics/types/GetGeneralCharacteristics';

import { CharacteristicsContent } from './index';

const generalCharacteristicsMockData: GetGeneralCharacteristicsType = {
  __typename: 'PlanGeneralCharacteristics',
  id: '123',
  isNewModel: false,
  existingModel: 'Second Plan',
  resemblesExistingModel: false,
  resemblesExistingModelHow: '',
  resemblesExistingModelNote: '',
  hasComponentsOrTracks: true,
  hasComponentsOrTracksDiffer: 'Differ text',
  hasComponentsOrTracksNote: 'Component note'
};

const generalCharacteristicsMock = [
  {
    request: {
      query: GetGeneralCharacteristics,
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
