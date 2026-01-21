import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  BeneficiariesType,
  GetBeneficiaryIdentificationDocument,
  GetBeneficiaryIdentificationQuery,
  GetBeneficiaryIdentificationQueryVariables,
  TriStateAnswer
} from 'gql/generated/graphql';
import { modelID, modelPlanBaseMockData } from 'tests/mock/general';

import { ModelInfoContext } from 'contexts/ModelInfoContext';

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

const beneficiaryMock: MockedResponse<
  GetBeneficiaryIdentificationQuery,
  GetBeneficiaryIdentificationQueryVariables
>[] = [
  {
    request: {
      query: GetBeneficiaryIdentificationDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        __typename: 'Query',
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelID,
          modelName: 'My excellent plan that I just initiated',
          beneficiaries: mockData
        }
      }
    }
  }
];

describe('Model Plan Beneficiaries', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/beneficiaries',
          element: (
            <ModelInfoContext.Provider value={modelPlanBaseMockData}>
              <BeneficiaryIdentification />
            </ModelInfoContext.Provider>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/beneficiaries'
        ]
      }
    );

    render(
      <MockedProvider mocks={beneficiaryMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
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
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/beneficiaries',
          element: (
            <ModelInfoContext.Provider value={modelPlanBaseMockData}>
              <BeneficiaryIdentification />
            </ModelInfoContext.Provider>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/beneficiaries'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={beneficiaryMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('beneficiaries-note')).toHaveValue('note');
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('beneficiaries-dual-eligibility-note')
      ).toHaveValue('This is note');
    });

    await waitFor(() => {
      expect(screen.getByTestId('beneficiaries-exclude-note')).toHaveValue(
        'Note'
      );
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
