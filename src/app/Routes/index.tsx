import React, { useLayoutEffect } from 'react';
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
  useLocation
} from 'react-router-dom';
import { LoginCallback, useOktaAuth } from '@okta/okta-react';
import AccessibilityStatement from 'features/AccessibilityStatement';
import Cookies from 'features/Cookies';
import FeedbackReceived from 'features/Feedback/FeedbackReceived';
import ReportAProblem from 'features/Feedback/ReportAProblem';
import SendFeedback from 'features/Feedback/SendFeedback';
import HelpAndKnowledge from 'features/HelpAndKnowledge';
import GetAccess from 'features/HelpAndKnowledge/Articles/GetAccess';
import Home from 'features/Home';
import HomePageSettings from 'features/Home/Settings';
import Landing from 'features/Landing';
import Login from 'features/Login';
import ChangeHistory from 'features/ModelPlan/ChangeHistory';
import CollaborationArea from 'features/ModelPlan/CollaborationArea';
import Collaborators from 'features/ModelPlan/Collaborators';
import CRTDL from 'features/ModelPlan/CRTDL';
import DataEchangeApproach from 'features/ModelPlan/DataExchangeApproach';
import Documents from 'features/ModelPlan/Documents';
import ModelPlan from 'features/ModelPlan/ModelPlanOverview';
import NewPlan from 'features/ModelPlan/NewPlan';
import ReadOnly from 'features/ModelPlan/ReadOnly';
import Status from 'features/ModelPlan/Status';
import StepsOverview from 'features/ModelPlan/StepsOverview';
import TaskList from 'features/ModelPlan/TaskList';
import Basics from 'features/ModelPlan/TaskList/Basics';
import Beneficiaries from 'features/ModelPlan/TaskList/Beneficiaries';
import CostEstimate from 'features/ModelPlan/TaskList/CostEstimate';
import Characteristics from 'features/ModelPlan/TaskList/GeneralCharacteristics';
import ITSolutions from 'features/ModelPlan/TaskList/ITSolutions';
import LockedTaskListSection from 'features/ModelPlan/TaskList/LockedModelPlanSection';
import OpsEvalAndLearning from 'features/ModelPlan/TaskList/OpsEvalAndLearning';
import Participants from 'features/ModelPlan/TaskList/ParticipantsAndProviders';
import Payment from 'features/ModelPlan/TaskList/Payment';
import PrepareForClearance from 'features/ModelPlan/TaskList/PrepareForClearance';
import SubmitRequest from 'features/ModelPlan/TaskList/SubmitRequest';
import Unfollow from 'features/ModelPlan/Unfollow';
import NDA from 'features/NDA';
import NDAWrapper from 'features/NDA/NDAWrapper';
import NotFound from 'features/NotFound';
import Notifications from 'features/Notifications';
import PrivacyPolicy from 'features/PrivacyPolicy';
import Sandbox from 'features/Sandbox';
import TermsAndConditions from 'features/TermsAndConditions';
import UserInfo from 'features/UserDiagnostics';
import { useFlags } from 'launchdarkly-react-client-sdk';
import AuthenticationWrapper from 'wrappers/AuthenticationWrapper';
import BeaconWrapper from 'wrappers/BeaconWrapper';
import FlagsWrapper from 'wrappers/FlagsWrapper';
import ModelAccessWrapper from 'wrappers/ModelAccessWrapper';
import SubscriptionHandler from 'wrappers/PageLockWrapper';
import TimeOutWrapper from 'wrappers/TimeOutWrapper';
import UserInfoWrapper from 'wrappers/UserInfoWrapper';

import Footer from 'components/Footer';
import Header from 'components/Header';
import PageWrapper from 'components/PageWrapper';
import TaskListBannerAlert from 'components/TaskListBannerAlert';
import MessageProvider from 'contexts/MessageContext';
import ModelInfoWrapper from 'contexts/ModelInfoContext';
import SubscriptionWrapper from 'contexts/PageLockContext';
import RouterProvider from 'contexts/RouterContext';
import usePrevLocation from 'hooks/usePrevious';
import useRouteTitle from 'hooks/useRouteTitle';

import ProtectedRoute from '../../components/ProtectedRoute';
import { NavContextProvider } from '../../contexts/NavContext';
import shouldScroll from '../../utils/scrollConfig';

const AppRoutes = () => {
  const { authState } = useOktaAuth();
  const location = useLocation();
  const prevLocation = usePrevLocation(location);
  const flags = useFlags();

  // Fetches translated title for route and sends to GA
  useRouteTitle({ sendGA: true });

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

          {/* Collaboration Area Routes */}
          <ProtectedRoute
            path="/models/:modelID/collaboration-area"
            exact
            component={CollaborationArea}
          />

          <ProtectedRoute
            path="/models/:modelID/collaboration-area/collaborators"
            component={Collaborators}
          />

          <ProtectedRoute
            path="/models/:modelID/collaboration-area/documents"
            component={Documents}
          />

          <ProtectedRoute
            path="/models/:modelID/collaboration-area/cr-and-tdl"
            component={CRTDL}
          />

          <ProtectedRoute
            path="/models/:modelID/collaboration-area/status"
            exact
            title="Model Status"
            component={Status}
          />

          {/* Data Echange Approach Routes */}
          <ProtectedRoute
            path="/models/:modelID/collaboration-area/data-exchange-approach"
            component={DataEchangeApproach}
          />

          {/* Task List Routes */}
          <Redirect
            exact
            from="/models/:modelID/task-list"
            to="/models/:modelID/collaboration-area/task-list"
          />

          <ProtectedRoute
            path="/models/:modelID/collaboration-area/task-list"
            exact
            component={TaskList}
          />

          <ProtectedRoute
            path="/models/:modelID/collaboration-area/task-list/basics"
            component={Basics}
          />

          <ProtectedRoute
            path="/models/:modelID/collaboration-area/task-list/beneficiaries"
            component={Beneficiaries}
          />

          <ProtectedRoute
            path="/models/:modelID/collaboration-area/task-list/characteristics"
            component={Characteristics}
          />

          <ProtectedRoute
            path="/models/:modelID/collaboration-area/task-list/cost-estimate"
            component={CostEstimate}
            enabled={false} // This route is not yet implemented
          />

          <ProtectedRoute
            path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning"
            component={OpsEvalAndLearning}
          />

          <ProtectedRoute
            path="/models/:modelID/collaboration-area/task-list/participants-and-providers"
            component={Participants}
          />

          <ProtectedRoute
            path="/models/:modelID/collaboration-area/task-list/payment"
            component={Payment}
          />

          <ProtectedRoute
            path="/models/:modelID/collaboration-area/task-list/it-solutions"
            component={ITSolutions}
          />

          <ProtectedRoute
            path="/models/:modelID/collaboration-area/task-list/prepare-for-clearance"
            component={PrepareForClearance}
          />

          <ProtectedRoute
            path="/models/:modelID/collaboration-area/task-list/submit-request"
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

          {/* 404 */}
          <Route path="*" component={NotFound} />
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
            <FlagsWrapper>
              <UserInfoWrapper>
                <BeaconWrapper>
                  <SubscriptionWrapper>
                    <SubscriptionHandler>
                      <MessageProvider>
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
                      </MessageProvider>
                    </SubscriptionHandler>
                  </SubscriptionWrapper>
                </BeaconWrapper>
              </UserInfoWrapper>
            </FlagsWrapper>
          </AuthenticationWrapper>
        </RouterProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
