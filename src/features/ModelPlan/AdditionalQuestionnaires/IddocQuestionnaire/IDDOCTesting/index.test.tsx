import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { GetIddocQuestionnaireTestingDocument } from 'gql/generated/graphql';

import ModelInfoWrapper from 'contexts/ModelInfoContext';

import IDDOCTesting, { IDDOCTestingFormType } from './index';

const iddocTestingMockData: IDDOCTestingFormType = {
  __typename: 'IDDOCQuestionnaire',
  id: '123',
  uatNeeds: '',
  stcNeeds: 'Yes needs',
  testingTimelines: '',
  testingNote: '',
  dataMonitoringFileTypes: [],
  dataMonitoringFileOther: '',
  dataResponseType: '',
  dataResponseFileFrequency: ''
};

const iddocTestingMock = [
  {
    request: {
      query: GetIddocQuestionnaireTestingDocument,
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
            iddocQuestionnaire: iddocTestingMockData
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
          path: '/models/:modelID/collaboration-area/additional-questionnaires/iddoc-questionnaire/testing',
          element: (
            <ModelInfoWrapper>
              <IDDOCTesting />
            </ModelInfoWrapper>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/additional-questionnaires/iddoc-questionnaire/testing'
        ]
      }
    );

    render(
      <MockedProvider mocks={iddocTestingMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('iddoc-questionnaire-testing-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId('iddoc-questionnaire-stc-needs')).toHaveValue(
        'Yes needs'
      );
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/additional-questionnaires/iddoc-questionnaire/testing',
          element: (
            <ModelInfoWrapper>
              <IDDOCTesting />
            </ModelInfoWrapper>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/additional-questionnaires/iddoc-questionnaire/testing'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={iddocTestingMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('iddoc-questionnaire-stc-needs')).toHaveValue(
        'Yes needs'
      );
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
