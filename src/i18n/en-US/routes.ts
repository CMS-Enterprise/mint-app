const routes = {
  titles: {
    '/': 'Home',

    '/signin': 'Sign in',
    '/pre-decisional-notice': 'Pre-Decisional Notice',

    '/models': 'Models',
    '/steps-overview': 'Steps Overview',
    '/new-plan': 'New Plan',
    '/status': 'Status',

    // Homepage settings
    '/homepage-settings': 'Homepage settings',
    '/order': 'Homepage settings order',
    '/solutions': 'Homepage settings solutions',

    // Notifications
    '/notifications': 'Notifications',
    '/notifications/settings': 'Notification settings',

    // Collaborators
    '/collaborators': 'Collaborators',
    '/add-collaborator': 'Add Collaborator',

    // Documents
    '/documents': 'Documents',
    '/add-document': 'Add Document',

    // CR and TDL
    '/cr-and-tdl': 'FFS CRs and TDLs',
    '/add-cr-and-tdl': 'Add FFS CR or TDL',

    // Task-list
    '/task-list': 'Task List',

    // Model basics
    '/basics': 'Model basics',
    '/overview': 'Overview',
    '/milestones': 'Milestones',

    // General characteristics
    '/characteristics': 'General characteristics',
    '/key-characteristics': 'General characteristics - Key characteristics',
    '/involvements': 'General characteristics - Involvements',
    '/targets-and-options': 'General characteristics - Targets and options',
    '/authority': 'General characteristics - Authority',

    // Participants and providers
    '/participants-and-providers': 'Participants and providers',
    '/participant-options': 'Participants and providers - Participant options',
    '/communication': 'Participants and providers - Communication',
    '/coordination': 'Participants and providers - Coordination',
    '/provider-options': 'Participants and providers - Provider options',

    // Beneficiaries
    '/beneficiaries:': 'Beneficiaries',
    '/people-impact': 'Beneficiaries - People impact',
    '/beneficiary-frequency': 'Beneficiaries - Beneficiary frequency',

    // Operations, evaluation, and learning
    '/ops-eval-and-learning': 'Operations, evaluation, and learning',
    '/iddoc': 'Operations, evaluation, and learning - IDDOC',
    '/iddoc-testing': 'Operations, evaluation, and learning - IDDOC Testing',
    '/iddoc-monitoring':
      'Operations, evaluation, and learning - IDDOC Monitoring',
    '/performance': 'Operations, evaluation, and learning - Performance',
    '/evaluation': 'Operations, evaluation, and learning - Evaluation',
    '/ccw-and-quality-assurance':
      'Operations, evaluation, and learning - CCW and quality',
    '/data-sharing': 'Operations, evaluation, and learning - Data sharing',
    '/learning': 'Operations, evaluation, and learning - Learning',

    // Payment
    '/payment': 'Payment',
    '/claims-based-payment': 'Payment - Claims-based payment',
    '/non-claims-based-payment': 'Payment - Non-claims-based payment',
    '/anticipating-dependencies': 'Payment - Anticipating dependencies',
    '/beneficiary-cost-sharing': 'Payment - Beneficiary cost sharing',
    '/complexity': 'Payment - Complexity',
    '/recover-payment': 'Payment - Recover payment',

    // Operational solutions and implementation status
    '/it-solutions': 'Operational solutions and implementation tracker',
    '/add-an-operational-need':
      'Operational solutions and implementation tracker - Add an operational need',
    '/update-need':
      'Operational solutions and implementation tracker - Update need',
    '/select-solutions':
      'Operational solutions and implementation tracker - Select solutions',
    '/add-solution':
      'Operational solutions and implementation tracker - Add solution',
    '/add-custom-solution':
      'Operational solutions and implementation tracker - Add custom solution',
    '/solution-implementation-details':
      'Operational solutions and implementation tracker - Solution implementation details',
    '/solution-details':
      'Operational solutions and implementation tracker - Solution details',
    '/add-subtasks':
      'Operational solutions and implementation tracker - Add subtasks',
    '/manage-subtasks':
      'Operational solutions and implementation tracker - Manage subtasks',
    '/link-documents':
      'Operational solutions and implementation tracker - Link documents',

    // Prepare for clearance
    '/prepare-for-clearance': 'Prepare for clearance',

    // Read view
    '/read-view': 'Read view',
    '/read-view/model-basics': 'Read view - Model basics',
    '/read-view/general-characteristics': 'Read view - General characteristics',
    '/read-view/participants-and-providers':
      'Read view - Participants and providers',
    '/read-view/beneficiaries': 'Read view - Beneficiaries',
    '/read-view/operations-evaluation-and-learning':
      'Read view - Operations, evaluation, and learning',
    '/read-view/payment': 'Read view - Payment',
    '/read-view/it-solutions':
      'Read view - Operational solutions and implementation status',
    '/read-view/team': 'Read view - Team',
    '/read-view/discussions': 'Read view - Discussions',
    '/read-view/documents': 'Read view - Documents',
    '/read-view/crs-and-tdl': 'Read view - FFS CRs and TDLs',

    // Help and knowledge center
    '/help-and-knowledge': 'Help and knowledge center',
    '/articles': 'Articles',
    '/model-plan-overview': 'Help and knowledge center - Model plan overview',
    '/operational-solutions':
      'Help and knowledge center - Operational solutions',
    '/high-level-project-plan':
      'Help and knowledge center - High level project plan',
    '/how-to-have-a-successful-2-pager-meeting':
      'Help and knowledge center - How to have a successful 2 pager meeting',
    '/how-to-have-a-successful-6-pager-meeting':
      'Help and knowledge center - How to have a successful 6 pager meeting',
    '/sample-model-plan': 'Help and knowledge center - Sample model plan',
    '/utilizing-solutions': 'Help and knowledge center - Utilizing solutions',
    '/model-and-solution-implementation':
      'Help and knowledge center - Model and solution implementation',
    '/model-and-solution-design':
      'Help and knowledge center - Model and solution design',
    '/phases-involved': 'Help and knowledge center - Phases involved',

    // Help and knowledge center - Operational solution categories (urlParam = category)
    'applications-and-participation-interaction-aco-and-kidney':
      'Help and knowledge center category - Applications and participation interaction - ACO and kidney',
    'applications-and-participation-interaction-non-aco':
      'Help and knowledge center category - Applications and participation interaction - Non-ACO',
    'communication-tools-and-help-desk':
      'Help and knowledge center category - Communication tools and help desk',
    'contract-vehicles':
      'Help and knowledge center category - Contract vehicles',
    data: 'Help and knowledge center category - Data',
    learning: 'Help and knowledge center category - Learning',
    legal: 'Help and knowledge center category - Legal',
    'medicare-advantage-and-part-d':
      'Help and knowledge center category - Medicare advantage and part D',
    'medicare-fee-for-service':
      'Help and knowledge center category - Medicare fee for service',
    'payments-and-financials':
      'Help and knowledge center category - Payments and financials',
    quality: 'Help and knowledge center category - Quality',

    // Help and knowledge center - Operational solutions (urlParam = solution)
    '4-innovation': '4 Innovation',
    'accountable-care-organization':
      'Help and knowledge center solution - Accountable care organization - Operational System',
    'automated-plan-payment-system':
      'Help and knowledge center solution - Automated Plan Payment System',
    'beneficiary-claims-data-api':
      'Help and knowledge center solution - Beneficiary Claims Data API',
    'centralized-data-exchange':
      'Help and knowledge center solution - Centralized Data Exchange',
    'chronic-conditions-warehouse':
      'Help and knowledge center solution - Chronic Conditions Warehouse',
    'cms-box': 'Help and knowledge center solution - CMS Box',
    'cms-qualtrics': 'Help and knowledge center solution - CMS Qualtrics',
    'consolidated-business-operations-support-center':
      'Help and knowledge center solution - Consolidated Business Operations Support Center',
    'cpi-vetting': 'Help and knowledge center solution - CPI Vetting',
    'electronic-file-transfer':
      'Help and knowledge center solution - Electronic File Transfer',
    'expanded-data-feedback-reporting':
      'Help and knowledge center solution - Expanded Data Feedback Reporting',
    'gov-delivery': 'Help and knowledge center solution - Gov Delivery',
    'grant-solutions': 'Help and knowledge center solution - Grant Solutions',
    'healthcare-integrated-general-ledger-accounting-system':
      'Healthcare Integrated General Ledger Accounting System',
    'health-data-reporting':
      'Help and knowledge center solution - Health Data Reporting',
    'health-plan-management-system': 'Health Plan Management System',
    'innovation-payment-contract':
      'Help and knowledge center solution - Innovation Payment Contractor',
    'innovation-support-platform':
      'Help and knowledge center solution - Innovation Support Platform',
    'integrated-data-repository':
      'Help and knowledge center solution - Integrated Data Repository',
    'learning-and-diffusion-group':
      'Help and knowledge center solution - Learning and Diffusion Group',
    'legal-vertical': 'Help and knowledge center solution - Legal Vertical',
    'master-data-management-program-organization-relationship':
      'Help and knowledge center solution - Master Data Management Program Organization Relationship',
    'master-data-management-for-ncbp':
      'Help and knowledge center solution - Master Data Management for NCBP',
    'measure-and-instrument-development-and-support':
      'Help and knowledge center solution - Measure and Instrument Development and Support',
    'medicare-advantage-prescription-drug-system':
      'Help and knowledge center solution - Medicare Advantage Prescription Drug System',
    'outlook-mailbox': 'Help and knowledge center solution - Outlook Mailbox',
    'quality-vertical': 'Help and knowledge center solution - Quality Vertical',
    'research-measurement-assessment-design-and-analysis':
      'Help and knowledge center solution - Research Measurement Assessment Design and Analysis',
    'salesforce-application-review-and-scoring':
      'Help and knowledge center solution - Salesforce Application Review and Scoring',
    'salesforce-connect':
      'Help and knowledge center solution - Salesforce Connect',
    'salesforce-letter-of-intent':
      'Help and knowledge center solution - Salesforce Letter of Intent',
    'salesforce-project-officer-support-tool-portal':
      'Help and knowledge center solution - Salesforce Project Officer Support Tool Portal',
    'salesforce-request-for-application':
      'Help and knowledge center solution - Salesforce Request for Application',
    'shared-systems': 'Help and knowledge center solution - Shared Systems',

    // Miscellaneous
    '/about': 'About',
    '/change-history': 'Change history',
    '/locked-task-list-section': 'Locked task list section',
    '/report-a-problem': 'Report a problem',
    '/send-feedback': 'Send feedback',
    '/feedback-received': 'Feedback received',
    '/private-policy': 'Privacy policy',
    '/cookies': 'Cookies',
    '/accessibility-statement': 'Accessibility statement',
    '/terms-and-conditions': 'Terms and conditions',
    '/how-to-get-access': 'How to get access'
  }
};

export default routes;
