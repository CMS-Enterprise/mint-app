import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetAllPayments from 'queries/ReadOnly/GetAllPayments';
import { GetAllPayments_modelPlan_payments as PaymentTypes } from 'queries/ReadOnly/types/GetAllPayments';
import {
  AnticipatedPaymentFrequencyType,
  ClaimsBasedPayType,
  ComplexityCalculationLevelType,
  FundingSource,
  NonClaimsBasedPayType,
  PayRecipient,
  PayType,
  TaskStatus
} from 'types/graphql-global-types';

import ReadOnlyPayments from './index';

const modelID = 'f11eb129-2c80-4080-9440-439cbe1a286f';

const mockData: PaymentTypes = {
  __typename: 'PlanPayments',
  fundingSource: [FundingSource.PATIENT_PROTECTION_AFFORDABLE_CARE_ACT],
  fundingSourceTrustFund: null,
  fundingSourceOther: null,
  fundingSourceNote: null,
  fundingSourceR: [FundingSource.PATIENT_PROTECTION_AFFORDABLE_CARE_ACT],
  fundingSourceRTrustFund: null,
  fundingSourceROther: null,
  fundingSourceRNote: null,
  payRecipients: [PayRecipient.BENEFICIARIES],
  payRecipientsOtherSpecification: null,
  payRecipientsNote: null,
  payType: [PayType.CLAIMS_BASED_PAYMENTS],
  payTypeNote: null,
  payClaims: [ClaimsBasedPayType.ADJUSTMENTS_TO_FFS_PAYMENTS],
  payClaimsOther: null,
  payClaimsNote: null,
  shouldAnyProvidersExcludedFFSSystems: true,
  shouldAnyProviderExcludedFFSSystemsNote: null,
  changesMedicarePhysicianFeeSchedule: true,
  changesMedicarePhysicianFeeScheduleNote: null,
  affectsMedicareSecondaryPayerClaims: true,
  affectsMedicareSecondaryPayerClaimsHow: null,
  affectsMedicareSecondaryPayerClaimsNote: null,
  payModelDifferentiation: null,
  creatingDependenciesBetweenServices: true,
  creatingDependenciesBetweenServicesNote: null,
  needsClaimsDataCollection: true,
  needsClaimsDataCollectionNote: null,
  providingThirdPartyFile: true,
  isContractorAwareTestDataRequirements: true,
  beneficiaryCostSharingLevelAndHandling: null,
  waiveBeneficiaryCostSharingForAnyServices: true,
  waiveBeneficiaryCostSharingServiceSpecification: null,
  waiverOnlyAppliesPartOfPayment: true,
  waiveBeneficiaryCostSharingNote: null,
  nonClaimsPayments: [NonClaimsBasedPayType.ADVANCED_PAYMENT],
  nonClaimsPaymentsNote: '',
  nonClaimsPaymentOther: null,
  paymentCalculationOwner: null,
  numberPaymentsPerPayCycle: null,
  numberPaymentsPerPayCycleNote: null,
  sharedSystemsInvolvedAdditionalClaimPayment: true,
  sharedSystemsInvolvedAdditionalClaimPaymentNote: null,
  planningToUseInnovationPaymentContractor: true,
  planningToUseInnovationPaymentContractorNote: null,
  fundingStructure: null,
  expectedCalculationComplexityLevel: ComplexityCalculationLevelType.HIGH,
  expectedCalculationComplexityLevelNote: null,
  canParticipantsSelectBetweenPaymentMechanisms: true,
  canParticipantsSelectBetweenPaymentMechanismsHow: null,
  canParticipantsSelectBetweenPaymentMechanismsNote: null,
  anticipatedPaymentFrequency: [AnticipatedPaymentFrequencyType.BIANNUALLY],
  anticipatedPaymentFrequencyOther: null,
  anticipatedPaymentFrequencyNote: null,
  willRecoverPayments: true,
  willRecoverPaymentsNote: null,
  anticipateReconcilingPaymentsRetrospectively: true,
  anticipateReconcilingPaymentsRetrospectivelyNote: null,
  paymentStartDate: '2022-06-03T19:32:24.412662Z',
  paymentStartDateNote: null,
  status: TaskStatus.IN_PROGRESS
};

const mocks = [
  {
    request: {
      query: GetAllPayments,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          id: modelID,
          payments: mockData
        }
      }
    }
  }
];

describe('Read Only Model Plan Summary -- Payment', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter initialEntries={[`/models/${modelID}/read-only/payment`]}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/payment">
            <ReadOnlyPayments modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
        'Claims-Based Payments'
      );
    });
  });
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={[`/models/${modelID}/read-only/payment`]}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/payment">
            <ReadOnlyPayments modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
        'Claims-Based Payments'
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
