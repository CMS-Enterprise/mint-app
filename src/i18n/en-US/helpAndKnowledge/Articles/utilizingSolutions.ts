const utilizingSolutions = {
  title: 'Utilizing available operational solutions',
  description:
    'One model will require several operational solutions to complete the essential functions. This is an overview of timing and activities involved in working with existing systems and services.',
  summaryBox: {
    copy: 'Examples of using an existing solution include:',
    items: [
      { copy: 'Using Salesforce to create a Request for Application website' },
      {
        copy: 'Creating a model-specific application in the Reusable Framework'
      },
      {
        copy: 'Adjusting claims payments in the <ml>Fee-for-Service</ml> systems',
        route: 'shared-systems'
      },
      {
        copy: 'Modifying the <ml>Health Plan Management System</ml> to capture information from Accountable Care Organizations (ACOs)',
        route: 'health-plan-management-system'
      }
    ]
  },
  timingSteps: {
    heading: 'Timing',
    description: `The business and system owners of existing systems each determine the timelines for the relevant systems. The IT Lead will assist model teams in understanding and following the release calendar of each system. The timeline below outlines a hypothetical release calendar. All systems are different. The IT Lead will document key dates in the model-to-operations matrix (MTO).

        <link1>Learn more about creating a model-to-operations matrix (MTO)
        <iconForward /></link1>`,
    subHeading: 'Hypothetical Release Calendar',
    items: [
      {
        heading: '<bold>June</bold> (6 months out)',
        description:
          'Deadline to submit Change Requests and Prioritize Release Content'
      },
      {
        heading: '<bold>July</bold> (5.5 months out)',
        description:
          'Deadline for Contractor to Respond with Candidate Release Plan and Level of Effort estimate'
      },
      {
        heading: '<bold>August</bold> (5 months out)',
        description: 'Scope Baseline Defined '
      },
      {
        heading: '<bold>October</bold> (2.5 months out)',
        description: 'Requirements Completed'
      },
      {
        heading: '<bold>December</bold> (3 weeks out)',
        description: 'User Acceptance Testing Started'
      },
      {
        heading: '<bold>December</bold>',
        description: 'Go Live'
      }
    ]
  },
  helpBox: {
    heading: 'Need timelines for a specific system or service?',
    description:
      '<link1>Check out the operational solutions</link1> listed in the Help and Knowledge Center for more information.'
  },
  activitySteps: {
    heading: 'Activities involved',
    description: `The timeline below describes the typical activities for using an existing system. Each CMS system has a unique process for accepting and implementing new requirements. The table below provides the general CMS process as guidance for model teams. However, teams will need to follow the specific procedures of each system. The IT Lead will assist model teams with this. The IT Lead will use the MTO to document the operational solutions and IT systems a model plans to use. MINT users may also browse all available solutions and IT systems within the operational solutions area of MINT’s Help and Knowledge Center.
      
        <link1>Learn more about creating a model-to-operations matrix (MTO)</link1>
        <link2>Browse available operational solutions</link2>
      `,
    subHeading: 'Typical activities for using an existing system',
    items: [
      {
        heading: 'Complete intake with the relevant system',
        description: `(Onboarding Request, Change Request, etc.)
          
          <bold>Who:</bold> Model Team / IT Lead`
      },
      {
        heading:
          'Complete Impact Assessment and Level of Effort (LOE) Estimate ',
        description: '<bold>Who:</bold> Contractor'
      },
      {
        heading: 'Evaluate Impact Assessment/LOE and schedule into release',
        description: '<bold>Who:</bold> System Team'
      },
      {
        heading: 'Complete Security Impact Assessment',
        description: '<bold>Who:</bold> ISSO'
      },
      {
        heading: 'Complete release development and testing',
        description: '<bold>Who:</bold> Contractor'
      },
      {
        heading: 'Conduct User Acceptance Testing',
        description: '<bold>Who:</bold> Model Team'
      },
      {
        heading: 'Implement the release',
        description: '<bold>Who:</bold> Contractor'
      }
    ]
  },
  helpBox2: {
    heading:
      'Did you know you can track the status for your operational solutions within MINT?',
    description:
      'Model teams should work with their IT Lead to complete the model-to-operations matrix (MTO) for their model to stay organized.'
  }
};

export default utilizingSolutions;
