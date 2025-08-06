import React from 'react';
import { Outlet } from 'react-router-dom';

import AddCustomMilestone from './Articles/AddCustomMilestone';
import AddCustomSolution from './Articles/AddCustomSolution';
import AllArticles from './Articles/AllArticles';
import CreatingMTOMatrix from './Articles/CreatingMTOMatrix';
import EvaluatingDataExchangeApproach from './Articles/EvaluatingDataExchangeApproach';
import HighLevelProjectPlan from './Articles/HighLevelProjectPlan';
import ModelPlanOverview from './Articles/ModelPlanOverview';
import ModelSolutionDesign from './Articles/ModelSolutionDesign';
import ModelSolutionImplementation from './Articles/ModelSolutionImplementation';
import PhasesInvolved from './Articles/PhasesInvolved';
import SampleModelPlan from './Articles/SampleModelPlan';
import SharingAndExportingMTO from './Articles/SharingAndExportingMTO';
import SixPagerMeeting from './Articles/SixPagerMeeting';
import StartingMTOMatrix from './Articles/StartingMTOMatrix';
import TwoPagerMeeting from './Articles/TwoPagerMeeting';
import UpdatingMTOStatus from './Articles/UpdatingMTOStatus';
import UsingMilestoneLibrary from './Articles/UsingMilestoneLibrary';
import UsingMilestoneTable from './Articles/UsingMilestoneTable';
import UsingSolutionLibrary from './Articles/UsingSolutionLibrary';
import UsingSolutionsAndITSystemsTable from './Articles/UsingSolutionsAndITSystemsTable';
import UsingTableActions from './Articles/UsingTableActions';
import UtilizingSolutions from './Articles/UtilizingSolutions';
import HelpAndKnowledgeHome from './home';
import SolutionsHelp from './SolutionsHelp';

export const HelpAndKnowledge = () => {
  return <Outlet />;
};

export const helpAndKnowledgeRoutes = {
  path: '/help-and-knowledge',
  element: <HelpAndKnowledge />,
  children: [
    { path: '', element: <HelpAndKnowledgeHome /> },
    { path: 'articles', element: <AllArticles /> },
    { path: 'model-plan-overview', element: <ModelPlanOverview /> },
    { path: 'operational-solutions', element: <SolutionsHelp /> },
    { path: 'high-level-project-plan', element: <HighLevelProjectPlan /> },
    {
      path: 'about-2-page-concept-papers-and-review-meetings',
      element: <TwoPagerMeeting />
    },
    {
      path: 'about-6-page-concept-papers-and-review-meeting',
      element: <SixPagerMeeting />
    },
    {
      path: 'evaluating-data-exchange-approach',
      element: <EvaluatingDataExchangeApproach />
    },
    { path: 'sample-model-plan', element: <SampleModelPlan /> },
    { path: 'utilizing-solutions', element: <UtilizingSolutions /> },
    {
      path: 'model-and-solution-implementation',
      element: <ModelSolutionImplementation />
    },
    {
      path: 'model-and-solution-design',
      element: <ModelSolutionDesign />
    },
    { path: 'phases-involved', element: <PhasesInvolved /> },
    { path: 'sample-model-plan/:subinfo', element: <SampleModelPlan /> },
    { path: 'creating-mto-matrix', element: <CreatingMTOMatrix /> },
    { path: 'starting-mto-matrix', element: <StartingMTOMatrix /> },
    { path: 'using-milestone-table', element: <UsingMilestoneTable /> },
    { path: 'using-table-actions', element: <UsingTableActions /> },
    {
      path: 'using-solutions-and-it-systems-table',
      element: <UsingSolutionsAndITSystemsTable />
    },
    { path: 'add-custom-milestone', element: <AddCustomMilestone /> },
    { path: 'add-custom-solution', element: <AddCustomSolution /> },
    { path: 'using-solution-library', element: <UsingSolutionLibrary /> },
    { path: 'using-milestone-library', element: <UsingMilestoneLibrary /> },
    { path: 'updating-mto-status', element: <UpdatingMTOStatus /> },
    { path: 'sharing-exporting-mto', element: <SharingAndExportingMTO /> }
  ]
};

export default HelpAndKnowledge;
