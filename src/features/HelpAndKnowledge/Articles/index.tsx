export enum ArticleCategories {
  GETTING_STARTED = 'getting-started',
  IT_IMPLEMENTATION = 'it-implementation',
  MODEL_CONCEPT_AND_DESIGN = 'model-concept-and-design'
}

export const articleCategories: ArticleCategories[] = [
  ArticleCategories.GETTING_STARTED,
  ArticleCategories.IT_IMPLEMENTATION,
  ArticleCategories.MODEL_CONCEPT_AND_DESIGN
];

export enum HelpArticle {
  MODEL_PLAN_OVERVIEW = 'MODEL_PLAN_OVERVIEW',
  SAMPLE_MODEL_PLAN = 'SAMPLE_MODEL_PLAN',
  TWO_PAGER_MEETING = 'TWO_PAGER_MEETING',
  SIX_PAGER_MEETING = 'SIX_PAGER_MEETING',
  HIGH_LEVEL_PROJECT_PLAN = 'HIGH_LEVEL_PROJECT_PLAN',
  UTILIZING_SOLUTIONS = 'UTILIZING_SOLUTIONS',
  MODEL_SOLUTION_IMPLEMENTATION = 'MODEL_SOLUTION_IMPLEMENTATION',
  MODEL_SOLUTION_DESIGN = 'MODEL_SOLUTION_DESIGN',
  PHASES_INVOLVED = 'PHASES_INVOLVED',
  EVALUATING_DATA_EXCHANGE_APPROACH = 'EVALUATING_DATA_EXCHANGE_APPROACH',
  ANNOUNCEMENT_MATERIALS = 'ANNOUNCEMENT_MATERIALS',
  IT_LEAD_TRAINING_MATERIALS = 'IT_LEAD_TRAINING_MATERIALS',
  CMMI_CLEARANCE_SITE = 'CMMI_CLEARANCE_SITE',
  STRATEGY_REFRESH_RESOURCES = 'STRATEGY_REFRESH_RESOURCES',
  ICIP_REPOSITORY = 'ICIP_REPOSITORY',
  FRAUD_AND_ABUSE_WAIVER = 'FRAUD_AND_ABUSE_WAIVER',
  QUALITY_VERTICAL_HEALTH_EQUITY = 'QUALITY_VERTICAL_HEALTH_EQUITY'
}

export type ArticleProps = {
  key: HelpArticle;
  route: string;
  translation: string;
  type: ArticleCategories;
  external?: boolean;
};

// Help and Knowledge Articles
const helpAndKnowledgeArticles: ArticleProps[] = [
  {
    key: HelpArticle.MODEL_PLAN_OVERVIEW,
    route: '/model-plan-overview', // route for hitting rendered article component
    translation: 'modelPlanOverview', // Should reference the translation used to index the title and description for cards
    type: ArticleCategories.GETTING_STARTED
  },
  {
    key: HelpArticle.SAMPLE_MODEL_PLAN,
    route: '/sample-model-plan',
    translation: 'sampleModelPlan',
    type: ArticleCategories.GETTING_STARTED
  },
  {
    key: HelpArticle.TWO_PAGER_MEETING,
    route: '/about-2-page-concept-papers-and-review-meetings',
    translation: 'twoPageMeeting',
    type: ArticleCategories.MODEL_CONCEPT_AND_DESIGN
  },
  {
    key: HelpArticle.SIX_PAGER_MEETING,
    route: '/about-6-page-concept-papers-and-review-meeting',
    translation: 'sixPageMeeting',
    type: ArticleCategories.MODEL_CONCEPT_AND_DESIGN
  },
  {
    key: HelpArticle.HIGH_LEVEL_PROJECT_PLAN,
    route: '/high-level-project-plan',
    translation: 'highLevelProjectPlans',
    type: ArticleCategories.GETTING_STARTED
  },
  {
    key: HelpArticle.UTILIZING_SOLUTIONS,
    route: '/utilizing-solutions',
    translation: 'utilizingSolutions',
    type: ArticleCategories.IT_IMPLEMENTATION
  },
  {
    key: HelpArticle.MODEL_SOLUTION_IMPLEMENTATION,
    route: '/model-and-solution-implementation',
    translation: 'modelSolutionImplementation',
    type: ArticleCategories.IT_IMPLEMENTATION
  },
  {
    key: HelpArticle.MODEL_SOLUTION_DESIGN,
    route: '/model-and-solution-design',
    translation: 'modelSolutionDesign',
    type: ArticleCategories.IT_IMPLEMENTATION
  },
  {
    key: HelpArticle.PHASES_INVOLVED,
    route: '/phases-involved',
    translation: 'phasesInvolved',
    type: ArticleCategories.IT_IMPLEMENTATION
  },
  {
    key: HelpArticle.EVALUATING_DATA_EXCHANGE_APPROACH,
    route: '/evaluating-data-exchange-approach',
    translation: 'evaluatingDataExchangeApproach',
    type: ArticleCategories.GETTING_STARTED
  },
  {
    key: HelpArticle.ANNOUNCEMENT_MATERIALS,
    route:
      'https://share.cms.gov/center/cmmi/PP/DSEP/Lists/AnnouncementsAndRollouts/Tiles.aspx',
    translation: HelpArticle.ANNOUNCEMENT_MATERIALS,
    type: ArticleCategories.GETTING_STARTED,
    external: true
  },
  {
    key: HelpArticle.IT_LEAD_TRAINING_MATERIALS,
    route:
      'ttps://share.cms.gov/center/CMMI-BSG/SitePages/IT%20Lead%20Resource%20Page.aspx',
    translation: HelpArticle.IT_LEAD_TRAINING_MATERIALS,
    type: ArticleCategories.IT_IMPLEMENTATION,
    external: true
  },
  {
    key: HelpArticle.CMMI_CLEARANCE_SITE,
    route: 'https://share.cms.gov/center/CMMI/Clearances/SitePages/Home.aspx ',
    translation: HelpArticle.CMMI_CLEARANCE_SITE,
    type: ArticleCategories.GETTING_STARTED,
    external: true
  },
  {
    key: HelpArticle.STRATEGY_REFRESH_RESOURCES,
    route: 'https://share.cms.gov/center/cmmi/SR/SitePages/Home.aspx ',
    translation: HelpArticle.STRATEGY_REFRESH_RESOURCES,
    type: ArticleCategories.MODEL_CONCEPT_AND_DESIGN,
    external: true
  },
  {
    key: HelpArticle.ICIP_REPOSITORY,
    route: 'https://share.cms.gov/center/CMMI/ICIPs/SitePages/Home.aspx',
    translation: HelpArticle.ICIP_REPOSITORY,
    type: ArticleCategories.MODEL_CONCEPT_AND_DESIGN,
    external: true
  },
  {
    key: HelpArticle.FRAUD_AND_ABUSE_WAIVER,
    route:
      'https://share.cms.gov/center/cmmi/PP/Model%20Design%20Resources/Forms/AllItems.aspx?RootFolder=%2Fcenter%2Fcmmi%2FPP%2FModel%20Design%20Resources%2FModel%20Agreement%20and%20Rule%20Resources%2FTemplate%20Participation%20Agreement%2FWaiver%20Resources&FolderCTID=0x012000A975146B83F0F045969E1B4CCF269310&View=%7B05D9040E%2DF2A4%2D4351%2D8D9E%2D2F0DBF3CD595%7D',
    translation: HelpArticle.FRAUD_AND_ABUSE_WAIVER,
    type: ArticleCategories.MODEL_CONCEPT_AND_DESIGN,
    external: true
  },
  {
    key: HelpArticle.QUALITY_VERTICAL_HEALTH_EQUITY,
    route:
      'https://share.cms.gov/center/cmmi/QualVert/ModelResources/Forms/AllItems.aspx?RootFolder=%2Fcenter%2Fcmmi%2FQualVert%2FModelResources%2FHealth%20Equity&FolderCTID=0x0120005E561329242B614A92093D06F4EE96E1&View=%7B2B63652B%2D67D7%2D4A43%2DA7CD%2D617DDE639979%7D',
    translation: HelpArticle.QUALITY_VERTICAL_HEALTH_EQUITY,
    type: ArticleCategories.MODEL_CONCEPT_AND_DESIGN,
    external: true
  }
];

export default helpAndKnowledgeArticles;
