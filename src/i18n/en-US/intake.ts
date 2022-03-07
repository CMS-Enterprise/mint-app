const intake = {
  fields: {
    projectName: 'Project name',
    requester: 'Requester',
    submissionDate: 'Submission date',
    requestFor: 'Request for',
    component: 'Component',
    grtDate: 'GRT Date',
    grbDate: 'GRB Date',
    adminLead: 'Admin Lead',
    status: 'Status',
    fundingNumber: 'Funding number',
    businessOwner: 'Business Owner',
    lcidExpirationDate: 'LCID Expiration Date',
    lastAdminNote: 'Last Admin Note'
  },
  submission: {
    confirmation: {
      heading: 'Your Intake Request has been submitted',
      subheading: 'Your reference ID is {{referenceId}}',
      homeCta: 'Go back to EASi homepage',
      taskListCta: 'Go back to Governance Task List'
    }
  },
  lifecycleId: 'Lifecycle ID',
  statusMap: {
    INTAKE_DRAFT: 'Intake draft',
    INTAKE_SUBMITTED: 'Intake request received',
    NEED_BIZ_CASE: 'Waiting for draft business case',
    BIZ_CASE_DRAFT: 'Waiting for draft business case',
    BIZ_CASE_DRAFT_SUBMITTED: 'Draft business case received',
    BIZ_CASE_CHANGES_NEEDED: 'Waiting for draft business case',
    BIZ_CASE_FINAL_NEEDED: 'Waiting for final business case',
    BIZ_CASE_FINAL_SUBMITTED: 'Final business case received',
    READY_FOR_GRT: 'Ready for GRT meeting',
    READY_FOR_GRB: 'Ready for GRB meeting',
    LCID_ISSUED: 'Lifecycle ID issued',
    WITHDRAWN: 'Withdrawn',
    NOT_IT_REQUEST: 'Closed',
    NOT_APPROVED: 'Business case not approved',
    NO_GOVERNANCE: 'Closed',
    SHUTDOWN_IN_PROGRESS: 'Decomission in progress',
    SHUTDOWN_COMPLETE: 'Decommissioned'
  },
  banner: {
    title: {
      intakeIncomplete: 'Intake request incomplete',
      pendingResponse: 'Pending response',
      startBizCase: 'Start business case',
      bizCaseIncomplete: 'Business case incomplete',
      responseRecevied: 'Response received',
      prepareGrt: 'Prepare for GRT',
      prepareGrb: 'Prepare for GRB',
      decisionReceived: 'Decision received',
      requestWithdrawn: 'Request withdrawn',
      decommissioning: 'Decommission in progress'
    },
    description: {
      intakeIncomplete:
        'Your Intake Request is incomplete, please submit it when you are ready so that we can move you to the next phase.',
      intakeSubmitted:
        'Your Intake Request has been submitted for review. The Governance Admin team will get back to you about the next step.',
      checkNextStep:
        'The Governance Admin team has gotten back to you. Please check and take the next step.',
      bizCaseIncomplete:
        'Your Business Case is incomplete, please submit it when you are ready so that we can move you to the next step.',
      bizCaseSubmitted:
        'Your Business Case has been submitted for review. The Governance Admin team will get back to you about the next step.',
      decommissioning:
        'Follow the decommission guide, complete steps relevant to your system and submit it back to IT_Governance@cms.hhs.gov to officially complete the decommissioning of your system.'
    }
  },
  requestType: {
    new: 'Add a new system',
    recompete: 'Re-compete',
    majorChanges: 'Major change or upgrade',
    shutdown: 'Decommission a system'
  },

  csvHeadings: {
    euaId: 'EUA ID',
    requesterName: 'Requester Name',
    requesterComponent: 'Requester Component',
    businessOwnerName: 'Business Owner Name',
    businessOwnerComponent: 'Business Owner Component',
    productManagerName: 'Product Manager Name',
    productManagerComponent: 'Product Manager Component',
    isso: 'ISSO Name',
    trbCollaborator: 'TRB Collaborator Name',
    oitCollaborator: 'OIT security Collaborator Name',
    eaCollaborator: 'EA Collaborator Name',
    projectName: 'Project Name',
    existingFunding: 'Existing Funding',
    fundingSource: 'Funding Source',
    fundingNumber: 'Funding Number',
    businessNeed: 'Business Need',
    businessSolution: 'Business Solution',
    currentStage: 'Process Status',
    eaSupport: 'EA Support Requested',
    isExpectingCostIncrease: 'Expecting Cost Increase',
    expectedIncreaseAmount: 'Expected Increase Amount',
    existingContract: 'Existing Contract',
    contractors: 'Contractor(s)',
    contractVehicle: 'Contract Vehicle',
    contractStart: 'Period of Performance Start',
    contractEnd: 'Period of Performance End',
    status: 'Status',
    lcidScope: 'LCID Scope',
    lastAdminNote: 'Last Admin Team Note',
    updatedAt: 'Updated At',
    submittedAt: 'Submitted At',
    createdAt: 'Created At',
    decidedAt: 'Decided At',
    archivedAt: 'Archived At',
    adminLead: 'Admin Lead'
  },
  requestTypeForm: {
    heading: 'Make a Request',
    subheading: 'What is this request for?',
    info:
      'If you are not sure send an email to the <1>IT Navigator Mailbox</1> describing your request and a navigator will get back to you.',
    fields: {
      addNewSystem: 'Add a new system',
      majorChanges: 'Major changes or upgrades to an existing system',
      recompete:
        'Re-compete a contract without any changes to systems or services',
      shutdown: 'Decommission a system'
    },
    helpAndGuidance: {
      majorChanges: {
        label: 'What is a major change?',
        para: 'A major change could be any of the following:',
        list: [
          'Moving a system from a physical data center to the cloud',
          'Software platform changes',
          'New system integrations/interconnections',
          'Changes in Major Function Alignments or the Data Categories a system supports'
        ]
      }
    }
  },
  contactDetails: {
    intakeProcessDescription:
      'The EASi System Intake process can guide you through all stages of your project, connecting you with the resources, people and services that you need. Please complete and submit this CMS IT Intake form to engage with the CMS IT Governance review process. This is the first step to receive a CMS IT LifeCycle ID. Upon submission, you will receive an email promptly from the IT_Governance mailbox, and an IT Governance Team member will reach out regarding next steps.',
    heading: 'Contact details',
    requester: 'Requester',
    requesterComponent: 'Requester Component',
    businessOwner: {
      name: 'CMS Business Owner Name',
      helpText:
        'This person owns a line of business related to this request and will champion the request moving forward',
      component: 'CMS Business Owner Component'
    },
    productManager: {
      name: 'CMS Project/Product Manager, or lead',
      helpText:
        'This person may be contacted for follow ups and to understand the state of the contract',
      component: 'CMS Product Manager Component'
    },
    isso: {
      label:
        'Does your project have an Information System Security Officer (ISSO)?',
      helpText:
        'If yes, please tell us the name of your Information System Security Officer so we can get in touch with them',
      name: 'ISSO Name'
    },
    collaboration: {
      label: 'For this request, I have started collaborating/consulting with:',
      helpText: `Please disclose the name of each person you've worked with. This helps us locate any additional information on your request`,
      oneOrMore: '1 or more of the following in OIT (select all that apply)',
      none: 'No one in OIT'
    }
  }
};

export default intake;
