import crtdl from './draftModelPlan/crtdl';
import discussions from './draftModelPlan/discussions';
import documents from './draftModelPlan/documents';
import draftModelPlan from './draftModelPlan/draftModelPlan';
import itSolutions from './draftModelPlan/itSolutions';
import prepareForClearance from './draftModelPlan/prepareForClearance';
import subtasks from './draftModelPlan/subtasks';
import getAccess from './helpAndKnowledge/Articles/getAccess';
import highLevelProjectPlans from './helpAndKnowledge/Articles/highLevelProjectPlans';
import modelPlanOverview from './helpAndKnowledge/Articles/modelPlanOverview';
import modelSolutionDesign from './helpAndKnowledge/Articles/modelSolutionDesign';
import modelSolutionImplementation from './helpAndKnowledge/Articles/modelSolutionImplementation';
import phasesInvolved from './helpAndKnowledge/Articles/phasesInvolved';
import sampleModelPlan from './helpAndKnowledge/Articles/sampleModelPlan';
import sixPageMeeting from './helpAndKnowledge/Articles/sixPageMeeting';
import twoPageMeeting from './helpAndKnowledge/Articles/twoPageMeeting';
import utilizingSolutions from './helpAndKnowledge/Articles/utilizingSolutions';
import helpAndKnowledge from './helpAndKnowledge/helpAndKnowledge';
import { basics, basicsMisc } from './modelPlan/basics';
import { beneficiaries, beneficiariesMisc } from './modelPlan/beneficiaries';
import { collaborators, collaboratorsMisc } from './modelPlan/collaborators';
import {
  generalCharacteristics,
  generalCharacteristicsMisc
} from './modelPlan/generalCharacteristics';
import miscellaneous from './modelPlan/miscellaneous';
import { modelPlan, modelPlanMisc } from './modelPlan/modelPlan';
import {
  opsEvalAndLearning,
  opsEvalAndLearningMisc
} from './modelPlan/opsEvalAndLearning';
import {
  participantsAndProviders,
  participantsAndProvidersMisc
} from './modelPlan/participantsAndProviders';
import { payments, paymentsMisc } from './modelPlan/payments';
import filterView from './readOnly/filterView';
import generalReadOnly from './readOnly/generalReadOnly';
import modelSummary from './readOnly/modelSummary';
import readOnlyModelPlan from './readOnly/readOnlyModelPlan';
import accessibilityStatement from './accessibilityStatement';
import auth from './auth';
import cookies from './cookies';
import error from './error';
import externalLinkModal from './externalLinkModal';
import feedback from './feedback';
import footer from './footer';
import general from './general';
import header from './header';
import home from './home';
import landing from './landing';
import plan from './modelPlan';
import modelPlanTaskList from './modelPlanTaskList';
import nda from './nda';
import notifications from './notifications';
import privacyPolicy from './privacyPolicy';
import tableAndPagination from './tableAndPagination';
import termsAndConditions from './termsAndConditions';

const enUS = {
  accessibilityStatement,
  auth,
  cookies,
  crtdl,
  discussions,
  documents,
  draftModelPlan,
  error,
  filterView,
  footer,
  general,
  generalReadOnly,
  getAccess,
  header,
  helpAndKnowledge,
  home,
  itSolutions,
  landing,
  plan,
  modelPlanOverview,
  modelPlanTaskList,
  modelSummary,
  nda,
  notifications,
  // New Translation
  modelPlan,
  modelPlanMisc,
  basics,
  basicsMisc,
  generalCharacteristics,
  generalCharacteristicsMisc,
  participantsAndProviders,
  participantsAndProvidersMisc,
  beneficiaries,
  beneficiariesMisc,
  opsEvalAndLearning,
  opsEvalAndLearningMisc,
  payments,
  paymentsMisc,
  collaborators,
  collaboratorsMisc,
  miscellaneous,
  // End new translation
  prepareForClearance,
  privacyPolicy,
  readOnlyModelPlan,
  feedback,
  // Help and Knowledge Center Articles
  highLevelProjectPlans,
  modelSolutionDesign,
  modelSolutionImplementation,
  phasesInvolved,
  sampleModelPlan,
  sixPageMeeting,
  twoPageMeeting,
  utilizingSolutions,
  // End Help and Knowledge Center Articles
  subtasks,
  tableAndPagination,
  termsAndConditions,
  externalLinkModal
};

export default enUS;
