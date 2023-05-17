const landing = {
  mint: 'Model Innovation Tool (MINT)',
  headingPart1: 'Say hello to ',
  headingPart2: 'better planning and collaboration.',
  description:
    'The Model Innovation Tool provides a single source of truth for all upcoming CMMI models and demonstrations that breaks down silos, bringing transparency and awareness across CMS.',
  signIn: 'Sign in to get started',
  bodyHeading: 'Product highlights',
  bodyItem1: {
    heading: 'No more asking around',
    description:
      'Quickly see the implementation status for each model’s operational needs all in one place.'
  },
  bodyItem2: {
    heading: 'Get help where you are',
    description:
      'Say goodbye to buried email threads. Model teams can get feedback and guidance on their model plans right in MINT.'
  },
  bodyItem3: {
    heading: 'Updates delivered right to you',
    description:
      'Follow the upcoming models and demonstrations you care about to receive email notifications when something changes.'
  },
  tableHeaders: ['Operational need', 'Solution', 'Status'],
  table: [
    {
      need: 'Quality performance scores',
      solution: 'Health Data Reporting (HDR)',
      status: 'Onboarding'
    },
    {
      need: 'Recruit participants',
      solution: 'Salesforce Request for Application (RFA)',
      status: 'In progress'
    },
    {
      need: 'Review and score applications',
      solution: 'Salesforce Application Review and Scoring (ARS)',
      status: 'Backlog'
    },
    {
      need: 'Send reports/data to participants',
      solution: 'Internal staff',
      status: 'Not started'
    }
  ],
  emailHeading: 'MINT',
  subHeading: 'The Model Innovation Tool',
  dailyUpdates: 'Your daily updates',
  sampleModel: 'Enhancing Oncology Model',
  bullet1: '3 new documents have been uploaded',
  bullet2: 'Updates to CRs/TDLs',
  viewPlan: 'View this Model Plan in MINT',
  footerHeading: 'Something for everyone',
  footerItems: [
    {
      heading: 'Model Teams and MINT Subject Matter Experts',
      description:
        'Model Teams have a place to collaborate on their models, receive help from the MINT SMEs, and see which tools other models have utilized.'
    },
    {
      heading: 'Leadership and other CMS Components',
      description:
        'Leadership and various SMEs can see what models are coming up and receive updates to stay informed throughout the process.'
    },
    {
      heading: 'MACs and Shared System Maintainers',
      description:
        'Medicare Administrative Contractors and maintainers can see which model a Change Request or Technical Direction Letter applies to, so they can understand more.'
    }
  ],
  access: 'Want access to MINT?',
  email: 'Email <1>MINTTeam@cms.hhs.gov</1> to learn how to get access.'
};

export default landing;
