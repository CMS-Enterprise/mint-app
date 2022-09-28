import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetAllBeneficiaries from 'queries/ReadOnly/GetAllBeneficiaries';
import { GetAllBeneficiaries_modelPlan_beneficiaries as AllBeneficiariesTypes } from 'queries/ReadOnly/types/GetAllBeneficiaries';
import {
  BeneficiariesType,
  ConfidenceType,
  FrequencyType,
  OverlapType,
  SelectionMethodType,
  TaskStatus,
  TriStateAnswer
} from 'types/graphql-global-types';
import { translateBeneficiariesType } from 'utils/modelPlan';

import ReadOnlyBeneficiaries from './index';

const modelID = 'f11eb129-2c80-4080-9440-439cbe1a286f';

const mockData: AllBeneficiariesTypes = {
  __typename: 'PlanBeneficiaries',
  id: '123',
  modelPlanID: modelID,
  beneficiaries: [
    BeneficiariesType.DISEASE_SPECIFIC,
    BeneficiariesType.DUALLY_ELIGIBLE
  ],
  beneficiariesOther: null,
  beneficiariesNote: null,
  treatDualElligibleDifferent: TriStateAnswer.YES,
  treatDualElligibleDifferentHow: 'null',
  treatDualElligibleDifferentNote: null,
  excludeCertainCharacteristics: TriStateAnswer.NO,
  excludeCertainCharacteristicsCriteria: null,
  excludeCertainCharacteristicsNote: null,
  numberPeopleImpacted: 1234,
  estimateConfidence: ConfidenceType.COMPLETELY,
  confidenceNote: null,
  beneficiarySelectionMethod: [SelectionMethodType.HISTORICAL],
  beneficiarySelectionOther: null,
  beneficiarySelectionNote: null,
  beneficiarySelectionFrequency: FrequencyType.ANNUALLY,
  beneficiarySelectionFrequencyOther: null,
  beneficiarySelectionFrequencyNote: null,
  beneficiaryOverlap: OverlapType.YES_NEED_POLICIES,
  beneficiaryOverlapNote: null,
  precedenceRules: null,
  status: TaskStatus.IN_PROGRESS
};

const mocks = [
  {
    request: {
      query: GetAllBeneficiaries,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          id: modelID,
          beneficiaries: mockData
        }
      }
    }
  }
];

describe('Read Only Model Plan Summary -- Beneficiaries', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-only/beneficiaries`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/beneficiaries">
            <ReadOnlyBeneficiaries modelID={modelID} />
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
          translateBeneficiariesType(BeneficiariesType.DISEASE_SPECIFIC)
        )
      ).toBeInTheDocument();
    });
  });
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-only/beneficiaries`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/beneficiaries">
            <ReadOnlyBeneficiaries modelID={modelID} />
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
          translateBeneficiariesType(BeneficiariesType.DISEASE_SPECIFIC)
        )
      ).toBeInTheDocument();
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
