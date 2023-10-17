import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import NotFound from 'views/NotFound';

import AllArticles from './Articles/AllArticles';
import GettingStarted from './Articles/GettingStarted';
import HighLevelProjectPlan from './Articles/HighLevelProjectPlan';
import ITImplementation from './Articles/ITImplementation';
import ModelPlanOverview from './Articles/ModelPlanOverview';
import SampleModelPlan from './Articles/SampleModelPlan';
import SixPagerMeeting from './Articles/SixPagerMeeting';
import TwoPagerMeeting from './Articles/TwoPagerMeeting';
import HelpAndKnowledgeHome from './home';
import SolutionsHelp from './SolutionsHelp';

export const HelpAndKnowledge = () => {
  return (
    <Switch>
      <Route path="/help-and-knowledge" exact>
        <HelpAndKnowledgeHome />
      </Route>

      <Route path="/help-and-knowledge/all-articles" exact>
        <AllArticles />
      </Route>

      <Route path="/help-and-knowledge/model-plan-overview" exact>
        <ModelPlanOverview />
      </Route>

      <Route path="/help-and-knowledge/operational-solutions" exact>
        <SolutionsHelp />
      </Route>

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
