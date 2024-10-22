import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import {
  GetClearanceStatusesDocument,
  GetClearanceStatusesQuery,
  PrepareForClearanceStatus,
  TaskStatus
} from 'gql/generated/graphql';
import Sinon from 'sinon';
import { benficiaryMocks } from 'tests/mock/readonly';
import setup from 'tests/util';

import { initialPrepareForClearanceValues } from '../Checklist';

import ClearanceReview from '.';

const modelID = 'f11eb129-2c80-4080-9440-439cbe1a286f';
const beneficiaryID = 'a093a178-5ec6-4a62-94df-f9b9179ee84e';

const clearanceMockData = initialPrepareForClearanceValues;

clearanceMockData.beneficiaries.status = TaskStatus.READY_FOR_CLEARANCE;
clearanceMockData.beneficiaries.id = beneficiaryID;

type GetClearanceStatusesType = GetClearanceStatusesQuery['modelPlan'];

const GetClearanceStatusesMockData: GetClearanceStatusesType = {
  __typename: 'ModelPlan',
  id: modelID,
  basics: {
    __typename: 'PlanBasics',
    id: '1234',
    readyForClearanceByUserAccount: null,
    readyForClearanceDts: null,
    status: TaskStatus.READY
  },
  generalCharacteristics: {
    __typename: 'PlanGeneralCharacteristics',
    id: '1234',
    readyForClearanceByUserAccount: null,
    readyForClearanceDts: null,
    status: TaskStatus.READY
  },
  participantsAndProviders: {
    __typename: 'PlanParticipantsAndProviders',
    id: '1234',
    readyForClearanceByUserAccount: null,
    readyForClearanceDts: null,
    status: TaskStatus.READY
  },
  beneficiaries: {
    __typename: 'PlanBeneficiaries',
    id: beneficiaryID,
    readyForClearanceByUserAccount: {
      __typename: 'UserAccount',
      id: '123',
      commonName: 'Jerry Seinfeld'
    },
    readyForClearanceDts: null,
    status: TaskStatus.READY_FOR_CLEARANCE
  },
  opsEvalAndLearning: {
    __typename: 'PlanOpsEvalAndLearning',
    id: '1234',
    readyForClearanceByUserAccount: null,
    readyForClearanceDts: null,
    status: TaskStatus.READY
  },
  payments: {
    __typename: 'PlanPayments',
    id: '1234',
    readyForClearanceByUserAccount: null,
    readyForClearanceDts: null,
    status: TaskStatus.READY
  },
  prepareForClearance: {
    __typename: 'PrepareForClearance',
    status: PrepareForClearanceStatus.READY
  }
};

const clearanceMock = [
  {
    request: {
      query: GetClearanceStatusesDocument,
      variables: { id: modelID, includePrepareForClearance: true }
    },
    result: {
      data: {
        modelPlan: GetClearanceStatusesMockData
      }
    }
  }
];

const clearanceMocks = [
  ...clearanceMock,
  ...benficiaryMocks,
  ...clearanceMock,
  ...benficiaryMocks
];

describe('ClearanceReview component', () => {
  // Stubing Math.random that occurs in Truss Tooltip component for deterministic output
  Sinon.stub(Math, 'random').returns(0.5);

  it('renders readonly component', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/task-list/prepare-for-clearance/beneficiaries/${beneficiaryID}`
        ]}
      >
        <MockedProvider mocks={clearanceMocks} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/prepare-for-clearance/:section/:sectionID">
            <ClearanceReview modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('spinner'));

    await waitFor(() => {
      expect(screen.getByText('Other disease group')).toBeInTheDocument();
    });
  });

  it('renders modal if already cleared', async () => {
    // ReactModel is throwing warning - App element is not defined. Please use `Modal.setAppElement(el)`.  The app is being set within the modal but RTL is not picking up on it
    // eslint-disable-next-line
    console.error = vi.fn();

    const { getByTestId, user } = setup(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/task-list/prepare-for-clearance/beneficiaries/${beneficiaryID}`
        ]}
      >
        <MockedProvider mocks={clearanceMocks} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/prepare-for-clearance/:section/:sectionID">
            <ClearanceReview modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('modify-task-list-for-clearance')).toBeInTheDocument();
    });

    await user.click(getByTestId('modify-task-list-for-clearance'));

    await waitFor(() => {
      expect(getByTestId('clearance-modal-header')).toHaveTextContent(
        'Are you sure you want to update this Model Plan section?'
      );
    });
  });

  it('matches snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/task-list/prepare-for-clearance/beneficiaries/${beneficiaryID}`
        ]}
      >
        <MockedProvider mocks={clearanceMocks} addTypename={false}>
          <Route path="/models/:modelID/collaboration-area/task-list/prepare-for-clearance/:section/:sectionID">
            <ClearanceReview modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('spinner'));

    await waitFor(() => {
      expect(screen.getByText('Other disease group')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
