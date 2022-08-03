import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';

import GetITToolsPageOne from 'queries/ITTools/GetITToolsPageOne';
import {
  GetITToolPageOne_modelPlan_generalCharacteristics as GeneralCharacteristicsType,
  GetITToolPageOne_modelPlan_itTools as GetITToolsPageOneType
} from 'queries/ITTools/types/GetITToolPageOne';
import { GcPartCDType } from 'types/graphql-global-types';

import ITToolsPageOne from '.';

const itToolsPageOneMockData: GetITToolsPageOneType = {
  __typename: 'PlanITTools',
  id: '123',
  gcPartCD: [GcPartCDType.MARX],
  gcPartCDOther: '',
  gcPartCDNote: '',
  gcCollectBids: [],
  gcCollectBidsOther: '',
  gcCollectBidsNote: '',
  gcUpdateContract: [],
  gcUpdateContractOther: '',
  gcUpdateContractNote: ''
};

const characteristicMockData: GeneralCharacteristicsType = {
  __typename: 'PlanGeneralCharacteristics',
  id: '456',
  managePartCDEnrollment: true,
  collectPlanBids: true,
  planContactUpdated: true
};

const itToolsPageOneMock = [
  {
    request: {
      query: GetITToolsPageOne,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          itTools: itToolsPageOneMockData,
          generalCharacteristics: characteristicMockData
        }
      }
    }
  }
];

describe('IT Tools Page One', () => {
  it('renders without errors', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/it-tools/page-one'
        ]}
      >
        <MockedProvider mocks={itToolsPageOneMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/it-tools/page-one">
            <ITToolsPageOne />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('it-tools-page-one-form')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        getByTestId('tools-question-managePartCDEnrollment')
      ).toHaveTextContent('Will you manage Part C/D enrollment?');

      expect(
        getByTestId('has-answered-tools-question-managePartCDEnrollment')
      ).toHaveTextContent('You previously answered:');

      expect(getByTestId('it-tools-gc-partc-MARX')).toBeChecked();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/it-tools/page-one'
        ]}
      >
        <MockedProvider mocks={itToolsPageOneMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/it-tools/page-one">
            <ITToolsPageOne />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        getByTestId('tools-question-managePartCDEnrollment')
      ).toHaveTextContent('Will you manage Part C/D enrollment?');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
