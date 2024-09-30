import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  BeneficiariesType,
  GetBeneficiaryIdentificationDocument,
  GetBeneficiaryIdentificationQuery,
  TriStateAnswer
} from 'gql/generated/graphql';

import BeneficiaryIdentification from './index';

type GetBeneficiaryIdentificationType =
  GetBeneficiaryIdentificationQuery['modelPlan']['beneficiaries'];

const mockData: GetBeneficiaryIdentificationType = {
  __typename: 'PlanBeneficiaries',
  id: '123',
  beneficiaries: [BeneficiariesType.MEDICAID, BeneficiariesType.OTHER],
  diseaseSpecificGroup: 'Other disease group',
  beneficiariesOther: 'other',
  beneficiariesNote: 'note',
  treatDualElligibleDifferent: TriStateAnswer.YES,
  treatDualElligibleDifferentHow: 'This is how',
  treatDualElligibleDifferentNote: 'This is note',
  excludeCertainCharacteristics: TriStateAnswer.YES,
  excludeCertainCharacteristicsCriteria: 'Exclude',
  excludeCertainCharacteristicsNote: 'Note'
};

const beneficiaryMock = [
  {
    request: {
      query: GetBeneficiaryIdentificationDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          beneficiaries: mockData
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
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/beneficiaries'
        ]}
      >
        <MockedProvider mocks={beneficiaryMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/beneficiaries">
            <BeneficiaryIdentification />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('beneficiaries-identification-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId('beneficiaries-other')).toHaveValue('other');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/beneficiaries'
        ]}
      >
        <MockedProvider mocks={beneficiaryMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/beneficiaries">
            <BeneficiaryIdentification />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('beneficiaries-other')).toHaveValue('other');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
