import { ReportsType } from 'features/ReportsAndAnalytics';

export const reports: Record<
  ReportsType,
  { heading: string; description: string; formatExcel: string }
> = {
  mtoMilestoneSummary: {
    heading: 'MTO milestone summary',
    description:
      'This report downloads an excel file of all model-to-operations matrix (MTO) milestones, separated my model. It contains a subset of data about each milestone.',
    formatExcel: 'Format: Excel'
  },
  allModels: {
    heading: 'All models',
    description:
      'This report downloads a csv of information about all models in MINT including Model Plan details and more.',
    formatExcel: 'Format: Excel'
  }
};

const analytics = {
  heading: 'Reports and analytics',
  description:
    'Download reports containing a variety of information about models in MINT or view the latest analytics about content in MINT.',
  contactMINTTeam:
    '<email>Contact the MINT Team</email> if you have any questions about the available reports.',
  downloadableReports: 'Downloadable reports',
  downloadableReportsDescription:
    'Download reports of the latest model information in MINT. Each report will be downloaded in a specific format and will include a subset of model information available in MINT.',
  reports,
  formatExcel: 'Format: Excel',
  formatCSV: 'Format: CSV',
  download: 'Download',
  mintAnalytics: 'MINT analytics',
  mintAnalyticsDescription: 'Charts and graphs of current statistics for MINT.',
  mtoCategorySummary: 'MTO category summary',
  changesPerModel: 'Changes per model',
  changesPerModelBySection: 'Changes per model by section',
  changesPerModelOtherData: 'Changes per model other data',
  modelsByStatus: 'Models by status',
  numberOfFollowersPerModel: 'Number of followers per model',
  totalNumberOfModels: 'Total number of models',
  numberOfChanges: 'Number of changes',
  numberOfModels: 'Number of models',
  numberOfFollowers: 'Number of followers',
  downloadAnalytics: 'Download analytics summary as XLSX',
  noAnalyticsData: 'No analytics data found',
  view: 'View'
};

export default analytics;
