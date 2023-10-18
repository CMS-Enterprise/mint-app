import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import NotFound from 'views/NotFound';

import AllArticles from './Articles/AllArticles';
import HighLevelProjectPlan from './Articles/HighLevelProjectPlan';
import ModelPlanOverview from './Articles/ModelPlanOverview';
import SampleModelPlan from './Articles/SampleModelPlan';
import SixPagerMeeting from './Articles/SixPagerMeeting';
import TwoPagerMeeting from './Articles/TwoPagerMeeting';
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
        path="/help-and-knowledge/how-to-have-a-successful-2-pager-meeting"
        exact
      >
        <TwoPagerMeeting />
      </Route>

      <Route
        path="/help-and-knowledge/how-to-have-a-successful-6-pager-meeting"
        exact
      >
        <SixPagerMeeting />
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

      <Route path="/help-and-knowledge/sample-model-plan/:subinfo" exact>
        <SampleModelPlan />
      </Route>

      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default HelpAndKnowledge;
