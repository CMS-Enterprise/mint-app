import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import NotFound from 'views/NotFound';

import ModelPlanOverview from './Articles/ModelPlanOverview';
import SampleModelPlan from './Articles/SampleModelPlan';
import HelpAndKnowledgeHome from './home';

export const HelpAndKnowledge = () => {
  return (
    <Switch>
      <Route path="/help-and-knowledge" exact>
        <HelpAndKnowledgeHome />
      </Route>

      <Route path="/help-and-knowledge/model-plan-overview" exact>
        <ModelPlanOverview />
      </Route>

      <Redirect
        exact
        from="/help-and-knowledge/sample-model-plan"
        to="/help-and-knowledge/sample-model-plan/model-basics"
      />

      <Route path="/help-and-knowledge/sample-model-plan/:subinfo" exact>
        <SampleModelPlan />
      </Route>

      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default HelpAndKnowledge;
