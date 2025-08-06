import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { DataToSendParticipantsType } from 'gql/generated/graphql';
import i18next from 'i18next';
import { modelID, opsEvalAndLearningMocks as mocks } from 'tests/mock/readonly';

import ReadOnlyOpsEvalAndLearning from './index';

describe('Read Only Model Plan Summary -- Operations, Evaluation, and Learning', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/operations-evaluation-and-learning',
          element: <ReadOnlyOpsEvalAndLearning modelID={modelID} />
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/read-view/operations-evaluation-and-learning`
        ]
      }
    );

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
      expect(
        screen.getByText(
          i18next.t<string, {}, string>(
            `opsEvalAndLearning:dataToSendParticicipants.options.${DataToSendParticipantsType.BENEFICIARY_LEVEL_DATA}`
          )
        )
      ).toBeInTheDocument();
    });
  });
  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/operations-evaluation-and-learning',
          element: <ReadOnlyOpsEvalAndLearning modelID={modelID} />
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/read-view/operations-evaluation-and-learning`
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
      expect(
        screen.getByText(
          i18next.t<string, {}, string>(
            `opsEvalAndLearning:dataToSendParticicipants.options.${DataToSendParticipantsType.BENEFICIARY_LEVEL_DATA}`
          )
        )
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
