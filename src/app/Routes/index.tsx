import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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
import ModelToOperations from 'features/ModelPlan/ModelToOperations';
import NewPlan from 'features/ModelPlan/NewPlan';
import ReadOnly from 'features/ModelPlan/ReadOnly';
import Status from 'features/ModelPlan/Status';
import StepsOverview from 'features/ModelPlan/StepsOverview';
import TaskList from 'features/ModelPlan/TaskList';
import Basics from 'features/ModelPlan/TaskList/Basics';
import Beneficiaries from 'features/ModelPlan/TaskList/Beneficiaries';
import CostEstimate from 'features/ModelPlan/TaskList/CostEstimate';
import Characteristics from 'features/ModelPlan/TaskList/GeneralCharacteristics';
import LockedTaskListSection from 'features/ModelPlan/TaskList/LockedModelPlanSection';
import OpsEvalAndLearning from 'features/ModelPlan/TaskList/OpsEvalAndLearning';
import Participants from 'features/ModelPlan/TaskList/ParticipantsAndProviders';
import Payment from 'features/ModelPlan/TaskList/Payment';
import PrepareForClearance from 'features/ModelPlan/TaskList/PrepareForClearance';
import SubmitRequest from 'features/ModelPlan/TaskList/SubmitRequest';
import Timeline from 'features/ModelPlan/Timeline';
import Unfollow from 'features/ModelPlan/Unfollow';
import UnlockAllSections from 'features/ModelPlan/UnlockAllSections';
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
import useRouteTitle from 'hooks/useRouteTitle';
import useScrollTop from 'hooks/useScrollTop';

import ProtectedRoute from '../../components/ProtectedRoute';
import { NavContextProvider } from '../../contexts/NavContext';

const AppRoutes = () => {
  const { authState } = useOktaAuth();
  const flags = useFlags();

  // Fetches translated title for route and sends to GA
  useRouteTitle({ sendGA: true });

  // Scroll to top
  useScrollTop();

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Navigate to="/signin" replace />} />

      <Route path="/signin" element={<Login />} />

      <Route
        path="/pre-decisional-notice"
        element={ProtectedRoute({ element: <NDA /> })}
      />

      {/* Home Routes */}
      <Route
        path="/"
        element={authState?.isAuthenticated ? <Home /> : <Landing />}
      />

      <Route
        path="/homepage-settings"
        element={ProtectedRoute({ element: <HomePageSettings /> })}
      />

      <Route
        path="/notifications"
        element={ProtectedRoute({ element: <Notifications /> })}
      />

      {/* Model Plan Routes */}
      <Route
        path="/models/*"
        element={
          <Routes>
            {/* New Plan Routes */}
            <Route
              path="steps-overview"
              element={ProtectedRoute({ element: <StepsOverview /> })}
            />

            <Route
              path="new-plan"
              element={ProtectedRoute({ element: <NewPlan /> })}
            />

            <Route
              path=":modelID/unlock-all-sections"
              element={ProtectedRoute({ element: <UnlockAllSections /> })}
            />

            {/* Collaboration Area Routes */}
            <Route
              path=":modelID/collaboration-area"
              element={ProtectedRoute({ element: <CollaborationArea /> })}
            />

            <Route
              path=":modelID/collaboration-area/collaborators"
              element={ProtectedRoute({ element: <Collaborators /> })}
            />

            <Route
              path=":modelID/collaboration-area/documents"
              element={ProtectedRoute({ element: <Documents /> })}
            />

            <Route
              path=":modelID/collaboration-area/cr-and-tdl"
              element={ProtectedRoute({ element: <CRTDL /> })}
            />

            <Route
              path=":modelID/collaboration-area/status"
              element={ProtectedRoute({ element: <Status /> })}
            />

            {/* Timeline Routes */}
            <Route
              path=":modelID/collaboration-area/task-list/basics/milestones"
              element={
                <Navigate
                  to="/models/:modelID/collaboration-area/model-timeline"
                  replace
                />
              }
            />

            <Route
              path=":modelID/collaboration-area/model-timeline"
              element={ProtectedRoute({ element: <Timeline /> })}
            />

            {/* Data Exchange Approach Routes */}
            <Route
              path=":modelID/collaboration-area/data-exchange-approach"
              element={ProtectedRoute({ element: <DataEchangeApproach /> })}
            />

            {/* Model to Operation Routes */}
            <Route
              path=":modelID/collaboration-area/model-to-operations"
              element={ProtectedRoute({ element: <ModelToOperations /> })}
            />

            {/* Task List Routes */}
            <Route
              path=":modelID/task-list"
              element={
                <Navigate
                  to="/models/:modelID/collaboration-area/task-list"
                  replace
                />
              }
            />

            <Route
              path=":modelID/collaboration-area/task-list"
              element={<TaskList />}
            />

            <Route
              path=":modelID/collaboration-area/task-list/basics"
              element={ProtectedRoute({ element: <Basics /> })}
            />

            <Route
              path=":modelID/collaboration-area/task-list/beneficiaries"
              element={ProtectedRoute({ element: <Beneficiaries /> })}
            />

            <Route
              path=":modelID/collaboration-area/task-list/characteristics"
              element={ProtectedRoute({ element: <Characteristics /> })}
            />

            <Route
              path=":modelID/collaboration-area/task-list/cost-estimate"
              element={ProtectedRoute({
                element: <CostEstimate />,
                enabled: false
              })}
            />

            <Route
              path=":modelID/collaboration-area/task-list/ops-eval-and-learning"
              element={ProtectedRoute({ element: <OpsEvalAndLearning /> })}
            />

            <Route
              path=":modelID/collaboration-area/task-list/participants-and-providers"
              element={ProtectedRoute({ element: <Participants /> })}
            />

            <Route
              path=":modelID/collaboration-area/task-list/payment"
              element={ProtectedRoute({ element: <Payment /> })}
            />

            {/* Redirect from legacy Operational Needs Track to new MTO Matrix.  TODO: Can remove at some point once fully converted */}
            <Route
              path=":modelID/collaboration-area/task-list/it-solutions"
              element={
                <Navigate
                  to="/models/:modelID/collaboration-area/model-to-operations"
                  replace
                />
              }
            />
            {/* Read view redirect from legacy Operational Needs Track to new MTO Matrix  */}
            <Route
              path=":modelID/read-view/it-solutions"
              element={
                <Navigate to="/models/:modelID/read-view/milestones" replace />
              }
            />

            <Route
              path=":modelID/collaboration-area/task-list/prepare-for-clearance"
              element={ProtectedRoute({ element: <PrepareForClearance /> })}
            />

            <Route
              path=":modelID/collaboration-area/task-list/submit-request"
              element={ProtectedRoute({
                element: <SubmitRequest />,
                enabled: false
              })}
            />

            {/* Model/Read View Routes */}
            <Route
              path=""
              element={ProtectedRoute({ element: <ModelPlan /> })}
            />

            {/* Redirects for legacy/renamed routes */}
            <Route
              path=":modelID/read-only"
              element={<Navigate to="/models/:modelID/read-view" replace />}
            />

            <Route
              path=":modelID/read-view"
              element={
                <Navigate
                  to="/models/:modelID/read-view/model-basics"
                  replace
                />
              }
            />

            <Route
              path=":modelID/read-view/it-systems-and-solutions"
              element={
                <Navigate
                  to="/models/:modelID/read-view/solutions-and-it-systems"
                  replace
                />
              }
            />

            <Route
              path=":modelID/read-only/:subinfo?"
              element={
                <Navigate to="/models/:modelID/read-view/:subinfo?" replace />
              }
            />

            <Route
              path=":modelID/read-view/:subinfo?"
              element={ProtectedRoute({ element: <ReadOnly /> })}
            />

            <Route
              path=":modelID"
              element={<Navigate to="/models/:modelID/read-view" replace />}
            />

            {/* Change History Routes */}
            <Route
              path=":modelID/change-history"
              element={ProtectedRoute({ element: <ChangeHistory /> })}
            />

            {/* Locked Task List Section */}
            <Route
              path=":modelID/locked-task-list-section"
              element={ProtectedRoute({ element: <LockedTaskListSection /> })}
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        }
      />

      {/* Help and Knowledge Center Routes */}
      <Route
        path="/help-and-knowledge"
        element={ProtectedRoute({ element: <HelpAndKnowledge /> })}
      />

      {/* Misc Routes */}
      <Route
        path="/user-diagnostics"
        element={ProtectedRoute({ element: <UserInfo /> })}
      />

      <Route
        path="/report-a-problem"
        element={ProtectedRoute({ element: <ReportAProblem /> })}
      />

      <Route
        path="/send-feedback"
        element={ProtectedRoute({ element: <SendFeedback /> })}
      />

      <Route
        path="/feedback-received"
        element={ProtectedRoute({ element: <FeedbackReceived /> })}
      />

      <Route
        path="/unfollow"
        element={ProtectedRoute({ element: <Unfollow /> })}
      />

      {flags.sandbox && <Route path="/sandbox" element={<Sandbox />} />}

      {/* Static Page Routes  */}
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      <Route path="/cookies" element={<Cookies />} />

      <Route
        path="/accessibility-statement"
        element={<AccessibilityStatement />}
      />

      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

      <Route path="/how-to-get-access" element={<GetAccess />} />

      <Route path="/implicit/callback" element={<LoginCallback />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
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
