import React, { useEffect, useLayoutEffect } from 'react';
import ReactGA from 'react-ga4';
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
  useLocation
} from 'react-router-dom';
import { LoginCallback, SecureRoute } from '@okta/okta-react';
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

import shouldScroll from './scrollConfig';

import './index.scss';

const AppRoutes = () => {
  const location = useLocation();
  const prevLocation = usePrevLocation(location);
  const flags = useFlags();

  // Track GA Pages
  useEffect(() => {
    if (location.pathname) {
      ReactGA.send({ hitType: 'pageview', page: location.pathname });
    }
  }, [location.pathname]);

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
      {/* General Routes */}
      <Route path="/" exact component={Home} />

      <Redirect exact from="/login" to="/signin" />
      <Route path="/signin" exact component={Login} />
      <SecureRoute path="/user-diagnostics" component={UserInfo} />

      <SecureRoute path="/unfollow" exact component={Unfollow} />

      {/* Model Routes */}
      <SecureRoute path="/models" exact component={ModelPlan} />

      <SecureRoute
        path="/models/:modelID/read-only/:subinfo?"
        exact
        component={ReadOnly}
      />

      <SecureRoute
        path="/models/steps-overview"
        exact
        component={StepsOverview}
      />

      <SecureRoute path="/models/new-plan" component={NewPlan} />
      <SecureRoute
        path="/models/:modelID/collaborators"
        component={Collaborators}
      />
      <SecureRoute path="/models/:modelID/documents" component={Documents} />
      <SecureRoute path="/models/:modelID/cr-and-tdl" component={CRTDL} />
      <SecureRoute path="/models/:modelID/status" exact component={Status} />
      <SecureRoute
        path="/models/:modelID/task-list"
        exact
        component={TaskList}
      />
      <SecureRoute
        path="/models/:modelID/task-list/basics"
        component={Basics}
      />
      <SecureRoute
        path="/models/:modelID/task-list/beneficiaries"
        component={Beneficiaries}
      />
      <SecureRoute
        path="/models/:modelID/task-list/characteristics"
        component={Characteristics}
      />
      <SecureRoute
        path="/models/:modelID/task-list/cost-estimate"
        component={CostEstimate}
      />
      <SecureRoute
        path="/models/:modelID/task-list/ops-eval-and-learning"
        component={OpsEvalAndLearning}
      />
      <SecureRoute
        path="/models/:modelID/task-list/participants-and-providers"
        component={Participants}
      />
      <SecureRoute
        path="/models/:modelID/task-list/payment"
        component={Payment}
      />
      {!flags.hideITLeadExperience && (
        <SecureRoute
          path="/models/:modelID/task-list/it-solutions"
          component={ITSolutions}
        />
      )}

      <SecureRoute
        path="/models/:modelID/task-list/prepare-for-clearance"
        component={PrepareForClearance}
      />
      <SecureRoute
        path="/models/:modelID/task-list/submit-request"
        component={SubmitRequest}
      />

      <SecureRoute path="/notifications" component={Notifications} />

      {flags.changeHistoryEnabled && (
        <SecureRoute
          path="/models/:modelID/change-history"
          component={ChangeHistory}
        />
      )}

      <SecureRoute path="/help-and-knowledge" component={HelpAndKnowledge} />

      <SecureRoute path="/pre-decisional-notice" component={NDA} />

      <SecureRoute path="/report-a-problem" component={ReportAProblem} />

      <SecureRoute path="/send-feedback" component={SendFeedback} />

      <SecureRoute path="/feedback-received" component={FeedbackReceived} />

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

      {/* Misc Routes */}
      {flags.sandbox && <Route path="/sandbox" exact component={Sandbox} />}

      <Route path="/implicit/callback" component={LoginCallback} />

      {/* Locked Task List Section */}
      <SecureRoute
        path="/models/:modelID/locked-task-list-section"
        component={LockedTaskListSection}
      />

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
