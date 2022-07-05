import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetBeneficiaryIdentification from 'queries/Beneficiaries/getBeneficiaryIndentification';
import { GetBeneficiaryIdentification_modelPlan_beneficiaries as GetBeneficiaryIdentificationType } from 'queries/Beneficiaries/types/GetBeneficiaryIdentification';
import { BeneficiariesType, TriStateAnswer } from 'types/graphql-global-types';

import BeneficiaryIdentification from './index';

const mockData: GetBeneficiaryIdentificationType = {
  __typename: 'PlanBeneficiaries',
  id: '123',
  beneficiaries: ['OTHER' as BeneficiariesType],
  beneficiariesOther: 'other',
  beneficiariesNote: 'note',
  treatDualElligibleDifferent: 'YES' as TriStateAnswer,
  treatDualElligibleDifferentHow: 'This is how',
  treatDualElligibleDifferentNote: 'This is note',
  excludeCertainCharacteristics: 'YES' as TriStateAnswer,
  excludeCertainCharacteristicsCriteria: 'Exclude',
  excludeCertainCharacteristicsNote: 'Note'
};

const beneficiaryMock = [
  {
    request: {
      query: GetBeneficiaryIdentification,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          opsEvalAndLearning: mockData
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
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/beneficiaries'
        ]}
      >
        <MockedProvider mocks={beneficiaryMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/beneficiaries">
            <BeneficiaryIdentification />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('beneficiaries-page-one-form')
      ).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/beneficiaries'
        ]}
      >
        <MockedProvider mocks={beneficiaryMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/beneficiaries">
            <BeneficiaryIdentification />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
