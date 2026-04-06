import { MilestoneSuggestionReason, TableName } from 'gql/generated/graphql';

import beneficiaries from 'i18n/en-US/modelPlan/beneficiaries';
import generalCharacteristics from 'i18n/en-US/modelPlan/generalCharacteristics';
import opsEvalAndLearning from 'i18n/en-US/modelPlan/opsEvalAndLearning';
import { participantsAndProviders } from 'i18n/en-US/modelPlan/participantsAndProviders';
import payments from 'i18n/en-US/modelPlan/payments';
import { convertToLowercaseAndDashes } from 'utils/modelPlan';

const generalCharacteristicsRoutes: { [key: number]: string } = {
  2: 'key-characteristics',
  4: 'targets-and-options'
};

const participantsAndProvidersRoutes: { [key: number]: string } = {
  2: 'participants-options',
  3: 'communication',
  4: 'coordination',
  5: 'provider-options'
};

const beneficiariesRoutes: { [key: number]: string } = {
  3: 'beneficiary-frequency'
};

const opsAndEvalRoutes: { [key: number]: string } = {
  5: 'performance',
  6: 'evaluation',
  7: 'ccw-and-quality',
  9: 'learning'
};

const paymentRoutes: { [key: number]: string } = {
  2: 'claims-based-payment',
  5: 'non-claims-based-payment',
  7: 'recover-payment'
};

const modelPlanTableMap = {
  [TableName.PLAN_GENERAL_CHARACTERISTICS]: {
    translationConfig: generalCharacteristics,
    path: 'characteristics',
    routes: generalCharacteristicsRoutes
  },
  [TableName.PLAN_PARTICIPANTS_AND_PROVIDERS]: {
    translationConfig: participantsAndProviders,
    path: 'participants-and-providers',
    routes: participantsAndProvidersRoutes
  },
  [TableName.PLAN_BENEFICIARIES]: {
    translationConfig: beneficiaries,
    path: 'beneficiaries',
    routes: beneficiariesRoutes
  },
  [TableName.PLAN_OPS_EVAL_AND_LEARNING]: {
    translationConfig: opsEvalAndLearning,
    path: 'ops-eval-and-learning',
    routes: opsAndEvalRoutes
  },
  [TableName.PLAN_PAYMENTS]: {
    translationConfig: payments,
    path: 'payment',
    routes: paymentRoutes
  }
};

const getQuestionConfig = (reason: MilestoneSuggestionReason) => {
  const tableConfig =
    modelPlanTableMap[reason.table as keyof typeof modelPlanTableMap];

  if (!tableConfig) return { questionKey: '', route: '', groupLabel: '' };

  const { translationConfig, routes, path } = tableConfig;

  const questionKey = (
    Object.keys(translationConfig) as Array<keyof typeof translationConfig>
  ).find(key => translationConfig[key].dbField === reason.field);

  if (!questionKey) return { questionKey: '', route: path, groupLabel: '' };

  const pageOrder = translationConfig[questionKey]?.order;

  const subRoute =
    pageOrder !== undefined ? routes[Math.floor(pageOrder)] : null;

  return {
    questionKey,
    route: subRoute ? `${path}/${subRoute}` : path,
    groupLabel: translationConfig[questionKey]?.groupLabel || ''
  };
};

export type ReasonType = {
  question: string;
  questionKey: string;
  questionUrl: string;
  groupLabel?: string;
  answers: string[];
};

// Function to format milestone answers for both single and multipart answers
/** Reasons Data is grouped by answer, one answer per element. We could have multiple answers for a single question.
 *  This function reformats data to group by question, with an array of answers for each question. This allows us to handle both single and multipart questions */
export const formatMilestoneAnswers = (
  reasons: MilestoneSuggestionReason[]
) => {
  const formattedReasons = reasons.reduce<Record<string, ReasonType>>(
    (reformattedReasons, reason) => {
      const { field, answer, question } = reason;

      const existingReason = reformattedReasons[field];

      if (!answer) {
        return reformattedReasons;
      }

      const questionConfig = getQuestionConfig(reason);

      return {
        ...reformattedReasons,
        [field]: {
          question,
          questionKey: questionConfig.questionKey,
          questionUrl: questionConfig.route,
          groupLabel: questionConfig.groupLabel,
          answers: existingReason
            ? [...existingReason.answers, answer]
            : [answer]
        }
      };
    },
    {}
  );

  const formattedAnswers = Object.values(formattedReasons);

  const isMultiQuestions = formattedAnswers.length > 1;

  return {
    answers: formattedAnswers,
    scrollElement: formattedAnswers[0]?.groupLabel
      ? convertToLowercaseAndDashes(formattedAnswers[0]?.groupLabel)
      : formattedAnswers[0]?.questionKey, // scroll to either question or group label
    questionUrl: formattedAnswers[0]?.questionUrl, // should only have one url
    groupLabel: isMultiQuestions ? 'appealGroupLabel' : '', // only certain multiple questions have groupLabel
    isMultiQuestions
  };
};
