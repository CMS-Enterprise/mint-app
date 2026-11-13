import React from 'react';
import { createMemoryRouter, RouterProvider, useMatch } from 'react-router-dom';
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
import { DateTime } from 'luxon';
import setup from 'tests/util';
import { vi } from 'vitest';

import CtatTicketPanel from './index';

const ticketId = '550e8400-e29b-41d4-a716-446655440000';
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
    discussionsMock = emptyDiscussionsMock,
    initialEntry = `/help-and-knowledge/contract-assistance/${ticketId}`
  }: {
    isAdmin?: boolean;
    closeModal?: () => void;
    discussionsMock?: MockedResponse;
    initialEntry?: string;
  } = {}
) => {
  const PanelOnRoute = () => {
    const isDiscussionView = !!useMatch(
      '/help-and-knowledge/contract-assistance/:ticketId/discussion'
    );

    return (
      <CtatTicketPanel
        ticketId={ticketId}
        closeModal={closeModal}
        isAdmin={isAdmin}
        isDiscussionView={isDiscussionView}
      />
    );
  };

  const router = createMemoryRouter(
    [
      {
        path: '/help-and-knowledge/contract-assistance/:ticketId',
        element: <PanelOnRoute />,
        children: [{ path: 'discussion', element: null }]
      }
    ],
    {
      initialEntries: [initialEntry]
    }
  );

  return setup(
    <MockedProvider mocks={[...mocks, discussionsMock]}>
      <RouterProvider router={router} />
    </MockedProvider>
  );
};

describe('CtatTicketPanel', () => {
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
    expect(
      screen.getByRole('link', { name: 'Go to discussion' })
    ).toHaveAttribute(
      'href',
      `/help-and-knowledge/contract-assistance/${ticketId}/discussion`
    );
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

  it('shows the count and latest poster from ticket discussions', async () => {
    const postedDate = DateTime.local().minus({ weeks: 2 }).toISO();
    const olderDate = DateTime.local().minus({ weeks: 3 }).toISO();
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

    const { user } = renderPanel([openTicketMock], { discussionsMock });

    expect(await screen.findByText('2 messages')).toBeInTheDocument();
    expect(
      screen.getByText('Latest message: Jane Smith, 2 weeks ago')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Latest message: No messages yet')
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Go to discussion' }));

    expect(await screen.findByText('2 messages')).toHaveClass('text-bold');
    expect(
      screen.queryByText(/^There are not yet any messages/)
    ).not.toBeInTheDocument();
  });

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

  it('confirms before leaving unsaved admin edits for the discussion', async () => {
    const { user } = renderPanel([openAdminTicketMock], { isAdmin: true });

    await screen.findByTestId('ctat-admin-status');
    const notesField = document.getElementById(
      'ctat-admin-progress-notes'
    ) as HTMLTextAreaElement;
    await user.type(notesField, 'Unsaved notes');
    await screen.findByText('0 messages');

    await user.click(screen.getByRole('link', { name: 'Go to discussion' }));

    expect(
      screen.getByText('Are you sure you want to leave?')
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('ctat-discussion-sidepanel')
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Stay on page' }));
    expect(
      screen.queryByText('Are you sure you want to leave?')
    ).not.toBeInTheDocument();
    expect(notesField).toHaveValue('Unsaved notes');

    await user.click(screen.getByRole('link', { name: 'Go to discussion' }));
    await user.click(
      screen.getByRole('button', { name: 'Leave without saving' })
    );

    expect(await screen.findByText('Ticket CTAT-001')).toBeInTheDocument();
    expect(screen.getByTestId('ctat-discussion-sidepanel')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Save changes' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Back' }));

    expect(await screen.findByTestId('ctat-admin-status')).toBeInTheDocument();
    expect(document.getElementById('ctat-admin-progress-notes')).toHaveValue(
      ''
    );
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();
  });

  it('keeps one panel and ticket query while moving between ticket and discussion', async () => {
    const { user } = renderPanel([openTicketMock]);

    await screen.findByText('0 messages');
    const panel = screen.getByTestId('side-panel');

    await user.click(screen.getByRole('link', { name: 'Go to discussion' }));

    expect(await screen.findByText('Ticket CTAT-001')).toBeInTheDocument();
    expect(screen.getByTestId('side-panel')).toBe(panel);
    expect(
      screen.getByRole('heading', { name: 'Back to ticket details' })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Back' }));

    expect(await screen.findByText('0 messages')).toBeInTheDocument();
    expect(screen.getByTestId('side-panel')).toBe(panel);
    expect(
      screen.getByRole('heading', { name: 'Contract assistance ticket' })
    ).toBeInTheDocument();
  });

  it('loads an admin discussion URL directly and returns to ticket details', async () => {
    const { user } = renderPanel([openAdminTicketMock], {
      isAdmin: true,
      initialEntry: `/help-and-knowledge/contract-assistance/${ticketId}/discussion`
    });

    expect(await screen.findByText('Ticket CTAT-001')).toBeInTheDocument();
    expect(screen.getByTestId('ctat-discussion-sidepanel')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Save changes' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Back' }));

    expect(await screen.findByTestId('ctat-admin-status')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();
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
