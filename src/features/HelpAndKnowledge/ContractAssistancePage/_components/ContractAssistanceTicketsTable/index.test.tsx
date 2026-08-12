import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { CtatStatus } from 'gql/generated/graphql';
import setup from 'tests/util';
import { vi } from 'vitest';

import { ContractAssistanceTicket } from '../../constants';

import ContractAssistanceTicketsTable from './index';

const tickets: ContractAssistanceTicket[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    ticketId: 'CTAT-001',
    submissionDate: '05/02/2026',
    contractName: 'Home Health Learning',
    cmmiGroupAcronym: 'PCMG',
    helpType: 'Data Use Agreement (DUA)',
    statusCode: CtatStatus.NEW,
    assigneeId: null,
    assigneeName: null
  }
];

describe('ContractAssistanceTicketsTable', () => {
  it('calls onTicketClick when ticket ID is clicked', () => {
    const handleTicketClick = vi.fn();

    setup(
      <ContractAssistanceTicketsTable
        tickets={tickets}
        variant="user"
        onTicketClick={handleTicketClick}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'CTAT-001' }));

    expect(handleTicketClick).toHaveBeenCalledWith(tickets[0]);
  });

  it('navigates with UUID when wired with navigate handler', async () => {
    const mockNavigate = vi.fn();

    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/contract-assistance',
          element: (
            <ContractAssistanceTicketsTable
              tickets={tickets}
              variant="user"
              onTicketClick={ticket => {
                mockNavigate(
                  `/help-and-knowledge/contract-assistance/${ticket.id}`
                );
              }}
            />
          )
        }
      ],
      { initialEntries: ['/help-and-knowledge/contract-assistance'] }
    );

    setup(
      <MockedProvider mocks={[]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'CTAT-001' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        '/help-and-knowledge/contract-assistance/550e8400-e29b-41d4-a716-446655440000'
      );
    });
  });

  it('renders the CMMI group column for admin tickets', () => {
    setup(<ContractAssistanceTicketsTable tickets={tickets} variant="admin" />);

    expect(
      screen.getByRole('columnheader', { name: /CMMI group/i })
    ).toBeInTheDocument();
    expect(screen.getByText('PCMG')).toBeInTheDocument();
  });

  it('does not render the CMMI group column for user tickets', () => {
    setup(<ContractAssistanceTicketsTable tickets={tickets} variant="user" />);

    expect(
      screen.queryByRole('columnheader', { name: 'CMMI group' })
    ).not.toBeInTheDocument();
  });
});
