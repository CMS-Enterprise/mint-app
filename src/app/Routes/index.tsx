import React from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useParams
} from 'react-router-dom';
import { LoginCallback, useOktaAuth } from '@okta/okta-react';
import AccessibilityStatement from 'features/AccessibilityStatement';
import Cookies from 'features/Cookies';
import FeedbackReceived from 'features/Feedback/FeedbackReceived';
import ReportAProblem from 'features/Feedback/ReportAProblem';
import SendFeedback from 'features/Feedback/SendFeedback';
import { helpAndKnowledgeRoutes } from 'features/HelpAndKnowledge';
import GetAccess from 'features/HelpAndKnowledge/Articles/GetAccess';
import ModelPlanOverview from 'features/HelpAndKnowledge/Articles/ModelPlanOverview';
import Home from 'features/Home';
import { homePageSettingsRoutes } from 'features/Home/Settings';
import Landing from 'features/Landing';
import Login from 'features/Login';
import ChangeHistory from 'features/ModelPlan/ChangeHistory';
import CollaborationArea from 'features/ModelPlan/CollaborationArea';
import { collaboratorsRoutes } from 'features/ModelPlan/Collaborators';
import { crtdlRoutes } from 'features/ModelPlan/CRTDL';
import { dataExchangeApproachRoutes } from 'features/ModelPlan/DataExchangeApproach';
import Documents from 'features/ModelPlan/Documents';
import AddDocument from 'features/ModelPlan/Documents/AddDocument';
import ModelPlan from 'features/ModelPlan/ModelPlanOverview';
import { modelToOperationsRoutes } from 'features/ModelPlan/ModelToOperations';
import NewPlan from 'features/ModelPlan/NewPlan';
import { readViewRoutes } from 'features/ModelPlan/ReadOnly';
import Status from 'features/ModelPlan/Status';
import StepsOverview from 'features/ModelPlan/StepsOverview';
import TaskList from 'features/ModelPlan/TaskList';
import Basics from 'features/ModelPlan/TaskList/Basics';
import Overview from 'features/ModelPlan/TaskList/Basics/Overview';
import BeneficiaryIdentification from 'features/ModelPlan/TaskList/Beneficiaries/BeneficiaryIdentification';
import Frequency from 'features/ModelPlan/TaskList/Beneficiaries/Frequency';
import PeopleImpact from 'features/ModelPlan/TaskList/Beneficiaries/PeopleImpact';
import Characteristics from 'features/ModelPlan/TaskList/GeneralCharacteristics';
import Authority from 'features/ModelPlan/TaskList/GeneralCharacteristics/Authority';
import Involvements from 'features/ModelPlan/TaskList/GeneralCharacteristics/Involvements';
import KeyCharacteristics from 'features/ModelPlan/TaskList/GeneralCharacteristics/KeyCharacteristics';
import TargetsAndOptions from 'features/ModelPlan/TaskList/GeneralCharacteristics/TargetsAndOptions';
import LockedTaskListSection from 'features/ModelPlan/TaskList/LockedModelPlanSection';
import OpsEvalAndLearning from 'features/ModelPlan/TaskList/OpsEvalAndLearning';
import CCWAndQuality from 'features/ModelPlan/TaskList/OpsEvalAndLearning/CCWAndQuality';
import DataSharing from 'features/ModelPlan/TaskList/OpsEvalAndLearning/DataSharing';
import Evaluation from 'features/ModelPlan/TaskList/OpsEvalAndLearning/Evaluation';
import IDDOC from 'features/ModelPlan/TaskList/OpsEvalAndLearning/IDDOC';
import IDDOCMonitoring from 'features/ModelPlan/TaskList/OpsEvalAndLearning/IDDOCMonitoring';
import IDDOCTesting from 'features/ModelPlan/TaskList/OpsEvalAndLearning/IDDOCTesting';
import Learning from 'features/ModelPlan/TaskList/OpsEvalAndLearning/Learning';
import Performance from 'features/ModelPlan/TaskList/OpsEvalAndLearning/Performance';
import Participants from 'features/ModelPlan/TaskList/ParticipantsAndProviders';
import Communication from 'features/ModelPlan/TaskList/ParticipantsAndProviders/Communication';
import Coordination from 'features/ModelPlan/TaskList/ParticipantsAndProviders/Coordination';
import ParticipantOptions from 'features/ModelPlan/TaskList/ParticipantsAndProviders/ParticipantOptions';
import ProviderOptions from 'features/ModelPlan/TaskList/ParticipantsAndProviders/ProviderOptions';
import AnticipateDependencies from 'features/ModelPlan/TaskList/Payment/AnticipateDependencies';
import BeneficiaryCostSharing from 'features/ModelPlan/TaskList/Payment/BeneficiaryCostSharing';
import ClaimsBasedPayment from 'features/ModelPlan/TaskList/Payment/ClaimsBasedPayment';
import Complexity from 'features/ModelPlan/TaskList/Payment/Complexity';
import FundingSource from 'features/ModelPlan/TaskList/Payment/FundingSource';
import NonClaimsBasedPayment from 'features/ModelPlan/TaskList/Payment/NonClaimsBasedPayment';
import Recover from 'features/ModelPlan/TaskList/Payment/Recover';
import PrepareForClearance from 'features/ModelPlan/TaskList/PrepareForClearance';
import Timeline from 'features/ModelPlan/Timeline';
import UnlockAllSections from 'features/ModelPlan/UnlockAllSections';
import NDA from 'features/NDA';
import NDAWrapper from 'features/NDA/NDAWrapper';
import NotFound from 'features/NotFound';
import { notificationsRoutes } from 'features/Notifications';
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
import useRouteTitle from 'hooks/useRouteTitle';
import useScrollTop from 'hooks/useScrollTop';

import ProtectedRoute from '../../components/ProtectedRoute';
import { NavContextProvider } from '../../contexts/NavContext';
import { OktaSessionProvider } from '../../contexts/OktaSessionContext';

const handleSkipNav = () => {
  const mainContent = document.getElementById('main-content')!;
  if (mainContent) {
    mainContent.focus();
  }
};

// Wrapper components to handle parameter interpolation
const Redirect = ({ route }: { route: string }) => {
  const { modelID } = useParams();
  return <Navigate to={`/models/${modelID}/${route}`} replace />;
};

const ReadOnlySubinfoRedirect = () => {
  const { modelID, subinfo } = useParams();
  return <Navigate to={`/models/${modelID}/read-view/${subinfo}`} replace />;
};

const ProtectedHome = () => {
  const { authState } = useOktaAuth();
  return authState?.isAuthenticated ? <Home /> : <Landing />;
};

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  // Fetches translated title for route and sends to GA
  useRouteTitle({ sendGA: true });

  // Scroll to top
  useScrollTop();

  return <>{children}</>;
};

// Create the router configuration
const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <NotFound />,
    element: (
      <AppWrapper>
        <div className="usa-overlay" />
        <button type="button" className="skipnav z-top" onClick={handleSkipNav}>
          Skip to main content
        </button>
        <AuthenticationWrapper>
          <OktaSessionProvider>
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
          </OktaSessionProvider>
        </AuthenticationWrapper>
      </AppWrapper>
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
        element: <ProtectedHome />
      },
      homePageSettingsRoutes,
      notificationsRoutes,
      // Model Plan Routes
      {
        path: '/models',
        element: (
          <ProtectedRoute>
            <ModelPlan />
          </ProtectedRoute>
        )
      },
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
        path: '/models/:modelID',
        element: (
          <ProtectedRoute>
            <ModelPlanOverview />
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
      // Collaboration Area Routes
      {
        path: '/models/:modelID/collaboration-area',
        element: (
          <ProtectedRoute>
            <CollaborationArea />
          </ProtectedRoute>
        )
      },
      collaboratorsRoutes,
      {
        path: '/models/:modelID/collaboration-area/status',
        element: (
          <ProtectedRoute>
            <Status />
          </ProtectedRoute>
        )
      },
      // Document Routes
      {
        path: '/models/:modelID/collaboration-area/documents',
        element: (
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/documents/add-document',
        element: (
          <ProtectedRoute>
            <AddDocument />
          </ProtectedRoute>
        )
      },
      // Timeline Routes
      {
        path: '/models/:modelID/collaboration-area/task-list/basics/milestones',
        element: (
          <Redirect route="collaboration-area/task-list/basics/milestones" />
        )
      },
      {
        path: '/models/:modelID/collaboration-area/model-timeline',
        element: (
          <ProtectedRoute>
            <Timeline />
          </ProtectedRoute>
        )
      },
      // CR and TDL Routes
      crtdlRoutes,
      // Data Exchange Approach Routes
      dataExchangeApproachRoutes,
      // Model to Operations Routes
      modelToOperationsRoutes,
      // Task List Routes
      {
        path: '/models/:modelID/task-list',
        element: <Redirect route="collaboration-area/model-timeline" />
      },
      {
        path: '/models/:modelID/collaboration-area/task-list',
        element: <TaskList />
      },
      // Basics Routes
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
      // Characteristics Routes
      {
        path: '/models/:modelID/collaboration-area/task-list/characteristics',
        element: (
          <ProtectedRoute>
            <Characteristics />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/characteristics/key-characteristics',
        element: (
          <ProtectedRoute>
            <KeyCharacteristics />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/characteristics/involvements',
        element: (
          <ProtectedRoute>
            <Involvements />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/characteristics/targets-and-options',
        element: (
          <ProtectedRoute>
            <TargetsAndOptions />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/characteristics/authority',
        element: (
          <ProtectedRoute>
            <Authority />
          </ProtectedRoute>
        )
      },
      // Participants and Providers Routes
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
      // Beneficiaries Routes
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
      {
        path: '/models/:modelID/collaboration-area/task-list/beneficiaries/beneficiary-frequency',
        element: (
          <ProtectedRoute>
            <Frequency />
          </ProtectedRoute>
        )
      },
      // Ops Eval and Learning Routes
      {
        path: '/models/:modelID/collaboration-area/task-list/ops-eval-and-learning',
        element: (
          <ProtectedRoute>
            <OpsEvalAndLearning />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/iddoc',
        element: (
          <ProtectedRoute>
            <IDDOC />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/iddoc-testing',
        element: (
          <ProtectedRoute>
            <IDDOCTesting />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/iddoc-monitoring',
        element: (
          <ProtectedRoute>
            <IDDOCMonitoring />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/performance',
        element: (
          <ProtectedRoute>
            <Performance />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/evaluation',
        element: (
          <ProtectedRoute>
            <Evaluation />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/ccw-and-quality',
        element: (
          <ProtectedRoute>
            <CCWAndQuality />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/data-sharing',
        element: (
          <ProtectedRoute>
            <DataSharing />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/learning',
        element: (
          <ProtectedRoute>
            <Learning />
          </ProtectedRoute>
        )
      },
      // Payment Routes
      {
        path: '/models/:modelID/collaboration-area/task-list/payment',
        element: (
          <ProtectedRoute>
            <FundingSource />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/payment/claims-based-payment',
        element: (
          <ProtectedRoute>
            <ClaimsBasedPayment />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/payment/non-claims-based-payment',
        element: (
          <ProtectedRoute>
            <NonClaimsBasedPayment />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/payment/anticipating-dependencies',
        element: (
          <ProtectedRoute>
            <AnticipateDependencies />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/payment/beneficiary-cost-sharing',
        element: (
          <ProtectedRoute>
            <BeneficiaryCostSharing />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/payment/complexity',
        element: (
          <ProtectedRoute>
            <Complexity />
          </ProtectedRoute>
        )
      },
      {
        path: '/models/:modelID/collaboration-area/task-list/payment/recover-payment',
        element: (
          <ProtectedRoute>
            <Recover />
          </ProtectedRoute>
        )
      },

      // IT Solutions Routes
      {
        path: '/models/:modelID/collaboration-area/task-list/it-solutions',
        element: <Redirect route="collaboration-area/model-to-operations" />
      },
      {
        path: '/models/:modelID/read-view/it-solutions',
        element: <Redirect route="read-view/milestones" />
      },

      // Prepare for Clearance Routes
      {
        path: '/models/:modelID/collaboration-area/task-list/prepare-for-clearance',
        element: (
          <ProtectedRoute>
            <PrepareForClearance />
          </ProtectedRoute>
        )
      },

      // Read View Routes
      {
        path: '/models/:modelID/read-only',
        element: <Redirect route="read-view" />
      },
      {
        path: '/models/:modelID/read-view',
        element: <Redirect route="read-view/model-basics" />
      },
      readViewRoutes,
      {
        path: '/models/:modelID/read-view/it-systems-and-solutions',
        element: <Redirect route="read-view/it-systems-and-solutions" />
      },
      {
        path: '/models/:modelID/read-only/:subinfo?',
        element: <ReadOnlySubinfoRedirect />
      },

      // Help and Knowledge Routes
      helpAndKnowledgeRoutes,
      {
        path: '/help-and-knowledge/articles/get-access',
        element: (
          <ProtectedRoute>
            <GetAccess />
          </ProtectedRoute>
        )
      },

      // Change History Routes
      {
        path: '/models/:modelID/change-history',
        element: (
          <ProtectedRoute>
            <ChangeHistory />
          </ProtectedRoute>
        )
      },

      // Locked Task List Section Routes
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
        path: '/how-to-get-access',
        element: <GetAccess />
      },
      {
        path: '/accessibility-statement',
        element: <AccessibilityStatement />
      },
      {
        path: '/cookies',
        element: <Cookies />
      },
      {
        path: '/send-feedback',
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
