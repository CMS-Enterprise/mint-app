import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { GetIddocQuestionnaireMonitoringDocument } from 'gql/generated/graphql';

import ModelInfoWrapper from 'contexts/ModelInfoContext';

import IDDOCMonitoring, { IDDOCMonitoringFormType } from './index';

const iddocMonitoringMockData: IDDOCMonitoringFormType = {
  __typename: 'IDDOCQuestionnaire',
  id: '123',
  dataFullTimeOrIncremental: null,
  eftSetUp: null,
  unsolicitedAdjustmentsIncluded: null,
  dataFlowDiagramsNeeded: null,
  produceBenefitEnhancementFiles: null,
  fileNamingConventions: '.pdf',
  dataMonitoringNote: '',
  isIDDOCQuestionnaireComplete: false,
  completedDts: '2022-06-03T19:32:24.412662Z',
  completedByUserAccount: {
    __typename: 'UserAccount',
    id: 'fake-user-id',
    commonName: ''
  }
};

const iddocMonitoringMock = [
  {
    request: {
      query: GetIddocQuestionnaireMonitoringDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          questionnaires: {
            __typename: 'Questionnaires',
            id: '123',
            iddocQuestionnaire: iddocMonitoringMockData
          }
        }
      }
    }
  }
];

describe('Model Plan Ops Eval and Learning IDDOC', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/additional-questionnaires/iddoc-questionnaire/monitoring',
          element: (
            <ModelInfoWrapper>
              <IDDOCMonitoring />
            </ModelInfoWrapper>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/additional-questionnaires/iddoc-questionnaire/monitoring'
        ]
      }
    );

    render(
      <MockedProvider mocks={iddocMonitoringMock}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('iddoc-questionnaire-monitoring-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('iddoc-questionnaire-file-naming-convention')
      ).toHaveValue('.pdf');
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/additional-questionnaires/iddoc-questionnaire/monitoring',
          element: (
            <ModelInfoWrapper>
              <IDDOCMonitoring />
            </ModelInfoWrapper>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/additional-questionnaires/iddoc-questionnaire/monitoring'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={iddocMonitoringMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('iddoc-questionnaire-file-naming-convention')
      ).toHaveValue('.pdf');
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
