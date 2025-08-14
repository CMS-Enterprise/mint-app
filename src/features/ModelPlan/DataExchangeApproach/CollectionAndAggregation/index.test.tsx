import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  AnticipatedMultiPayerDataAvailabilityUseCase,
  GetCollectionAndAggregationDocument,
  GetCollectionAndAggregationQuery,
  MultiSourceDataToCollect
} from 'gql/generated/graphql';
import i18next from 'i18next';

import CollectionAndAggregation from '.';

type CollectionAndAggregationType =
  GetCollectionAndAggregationQuery['modelPlan']['dataExchangeApproach'];

const dataExchangeApproachMock: CollectionAndAggregationType = {
  __typename: 'PlanDataExchangeApproach',
  id: '123',
  doesNeedToMakeMultiPayerDataAvailable: false,
  anticipatedMultiPayerDataAvailabilityUseCase: [
    AnticipatedMultiPayerDataAvailabilityUseCase.SUPPLY_MULTI_PAYER_CLAIMS_COST_UTIL_AND_QUALITY_REPORTING
  ],
  doesNeedToMakeMultiPayerDataAvailableNote: 'data available note',
  doesNeedToCollectAndAggregateMultiSourceData: false,
  multiSourceDataToCollect: [MultiSourceDataToCollect.OTHER],
  multiSourceDataToCollectOther: 'other data',
  doesNeedToCollectAndAggregateMultiSourceDataNote: 'multi source note'
};

const mock = [
  {
    request: {
      query: GetCollectionAndAggregationDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          dataExchangeApproach: dataExchangeApproachMock
        }
      }
    }
  }
];

describe('CollectionAndAggregation', () => {
  it('renders correctly and matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/data-exchange-approach/multi-payer-data-multi-source-collection-aggregation'
        ]}
      >
        <MockedProvider mocks={mock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/data-exchange-approach/multi-payer-data-multi-source-collection-aggregation">
            <CollectionAndAggregation />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    // Check if the label and help text are rendered
    expect(await screen.findByText('data available note')).toBeInTheDocument();

    // Create a snapshot
    expect(asFragment()).toMatchSnapshot();
  });

  it('disables MultiSelect when checkbox is checked', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/data-exchange-approach/multi-payer-data-multi-source-collection-aggregation'
        ]}
      >
        <MockedProvider mocks={mock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/data-exchange-approach/multi-payer-data-multi-source-collection-aggregation">
            <CollectionAndAggregation />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText('data available note')).toBeInTheDocument();

    // Check if the doesNeedToMakeMultiPayerDataAvailable component is disabled
    expect(
      screen.getByLabelText(
        i18next.t(
          'dataExchangeApproach:anticipatedMultiPayerDataAvailabilityUseCase.options.FILL_GAPS_IN_CARE_ALERTING_AND_REPORTS'
        )
      )
    ).toBeDisabled();

    // Check the checkbox
    fireEvent.click(
      screen.queryAllByLabelText(
        i18next.t(
          'dataExchangeApproach:doesNeedToMakeMultiPayerDataAvailable.options.true'
        )
      )[0]
    );

    // Check if the doesNeedToMakeMultiPayerDataAvailable for component is enabled
    expect(
      screen.getByLabelText(
        i18next.t(
          'dataExchangeApproach:anticipatedMultiPayerDataAvailabilityUseCase.options.FILL_GAPS_IN_CARE_ALERTING_AND_REPORTS'
        )
      )
    ).not.toBeDisabled();

    // Check if the MultiSelect component is disabled
    expect(
      screen.getByLabelText(
        i18next.t('dataExchangeApproach:multiSourceDataToCollect.label')
      )
    ).toBeDisabled();

    // Check the checkbox
    fireEvent.click(
      screen.getAllByLabelText(
        i18next.t(
          'dataExchangeApproach:doesNeedToCollectAndAggregateMultiSourceData.options.true'
        )
      )[1]
    );

    // Check if the MultiSelect for component is enabled
    expect(
      screen.getByLabelText(
        i18next.t('dataExchangeApproach:multiSourceDataToCollect.label')
      )
    ).not.toBeDisabled();
  });
});
