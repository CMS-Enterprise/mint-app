import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
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
    <Switch>
      <Route path="/help-and-knowledge" exact>
        <HelpAndKnowledgeHome />
      </Route>

      <Route path="/help-and-knowledge/articles" exact>
        <AllArticles />
      </Route>

      <Route path="/help-and-knowledge/model-plan-overview" exact>
        <ModelPlanOverview />
      </Route>

      <Route path="/help-and-knowledge/operational-solutions" exact>
        <SolutionsHelp />
      </Route>

      {/* Getting Started Articles */}
      <Route path="/help-and-knowledge/high-level-project-plan" exact>
        <HighLevelProjectPlan />
      </Route>

      <Route
        path="/help-and-knowledge/about-2-page-concept-papers-and-review-meetings"
        exact
      >
        <TwoPagerMeeting />
      </Route>

      <Route
        path="/help-and-knowledge/about-6-page-concept-papers-and-review-meeting"
        exact
      >
        <SixPagerMeeting />
      </Route>

      <Route path="/help-and-knowledge/evaluating-data-exchange-approach" exact>
        <EvaluatingDataExchangeApproach />
      </Route>

      <Redirect
        exact
        from="/help-and-knowledge/sample-model-plan"
        to="/help-and-knowledge/sample-model-plan/model-basics"
      />

      {/* IT Implementation Articles */}
      <Route path="/help-and-knowledge/utilizing-solutions" exact>
        <UtilizingSolutions />
      </Route>

      <Route path="/help-and-knowledge/model-and-solution-implementation" exact>
        <ModelSolutionImplementation />
      </Route>

      <Route path="/help-and-knowledge/model-and-solution-design" exact>
        <ModelSolutionDesign />
      </Route>

      <Route path="/help-and-knowledge/phases-involved" exact>
        <PhasesInvolved />
      </Route>

      <Route path="/help-and-knowledge/sample-model-plan/:subinfo" exact>
        <SampleModelPlan />
      </Route>

      <Route path="/help-and-knowledge/creating-mto-matrix" exact>
        <CreatingMTOMatrix />
      </Route>

      {/* MTO Tutorial Arcticles */}
      <Route path="/help-and-knowledge/starting-mto-matrix" exact>
        <StartingMTOMatrix />
      </Route>

      <Route path="/help-and-knowledge/using-milestone-table" exact>
        <UsingMilestoneTable />
      </Route>

      <Route path="/help-and-knowledge/using-table-actions" exact>
        <UsingTableActions />
      </Route>

      <Route
        path="/help-and-knowledge/using-solutions-and-it-systems-table"
        exact
      >
        <UsingSolutionsAndITSystemsTable />
      </Route>

      <Route path="/help-and-knowledge/add-custom-milestone" exact>
        <AddCustomMilestone />
      </Route>

      <Route path="/help-and-knowledge/add-custom-solution" exact>
        <AddCustomSolution />
      </Route>

      <Route path="/help-and-knowledge/using-solution-library" exact>
        <UsingSolutionLibrary />
      </Route>

      <Route path="/help-and-knowledge/using-milestone-library" exact>
        <UsingMilestoneLibrary />
      </Route>

      <Route path="/help-and-knowledge/updating-mto-status" exact>
        <UpdatingMTOStatus />
      </Route>

      <Route path="/help-and-knowledge/sharing-exporting-mto" exact>
        <SharingAndExportingMTO />
      </Route>

      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default HelpAndKnowledge;
