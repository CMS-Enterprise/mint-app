import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { GetIddocQuestionnaireOperationsDocument } from 'gql/generated/graphql';
import { modelPlanBaseMock } from 'tests/mock/general';

import ModelInfoWrapper from 'contexts/ModelInfoContext';

import IDDOC, { IDDOCOperationsDataType } from './index';

const iddocMockData: IDDOCOperationsDataType = {
  __typename: 'IDDOCQuestionnaire',
  id: '123',
  technicalContactsIdentified: null,
  technicalContactsIdentifiedDetail: '',
  technicalContactsIdentifiedNote: '',
  captureParticipantInfo: null,
  captureParticipantInfoNote: '',
  icdOwner: 'John Doe',
  draftIcdDueDate: null,
  icdNote: ''
};

const iddocMock = [
  {
    request: {
      query: GetIddocQuestionnaireOperationsDocument,
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
            iddocQuestionnaire: iddocMockData
          }
        }
      }
    }
  },
  ...modelPlanBaseMock
];

describe('Model Plan Ops Eval and Learning IDDOC', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/additional-questionnaires/iddoc-questionnaire/operations',
          element: (
            <ModelInfoWrapper>
              <IDDOC />
            </ModelInfoWrapper>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/additional-questionnaires/iddoc-questionnaire/operations'
        ]
      }
    );

    render(
      <MockedProvider mocks={iddocMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('iddoc-questionnaire-operations-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId('icd-owner')).toHaveValue('John Doe');
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/additional-questionnaires/iddoc-questionnaire/operations',
          element: (
            <ModelInfoWrapper>
              <IDDOC />
            </ModelInfoWrapper>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/additional-questionnaires/iddoc-questionnaire/operations'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={iddocMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('icd-owner')).toHaveValue('John Doe');
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
