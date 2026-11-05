import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { screen, waitFor } from '@testing-library/react';
import {
  AdminUpdateCtatRequestDocument,
  CtatcmmiGroupOption,
  CtatDiscussionPoster,
  CtatHelpNeededType,
  CtatRequestUrgency,
  CtatStatus,
  GetCtatDiscussionsDocument,
  GetCtatRequestAdminDocument,
  GetCtatRequestDocument,
  GetCtatRequestsAdminDocument
} from 'gql/generated/graphql';
import { DateTime, Settings } from 'luxon';
import setup from 'tests/util';
import { afterEach, vi } from 'vitest';

import CtatTicketViewPanel from './index';

const ticketId = '550e8400-e29b-41d4-a716-446655440000';
const originalLuxonNow = Settings.now;

afterEach(() => {
  Settings.now = originalLuxonNow;
});

const baseTicket = {
  __typename: 'CTATRequest' as const,
  id: ticketId,
  humanReadableID: 'CTAT-001',
  createdDts: '2026-05-02T00:00:00Z',
  notes: null,
  resolution: null,
  cmmiGroup: CtatcmmiGroupOption.SCMG,
  cmmiGroupOther: null,
  cmmiDivision: null,
  cmmiDivisionOther: null,
  contractActivityType: null,
  contractActivityTypeOther: null,
  contractName: null,
  contractNumber: null,
  contractType: null,
  contractTypeOther: null,
  typeOfHelpNeeded: [CtatHelpNeededType.DATA_USE_AGREEMENT_DUA],
  typeOfHelpNeededOther: null,
  describeHelpNeeded: 'Need help drafting a DUA.',
  requestUrgency: CtatRequestUrgency.MEDIUM,
  dateAssistanceNeededBy: '2026-07-12T00:00:00Z',
  requesterUserAccount: {
    __typename: 'UserAccount' as const,
    givenName: 'Luke',
    familyName: 'Skywalker',
    commonName: 'Luke Skywalker',
    email: 'luke.skywalker@cms.hhs.gov'
  },
  assignedAdminUserAccount: null,
  relatedMINTModels: [],
  supportingDocuments: []
};

const openTicketMock = {
  request: {
    query: GetCtatRequestDocument,
    variables: { id: ticketId }
  },
  result: {
    data: {
      ctatRequest: {
        ...baseTicket,
        status: CtatStatus.NEW
      }
    }
  }
};

const openAdminTicketMock = {
  ...openTicketMock,
  request: {
    query: GetCtatRequestAdminDocument,
    variables: { id: ticketId }
  }
};

const closedTicketMock = {
  request: {
    query: GetCtatRequestDocument,
    variables: { id: ticketId }
  },
  result: {
    data: {
      ctatRequest: {
        ...baseTicket,
        status: CtatStatus.CLOSED,
        notes: 'Working on data security language.',
        resolution: 'Drafted a legally sound document.',
        assignedAdminUserAccount: {
          __typename: 'UserAccount' as const,
          username: 'MWIN',
          givenName: 'Mace',
          familyName: 'Windu',
          commonName: 'Mace Windu',
          email: 'mace.windu@cms.hhs.gov'
        }
      }
    }
  }
};

const closedAdminTicketMock = {
  ...closedTicketMock,
  request: {
    query: GetCtatRequestAdminDocument,
    variables: { id: ticketId }
  }
};

const adminListMock = {
  request: {
    query: GetCtatRequestsAdminDocument
  },
  result: {
    data: {
      ctatRequestsAdmin: {
        __typename: 'CTATRequestsTableData',
        count: 1,
        ctatRequests: [
          {
            __typename: 'CTATRequest',
            id: ticketId,
            humanReadableID: 'CTAT-001',
            createdDts: '2026-05-02T00:00:00Z',
            contractName: null,
            typeOfHelpNeeded: [CtatHelpNeededType.DATA_USE_AGREEMENT_DUA],
            typeOfHelpNeededOther: null,
            status: CtatStatus.NEW,
            assignedAdminUserAccount: null
          }
        ]
      }
    }
  }
};

const emptyDiscussionsMock = {
  request: {
    query: GetCtatDiscussionsDocument,
    variables: { ticketID: ticketId }
  },
  result: {
    data: { discussions: [] }
  }
};

const renderPanel = (
  mocks: MockedResponse[],
  {
    isAdmin = false,
    closeModal = vi.fn(),
    discussionsMock = emptyDiscussionsMock
  }: {
    isAdmin?: boolean;
    closeModal?: () => void;
    discussionsMock?: MockedResponse;
  } = {}
) => {
  const router = createMemoryRouter(
    [
      {
        path: '/help-and-knowledge/contract-assistance/:ticketId',
        element: (
          <CtatTicketViewPanel
            ticketId={ticketId}
            closeModal={closeModal}
            isAdmin={isAdmin}
          />
        )
      }
    ],
    {
      initialEntries: [`/help-and-knowledge/contract-assistance/${ticketId}`]
    }
  );

  return setup(
    <MockedProvider mocks={[...mocks, discussionsMock]}>
      <RouterProvider router={router} />
    </MockedProvider>
  );
};

describe('CtatTicketViewPanel', () => {
  it('renders open ticket with blue progress box and what happens next', async () => {
    renderPanel([openTicketMock], { isAdmin: false });

    await waitFor(() => {
      expect(screen.getByText('CTAT-001')).toBeInTheDocument();
    });

    expect(
      screen.getByText('Ticket progress and resolution')
    ).toBeInTheDocument();
    expect(screen.getByText('Not assigned yet')).toBeInTheDocument();
    expect(screen.queryByText('Progress notes')).not.toBeInTheDocument();
    expect(screen.queryByText('No notes added')).not.toBeInTheDocument();
    expect(screen.getByText('No resolution added')).toBeInTheDocument();
    expect(screen.getByText('What happens next?')).toBeInTheDocument();
    expect(await screen.findByText('0 messages')).toBeInTheDocument();
    expect(screen.getByText('Latest message: No messages yet')).not.toHaveClass(
      'text-italic'
    );
    expect(
      screen.queryByText(/^This ticket is closed/)
    ).not.toBeInTheDocument();

    const progressBox = screen
      .getByText('Ticket progress and resolution')
      .closest('div');
    expect(progressBox).toHaveClass('bg-primary-lighter');
  });

  it.each([
    {
      latestDate: () => DateTime.local().minus({ weeks: 2 }).toISO(),
      expectedDate: '2 weeks ago'
    },
    {
      latestDate: () =>
        DateTime.local()
          .set({ hour: 15, minute: 42, second: 0, millisecond: 0 })
          .toISO(),
      expectedDate: 'today at 03:42 PM'
    },
    {
      latestDate: () => DateTime.local().minus({ months: 1 }).toISO(),
      expectedDate: '1 month ago'
    },
    {
      latestDate: () => DateTime.local().minus({ months: 2 }).toISO(),
      expectedDate: '2 months ago'
    },
    {
      latestDate: () => DateTime.local().minus({ years: 1 }).toISO(),
      expectedDate: '1 year ago'
    },
    {
      latestDate: () => DateTime.local().minus({ years: 2 }).toISO(),
      expectedDate: '2 years ago'
    },
    {
      latestDate: () => DateTime.local().minus({ years: 9 }).toISO(),
      expectedDate: '9 years ago'
    },
    {
      latestDate: () => DateTime.local().minus({ years: 10 }).toISO(),
      expectedDate: '1 decade ago'
    },
    {
      latestDate: () => DateTime.local().minus({ years: 20 }).toISO(),
      expectedDate: '2 decades ago'
    },
    {
      now: '2026-11-01T12:00:00',
      latestDate: () => DateTime.local().minus({ days: 1 }).toISO(),
      expectedDate: 'yesterday'
    },
    {
      now: '2026-01-01T12:00:00',
      latestDate: () => DateTime.local().minus({ days: 1 }).toISO(),
      expectedDate: 'yesterday'
    }
  ])(
    'shows the count and latest poster with $expectedDate',
    async ({ now, latestDate, expectedDate }) => {
      if (now) Settings.now = () => new Date(now).getTime();
      const postedDate = latestDate();
      const olderDate = DateTime.fromISO(postedDate ?? '')
        .minus({ years: 1 })
        .toISO();
      const discussionsMock = {
        request: emptyDiscussionsMock.request,
        result: {
          data: {
            discussions: [
              {
                __typename: 'CTATDiscussion',
                id: '660e8400-e29b-41d4-a716-446655440001',
                ticketID: ticketId,
                content: 'Latest message',
                posterRole: CtatDiscussionPoster.ADMIN,
                createdBy: '770e8400-e29b-41d4-a716-446655440002',
                createdByUserAccount: {
                  __typename: 'UserAccount',
                  givenName: 'Jane',
                  familyName: 'Smith'
                },
                createdDts: postedDate
              },
              {
                __typename: 'CTATDiscussion',
                id: '880e8400-e29b-41d4-a716-446655440003',
                ticketID: ticketId,
                content: 'Earlier message',
                posterRole: CtatDiscussionPoster.REQUESTER,
                createdBy: '990e8400-e29b-41d4-a716-446655440004',
                createdByUserAccount: {
                  __typename: 'UserAccount',
                  givenName: 'Luke',
                  familyName: 'Skywalker'
                },
                createdDts: olderDate
              }
            ]
          }
        }
      };

      renderPanel([openTicketMock], { discussionsMock });

      expect(await screen.findByText('2 messages')).toBeInTheDocument();
      expect(
        screen.getByText(`Latest message: Jane Smith, ${expectedDate}`)
      ).toBeInTheDocument();
      expect(
        screen.queryByText('Latest message: No messages yet')
      ).not.toBeInTheDocument();
    }
  );

  it('shows a spinner while discussions load inside the ticket', async () => {
    renderPanel([openTicketMock], {
      discussionsMock: { ...emptyDiscussionsMock, delay: 500 }
    });

    await screen.findByText('CTAT-001');
    expect(
      screen.getByRole('progressbar', { name: 'Loading discussion…' })
    ).toBeInTheDocument();
    expect(await screen.findByText('0 messages')).toBeInTheDocument();
  });

  it('renders downloadable supporting documents when virus scan is clean', async () => {
    const ticketWithDocumentMock = {
      request: {
        query: GetCtatRequestDocument,
        variables: { id: ticketId }
      },
      result: {
        data: {
          ctatRequest: {
            ...baseTicket,
            status: CtatStatus.NEW,
            supportingDocuments: [
              {
                __typename: 'CTATRequestDocument' as const,
                id: '660e8400-e29b-41d4-a716-446655440001',
                fileName: 'dua-draft.pdf',
                fileType: 'application/pdf',
                url: null,
                downloadUrl: 'https://example.com/dua-draft.pdf',
                virusScanned: true,
                virusClean: true
              }
            ]
          }
        }
      }
    };

    renderPanel([ticketWithDocumentMock]);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'dua-draft.pdf' })
      ).toBeInTheDocument();
    });
  });

  it('opens View model in MINT links in a new tab', async () => {
    const modelId = '770e8400-e29b-41d4-a716-446655440002';
    const ticketWithModelMock = {
      request: {
        query: GetCtatRequestDocument,
        variables: { id: ticketId }
      },
      result: {
        data: {
          ctatRequest: {
            ...baseTicket,
            status: CtatStatus.NEW,
            relatedMINTModels: [
              {
                __typename: 'ModelPlan' as const,
                id: modelId,
                modelName: 'Test Model'
              }
            ]
          }
        }
      }
    };

    renderPanel([ticketWithModelMock], { isAdmin: false });

    await waitFor(() => {
      expect(
        screen.getByRole('link', { name: 'View model in MINT' })
      ).toHaveAttribute('target', '_blank');
    });

    expect(
      screen.getByRole('link', { name: 'View model in MINT' })
    ).toHaveAttribute('rel', 'noopener noreferrer');
    expect(
      screen.getByRole('link', { name: 'View model in MINT' })
    ).toHaveAttribute('href', `/models/${modelId}/collaboration-area`);
  });

  it('renders closed ticket with grey progress box and no what happens next', async () => {
    renderPanel([closedTicketMock], { isAdmin: false });

    await waitFor(() => {
      expect(screen.getByText('Closed')).toBeInTheDocument();
    });

    expect(
      screen.queryByText('Working on data security language.')
    ).not.toBeInTheDocument();
    expect(
      screen.getByText('Drafted a legally sound document.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Mace Windu (mace.windu@cms.hhs.gov)')
    ).toBeInTheDocument();
    expect(screen.queryByText('What happens next?')).not.toBeInTheDocument();
    expect(await screen.findByText('0 messages')).toBeInTheDocument();
    expect(
      screen.getByText(/^This ticket is closed/).closest('.usa-alert')
    ).toHaveClass('usa-alert--info');

    const progressBox = screen
      .getByText('Ticket progress and resolution')
      .closest('div');
    expect(progressBox).toHaveClass('bg-base-lighter');
  });

  it('renders admin editable form with save footer for assessment users', async () => {
    renderPanel([openAdminTicketMock], { isAdmin: true });

    await waitFor(() => {
      expect(screen.getByTestId('ctat-admin-status')).toBeInTheDocument();
    });

    expect(screen.getByText('Assigned admin team member')).toBeInTheDocument();
    expect(screen.getByText('Progress notes')).toBeInTheDocument();
    expect(screen.getByText('Resolution')).toBeInTheDocument();
    expect(
      document.getElementById('ctat-admin-progress-notes')
    ).toBeInTheDocument();
    expect(
      document.getElementById('ctat-admin-resolution')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();
    expect(screen.queryByText('Not assigned yet')).not.toBeInTheDocument();
    expect(screen.queryByText('What happens next?')).not.toBeInTheDocument();
  });

  it('renders blue admin progress box for open tickets', async () => {
    renderPanel([openAdminTicketMock], { isAdmin: true });

    await waitFor(() => {
      expect(screen.getByTestId('ctat-admin-status')).toBeInTheDocument();
    });

    const progressBox = screen
      .getByText('Ticket progress and resolution')
      .closest('div');
    expect(progressBox).toHaveClass('bg-primary-lighter');
  });

  it('renders grey admin progress box for closed tickets', async () => {
    renderPanel([closedAdminTicketMock], { isAdmin: true });

    await waitFor(() => {
      expect(screen.getByTestId('ctat-admin-status')).toBeInTheDocument();
    });

    const progressBox = screen
      .getByText('Ticket progress and resolution')
      .closest('div');
    expect(progressBox).toHaveClass('bg-base-lighter');
  });

  it('enables save and closes panel after successful admin update', async () => {
    const closeModal = vi.fn();

    const adminUpdateMock = {
      request: {
        query: AdminUpdateCtatRequestDocument,
        variables: {
          id: ticketId,
          changes: {
            notes: 'Updated notes'
          }
        }
      },
      result: {
        data: {
          adminUpdateCTATRequest: {
            __typename: 'CTATRequest',
            id: ticketId,
            humanReadableID: 'CTAT-001',
            status: CtatStatus.NEW,
            notes: 'Updated notes',
            resolution: null,
            assignedAdminUserAccount: null
          }
        }
      }
    };

    const { user } = renderPanel(
      [
        openAdminTicketMock,
        adminUpdateMock,
        openAdminTicketMock,
        adminListMock
      ],
      { isAdmin: true, closeModal }
    );

    await waitFor(() => {
      expect(
        document.getElementById('ctat-admin-progress-notes')
      ).toBeInTheDocument();
    });

    const saveButton = screen.getByRole('button', { name: 'Save changes' });
    expect(saveButton).toBeDisabled();

    const notesField = document.getElementById(
      'ctat-admin-progress-notes'
    ) as HTMLTextAreaElement;
    await user.type(notesField, 'Updated notes');

    await waitFor(() => {
      expect(saveButton).toBeEnabled();
    });

    await user.click(saveButton);

    await waitFor(() => {
      expect(closeModal).toHaveBeenCalled();
    });
  });
});
