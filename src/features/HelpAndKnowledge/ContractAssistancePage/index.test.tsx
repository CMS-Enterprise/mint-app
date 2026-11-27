import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { screen, waitFor } from '@testing-library/react';
import {
  CtatStatus,
  GetCtatDiscussionsDocument,
  GetCtatRequestDocument,
  GetCtatRequestsAdminDocument,
  GetCtatRequestsRequesterDocument
} from 'gql/generated/graphql';
import configureMockStore from 'redux-mock-store';
import setup from 'tests/util';

import { ASSESSMENT } from 'constants/jobCodes';

import ContractAssistancePage from './index';

const mockAuthAssessment = {
  isUserSet: true,
  groups: [ASSESSMENT],
  euaId: 'ABCD'
};

const mockAuthNotAssessment = {
  isUserSet: true,
  groups: [],
  euaId: 'EFGH'
};

const ctatRequestsMocks = [
  {
    request: {
      query: GetCtatRequestsRequesterDocument
    },
    result: {
      data: {
        ctatRequestsRequester: {
          __typename: 'CTATRequestsTableDataRequester',
          ctatRequests: []
        }
      }
    }
  },
  {
    request: {
      query: GetCtatRequestsAdminDocument
    },
    result: {
      data: {
        ctatRequests: {
          __typename: 'CTATRequestsTableData',
          count: 0,
          ctatRequests: []
        }
      }
    }
  }
];

const requesterTicketMock = {
  request: { query: GetCtatRequestsRequesterDocument },
  result: {
    data: {
      ctatRequestsRequester: {
        __typename: 'CTATRequestsTableDataRequester',
        ctatRequests: [
          {
            __typename: 'CTATRequest',
            id: '550e8400-e29b-41d4-a716-446655440000',
            humanReadableID: 'CTAT-001',
            createdDts: '2026-05-02T00:00:00Z',
            contractName: null,
            cmmiGroup: null,
            typeOfHelpNeeded: [],
            typeOfHelpNeededOther: null,
            status: CtatStatus.NEW,
            assignedAdminUserAccount: null
          }
        ]
      }
    }
  }
};

const requesterDetailMock = {
  request: {
    query: GetCtatRequestDocument,
    variables: { id: '550e8400-e29b-41d4-a716-446655440000' }
  },
  result: {
    data: {
      ctatRequest: {
        __typename: 'CTATRequest',
        id: '550e8400-e29b-41d4-a716-446655440000',
        humanReadableID: 'CTAT-001',
        createdDts: '2026-05-02T00:00:00Z',
        status: CtatStatus.NEW,
        assignedAdminUserAccount: null,
        resolution: null,
        requesterUserAccount: {
          __typename: 'UserAccount',
          givenName: 'Luke',
          familyName: 'Skywalker',
          commonName: 'Luke Skywalker',
          email: 'luke.skywalker@cms.hhs.gov'
        },
        cmmiGroup: null,
        cmmiGroupOther: null,
        cmmiDivision: null,
        cmmiDivisionOther: null,
        relatedMINTModels: [],
        contractActivityType: null,
        contractActivityTypeOther: null,
        contractName: null,
        contractNumber: null,
        contractType: null,
        contractTypeOther: null,
        typeOfHelpNeeded: [],
        typeOfHelpNeededOther: null,
        describeHelpNeeded: 'Need help drafting a DUA.',
        requestUrgency: null,
        dateAssistanceNeededBy: null,
        supportingDocuments: []
      }
    }
  }
};

const emptyDiscussionsMock = {
  request: {
    query: GetCtatDiscussionsDocument,
    variables: { ticketID: '550e8400-e29b-41d4-a716-446655440000' }
  },
  result: { data: { discussions: [] } }
};

const mockStore = configureMockStore();
const assessmentStore = mockStore({ auth: mockAuthAssessment });
const nonAssessmentStore = mockStore({ auth: mockAuthNotAssessment });

const renderPage = (
  store: ReturnType<typeof mockStore>,
  initialEntry?: string,
  mocks: MockedResponse[] = ctatRequestsMocks
) => {
  const router = createMemoryRouter(
    [
      {
        path: '/help-and-knowledge/contract-assistance',
        element: <ContractAssistancePage />
      },
      {
        path: '/help-and-knowledge/contract-assistance/:ticketId',
        element: <ContractAssistancePage />,
        children: [{ path: 'discussion', element: null }]
      }
    ],
    {
      initialEntries: [
        initialEntry ?? '/help-and-knowledge/contract-assistance'
      ]
    }
  );

  return setup(
    <Provider store={store}>
      <MockedProvider mocks={mocks}>
        <RouterProvider router={router} />
      </MockedProvider>
    </Provider>
  );
};

vi.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: () => {
    return {
      ctatEnabled: true
    };
  }
}));

describe('ContractAssistancePage', () => {
  it('renders admin ticket management for assessment team', async () => {
    renderPage(assessmentStore);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'Contract assistance' })
      ).toBeInTheDocument();
    });
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Admin ticket management'
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'My submitted help tickets'
      })
    ).toBeInTheDocument();
  });

  it('does not render admin ticket management for non-assessment team', async () => {
    renderPage(nonAssessmentStore);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'Contract assistance' })
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByRole('heading', {
        level: 2,
        name: 'Admin ticket management'
      })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'My submitted help tickets'
      })
    ).toBeInTheDocument();
  });

  it('renders the CTAT E-library link', async () => {
    renderPage(nonAssessmentStore);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'Contract assistance' })
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText('Visit the CTAT E-library on SharePoint')
    ).toBeInTheDocument();
  });

  it('opens the discussion panel at the ticket discussion URL', async () => {
    renderPage(
      nonAssessmentStore,
      '/help-and-knowledge/contract-assistance/550e8400-e29b-41d4-a716-446655440000/discussion',
      [requesterTicketMock, requesterDetailMock, emptyDiscussionsMock]
    );

    expect(
      await screen.findByTestId('ctat-discussion-sidepanel')
    ).toBeInTheDocument();
    expect(await screen.findByText('Ticket CTAT-001')).toBeInTheDocument();
    expect(
      await screen.findByText(
        'There are not yet any messages about this ticket. Add a message to start a discussion.'
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('ctat-ticket-view-sidepanel')
    ).not.toBeInTheDocument();
  });

  it('matches snapshot', async () => {
    const { asFragment } = renderPage(assessmentStore);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'Contract assistance' })
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
