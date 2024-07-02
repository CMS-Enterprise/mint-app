const customHome = {
  title: 'Welcome to MINT',
  subheading:
    'The place to collaborate on new CMMI models and demonstrations and access resources to assist with your model plans.',
  macSubheading:
    'The place to learn about upcoming CMMI models and demonstrations.',
  signIn: 'Sign in to start',
  mintPurpose: 'You can use MINT to:',
  previously: 'previously ',
  viewMore: 'View {{-number}} more',
  viewLess: 'View less',
  more: 'more',
  mintTasks: [
    'collaborate on requirements for new CMMI models and demonstrations',
    'access resources to help you complete your model plans'
  ],
  newModelSummaryBox: {
    copy: 'Have a new model or demonstration?',
    cta: 'Start a new Model Plan'
  },
  allModels: {
    copy: 'Don’t see the model you’re looking for?',
    cta: 'View all models',
    heading: 'All models',
    subheading:
      'Follow models that you want to stay up to date on by clicking the star icon.',
    noResults: {
      heading: 'We couldn’t find any matches for "{{-searchTerm}}".',
      subheading:
        'Double check your search for typos or try a different search.'
    }
  },
  yourModels: 'You have been added as a team member to the model plans below.',
  fetchError: 'There was an error fetching models plans.  Please try again.',
  downloadAllCSV: 'Download all plans as CSV',
  downloadSingleCSV: 'Download this Model Plan (CSV)',
  requestsTable: {
    id: 'model-plans',
    title: 'Model plans',
    basic: {
      heading: 'My model plans',
      subheading:
        'You have been added as a team member to the model plans below.'
    },
    admin: {
      heading: 'All model plans'
    },
    mac: {
      heading: 'Upcoming models',
      empty: {
        heading: 'There aren’t any model plans with CRs or TDLs.',
        body:
          'Check back later. When CR or TDL is added to a model plan, it will appear here.'
      }
    },
    empty: {
      heading: 'You haven’t been added to any Model Plans yet.',
      body:
        'Once you create one or are added as a team member to an existing plan, it will appear here.'
    },
    caption:
      'Below is a list of governance requests that are in draft or submitted.',
    headers: {
      name: 'Model name',
      category: 'Category',
      abbreviation: 'Short name',
      amsModelID: 'ID',
      modelPoc: 'Model lead(s)',
      clearanceDate: 'Anticipated clearance date',
      startDate: 'Model start date',
      paymentDate: 'Payment start date',
      keyCharacteristics: 'Key characteristics',
      demoCode: 'Demo code',
      crTDLs: 'CRs and TDLs',
      status: 'Status',
      recentActivity: 'Recent activity'
    },
    noneSelectedYet: 'None selected yet',
    tbd: 'To be determined',
    updated: 'Updated',
    unansweredQuestion: 'unanswered question',
    answeredQuestion: 'answered question'
  },
  emptyHome: 'Your homepage looks a little empty.',
  editHomepage: 'Edit homepage settings',
  customizeHomepage: 'Did you know you can customize this page?'
};

export default customHome;
