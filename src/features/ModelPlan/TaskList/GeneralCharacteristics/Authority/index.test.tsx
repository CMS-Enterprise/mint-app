import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  GetAuthorityDocument,
  GetAuthorityQuery,
  TaskStatus
} from 'gql/generated/graphql';

import Authority from './index';

type GetAuthorityType = GetAuthorityQuery['modelPlan']['generalCharacteristics'];

const authorityMockData: GetAuthorityType = {
  __typename: 'PlanGeneralCharacteristics',
  id: '123',
  rulemakingRequired: true,
  rulemakingRequiredDescription: 'Yes rulemaking is required',
  rulemakingRequiredNote: '',
  authorityAllowances: [],
  authorityAllowancesOther: '',
  authorityAllowancesNote: '',
  waiversRequired: false,
  waiversRequiredTypes: [],
  waiversRequiredNote: '',
  readyForReviewByUserAccount: {
    commonName: 'ASDF',
    id: '000',
    __typename: 'UserAccount'
  },
  readyForReviewDts: '2022-05-12T15:01:39.190679Z',
  status: TaskStatus.IN_PROGRESS
};

const authorityMock = [
  {
    request: {
      query: GetAuthorityDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
          modelName: 'My excellent plan that I just initiated',
          generalCharacteristics: authorityMockData
        }
      }
    }
  }
];

describe('Model Plan Characteristics', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/characteristics/authority'
        ]}
      >
        <MockedProvider mocks={authorityMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/characteristics/authority">
            <Authority />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('plan-characteristics-authority-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId(
          'plan-characteristics-rulemaking-required-description'
        )
      ).toHaveValue('Yes rulemaking is required');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/task-list/characteristics/authority'
        ]}
      >
        <MockedProvider mocks={authorityMock} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/characteristics/authority">
            <Authority />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(
          'plan-characteristics-rulemaking-required-description'
        )
      ).toHaveValue('Yes rulemaking is required');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
