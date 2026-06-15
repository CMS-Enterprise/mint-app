import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { screen, waitFor } from '@testing-library/react';
import {
  AdminUpdateCtatRequestDocument,
  CtatcmmiGroupOption,
  CtatHelpNeededType,
  CtatRequestUrgency,
  CtatStatus,
  GetCtatRequestDocument,
  GetCtatRequestsAdminDocument
} from 'gql/generated/graphql';
import setup from 'tests/util';
import { vi } from 'vitest';

import CtatTicketViewPanel from './index';

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

const adminListMock = {
  request: {
    query: GetCtatRequestsAdminDocument
  },
  result: {
    data: {
      ctatRequestsAdmin: {
        __typename: 'CTATRequestsTableDataAdmin',
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

const renderPanel = (
  mocks: MockedResponse[],
  {
    isAdmin = false,
    closeModal = vi.fn()
  }: { isAdmin?: boolean; closeModal?: () => void } = {}
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
    <MockedProvider mocks={mocks}>
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
    expect(screen.getByText('No notes added')).toBeInTheDocument();
    expect(screen.getByText('No resolution added')).toBeInTheDocument();
    expect(screen.getByText('What happens next?')).toBeInTheDocument();

    const progressBox = screen
      .getByText('Ticket progress and resolution')
      .closest('div');
    expect(progressBox).toHaveClass('bg-primary-lighter');
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

  it('renders closed ticket with grey progress box and no what happens next', async () => {
    renderPanel([closedTicketMock], { isAdmin: false });

    await waitFor(() => {
      expect(screen.getByText('Closed')).toBeInTheDocument();
    });

    expect(
      screen.getByText('Working on data security language.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Drafted a legally sound document.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Mace Windu (mace.windu@cms.hhs.gov)')
    ).toBeInTheDocument();
    expect(screen.queryByText('What happens next?')).not.toBeInTheDocument();

    const progressBox = screen
      .getByText('Ticket progress and resolution')
      .closest('div');
    expect(progressBox).toHaveClass('bg-base-lighter');
  });

  it('renders admin editable form with save footer for assessment users', async () => {
    renderPanel([openTicketMock], { isAdmin: true });

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
  });

  it('renders blue admin progress box for open tickets', async () => {
    renderPanel([openTicketMock], { isAdmin: true });

    await waitFor(() => {
      expect(screen.getByTestId('ctat-admin-status')).toBeInTheDocument();
    });

    const progressBox = screen
      .getByText('Ticket progress and resolution')
      .closest('div');
    expect(progressBox).toHaveClass('bg-primary-lighter');
  });

  it('renders grey admin progress box for closed tickets', async () => {
    renderPanel([closedTicketMock], { isAdmin: true });

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
      [openTicketMock, adminUpdateMock, openTicketMock, adminListMock],
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
