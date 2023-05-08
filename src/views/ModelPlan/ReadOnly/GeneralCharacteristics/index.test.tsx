import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetAllGeneralCharacteristics from 'queries/ReadOnly/GetAllGeneralCharacteristics';
import { GetAllGeneralCharacteristics_modelPlan_generalCharacteristics as GetAllGeneralCharacteristicsTypes } from 'queries/ReadOnly/types/GetAllGeneralCharacteristics';
import {
  AlternativePaymentModelType,
  KeyCharacteristic,
  TaskStatus
} from 'types/graphql-global-types';

import ReadOnlyGeneralCharacteristics from './index';

const modelID = 'f11eb129-2c80-4080-9440-439cbe1a286f';

const mockData: GetAllGeneralCharacteristicsTypes = {
  __typename: 'PlanGeneralCharacteristics',
  id: '123',
  isNewModel: false,
  existingModel: 'Accountable Care Organizations (ACOs): General Information',
  resemblesExistingModel: true,
  resemblesExistingModelHow: null,
  resemblesExistingModelNote: 'THIS IS A NEW NOTE',
  hasComponentsOrTracks: false,
  hasComponentsOrTracksDiffer: null,
  hasComponentsOrTracksNote: null,
  alternativePaymentModelTypes: [
    AlternativePaymentModelType.REGULAR,
    AlternativePaymentModelType.MIPS
  ],
  alternativePaymentModelNote: 'asdfasd',
  keyCharacteristics: [
    KeyCharacteristic.POPULATION_BASED,
    KeyCharacteristic.PAYMENT,
    KeyCharacteristic.SERVICE_DELIVERY,
    KeyCharacteristic.OTHER
  ],
  keyCharacteristicsOther: null,
  keyCharacteristicsNote: 'test',
  collectPlanBids: null,
  collectPlanBidsNote: null,
  managePartCDEnrollment: null,
  managePartCDEnrollmentNote: null,
  planContractUpdated: null,
  planContractUpdatedNote: null,
  careCoordinationInvolved: false,
  careCoordinationInvolvedDescription: null,
  careCoordinationInvolvedNote: null,
  additionalServicesInvolved: true,
  additionalServicesInvolvedDescription: 'Lots of additional services',
  additionalServicesInvolvedNote: null,
  communityPartnersInvolved: true,
  communityPartnersInvolvedDescription: 'Are community partners involved?\n\n',
  communityPartnersInvolvedNote: 'frwegqergqgrqwg planContractUpdatedNote',
  geographiesTargeted: false,
  geographiesTargetedTypes: [],
  geographiesTargetedTypesOther: null,
  geographiesTargetedAppliedTo: [],
  geographiesTargetedAppliedToOther: null,
  geographiesTargetedNote: null,
  participationOptions: false,
  participationOptionsNote: null,
  agreementTypes: [],
  agreementTypesOther: null,
  multiplePatricipationAgreementsNeeded: null,
  multiplePatricipationAgreementsNeededNote: null,
  rulemakingRequired: true,
  rulemakingRequiredDescription: 'Lots of rules',
  rulemakingRequiredNote: null,
  authorityAllowances: [],
  authorityAllowancesOther: null,
  authorityAllowancesNote: null,
  waiversRequired: false,
  waiversRequiredTypes: [],
  waiversRequiredNote: null,
  status: TaskStatus.IN_PROGRESS
};

const mocks = [
  {
    request: {
      query: GetAllGeneralCharacteristics,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          id: modelID,
          existingModelLinks: [],
          generalCharacteristics: mockData
        }
      }
    }
  }
];

describe('Read Only Model Plan Summary -- General Characteristics', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/read-only/general-characteristics`
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/general-characteristics">
            <ReadOnlyGeneralCharacteristics modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
      expect(
        screen.getByText(
          'Accountable Care Organizations (ACOs): General Information'
        )
      ).toBeInTheDocument();
    });
  });
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/read-only/general-characteristics`
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/general-characteristics">
            <ReadOnlyGeneralCharacteristics modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
      expect(
        screen.getByText(
          'Accountable Care Organizations (ACOs): General Information'
        )
      ).toBeInTheDocument();
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
