import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NotFoundPartial } from 'views/NotFound';

import ModelPlanOverview from './Articles/ModelPlanOverview';
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

      <Route path="*" render={() => <NotFoundPartial />} />
    </Switch>
  );
};

export default HelpAndKnowledge;
