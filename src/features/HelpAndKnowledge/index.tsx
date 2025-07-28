import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import NotFound from 'features/NotFound';

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
  return (
    <Routes>
      <Route path="/help-and-knowledge">
        <HelpAndKnowledgeHome />
      </Route>

      <Route path="/help-and-knowledge/articles">
        <AllArticles />
      </Route>

      <Route path="/help-and-knowledge/model-plan-overview">
        <ModelPlanOverview />
      </Route>

      <Route path="/help-and-knowledge/operational-solutions">
        <SolutionsHelp />
      </Route>

      {/* Getting Started Articles */}
      <Route path="/help-and-knowledge/high-level-project-plan">
        <HighLevelProjectPlan />
      </Route>

      <Route path="/help-and-knowledge/about-2-page-concept-papers-and-review-meetings">
        <TwoPagerMeeting />
      </Route>

      <Route path="/help-and-knowledge/about-6-page-concept-papers-and-review-meeting">
        <SixPagerMeeting />
      </Route>

      <Route path="/help-and-knowledge/evaluating-data-exchange-approach">
        <EvaluatingDataExchangeApproach />
      </Route>

      <Route
        path="/help-and-knowledge/sample-model-plan"
        element={
          <Navigate
            to="/help-and-knowledge/sample-model-plan/model-basics"
            replace
          />
        }
      />

      {/* IT Implementation Articles */}
      <Route path="/help-and-knowledge/utilizing-solutions">
        <UtilizingSolutions />
      </Route>

      <Route path="/help-and-knowledge/model-and-solution-implementation">
        <ModelSolutionImplementation />
      </Route>

      <Route path="/help-and-knowledge/model-and-solution-design">
        <ModelSolutionDesign />
      </Route>

      <Route path="/help-and-knowledge/phases-involved">
        <PhasesInvolved />
      </Route>

      <Route path="/help-and-knowledge/sample-model-plan/:subinfo">
        <SampleModelPlan />
      </Route>

      <Route path="/help-and-knowledge/creating-mto-matrix">
        <CreatingMTOMatrix />
      </Route>

      {/* MTO Tutorial Arcticles */}
      <Route path="/help-and-knowledge/starting-mto-matrix">
        <StartingMTOMatrix />
      </Route>

      <Route path="/help-and-knowledge/using-milestone-table">
        <UsingMilestoneTable />
      </Route>

      <Route path="/help-and-knowledge/using-table-actions">
        <UsingTableActions />
      </Route>

      <Route path="/help-and-knowledge/using-solutions-and-it-systems-table">
        <UsingSolutionsAndITSystemsTable />
      </Route>

      <Route path="/help-and-knowledge/add-custom-milestone">
        <AddCustomMilestone />
      </Route>

      <Route path="/help-and-knowledge/add-custom-solution">
        <AddCustomSolution />
      </Route>

      <Route path="/help-and-knowledge/using-solution-library">
        <UsingSolutionLibrary />
      </Route>

      <Route path="/help-and-knowledge/using-milestone-library">
        <UsingMilestoneLibrary />
      </Route>

      <Route path="/help-and-knowledge/updating-mto-status">
        <UpdatingMTOStatus />
      </Route>

      <Route path="/help-and-knowledge/sharing-exporting-mto">
        <SharingAndExportingMTO />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default HelpAndKnowledge;
