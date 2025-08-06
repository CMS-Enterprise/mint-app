import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  CcmInvolvmentType,
  GetIddocDocument,
  GetIddocQuery
} from 'gql/generated/graphql';

import IDDOC from './index';

type GetIDDOCType = GetIddocQuery['modelPlan']['opsEvalAndLearning'];

const iddocMockData: GetIDDOCType = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '123',
  ccmInvolvment: [CcmInvolvmentType.YES_EVALUATION],
  dataNeededForMonitoring: [],
  iddocSupport: true,
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
      query: GetIddocDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          opsEvalAndLearning: iddocMockData
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
          path: '/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/iddoc',
          element: <IDDOC />
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/ops-eval-and-learning/iddoc'
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
        screen.getByTestId('ops-eval-and-learning-iddoc-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-capture-icd-owner')
      ).toHaveValue('John Doe');
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/iddoc',
          element: <IDDOC />
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/ops-eval-and-learning/iddoc'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={iddocMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('ops-eval-and-learning-capture-icd-owner')
      ).toHaveValue('John Doe');
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
