import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import configureMockStore from 'redux-mock-store';

import { businessCaseInitialData } from 'data/businessCase';
import { initialSystemIntakeForm } from 'data/systemIntake';
import GetAdminNotesAndActionsQuery from 'queries/GetAdminNotesAndActionsQuery';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import Notes from 'views/GovernanceReviewTeam/Notes';

import RequestOverview from '../RequestOverview';

const waitForPageLoad = async () => {
  await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));
};

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getAccessToken: () => Promise.resolve('test-access-token'),
        getUser: () =>
          Promise.resolve({
            name: 'John Doe'
          })
      }
    };
  }
}));

window.scrollTo = jest.fn();

describe('Provide GRT Feedback to GRT Business Owner', () => {
  const intakeQuery = {
    request: {
      query: GetSystemIntakeQuery,
      variables: {
        id: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2'
      }
    },
    result: {
      data: {
        systemIntake: {
          id: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2',
          euaUserId: 'ABCD',
          adminLead: null,
          businessNeed: 'Test business need',
          businessSolution: 'Test business solution',
          businessOwner: {
            component: 'Center for Medicaid and CHIP Services',
            name: 'ABCD'
          },
          contract: {
            contractor: 'Contractor Name',
            endDate: {
              day: '31',
              month: '12',
              year: '2023'
            },
            hasContract: 'HAVE_CONTRACT',
            startDate: {
              day: '1',
              month: '1',
              year: '2021'
            },
            vehicle: 'Sole source'
          },
          costs: {
            isExpectingIncrease: 'YES',
            expectedIncreaseAmount: '10 million dollars'
          },
          currentStage: 'I have done some initial research',
          decisionNextSteps: null,
          grbDate: null,
          grtDate: null,
          grtFeedbacks: [],
          governanceTeams: {
            isPresent: true,
            teams: []
          },
          isso: {
            isPresent: true,
            name: 'ISSO Name'
          },
          fundingSource: {
            fundingNumber: '123456',
            isFunded: true,
            source: 'Research'
          },
          lcid: null,
          lcidExpiresAt: null,
          lcidScope: null,
          lcidCostBaseline: null,
          needsEaSupport: true,
          productManager: {
            component: 'Center for Program Integrity',
            name: 'Project Manager'
          },
          rejectionReason: null,
          requester: {
            component: 'Center for Medicaid and CHIP Services',
            email: null,
            name: 'User ABCD'
          },
          requestName: 'TACO',
          requestType: 'NEW',
          status: 'INTAKE_SUBMITTED',
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

  const noteActionQuery = {
    request: {
      query: GetAdminNotesAndActionsQuery,
      variables: {
        id: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2'
      }
    },
    result: {
      data: {
        systemIntake: {
          lcid: null,
          notes: [],
          actions: []
        }
      }
    }
  };

  const mockStore = configureMockStore();
  const defaultStore = mockStore({
    auth: {
      euaId: 'AAAA',
      isUserSet: true,
      groups: ['EASI_D_GOVTEAM']
    },
    systemIntake: {
      systemIntake: {
        ...initialSystemIntakeForm,
        businessCaseId: '51aaa76e-57a6-4bff-ae51-f693b8038ba2'
      }
    },
    businessCase: {
      form: {
        ...businessCaseInitialData,
        id: '51aaa76e-57a6-4bff-ae51-f693b8038ba2'
      }
    }
  });
  describe('actions', () => {
    it('displays formik validation errors', async () => {
      renderActionPage('provide-feedback-need-biz-case', [intakeQuery]);
      await waitForPageLoad();

      screen.getByRole('button', { name: /email decision/i }).click();

      expect(
        await screen.findByTestId('formik-validation-errors')
      ).toBeInTheDocument();
    });

    const renderActionPage = (slug: string, mocks: any[]) => {
      render(
        <MemoryRouter
          initialEntries={[
            `/governance-review-team/a4158ad8-1236-4a55-9ad5-7e15a5d49de2/actions/${slug}`
          ]}
        >
          <MockedProvider mocks={mocks} addTypename={false}>
            <Provider store={defaultStore}>
              <Route
                path={[
                  '/governance-review-team/:systemId/intake-request',
                  `/governance-review-team/:systemId/actions/${slug}`
                ]}
              >
                <RequestOverview />
              </Route>
              <Route path="/governance-review-team/:systemId/notes">
                <Notes />
              </Route>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
    };
  });
});
