import React, { useLayoutEffect } from 'react';
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
import Accessibility from 'views/Accessibility';
import AccessibilityStatement from 'views/AccessibilityStatement';
import AuthenticationWrapper from 'views/AuthenticationWrapper';
import BusinessCase from 'views/BusinessCase';
import Cookies from 'views/Cookies';
import FlagsWrapper from 'views/FlagsWrapper';
import GovernanceOverview from 'views/GovernanceOverview';
import GovernanceReviewTeam from 'views/GovernanceReviewTeam';
import GovernanceTaskList from 'views/GovernanceTaskList';
import GovernanceFeedback from 'views/GovernanceTaskList/Feedback';
import LcidInfo from 'views/GovernanceTaskList/LcidInfo';
import RequestDecision from 'views/GovernanceTaskList/RequestDecision';
import Home from 'views/Home';
import Login from 'views/Login';
import MakingARequest from 'views/MakingARequest';
import MyRequests from 'views/MyRequests';
import NotFound from 'views/NotFound';
import PrepareForGRB from 'views/PrepareForGRB';
import PrepareForGRT from 'views/PrepareForGRT';
import PrivacyPolicy from 'views/PrivacyPolicy';
import RequestTypeForm from 'views/RequestTypeForm';
import Sandbox from 'views/Sandbox';
import SystemIntake from 'views/SystemIntake';
import SystemList from 'views/SystemList';
import SystemProfile from 'views/SystemProfile';
import TermsAndConditions from 'views/TermsAndConditions';
import TimeOutWrapper from 'views/TimeOutWrapper';
import UserInfo from 'views/User';
import UserInfoWrapper from 'views/UserInfoWrapper';

import { NavContextProvider } from '../../components/Header/navContext';

import shouldScroll from './scrollConfig';

import './index.scss';

const AppRoutes = () => {
  const location = useLocation();
  const flags = useFlags();

  // Scroll to top
  useLayoutEffect(() => {
    if (shouldScroll(location.pathname)) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <Switch>
      {/* General Routes */}
      <Route path="/" exact component={Home} />
      <Redirect exact from="/login" to="/signin" />
      <Route path="/signin" exact component={Login} />
      <SecureRoute path="/user-diagnostics" component={UserInfo} />
      <SecureRoute path="/my-requests" component={MyRequests} />

      {/* 508 / Accessibility Team Routes */}
      <Redirect exact from="/508" to="/508/making-a-request" />
      <SecureRoute path="/508" component={Accessibility} />

      {/* GRT/GRB Routes */}
      <SecureRoute
        path="/governance-review-team"
        component={GovernanceReviewTeam}
      />

      {/* Requester / Business Owner Routes */}
      <SecureRoute path="/system/making-a-request" component={MakingARequest} />
      <SecureRoute
        exact
        path="/system/request-type"
        component={RequestTypeForm}
      />
      <Route
        path="/governance-overview/:systemId?"
        component={GovernanceOverview}
      />
      <SecureRoute
        path="/governance-task-list/:systemId"
        exact
        component={GovernanceTaskList}
      />
      <SecureRoute
        path="/governance-task-list/:systemId/feedback"
        exact
        component={GovernanceFeedback}
      />
      <SecureRoute
        exact
        path="/governance-task-list/:systemId/prepare-for-grt"
        component={PrepareForGRT}
      />
      <SecureRoute
        exact
        path="/governance-task-list/:systemId/prepare-for-grb"
        component={PrepareForGRB}
      />
      <SecureRoute
        exact
        path="/governance-task-list/:systemId/request-decision"
        component={RequestDecision}
      />
      <SecureRoute
        exact
        path="/governance-task-list/:systemId/lcid-info"
        component={LcidInfo}
      />
      <Redirect exact from="/system/new" to="/system/request-type" />
      <Redirect
        exact
        from="/system/:systemId"
        to="/system/:systemId/contact-details"
      />
      <SecureRoute
        path="/system/:systemId/:formPage"
        component={SystemIntake}
      />
      {flags.systemProfile && (
        <SecureRoute exact path="/systems" component={SystemList} />
      )}
      {flags.systemProfile && (
        <SecureRoute
          path="/systems/:systemId"
          exact
          component={SystemProfile}
        />
      )}
      {flags.systemProfile && (
        <SecureRoute
          path="/systems/:systemId/:subinfo/:top?"
          exact
          component={SystemProfile}
        />
      )}
      <Redirect
        exact
        from="/business/:businessCaseId"
        to="/business/:businessCaseId/general-request-info"
      />
      <SecureRoute
        path="/business/:businessCaseId/:formPage"
        component={BusinessCase}
      />

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

      {/* Misc Routes */}
      {flags.sandbox && <Route path="/sandbox" exact component={Sandbox} />}
      {flags.sandbox && (
        <Route path="/sandbox/:systemId" exact component={SystemProfile} />
      )}

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
      <button type="button" className="skipnav" onClick={handleSkipNav}>
        Skip to main content
      </button>
      <BrowserRouter>
        <AuthenticationWrapper>
          <MessageProvider>
            <FlagsWrapper>
              <UserInfoWrapper>
                <TimeOutWrapper>
                  <NavContextProvider>
                    <PageWrapper>
                      <Header />
                      <AppRoutes />
                      <Footer />
                    </PageWrapper>
                  </NavContextProvider>
                </TimeOutWrapper>
              </UserInfoWrapper>
            </FlagsWrapper>
          </MessageProvider>
        </AuthenticationWrapper>
      </BrowserRouter>
    </>
  );
};

export default App;
