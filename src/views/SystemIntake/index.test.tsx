import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import GetSytemIntakeQuery from 'queries/GetSystemIntakeQuery';

import { SystemIntake } from './index';

describe('The System Intake page', () => {
  const INTAKE_ID = 'ccdfdcf5-5085-4521-9f77-fa1ea324502b';
  const intakeQuery = {
    request: {
      query: GetSytemIntakeQuery,
      variables: {
        id: INTAKE_ID
      }
    },
    result: {
      data: {
        systemIntake: {
          id: INTAKE_ID,
          euaUserId: 'ABCD',
          adminLead: null,
          businessNeed: null,
          businessSolution: null,
          businessOwner: {
            component: null,
            name: null
          },
          contract: {
            contractor: null,
            endDate: {
              day: null,
              month: null,
              year: null
            },
            hasContract: null,
            startDate: {
              day: null,
              month: null,
              year: null
            },
            vehicle: null
          },
          costs: {
            isExpectingIncrease: null,
            expectedIncreaseAmount: null
          },
          currentStage: null,
          decisionNextSteps: null,
          grbDate: null,
          grtDate: null,
          grtFeedbacks: [],
          governanceTeams: {
            isPresent: false,
            teams: null
          },
          isso: {
            isPresent: false,
            name: null
          },
          fundingSource: {
            fundingNumber: null,
            isFunded: null,
            source: null
          },
          lcid: null,
          lcidExpiresAt: null,
          lcidScope: null,
          lcidCostBaseline: null,
          needsEaSupport: null,
          productManager: {
            component: null,
            name: null
          },
          rejectionReason: null,
          requester: {
            component: null,
            email: null,
            name: 'User ABCD'
          },
          requestName: '',
          requestType: 'NEW',
          status: 'INTAKE_DRAFT',
          createdAt: null,
          submittedAt: null,
          updatedAt: null,
          archivedAt: null,
          decidedAt: null,
          businessCaseId: null,
          lastAdminNote: {
            content: null,
            createdAt: null
          },
          grtReviewEmailBody: null
        }
      }
    }
  };

  it('renders without crashing', async () => {
    render(
      <MemoryRouter initialEntries={[`/system/${INTAKE_ID}/contact-details`]}>
        <MockedProvider mocks={[intakeQuery]} addTypename={false}>
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(screen.getByTestId('system-intake')).toBeInTheDocument();
  });

  it('renders request details', async () => {
    render(
      <MemoryRouter initialEntries={[`/system/${INTAKE_ID}/request-details`]}>
        <MockedProvider mocks={[intakeQuery]} addTypename={false}>
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', { name: /request details/i, level: 1 })
    ).toBeInTheDocument();
  });

  it('renders contract details', async () => {
    render(
      <MemoryRouter initialEntries={[`/system/${INTAKE_ID}/contract-details`]}>
        <MockedProvider mocks={[intakeQuery]} addTypename={false}>
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', { name: /contract details/i, level: 1 })
    ).toBeInTheDocument();
  });

  it('renders intake review page', async () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      auth: {
        euaId: 'ABCD'
      },
      systemIntake: { systemIntake: {} },
      action: {}
    });
    render(
      <MemoryRouter initialEntries={[`/system/${INTAKE_ID}/review`]}>
        <MockedProvider mocks={[intakeQuery]} addTypename={false}>
          <Provider store={store}>
            <Route path="/system/:systemId/:formPage">
              <SystemIntake />
            </Route>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByRole('heading', {
        name: /check your answers before sending/i,
        level: 1
      })
    ).toBeInTheDocument();
  });

  it('renders confirmation page', async () => {
    render(
      <MemoryRouter initialEntries={[`/system/${INTAKE_ID}/confirmation`]}>
        <MockedProvider mocks={[intakeQuery]} addTypename={false}>
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', {
        name: /your intake request has been submitted/i,
        level: 1
      })
    ).toBeInTheDocument();
  });

  it('renders intake view page', async () => {
    render(
      <MemoryRouter initialEntries={[`/system/${INTAKE_ID}/view`]}>
        <MockedProvider mocks={[intakeQuery]} addTypename={false}>
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', {
        name: /review your intake request/i,
        level: 1
      })
    ).toBeInTheDocument();
  });

  it('renders not found page for unrecognized route', async () => {
    render(
      <MemoryRouter initialEntries={[`/system/${INTAKE_ID}/mumbo-jumbo`]}>
        <MockedProvider mocks={[intakeQuery]} addTypename={false}>
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', {
        name: /this page cannot be found/i,
        level: 1
      })
    ).toBeInTheDocument();
  });

  it('renders not found page for invalid intake id', async () => {
    const invalidIntakeQuery = {
      request: {
        query: GetSytemIntakeQuery,
        variables: {
          id: INTAKE_ID
        }
      },
      result: {
        data: {
          systemIntake: null
        }
      }
    };
    render(
      <MemoryRouter initialEntries={[`/system/${INTAKE_ID}/mumbo-jumbo`]}>
        <MockedProvider mocks={[invalidIntakeQuery]} addTypename={false}>
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', {
        name: /this page cannot be found/i,
        level: 1
      })
    ).toBeInTheDocument();
  });
});
