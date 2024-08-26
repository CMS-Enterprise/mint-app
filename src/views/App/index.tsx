import React, { useEffect, useLayoutEffect } from 'react';
import ReactGA from 'react-ga4';
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
  useLocation
} from 'react-router-dom';
import { LoginCallback, useOktaAuth } from '@okta/okta-react';
import { useFlags } from 'launchdarkly-react-client-sdk';

import Footer from 'components/Footer';
import Header from 'components/Header';
import PageWrapper from 'components/PageWrapper';
import { MessageProvider } from 'hooks/useMessage';
import usePrevLocation from 'hooks/usePrevious';
import AccessibilityStatement from 'views/AccessibilityStatement';
import AuthenticationWrapper from 'views/AuthenticationWrapper';
import BeaconWrapper from 'views/BeaconWrapper';
import Cookies from 'views/Cookies';
import FeedbackReceived from 'views/Feedback/FeedbackReceived';
import ReportAProblem from 'views/Feedback/ReportAProblem';
import SendFeedback from 'views/Feedback/SendFeedback';
import FlagsWrapper from 'views/FlagsWrapper';
import HelpAndKnowledge from 'views/HelpAndKnowledge';
import GetAccess from 'views/HelpAndKnowledge/Articles/GetAccess';
import Home from 'views/Home';
import HomePageSettings from 'views/Home/Settings';
import Landing from 'views/Landing';
import Login from 'views/Login';
import ModelAccessWrapper from 'views/ModelAccessWrapper';
import ModelInfoWrapper from 'views/ModelInfoWrapper';
import ChangeHistory from 'views/ModelPlan/ChangeHistory';
import Collaborators from 'views/ModelPlan/Collaborators';
import CRTDL from 'views/ModelPlan/CRTDL';
import Documents from 'views/ModelPlan/Documents';
import LockedTaskListSection from 'views/ModelPlan/LockedTaskListSection';
import ModelPlan from 'views/ModelPlan/ModelPlanOverview';
import NewPlan from 'views/ModelPlan/NewPlan';
import ReadOnly from 'views/ModelPlan/ReadOnly';
import Status from 'views/ModelPlan/Status';
import StepsOverview from 'views/ModelPlan/StepsOverview';
import TaskList from 'views/ModelPlan/TaskList';
import Basics from 'views/ModelPlan/TaskList/Basics';
import Beneficiaries from 'views/ModelPlan/TaskList/Beneficiaries';
import CostEstimate from 'views/ModelPlan/TaskList/CostEstimate';
import Characteristics from 'views/ModelPlan/TaskList/GeneralCharacteristics';
import ITSolutions from 'views/ModelPlan/TaskList/ITSolutions';
import OpsEvalAndLearning from 'views/ModelPlan/TaskList/OpsEvalAndLearning';
import Participants from 'views/ModelPlan/TaskList/ParticipantsAndProviders';
import Payment from 'views/ModelPlan/TaskList/Payment';
import PrepareForClearance from 'views/ModelPlan/TaskList/PrepareForClearance';
import SubmitRequest from 'views/ModelPlan/TaskList/SubmitRequest';
import NDA from 'views/NDA';
import NDAWrapper from 'views/NDAWrapper';
import NotFound from 'views/NotFound';
import Notifications from 'views/Notifications';
import PrivacyPolicy from 'views/PrivacyPolicy';
import RouterProvider from 'views/RouterContext';
import Sandbox from 'views/Sandbox';
import SubscriptionHandler from 'views/SubscriptionHandler';
import SubscriptionWrapper from 'views/SubscriptionWrapper';
import TaskListBannerAlert from 'views/TaskListBannerAlert';
import TermsAndConditions from 'views/TermsAndConditions';
import TimeOutWrapper from 'views/TimeOutWrapper';
import Unfollow from 'views/Unfollow';
import UserInfo from 'views/User';
import UserInfoWrapper from 'views/UserInfoWrapper';

import { NavContextProvider } from '../../components/Header/navContext';

import ProtectedRoute from './ProtectedRoute';
import shouldScroll from './scrollConfig';

import './index.scss';

const AppRoutes = () => {
  const { authState } = useOktaAuth();
  const location = useLocation();
  const prevLocation = usePrevLocation(location);
  const flags = useFlags();

  // Track GA Pages
  useEffect(() => {
    if (location.pathname) {
      const { pathname } = location;

      const currentRouteParams = pathname.replace(/\/+$/, '').split('/');

      const currentRoute = currentRouteParams[currentRouteParams.length - 1];

      console.log('pathname', pathname);
      console.log('currentRoute', currentRoute);

      ReactGA.send({ hitType: 'pageview', page: location.pathname });
    }
  }, [location]);

  // Scroll to top
  useLayoutEffect(() => {
    if (
      shouldScroll(
        location.pathname + location.search,
        (prevLocation?.pathname || '') + (prevLocation?.search || '')
      )
    ) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.search, prevLocation]);

  return (
    <Switch>
      {/* Auth Routes */}
      <Redirect exact from="/login" to="/signin" />

      <Route path="/signin" exact component={Login} />

      <ProtectedRoute path="/pre-decisional-notice" component={NDA} />

      {/* Home Routes */}
      <Route
        path="/"
        exact
        render={() => {
          if (!authState?.isAuthenticated) {
            return <Landing />;
          }
          return <Home />;
        }}
      />

      <ProtectedRoute path="/homepage-settings" component={HomePageSettings} />

      <ProtectedRoute path="/notifications" component={Notifications} />

      {/* Model Plan Routes */}
      <ProtectedRoute path="/models">
        <Switch>
          {/* New Plan Routes */}
          <ProtectedRoute
            path="/models/steps-overview"
            exact
            component={StepsOverview}
          />

          <ProtectedRoute path="/models/new-plan" component={NewPlan} />

          <ProtectedRoute
            path="/models/:modelID/collaborators"
            component={Collaborators}
          />

          {/* Task List Routes */}
          <ProtectedRoute
            path="/models/:modelID/documents"
            component={Documents}
          />

          <ProtectedRoute
            path="/models/:modelID/cr-and-tdl"
            component={CRTDL}
          />

          <ProtectedRoute
            path="/models/:modelID/status"
            exact
            title="Model Status"
            component={Status}
          />

          <ProtectedRoute
            path="/models/:modelID/task-list"
            exact
            component={TaskList}
          />

          <ProtectedRoute
            path="/models/:modelID/task-list/basics"
            component={Basics}
          />

          <ProtectedRoute
            path="/models/:modelID/task-list/beneficiaries"
            component={Beneficiaries}
          />

          <ProtectedRoute
            path="/models/:modelID/task-list/characteristics"
            component={Characteristics}
          />

          <ProtectedRoute
            path="/models/:modelID/task-list/cost-estimate"
            component={CostEstimate}
            enabled={false} // This route is not yet implemented
          />

          <ProtectedRoute
            path="/models/:modelID/task-list/ops-eval-and-learning"
            component={OpsEvalAndLearning}
          />

          <ProtectedRoute
            path="/models/:modelID/task-list/participants-and-providers"
            component={Participants}
          />

          <ProtectedRoute
            path="/models/:modelID/task-list/payment"
            component={Payment}
          />

          <ProtectedRoute
            path="/models/:modelID/task-list/it-solutions"
            component={ITSolutions}
          />

          <ProtectedRoute
            path="/models/:modelID/task-list/prepare-for-clearance"
            component={PrepareForClearance}
          />

          <ProtectedRoute
            path="/models/:modelID/task-list/submit-request"
            component={SubmitRequest}
            enabled={false} // This route is not yet implemented
          />

          {/* Model/Read View Routes */}
          <ProtectedRoute path="/models" exact component={ModelPlan} />

          <Redirect
            exact
            from="/models/:modelID/read-only"
            to="/models/:modelID/read-view"
          />

          <Redirect
            exact
            from="/models/:modelID/read-view"
            to="/models/:modelID/read-view/model-basics"
          />

          <ProtectedRoute // Wrap redirect as child of route to pass on query parameters
            path="/models/:modelID/read-only/:subinfo?"
            render={match => (
              <Redirect
                to={{
                  // /models/:modelID/read-view/:subinfo? syntax does not work with pathname prop, so we replace 'only' with 'view'
                  pathname: match.location.pathname.replace('only', 'view'),
                  search: match.location.search
                }}
              />
            )}
          />

          <ProtectedRoute
            path="/models/:modelID/read-view/:subinfo?"
            exact
            component={ReadOnly}
          />

          <Redirect
            exact
            from="/models/:modelID"
            to="/models/:modelID/read-view"
          />

          {/* Change History Routes */}
          <ProtectedRoute
            path="/models/:modelID/change-history"
            component={ChangeHistory}
            enabled={flags.changeHistoryEnabled}
          />

          {/* Locked Task List Section */}
          <ProtectedRoute
            path="/models/:modelID/locked-task-list-section"
            component={LockedTaskListSection}
          />
        </Switch>
      </ProtectedRoute>

      {/* Help and Knowledge Center Routes */}
      <ProtectedRoute path="/help-and-knowledge" component={HelpAndKnowledge} />

      {/* Misc Routes */}
      <ProtectedRoute path="/user-diagnostics" component={UserInfo} />

      <ProtectedRoute path="/report-a-problem" component={ReportAProblem} />

      <ProtectedRoute path="/send-feedback" component={SendFeedback} />

      <ProtectedRoute path="/feedback-received" component={FeedbackReceived} />

      <ProtectedRoute path="/unfollow" exact component={Unfollow} />

      {flags.sandbox && <Route path="/sandbox" exact component={Sandbox} />}

      {/* Static Page Routes  */}
      <Route path="/privacy-policy" exact component={PrivacyPolicy} />

      <Route path="/cookies" exact component={Cookies} />

      <Route
        path="/accessibility-statement"
        exact
        component={AccessibilityStatement}
      />

      <Route
        exact
        path="/terms-and-conditions"
        component={TermsAndConditions}
      />

      <Route exact path="/how-to-get-access" component={GetAccess} />

      <Route path="/implicit/callback" component={LoginCallback} />

      {/* 404 */}
      <Route path="*" component={NotFound} />
    </Switch>
  );
};

const App = () => {
  const handleSkipNav = () => {
    const mainContent = document.getElementById('main-content')!;
    if (mainContent) {
      mainContent.focus();
    }
  };

  return (
    <>
      <div className="usa-overlay" />
      <button type="button" className="skipnav z-top" onClick={handleSkipNav}>
        Skip to main content
      </button>
      <BrowserRouter>
        <RouterProvider>
          <AuthenticationWrapper>
            <SubscriptionWrapper>
              <SubscriptionHandler>
                <MessageProvider>
                  <FlagsWrapper>
                    <UserInfoWrapper>
                      <BeaconWrapper>
                        <NDAWrapper>
                          <ModelAccessWrapper>
                            <ModelInfoWrapper>
                              <TimeOutWrapper>
                                <NavContextProvider>
                                  <PageWrapper>
                                    <Header />
                                    <TaskListBannerAlert />
                                    <AppRoutes />
                                    <Footer />
                                  </PageWrapper>
                                </NavContextProvider>
                              </TimeOutWrapper>
                            </ModelInfoWrapper>
                          </ModelAccessWrapper>
                        </NDAWrapper>
                      </BeaconWrapper>
                    </UserInfoWrapper>
                  </FlagsWrapper>
                </MessageProvider>
              </SubscriptionHandler>
            </SubscriptionWrapper>
          </AuthenticationWrapper>
        </RouterProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
