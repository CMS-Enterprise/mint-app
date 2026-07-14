const contractAssistance = {
  hkcHeading: 'Contract assistance',
  hkcDescription:
    'Need contract-related help for your model? Raise a ticket to get help from the Contract Technical Assistance Team (CTAT). CTAT can assist with a variety of contracting needs including requirements gathering, Independent Government Cost Estimate (IGCE) preparation, Requests for Proposal (RFPs), guidance on market research, and more.',
  hkcJumpToLabel: 'Contract assistance',
  hkcViewCta: 'Create and manage help tickets',
  description:
    'The Contract Technical Assistance Team (CTAT) can help with a variety of contracting needs and activities in pre-award and post-award timeframes.',
  dccsDescription:
    'For additional acquisition support and guidance, visit the DCCS Contract Summary Page, which provides acquisition support for both pre-award and post-award activities, including documents, templates, and resources.',
  dccsLinkText: 'Visit the DCCS Contract Summary Page on SharePoint',
  table: {
    ticketId: 'Ticket ID',
    submissionDate: 'Submission date',
    cmmiGroup: 'CMMI group',
    contractName: 'Contract name',
    helpType: 'Help type',
    status: 'Status',
    noContractName: 'No contract name added'
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

  ctatViewPanel: {
    submittedOn: 'Submitted on {{date}}',
    progressHeading: 'Ticket progress and resolution',
    ticketDetailsHeading: 'Ticket details',
    assignedMember: 'Assigned contract assistance team member',
    progressNotes: 'Progress notes',
    resolution: 'Resolution',
    uploadedDocuments: 'Uploaded documents',
    viewModelInMint: 'View model in MINT',
    empty: {
      notAssigned: 'Not assigned yet',
      noNotes: 'No notes added',
      noResolution: 'No resolution added',
      noModel: 'No model added',
      noContractActivityType: 'No contract activity type added',
      noContractName: 'No contract name added',
      noContractNumber: 'No contract number added',
      noContractType: 'No contract type added',
      noDocuments: 'No documents added'
    }
  },

  ctatAdminPanel: {
    assignedMember: {
      label: 'Assigned admin team member',
      hint: 'Look up the admin team member you wish to assign this ticket to. You may look up by name or EUA ID.'
    },
    progressNotes: {
      hint: 'Add any notes about your progress on this ticket. Once saved, these notes are viewable by the requester, who will receive an email update alerting them to your changes.'
    },
    resolution: {
      hint: 'Document the final outcome of this ticket. Once saved, this resolution is viewable by the requester, who will receive an email update alerting them to the new resolution.'
    },
    saveChanges: 'Save changes',
    success:
      'You have updated a contract assistance ticket (<bold>{{ticketId}}</bold>).',
    error:
      'There was an error saving your changes. Please try again. If the error persists, please try again another time.',
    leaveConfirm: {
      description:
        'You have made changes that will not be saved if you navigate away from this view.'
    }
  },

  ctatSidePanel: {
    modalHeading: 'Contract assistance ticket',
    allFieldsRequired:
      'Fields marked with an asterisk ( <s>*</s> ) are required.',
    newTicketHeading: 'New ticket',
    submitTicket: 'Submit ticket',
    cancel: 'Cancel',
    success:
      'You submitted a new contract assistance ticket (<bold>{{ticketId}}</bold>).',
    error:
      'There was an error submitting your ticket. Please try again. If the error persists, please try again another time.',
    validation: {
      fillOut: 'Please fill out the required field.'
    },
    leaveConfirm: {
      heading: 'Are you sure you want to leave?',
      description:
        'You have unsaved changes. If you leave, your changes will not be saved.',
      confirm: 'Leave without saving',
      dontLeave: 'Stay on page'
    },
    fields: {
      requester: {
        label: 'Requester',
        hint: 'This field is automatically populated based on your MINT user account.'
      },
      cmmiGroup: {
        label: 'CMMI group',
        selectDefault: '-Select-',
        otherLabel: 'Describe other',
        otherHint: 'Please describe your "Other" CMMI group.'
      },
      cmmiDivision: {
        label: 'CMMI division',
        hint: 'Select your CMMI group before selecting your division.',
        selectDefault: '-Select-',
        otherLabel: 'Describe other',
        otherHint: 'Please describe your "Other" division.'
      },
      modelOrDemonstration: {
        label: 'Model or demonstration',
        hint: 'If applicable, select the model(s) associated with this assistance request. Only models listed in MINT will appear in this list. Select all that apply.'
      },
      contractActivityType: {
        label: 'Contract activity type',
        selectDefault: '-Select-',
        otherLabel: 'Describe other',
        otherHint: 'Please describe your "Other" contract activity type.'
      },
      contractName: {
        label: 'Contract name'
      },
      contractNumber: {
        label: 'Contract number (if applicable)'
      },
      contractType: {
        label: 'Contract type',
        selectDefault: '-Select-',
        otherLabel: 'Describe other',
        otherHint: 'Please describe your "Other" contract type.'
      },
      helpNeededType: {
        label: 'Type of help needed',
        hint: 'Select all that apply.'
      },
      assistanceDescription: {
        label: 'Describe the type of assistance you need.',
        hint: 'Add additional detail about the help you need. If you selected "Other" in the previous question, please explain.',
        charactersAllowed: '500 characters allowed'
      },
      requestUrgency: {
        label: 'Request urgency',
        selectDefault: '-Select-'
      },
      assistanceNeededBy: {
        label: 'When do you need assistance by?',
        hint: 'mm/dd/yyyy'
      },
      supportingDocuments: {
        label: 'Supporting documents',
        hint: 'Upload any documentation that will help CTAT better understand your request.'
      },
      other: {
        helpNeededType: 'Please specify the type of help needed'
      }
    },
    whatHappensNext: {
      heading: 'What happens next?',
      intro: 'After you submit your ticket:',
      bullet1:
        'you will receive an automated confirmation email from MINT that includes all the details you shared about your assistance request',
      bullet2:
        'CTAT will assign a team member to your assistance request, and they will work with you to investigate your issue and provide assistance',
      bullet3:
        'you will receive update emails when CTAT updates anything about your ticket in MINT or changes the status',
      bullet4:
        'you may continue to check on the status of your ticket from the contract assistance page in the MINT Help and Knowledge Center'
    }
  }
};

export default contractAssistance;
