import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { DataToSendParticipantsType } from 'gql/gen/graphql';
import i18next from 'i18next';
import Sinon from 'sinon';

import { modelID, opsEvalAndLearningMocks as mocks } from 'data/mock/readonly';

import ReadOnlyOpsEvalAndLearning from './index';

describe('Read Only Model Plan Summary -- Operations, Evaluation, and Learning', () => {
  // Stubing Math.random that occurs in Truss Tooltip component for deterministic output
  Sinon.stub(Math, 'random').returns(0.5);

  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/read-only/operations-evaluation-and-learning`
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/operations-evaluation-and-learning">
            <ReadOnlyOpsEvalAndLearning modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
      expect(
        screen.getByText(
          i18next.t<string>(
            `opsEvalAndLearning:dataToSendParticicipants.options.${DataToSendParticipantsType.BENEFICIARY_LEVEL_DATA}`
          )
        )
      ).toBeInTheDocument();
    });
  });
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/read-only/operations-evaluation-and-learning`
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/operations-evaluation-and-learning">
            <ReadOnlyOpsEvalAndLearning modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
      expect(
        screen.getByText(
          i18next.t<string>(
            `opsEvalAndLearning:dataToSendParticicipants.options.${DataToSendParticipantsType.BENEFICIARY_LEVEL_DATA}`
          )
        )
      ).toBeInTheDocument();
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
