import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import NotFound from 'views/NotFound';

import GettingStarted from './Articles/GettingStarted';
import ITImplementation from './Articles/ITImplementation';
import ModelPlanOverview from './Articles/ModelPlanOverview';
import SampleModelPlan from './Articles/SampleModelPlan';
import TwoPagerMeeting from './Articles/TwoPagerMeeting';
import HelpAndKnowledgeHome from './home';
import SolutionsHelp from './SolutionsHelp';

export const HelpAndKnowledge = () => {
  return (
    <Switch>
      <Route path="/help-and-knowledge" exact>
        <HelpAndKnowledgeHome />
      </Route>

      <Route path="/help-and-knowledge/model-plan-overview" exact>
        <ModelPlanOverview />
      </Route>

      <Route path="/help-and-knowledge/operational-solutions" exact>
        <SolutionsHelp />
      </Route>

      <Route
        path="/help-and-knowledge/how-to-have-a-successful-2-pager-meeting"
        exact
      >
        <TwoPagerMeeting />
      </Route>

      <Redirect
        exact
        from="/help-and-knowledge/sample-model-plan"
        to="/help-and-knowledge/sample-model-plan/model-basics"
      />

      <Route path="/help-and-knowledge/sample-model-plan/:subinfo" exact>
        <SampleModelPlan />
      </Route>

      <Route path="/help-and-knowledge/getting-started" exact>
        <GettingStarted />
      </Route>

      <Route path="/help-and-knowledge/it-implementation" exact>
        <ITImplementation />
      </Route>

      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default HelpAndKnowledge;
