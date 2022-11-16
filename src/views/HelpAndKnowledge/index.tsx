import React from 'react';
import { Route, Switch } from 'react-router-dom';

import NotFound from 'views/NotFound';

import GettingStarted from './Articles/GettingStarted';
import ITImplementation from './Articles/ITImplementation';
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

      <Route path="/help-and-knowledge/sample-model-plan" exact>
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
