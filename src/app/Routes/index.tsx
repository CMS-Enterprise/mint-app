import React from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useParams
} from 'react-router-dom';
import { LoginCallback } from '@okta/okta-react';
import AccessibilityStatement from 'features/AccessibilityStatement';
import Cookies from 'features/Cookies';
import FeedbackReceived from 'features/Feedback/FeedbackReceived';
import ReportAProblem from 'features/Feedback/ReportAProblem';
import SendFeedback from 'features/Feedback/SendFeedback';
import HelpAndKnowledge from 'features/HelpAndKnowledge';
import GetAccess from 'features/HelpAndKnowledge/Articles/GetAccess';
import Home from 'features/Home';
import HomePageSettings from 'features/Home/Settings';
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
import Overview from 'features/ModelPlan/TaskList/Basics/Overview';
import Beneficiaries from 'features/ModelPlan/TaskList/Beneficiaries';
import BeneficiaryIdentification from 'features/ModelPlan/TaskList/Beneficiaries/BeneficiaryIdentification';
import Frequency from 'features/ModelPlan/TaskList/Beneficiaries/Frequency';
import PeopleImpact from 'features/ModelPlan/TaskList/Beneficiaries/PeopleImpact';
import CostEstimate from 'features/ModelPlan/TaskList/CostEstimate';
import Characteristics from 'features/ModelPlan/TaskList/GeneralCharacteristics';
import LockedTaskListSection from 'features/ModelPlan/TaskList/LockedModelPlanSection';
import OpsEvalAndLearning from 'features/ModelPlan/TaskList/OpsEvalAndLearning';
import Participants from 'features/ModelPlan/TaskList/ParticipantsAndProviders';
import Communication from 'features/ModelPlan/TaskList/ParticipantsAndProviders/Communication';
import Coordination from 'features/ModelPlan/TaskList/ParticipantsAndProviders/Coordination';
import ParticipantOptions from 'features/ModelPlan/TaskList/ParticipantsAndProviders/ParticipantOptions';
import ProviderOptions from 'features/ModelPlan/TaskList/ParticipantsAndProviders/ProviderOptions';
import Payment from 'features/ModelPlan/TaskList/Payment';
import PrepareForClearance from 'features/ModelPlan/TaskList/PrepareForClearance';
import SubmitRequest from 'features/ModelPlan/TaskList/SubmitRequest';
import Timeline from 'features/ModelPlan/Timeline';
import UnlockAllSections from 'features/ModelPlan/UnlockAllSections';
import NDA from 'features/NDA';
import NDAWrapper from 'features/NDA/NDAWrapper';
import NotFound from 'features/NotFound';
import Notifications from 'features/Notifications';
import PrivacyPolicy from 'features/PrivacyPolicy';
import Sandbox from 'features/Sandbox';
import TermsAndConditions from 'features/TermsAndConditions';
import UserInfo from 'features/UserDiagnostics';
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

import ProtectedRoute from '../../components/ProtectedRoute';
import { NavContextProvider } from '../../contexts/NavContext';

const handleSkipNav = () => {
  const mainContent = document.getElementById('main-content')!;
  if (mainContent) {
    mainContent.focus();
  }
};

// Wrapper components to handle parameter interpolation
const TaskListRedirect = () => {
  const { modelID } = useParams();
  return (
    <Navigate to={`/models/${modelID}/collaboration-area/task-list`} replace />
  );
};

const TimelineRedirect = () => {
  const { modelID } = useParams();
  return (
    <Navigate
      to={`/models/${modelID}/collaboration-area/model-timeline`}
      replace
    />
  );
};

const ITSolutionsRedirect = () => {
  const { modelID } = useParams();
  return (
    <Navigate
      to={`/models/${modelID}/collaboration-area/model-to-operations`}
      replace
    />
  );
};

const ReadViewITSolutionsRedirect = () => {
  const { modelID } = useParams();
  return <Navigate to={`/models/${modelID}/read-view/milestones`} replace />;
};

const ReadOnlyRedirect = () => {
  const { modelID } = useParams();
  return <Navigate to={`/models/${modelID}/read-view`} replace />;
};

const ReadViewRedirect = () => {
  const { modelID } = useParams();
  return <Navigate to={`/models/${modelID}/read-view`} replace />;
};

const ITSystemsRedirect = () => {
  const { modelID } = useParams();
  return (
    <Navigate
      to={`/models/${modelID}/read-view/it-systems-and-solutions`}
      replace
    />
  );
};

const ReadOnlySubinfoRedirect = () => {
  const { modelID, subinfo } = useParams();
  return <Navigate to={`/models/${modelID}/read-view/${subinfo}`} replace />;
};

// Create the router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <div className="usa-overlay" />
        <button type="button" className="skipnav z-top" onClick={handleSkipNav}>
          Skip to main content
        </button>
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
                                  <Outlet />
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
      </>
    ),
    children: [
      // Auth Routes
      {
        path: '/login',
        element: <Navigate to="/signin" replace />
      },
      {
        path: '/signin',
        element: <Login />
      },
      {
        path: '/pre-decisional-notice',
        element: (
          <ProtectedRoute>
            <NDA />
          </ProtectedRoute>
        )
      },
      // Home Routes
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/homepage-settings',
        element: (
          <ProtectedRoute>
            <HomePageSettings />
          </ProtectedRoute>
        )
      },
      {
        path: '/notifications',
        element: (
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        )
      },
      // Model Plan Routes
      {
        path: '/models/steps-overview',
        element: (
          <ProtectedRoute>
            <StepsOverview />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/new-plan',
        element: (
          <ProtectedRoute>
            <NewPlan />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/unlock-all-sections',
        element: (
          <ProtectedRoute>
            <UnlockAllSections />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area',
        element: (
          <ProtectedRoute>
            <CollaborationArea />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/collaborators/*',
        element: (
          <ProtectedRoute>
            <Collaborators />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/documents',
        element: (
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/cr-and-tdl',
        element: (
          <ProtectedRoute>
            <CRTDL />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/status',
        element: (
          <ProtectedRoute>
            <Status />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/basics/milestones',
        element: <TimelineRedirect />
      },
      {
        path: '/models/:modelID/collaboration-area/model-timeline',
        element: (
          <ProtectedRoute>
            <Timeline />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/data-exchange-approach',
        element: (
          <ProtectedRoute>
            <DataEchangeApproach />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/model-to-operations',
        element: (
          <ProtectedRoute>
            <ModelToOperations />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/task-list',
        element: <TaskListRedirect />
      },
      {
        path: '/models/:modelID/collaboration-area/task-list',
        element: <TaskList />
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/basics',
        element: (
          <ProtectedRoute>
            <Basics />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/basics/overview',
        element: (
          <ProtectedRoute>
            <Overview />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/characteristics',
        element: (
          <ProtectedRoute>
            <Characteristics />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/participants-and-providers',
        element: (
          <ProtectedRoute>
            <Participants />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/participants-and-providers/participants-options',
        element: (
          <ProtectedRoute>
            <ParticipantOptions />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/participants-and-providers/communication',
        element: (
          <ProtectedRoute>
            <Communication />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/participants-and-providers/coordination',
        element: (
          <ProtectedRoute>
            <Coordination />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/participants-and-providers/provider-options',
        element: (
          <ProtectedRoute>
            <ProviderOptions />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/beneficiaries',
        element: (
          <ProtectedRoute>
            <BeneficiaryIdentification />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/beneficiaries/people-impact',
        element: (
          <ProtectedRoute>
            <PeopleImpact />
          </ProtectedRoute>
        )
      },
      // {
      //   path: '/models/:modelID/collaboration-area/task-list/beneficiaries/beneficiary-identification',
      //   element: (
      //     <ProtectedRoute>
      //       <BeneficiaryIdentification />
      //     </ProtectedRoute>
      //   )
      // },
      {
        path: '/models/:modelID/collaboration-area/task-list/beneficiaries/beneficiary-frequency',
        element: (
          <ProtectedRoute>
            <Frequency />
          </ProtectedRoute>
        )
      },
      // {
      //   path: '/models/:modelID/collaboration-area/task-list/cost-estimate',
      //   element: (
      //     <ProtectedRoute enabled={false}>
      //       <CostEstimate />
      //     </ProtectedRoute>
      //   )
      // },
      {
        path: '/models/:modelID/collaboration-area/task-list/ops-eval-and-learning',
        element: (
          <ProtectedRoute>
            <OpsEvalAndLearning />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/payment',
        element: (
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/it-solutions',
        element: <ITSolutionsRedirect />
      },
      {
        path: '/models/:modelID/read-view/it-solutions',
        element: <ReadViewITSolutionsRedirect />
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/prepare-for-clearance',
        element: (
          <ProtectedRoute>
            <PrepareForClearance />
          </ProtectedRoute>
        )
      },
      // {
      //   path: '/models/:modelID/collaboration-area/task-list/submit-request',
      //   element: (
      //     <ProtectedRoute enabled={false}>
      //       <SubmitRequest />
      //     </ProtectedRoute>
      //   )
      // },
      {
        path: '/models/:modelID',
        element: (
          <ProtectedRoute>
            <ModelPlan />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/read-only',
        element: <ReadOnlyRedirect />
      },
      {
        path: '/models/:modelID/read-view',
        element: <ReadViewRedirect />
      },
      {
        path: '/models/:modelID/read-view/it-systems-and-solutions',
        element: <ITSystemsRedirect />
      },
      {
        path: '/models/:modelID/read-only/:subinfo?',
        element: <ReadOnlySubinfoRedirect />
      },
      {
        path: '/models/:modelID/read-view/:subinfo?',
        element: (
          <ProtectedRoute>
            <ReadOnly />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/change-history',
        element: (
          <ProtectedRoute>
            <ChangeHistory />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/locked-task-list-section',
        element: (
          <ProtectedRoute>
            <LockedTaskListSection />
          </ProtectedRoute>
        )
      },
      // Other Routes
      {
        path: '/accessibility-statement',
        element: <AccessibilityStatement />
      },
      {
        path: '/cookies',
        element: <Cookies />
      },
      {
        path: '/feedback',
        element: (
          <ProtectedRoute>
            <SendFeedback />
          </ProtectedRoute>
        )
      },
      {
        path: '/feedback/received',
        element: (
          <ProtectedRoute>
            <FeedbackReceived />
          </ProtectedRoute>
        )
      },
      {
        path: '/help-and-knowledge',
        element: (
          <ProtectedRoute>
            <HelpAndKnowledge />
          </ProtectedRoute>
        )
      },
      {
        path: '/help-and-knowledge/articles/get-access',
        element: (
          <ProtectedRoute>
            <GetAccess />
          </ProtectedRoute>
        )
      },
      {
        path: '/privacy-policy',
        element: <PrivacyPolicy />
      },
      {
        path: '/report-a-problem',
        element: <ReportAProblem />
      },
      {
        path: '/sandbox',
        element: <Sandbox />
      },
      {
        path: '/terms-and-conditions',
        element: <TermsAndConditions />
      },
      {
        path: '/user-info',
        element: (
          <ProtectedRoute>
            <UserInfo />
          </ProtectedRoute>
        )
      },
      {
        path: '/implicit/callback',
        element: <LoginCallback />
      },
      // 404
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
