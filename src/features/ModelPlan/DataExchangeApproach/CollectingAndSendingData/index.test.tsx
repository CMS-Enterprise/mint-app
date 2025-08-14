import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  DataToCollectFromParticipants,
  DataToSendToParticipants,
  GetCollectingAndSendingDataDocument,
  GetCollectingAndSendingDataQuery
} from 'gql/generated/graphql';
import i18next from 'i18next';

import CollectingAndSendingData from '.';

type GetCollectingAndSendingDataType =
  GetCollectingAndSendingDataQuery['modelPlan']['dataExchangeApproach'];

const dataExchangeApproachMock: GetCollectingAndSendingDataType = {
  __typename: 'PlanDataExchangeApproach',
  id: '123',
  dataToCollectFromParticipants: [
    DataToCollectFromParticipants.REPORTS_FROM_PARTICIPANTS,
    DataToCollectFromParticipants.OTHER
  ],
  dataToCollectFromParticipantsReportsDetails: 'report details',
  dataToCollectFromParticipantsOther: 'other note',
  dataWillNotBeCollectedFromParticipants: false,
  dataToCollectFromParticipantsNote: 'collect note',
  dataToSendToParticipants: [DataToSendToParticipants.OPERATIONS_DATA],
  dataToSendToParticipantsNote: 'send note'
};

const mock = [
  {
    request: {
      query: GetCollectingAndSendingDataDocument,
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

describe('CollectingAndSendingData', () => {
  it('renders correctly and matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/data-exchange-approach/collecting-and-sending-data'
        ]}
      >
        <MockedProvider mocks={mock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/data-exchange-approach/collecting-and-sending-data">
            <CollectingAndSendingData />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    // Check if the label and help text are rendered
    expect(await screen.findByText('send note')).toBeInTheDocument();

    // Create a snapshot
    expect(asFragment()).toMatchSnapshot();
  });

  it('disables MultiSelect when checkbox is checked', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/data-exchange-approach/collecting-and-sending-data'
        ]}
      >
        <MockedProvider mocks={mock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/data-exchange-approach/collecting-and-sending-data">
            <CollectingAndSendingData />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText('send note')).toBeInTheDocument();

    // Check if the MultiSelect component is enabled
    expect(
      screen.getByLabelText(
        i18next.t('dataExchangeApproach:dataToCollectFromParticipants.label')
      )
    ).not.toBeDisabled();

    // Check the checkbox
    fireEvent.click(
      screen.getByLabelText(
        i18next.t(
          'dataExchangeApproach:dataWillNotBeCollectedFromParticipants.label'
        )
      )
    );

    // Check if the Checkbox for component is disabled
    expect(
      screen.getByLabelText(
        i18next.t('dataExchangeApproach:dataToCollectFromParticipants.label')
      )
    ).toBeDisabled();

    // Check if the data-to-send-to-participants component is enabled
    expect(
      screen.getByLabelText(
        i18next.t(
          'dataExchangeApproach:dataToSendToParticipants.options.DATA_FEEDBACK_DASHBOARD'
        )
      )
    ).not.toBeDisabled();

    // Check data-to-send-to-participants-DATA_WILL_NOT_BE_SENT_TO_PARTICIPANTS to disabled others
    fireEvent.click(
      screen.getByLabelText(
        i18next.t(
          'dataExchangeApproach:dataToSendToParticipants.options.DATA_WILL_NOT_BE_SENT_TO_PARTICIPANTS'
        )
      )
    );

    // Check if the data-to-send-to-participants component is disabled
    expect(
      screen.getByLabelText(
        i18next.t(
          'dataExchangeApproach:dataToSendToParticipants.options.DATA_FEEDBACK_DASHBOARD'
        )
      )
    ).toBeDisabled();
  });
});
