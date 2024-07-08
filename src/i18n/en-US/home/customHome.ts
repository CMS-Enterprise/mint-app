import { ViewCustomizationType } from 'gql/gen/graphql';

export type HomepageSettingsType = Record<
  ViewCustomizationType,
  Record<'heading' | 'description', string>
>;

const settings: HomepageSettingsType = {
  [ViewCustomizationType.MY_MODEL_PLANS]: {
    heading: 'My Model Plans',
    description:
      'You have been added as a team member to the model plans below.'
  },
  [ViewCustomizationType.ALL_MODEL_PLANS]: {
    heading: 'All Model Plans',
    description: ''
  },
  [ViewCustomizationType.FOLLOWED_MODELS]: {
    heading: 'Models I’m following',
    description:
      'This section shows only the models you’re following (like the one on the Models tab).'
  },
  [ViewCustomizationType.MODELS_WITH_CR_TDL]: {
    heading: 'Models with FFS CRs or TDLs',
    description:
      'View all of the models that contain Fee-for-Service (FFS) Change Requests (CRs) and Technical Direction Letters (TDLs).'
  },
  [ViewCustomizationType.MODELS_BY_OPERATIONAL_SOLUTION]: {
    heading: 'Models using specific operational solutions',
    description:
      'This tabbed section displays the models using the operational solutions you care about.'
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
  mintTasks: [
    'collaborate on requirements for new CMMI models and demonstrations',
    'access resources to help you complete your model plans'
  ],
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
