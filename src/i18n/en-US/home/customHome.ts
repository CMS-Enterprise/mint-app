import { ViewCustomizationType } from 'gql/generated/graphql';

export type HomepageSettingsType = Record<
  ViewCustomizationType,
  Record<string, string>
>;

const settings: HomepageSettingsType = {
  [ViewCustomizationType.MY_MODEL_PLANS]: {
    heading: 'My Model Plans',
    description:
      'You have been added as a team member to the model plans below.',
    noResultsHeading: 'You haven’t been added to any Model Plans yet.',
    noResultsDescription:
      'Once you create one or are added as a team member to an existing plan, it will appear here.'
  },
  [ViewCustomizationType.ALL_MODEL_PLANS]: {
    heading: 'All Model Plans',
    noResultsHeading: 'There are no model plans in MINT yet.',
    noResultsDescription: 'Once a plan is created, it will appear here.'
  },
  [ViewCustomizationType.FOLLOWED_MODELS]: {
    heading: 'Models you’re following',
    description:
      'You will receive email notifications when models you’re following are updated.',
    noResultsHeading: 'You are not following any models yet.',
    noResultsDescription:
      'To follow a model, <link1>view all models</link1> and click the star icon (<star></star>) for any model to add it to this section.'
  },
  [ViewCustomizationType.MODELS_WITH_CR_TDL]: {
    heading: 'Models with FFS CRs or TDLs',
    description:
      'View all of the models that contain Fee-for-Service (FFS) Change Requests (CRs) and Technical Direction Letters (TDLs).',
    noResultsHeading:
      'There are no model plans in FFS CRs or TDLs in MINT yet.',
    noResultsDescription:
      'Once a FFS CR or TDL plan is created, it will appear here.'
  },
  [ViewCustomizationType.MODELS_APPROACHING_CLEARANCE]: {
    heading: 'Models approaching clearance',
    description:
      'These models are scheduled for clearance within the next six months.',
    noResultsHeading: 'There are no Models approaching clearance.',
    noResultsDescription: 'Check back later.'
  },
  [ViewCustomizationType.MODELS_BY_OPERATIONAL_SOLUTION]: {
    heading: 'Models using specific operational solutions',
    description:
      'This tabbed section displays the models using the operational solutions you care about.',
    noResultsHeading:
      'It looks like you forgot to select at least one operational solution.',
    noResultsDescription: 'Select solutions'
  }
};

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
  settings,
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
    empty: {
      heading: 'You haven’t been added to any Model Plans yet.',
      body: 'Once you create one or are added as a team member to an existing plan, it will appear here.'
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
      crTDLs: 'FFS CRs and TDLs',
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
  customizeHomepage: 'Did you know you can customize this page?',
  solutionCard: {
    status: 'Status',
    category: 'Category',
    startDate: 'Start date',
    endDate: 'End date',
    tbd: 'To be determined'
  },
  noModelSolutionHeading:
    'There is no record of any models using this solution.',
  noModelSolutionDescription:
    'If you believe this is an error, please <report>report a problem</report> or email the MINT Team at <email>MINTTeam@cms.hhs.gov</email>.',
  solutionStatus: {
    total: 'Total',
    planned: 'Planned',
    active: 'Active',
    ended: 'Ended'
  }
};

export default customHome;
