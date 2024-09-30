import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  FrequencyType,
  GetFrequencyDocument,
  GetFrequencyQuery,
  OperationalNeedKey,
  OverlapType,
  TaskStatus,
  YesNoType
} from 'gql/generated/graphql';

import Frequency from './index';

type BeneficiaryFrequencyType = GetFrequencyQuery['modelPlan']['beneficiaries'];

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';
const operationalNeedID = '081cb879-bd6f-4ead-b9cb-3a299de76390';

const mockData: BeneficiaryFrequencyType = {
  __typename: 'PlanBeneficiaries',
  id: '123',
  beneficiarySelectionFrequency: [FrequencyType.OTHER],
  beneficiarySelectionFrequencyNote: '',
  beneficiarySelectionFrequencyContinually: 'other',
  beneficiarySelectionFrequencyOther: 'Very often',
  beneficiaryRemovalFrequency: [FrequencyType.CONTINUALLY],
  beneficiaryRemovalFrequencyNote: '',
  beneficiaryRemovalFrequencyContinually: 'continually',
  beneficiaryRemovalFrequencyOther: 'Not very often',
  beneficiaryOverlap: OverlapType.YES_NO_ISSUES,
  beneficiaryOverlapNote: '',
  precedenceRules: [YesNoType.YES],
  precedenceRulesYes: 'Yes precedence rules',
  precedenceRulesNo: null,
  precedenceRulesNote: 'Precedent note',
  readyForReviewByUserAccount: {
    commonName: 'ASDF',
    id: '000',
    __typename: 'UserAccount'
  },
  readyForReviewDts: '2022-05-12T15:01:39.190679Z',
  status: TaskStatus.IN_PROGRESS
};

const beneficiaryMock = [
  {
    request: {
      query: GetFrequencyDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          id: modelID,
          modelName: 'My excellent plan that I just initiated',
          beneficiaries: mockData,
          operationalNeeds: [
            {
              __typename: 'OperationalNeed',
              id: operationalNeedID,
              modelPlanID: modelID,
              name: 'Obtain an application support contractor',
              key: OperationalNeedKey.APP_SUPPORT_CON,
              nameOther: null,
              needed: true,
              modifiedDts: '',
              solutions: []
            }
          ]
        }
      }
    }
  }
];

describe('Model Plan Beneficiaries', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/beneficiaries/beneficiary-frequency'
        ]}
      >
        <MockedProvider mocks={beneficiaryMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/beneficiaries/beneficiary-frequency">
            <Frequency />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('beneficiaries-frequency-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('beneficiaries-precedence-rules-YES-note')
      ).toHaveValue('Yes precedence rules');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/beneficiaries/beneficiary-frequency'
        ]}
      >
        <MockedProvider mocks={beneficiaryMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/beneficiaries/beneficiary-frequency">
            <Frequency />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('beneficiaries-precedence-rules-YES-note')
      ).toHaveValue('Yes precedence rules');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
