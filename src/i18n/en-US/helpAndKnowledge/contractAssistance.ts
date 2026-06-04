const contractAssistance = {
  hkcHeading: 'Contract assistance',
  hkcDescription:
    'Need contract-related help for your model? Raise a ticket to get help from the Contract Technical Assistance Team (CTAT). CTAT can assist with a variety of contracting needs including requirements gathering, Independent Government Cost Estimate (IGCE) preparation, Requests for Proposal (RFPs), guidance on market research, and more.',
  hkcJumpToLabel: 'Contract assistance',
  hkcViewCta: 'Create and manage help tickets',
  description:
    'The Contract Technical Assistance Team (CTAT) can help with a variety of contracting needs and activities in pre-award and post-award timeframes.',
  table: {
    ticketId: 'Ticket ID',
    submissionDate: 'Submission date',
    contractName: 'Contract name',
    helpType: 'Help type',
    status: 'Status'
  },
  adminActions: {
    title: 'Admin ticket management',
    emptyState: {
      all: {
        title: 'There are no submitted help tickets.',
        copy: 'Once a MINT user submits a request for contract assistance, it will appear here.'
      },
      open: {
        title: 'There are no open help tickets.',
        copy: 'Once a MINT user submits a request for contract assistance, it will appear here until work is complete and it is closed. You may choose another option above to see a different subset of submitted contract assistance tickets.'
      },
      unassigned: {
        title: 'There are no unassigned help tickets.',
        copy: 'Once a MINT user submits a request for contract assistance, it will appear here until assigned. You may choose another option above to see a different subset of submitted contract assistance tickets.'
      },
      myTickets: {
        title: 'You have no help tickets assigned to you.',
        copy: 'Any contract assistance tickets assigned to you will appear here. To see a different subset of submitted contract assistance tickets, choose another option above. You may assign any unassigned tickets to yourself.'
      },
      closed: {
        title: 'There are no closed help tickets.',
        copy: 'Once work is completed for a contract assistance ticket and it is closed, it will appear here. You may choose another option above to see a different subset of submitted contract assistance tickets.'
      }
    },
    table: {
      caption: 'Contract assistance help tickets'
    },
    tabs: {
      all: 'All tickets ({{count}})',
      open: 'Open tickets ({{count}})',
      unassigned: 'Unassigned tickets ({{count}})',
      myTickets: 'My assigned tickets ({{count}})',
      closed: 'Closed tickets ({{count}})'
    }
  },
  userSubmittedTickets: {
    title: 'My submitted help tickets',
    description:
      'Use the button below to start a new contract assistance ticket.',
    button: 'Create a new ticket',
    emptyState: {
      title: 'You have not submitted any help tickets.',
      copy: 'Use the button above to create a new ticket and request contract assistance from CTAT.'
    },
    table: {
      caption: 'Your contract assistance help tickets'
    }
  },
  ctatSidePanel: {
    heading: 'Contract assistance ticket'
  }
};

export default contractAssistance;
