import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import {
  ConfidenceType,
  GetPeopleImpactedDocument,
  GetPeopleImpactedQuery,
  SelectionMethodType
} from 'gql/generated/graphql';
import { modelID, modelPlanBaseMock } from 'tests/mock/general';

import ModelInfoWrapper from 'contexts/ModelInfoContext';

import PeopleImpact from './index';

type PeopleImpactType = GetPeopleImpactedQuery['modelPlan']['beneficiaries'];

const mockData: PeopleImpactType = {
  __typename: 'PlanBeneficiaries',
  id: '123',
  numberPeopleImpacted: 100,
  estimateConfidence: ConfidenceType.COMPLETELY,
  confidenceNote: 'String',
  beneficiarySelectionNote: 'String',
  beneficiarySelectionOther: 'Selection Method Other',
  beneficiarySelectionMethod: [
    SelectionMethodType.HISTORICAL,
    SelectionMethodType.OTHER
  ]
};

const beneficiaryMock = [
  {
    request: {
      query: GetPeopleImpactedDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          id: modelID,
          modelName: 'My excellent plan that I just initiated',
          beneficiaries: mockData
        }
      }
    }
  },
  ...modelPlanBaseMock
];

describe('Model Plan Beneficiaries', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/beneficiaries/people-impact',
          element: (
            <ModelInfoWrapper>
              <PeopleImpact />
            </ModelInfoWrapper>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/beneficiaries/people-impact'
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
        screen.getByTestId('beneficiaries-people-impact-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId('expected-people-impacted')).toHaveValue(100);
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('beneficiaries-choose-beneficiaries-other')
      ).toHaveValue('Selection Method Other');
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/beneficiaries/people-impact',
          element: (
            <ModelInfoWrapper>
              <PeopleImpact />
            </ModelInfoWrapper>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/beneficiaries/people-impact'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={beneficiaryMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitForElementToBeRemoved(() =>
      screen.getByTestId('beneficiaries-selection-note-add-note-toggle')
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
